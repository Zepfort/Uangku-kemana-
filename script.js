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
            budgetsPage.classList.add("hidden");
            budgetDetailsPage.classList.remove("hidden");
        });
    });
    //event listener click Tambah Budget
    addBudgetButton.addEventListener("click", () =>{
        budgetForm.classList.remove("hidden");
    });
}

//render ID budget
function renderBudgetDetail(budgetId) {
        const currentBudget = getBudgetById(budgetId);

        document
        .querySelector("#budget__details .budget__card")
        .setAttribute("data-budgetid", budgetId);

        document.querySelector("#budget__details .budget__card h2").innerText = currentBudget.nama__budget;
        document.querySelector("#budget__details .budget__card .budget__amount").innerText = "Rp " +currentBudget.total;
        document.querySelector("#budget__details .budget__card .budget__total").innerText = "Rp " +currentBudget.total;       
}

function renderBudgets() {
    const budgetData = getExistingData();
    const budgetList = budgetData.map((budget) => {
        return `<div class="budget__card" data-budgetId="${budget.id}">
                <h2 class="budget__name"> ${budget.nama__budget}</h2>
                <p class="budget__amount">Rp ${budget.total}</p>
                <p class="budget__total">Total Rp ${budget.total}</p>
            </div>`
    }).concat(`<button class="add__budget__btn">+</button>`)
    .join("");
    budgetsPage.innerHTML = budgetList;
    selectBudgetCardsAndButton();
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
    const data = getFormValue(new FormData(e.target));

    addPengeluaran(data);
    closeModalPengeluaran();
    resetInput();
    showNotification(`✅ Pengeluaran ${data.nama__pengeluaran} berhasil ditambahkan`);
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

/*notification pop up*/

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
