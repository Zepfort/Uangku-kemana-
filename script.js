const backHomeBtn = document.querySelector("#budget__details button.back__home");
const budgetsPage = document.getElementById("budgets");
renderBudgets();
const budgetDetailsPage = document.querySelector("#budget__details");
const budgetForm = document.getElementById("budget__form");
const closeModalBudgetBtn = document.querySelector("#budget__form i");
const addSpentBtn = document.querySelector(".add__spent__btn");
const spentForm = document.getElementById("spent__form");
const closeModalPengeluaranBtn = document.querySelector("#spent__form i");
const notifications = document.getElementById("notifications");

function selectBudgetCardsAndButton (){
    let budgetCards = document.querySelectorAll("#budgets .budget__card");
    let addBudgetButton = document.querySelector("#budgets button");

    budgetCards = document.querySelectorAll("#budgets .budget__card");
    addBudgetButton = document.querySelector("#budgets button");

    //event listener click budget card
    budgetCards.forEach((Card) => {
        Card.addEventListener("click", () => {
            const budgetId = Card.getAttribute("data-budgetid");

            renderBudgetDetail(budgetId);
            renderPengeluaran(budgetId);
            budgetsPage.classList.add("hidden");
            budgetDetailsPage.classList.remove("hidden");
        });
    });
    //event listener click Tambah Budget
    addBudgetButton.addEventListener("click", () =>{
        budgetForm.classList.remove("hidden");
    });
}

// render pengeluaran
function renderPengeluaran(budgetId){
    const {pengeluaran = []} = getBudgetById(budgetId);

    const listPengeluaran = pengeluaran
    .map((item) =>{
        return `<div class="spent__item">
                <div class="spent__item__description">
                    <h4>${item.nama__pengeluaran}</h4>
                    <p>${item.tanggal}</p>
                </div>
                <div class="spent__item__price">
                    <p>${formatRupiah(item.jumlah)}</p>
                </div>                
            </div>`
    })
    .join("");

    document.querySelector("#budget__details .spent").innerHTML = listPengeluaran;
}

//render ID budget
function renderBudgets() {
    const budgetData = getExistingData();
    const budgetList = budgetData.map((budget) => {
        const sisaBudget = hitungSisaBudget(budget);

        console.log("Format: ", formatRupiah(sisaBudget))

        return `<div class="budget__card" data-budgetId="${budget.id}">
                <h2 class="budget__name"> ${budget.nama__budget}</h2>
                <p class="budget__amount"> ${formatRupiah(sisaBudget)}</p>
                <p class="budget__total">Total Rp ${formatRupiah(budget.total)}</p>
            </div>`
    }).concat(`<button class="add__budget__btn">+</button>`)
    .join("");
    budgetsPage.innerHTML = budgetList;
    selectBudgetCardsAndButton();
}

function renderBudgetDetail(budgetId) {
        const currentBudget = getBudgetById(budgetId);

        const sisaBudget = hitungSisaBudget(currentBudget);

        document
        .querySelector("#budget__details .budget__card")
        .setAttribute("data-budgetid", budgetId);

        document.querySelector("#budget__details .budget__card h2").innerText = currentBudget.nama__budget;
        document.querySelector("#budget__details .budget__card .budget__amount").innerText = formatRupiah(sisaBudget);
        document.querySelector("#budget__details .budget__card .budget__total").innerText = formatRupiah(currentBudget.total);       
}
    
//click  Tombol Halaman Utama
backHomeBtn.addEventListener("click", () => {
    budgetDetailsPage.classList.add("hidden");
    budgetsPage.classList.remove("hidden");
});

closeModalBudgetBtn.addEventListener("click", () =>{
    closeModalBudget();
});

function closeModalBudget(){
    budgetForm.classList.add("hidden");
}

addSpentBtn.addEventListener("click", ()=> {
    spentForm.classList.remove("hidden");
});

closeModalPengeluaranBtn.addEventListener("click", ()=> {
    closeModalPengeluaran()
});

function closeModalPengeluaran() {
    spentForm.classList.add("hidden")
}

function getFormValue(formData) {
    let result = new Object();

    for (const data of formData.entries()) {
        const [key, value] = data;

        Object.assign(result, { [key]: value,});
    }
    return result;
}

function getExistingData (){
    return JSON.parse(localStorage.getItem("budgets")) ?? [];
}

function saveDataBudget(dataBaru) {
    const existingData = getExistingData();

    existingData.push(dataBaru);

    localStorage.setItem("budgets",JSON.stringify(existingData));
}

function getBudgetById(id) {
    const budgets = getExistingData();

    return budgets.filter((budget) => budget.id == id)[0];
}

// submit form budget
document.querySelector("#budget__form form").addEventListener ("submit", (e) =>{
    e.preventDefault();
    
    const data =  getFormValue(new FormData(e.target));

    const dataWithId = {
        id: generateId(),
        ...data,
    }

    saveDataBudget(dataWithId);
    closeModalBudget();
    resetInput();
    showNotification(`✅ Budget ${data.nama__budget} berhasil disimpan!`);
    renderBudgets();
});

//submit pengeluaran 
document.querySelector("#spent__form form").addEventListener("submit", (e) => {
    e.preventDefault();
    //budgetid
    const budgetId = document.querySelector("#budget__details .budget__card").getAttribute("data-budgetid");
    const data = getFormValue(new FormData(e.target));

    addPengeluaran(data);
    closeModalPengeluaran();
    resetInput();
    showNotification(`✅ Pengeluaran ${data.nama__pengeluaran} berhasil ditambahkan`);
    renderPengeluaran(budgetId);
});

function addPengeluaran(data) {
    const budgetId = document
    .querySelector("#budget__details .budget__card")
    .getAttribute("data-budgetid");

    const currentBudget = getBudgetById(budgetId);

    const currentSpent = currentBudget.pengeluaran ?? [];

    const budgetWithSpent = {...currentBudget, pengeluaran: [...currentSpent, data] }

    const allBudgets = getExistingData();

    const updateBudgets = allBudgets.map((budget) => {
        if(budget.id == budgetId){
            return budgetWithSpent;
        } else {
            return budget;
        }
    })
    localStorage.setItem("budgets", JSON.stringify(updateBudgets));
}


function generateId() {
    return new Date().getTime();
}

//console.log(generateId())

function resetInput(){
    document.querySelectorAll("form input").forEach((input) =>{
        input.value = "";
    })
}

//notification pop up

function showNotification(message) {
    const newNotification = document.createElement("div");
    newNotification.innerHTML = message;
    newNotification.classList.add("notification");

    notifications.appendChild(newNotification);
    setTimeout (() => {
        newNotification.classList.add("out");
        setTimeout(() => {
            notifications.removeChild(newNotification)
        }, 500);
    }, 4000);
}

// Kalkulasi sisa budget 
function hitungSisaBudget(databudget) {
    const totalPengeluaran = databudget.pengeluaran?.map((item) => +item.jumlah)
        .reduce((total, jumlah) => total + jumlah, 0);  // Tambahkan 0 sebagai initial value

    return +databudget.total - (totalPengeluaran || 0); // Pastikan totalPengeluaran tidak undefined
}

function formatRupiah (angka) {
    return "format : ", 
        new Intl.NumberFormat('id-ID', { 
        style: "currency",
        currency: "IDR",
        maximumFractionDigits : 0,
        }).format(angka);
}