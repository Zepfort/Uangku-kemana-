const backHomeBtn = document.querySelector("#budget__details button.back__home");
const budgetPage = document.getElementById("budgets");
const budgetDetailsPage = document.querySelector("#budget__details");
const budgetCards = document.querySelectorAll("#budgets .budget__card");
const addBudgetButton = document.querySelector("#budgets button");
const budgetForm = document.getElementById("budget__form");
const closeModalBudgetBtn = document.querySelector("#budget__form i");
const addSpentBtn = document.querySelector(".add__spent__btn");
const spentForm = document.getElementById("spent__form");
const closeModalPengeluaranBtn = document.querySelector("#spent__form i");
const notifications = document.getElementById("notifications");

//click  Tombol Halaman Utama
backHomeBtn.addEventListener("click", () => {
    budgetDetailsPage.classList.add("hidden");
    budgetPage.classList.remove("hidden");
});

//click budget card
budgetCards.forEach((Card) => {
    Card.addEventListener("click", () => {
        budgetPage.classList.add("hidden");
        budgetDetailsPage.classList.remove("hidden");
    });
});

//click Tambah Budget
addBudgetButton.addEventListener("click", () =>{
    budgetForm.classList.remove("hidden");
});

//
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
    spentForm.classList.add("hidden")
});

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

// submit form budget
document.querySelector("#budget__form form").addEventListener ("submit", (e) =>{
    e.preventDefault();
    
    const data =  getFormValue(new FormData(e.target));

    console.log(data);

    saveDataBudget(data);
    closeModalBudget();
    resetInput();
    showNotification(`✅ Budget ${data.nama__budget} berhasil disimpan!`)
   
});

function resetInput(){
    document.querySelectorAll("form input").forEach((input) =>{
        input.value = "";
    })
}

/*notification pppup*/

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
