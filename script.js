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
    budgetForm.classList.add("hidden");
});

addSpentBtn.addEventListener("click", ()=> {
    spentForm.classList.remove("hidden");
});

closeModalPengeluaranBtn.addEventListener("click", ()=> {
    spentForm.classList.add("hidden")
})