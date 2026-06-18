
let expenses = [];

let salary = 0;
let savings = 0;

let currentMonth = "";

let lastMonthSpent = 0;

let isLoginMode = true;


const landingPage =
document.getElementById("landingPage");

const authPage =
document.getElementById("authPage");

const setupPage =
document.getElementById("setupPage");

const dashboardPage =
document.getElementById("dashboardPage");


const dot =
document.querySelector(".cursor-dot");

const ring =
document.querySelector(".cursor-ring");

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;

document.addEventListener(
"mousemove",
function(e){

    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";

}
);

function animateCursor(){

    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";

    requestAnimationFrame(
        animateCursor
    );
}

animateCursor();


document
.getElementById("startBtn")
.addEventListener(
"click",
function(){

    landingPage.classList.remove(
        "active"
    );

    authPage.classList.add(
        "active"
    );

}
);


document
.getElementById("toggleAuth")
.addEventListener(
"click",
toggleMode
);

function toggleMode(){

    let title =
    document.getElementById(
        "authTitle"
    );

    let button =
    document.getElementById(
        "authBtn"
    );

    let toggle =
    document.getElementById(
        "toggleAuth"
    );

    if(isLoginMode){

        title.innerText =
        "Sign Up";

        button.innerText =
        "Sign Up";

        toggle.innerText =
        "Login";

        isLoginMode = false;

    }
    else{

        title.innerText =
        "Login";

        button.innerText =
        "Login";

        toggle.innerText =
        "Sign Up";

        isLoginMode = true;

    }

}


document
.getElementById("authBtn")
.addEventListener(
"click",
handleAuth
);

function handleAuth(){

    let email =
    document.getElementById(
        "email"
    ).value;

    let password =
    document.getElementById(
        "password"
    ).value;

    if(email === "" ||
       password === ""){

        alert(
        "Fill all fields"
        );

        return;
    }

    if(isLoginMode){

        login(
            email,
            password
        );

    }
    else{

    // save user

    document
    .querySelectorAll(".page")
    .forEach(function(page){

        page.classList.remove("active");

    });

    document
    .getElementById("setupPage")
    .classList.add("active");

}

}

/* =========================
   SIGNUP
========================= */

function signup(
email,
password
){

    let user = {

        email:email,
        password:password

    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert(
    "Account Created"
    );

    toggleMode();

}


function login(
email,
password
){

    let storedUser =
    localStorage.getItem(
        "user"
    );

    if(storedUser === null){

        alert(
        "No Account Found"
        );

        return;
    }

    let user =
    JSON.parse(
        storedUser
    );

    if(
       user.email === email
       &&
       user.password === password
    ){

        authPage.classList.remove(
            "active"
        );

        if(
            localStorage.getItem(
            "salary"
            )
        ){

            dashboardPage.classList.add(
                "active"
            );

            loadData();
        }
        else{

            setupPage.classList.add(
                "active"
            );

        }

    }
    else{

        alert(
        "Wrong Email Or Password"
        );

    }

}


document
.getElementById(
"saveSetupBtn"
)
.addEventListener(
"click",
saveSetup
);

function saveSetup(){

    let salaryInput =
    document.getElementById(
        "salaryInput"
    ).value;

    let monthInput =
    document.getElementById(
        "monthInput"
    ).value;

    if(
        salaryInput === ""
        ||
        monthInput === ""
    ){

        alert(
        "Fill all fields"
        );

        return;
    }

    salary =
    Number(
        salaryInput
    );

    currentMonth =
    monthInput;

    localStorage.setItem(
        "salary",
        salary
    );

    localStorage.setItem(
        "currentMonth",
        currentMonth
    );

    setupPage.classList.remove(
        "active"
    );

    dashboardPage.classList.add(
        "active"
    );

    updateDashboard();

}


document
.getElementById(
"addExpenseBtn"
)
.addEventListener(
"click",
addExpense
);

function addExpense(){

    let name =
    document.getElementById(
        "expenseName"
    ).value;

    let amount =
    document.getElementById(
        "expenseAmount"
    ).value;

    if(
       name === ""
       ||
       amount === ""
    ){

        alert(
        "Fill all fields"
        );

        return;
    }

    let expense = {

        id:Date.now(),

        name:name,

        amount:Number(amount),

        date:
        new Date()
        .toLocaleDateString()

    };

    expenses.push(
        expense
    );

    saveData();

    renderExpenses();

    updateDashboard();

    document
    .getElementById(
    "expenseName"
    ).value = "";

    document
    .getElementById(
    "expenseAmount"
    ).value = "";

}


function renderExpenses(){

    let list =
    document.getElementById(
        "expenseList"
    );

    list.innerHTML = "";

    for(
        let i =
        expenses.length - 1;

        i >= 0;

        i--
    ){

        let card =
        document.createElement(
            "div"
        );

        card.className =
        "expense-card";

        card.innerHTML =

        `
        <div class="card-left">

            <div class="expense-name">
            ${expenses[i].name}
            </div>

            <div class="expense-date">
            ${expenses[i].date}
            </div>

        </div>

        <div class="card-right">

            <div class="amount">
            ₹${expenses[i].amount}
            </div>

            <div class="action-buttons">

                <button
                onclick="editExpense(${expenses[i].id})">
                Edit
                </button>

                <button
                onclick="deleteExpense(${expenses[i].id})">
                Delete
                </button>

            </div>

        </div>
        `;

        list.appendChild(
            card
        );

    }

}


function editExpense(id){

    let newName =
    prompt(
    "New Name"
    );

    if(
        newName === null
        ||
        newName === ""
    ){

        return;
    }

    for(
        let i = 0;
        i < expenses.length;
        i++
    ){

        if(
            expenses[i].id
            === id
        ){

            expenses[i].name =
            newName;

        }

    }

    saveData();

    renderExpenses();

}


function deleteExpense(id){

    let updated = [];

    for(
        let i = 0;
        i < expenses.length;
        i++
    ){

        if(
            expenses[i].id
            !== id
        ){

            updated.push(
                expenses[i]
            );

        }

    }

    expenses = updated;

    saveData();

    renderExpenses();

    updateDashboard();

}

function updateDashboard(){

    let spent = 0;

    for(
        let i = 0;
        i < expenses.length;
        i++
    ){

        spent =
        spent +
        expenses[i].amount;

    }

    let remaining =
    salary - spent;

    document
    .getElementById(
    "salaryDisplay"
    ).innerText =
    "₹" + salary;

    document
    .getElementById(
    "spentDisplay"
    ).innerText =
    "₹" + spent;

    document
    .getElementById(
    "remainingDisplay"
    ).innerText =
    "₹" + remaining;

    document
    .getElementById(
    "savingsDisplay"
    ).innerText =
    "₹" + savings;

    document
    .getElementById(
    "currentMonth"
    ).innerText =
    formatMonth(
        currentMonth
    );

    updateAnalytics();

}


function updateAnalytics(){

    let spent = 0;

    for(
        let i = 0;
        i < expenses.length;
        i++
    ){

        spent =
        spent +
        expenses[i].amount;

    }

    document
    .getElementById(
    "thisMonthSpend"
    ).innerText =
    "₹" + spent;

    document
    .getElementById(
    "lastMonthSpend"
    ).innerText =
    "₹" + lastMonthSpent;

    let diff = 0;

    if(
        lastMonthSpent !== 0
    ){

        diff =
        (
        (spent -
        lastMonthSpent)
        /
        lastMonthSpent
        ) * 100;

    }

    document
    .getElementById(
    "differencePercent"
    ).innerText =
    diff.toFixed(1)
    + "%";

}


document
.getElementById(
"endMonthBtn"
)
.addEventListener(
"click",
function(){

    document
    .getElementById(
    "monthModal"
    )
    .classList.add(
        "show"
    );

}
);

document
.getElementById(
"confirmMonthBtn"
)
.addEventListener(
"click",
endMonth
);

function endMonth(){

    let spent = 0;

    for(
        let i = 0;
        i < expenses.length;
        i++
    ){

        spent +=
        expenses[i].amount;

    }

    let remaining =
    salary - spent;

    let choice =
    document.querySelector(
    'input[name="monthAction"]:checked'
    ).value;

    if(
       choice === "save"
    ){

        savings =
        savings +
        remaining;

    }
    else{

        salary =
        salary +
        remaining;

    }

    lastMonthSpent =
    spent;

    nextMonth();

    expenses = [];

    saveData();

    renderExpenses();

    updateDashboard();

    document
    .getElementById(
    "monthModal"
    )
    .classList.remove(
        "show"
    );

}

/* =========================
   NEXT MONTH
========================= */

function nextMonth(){

    let date =
    new Date(
        currentMonth + "-01"
    );

    date.setMonth(
        date.getMonth() + 1
    );

    currentMonth =
    date
    .toISOString()
    .slice(0,7);

}


function formatMonth(value){

    let date =
    new Date(
        value + "-01"
    );

    return date
    .toLocaleString(
        "default",
        {
            month:"long",
            year:"numeric"
        }
    );

}


function saveData(){

    localStorage.setItem(
        "expenses",
        JSON.stringify(
            expenses
        )
    );

    localStorage.setItem(
        "salary",
        salary
    );

    localStorage.setItem(
        "savings",
        savings
    );

    localStorage.setItem(
        "currentMonth",
        currentMonth
    );

    localStorage.setItem(
        "lastMonthSpent",
        lastMonthSpent
    );

}

function loadData(){

    let storedExpenses =
    localStorage.getItem(
        "expenses"
    );

    if(
        storedExpenses
    ){

        expenses =
        JSON.parse(
            storedExpenses
        );

    }

    let s =
    localStorage.getItem(
        "salary"
    );

    if(s){

        salary =
        Number(s);

    }

    let sv =
    localStorage.getItem(
        "savings"
    );

    if(sv){

        savings =
        Number(sv);

    }

    let cm =
    localStorage.getItem(
        "currentMonth"
    );

    if(cm){

        currentMonth = cm;

    }

    let lm =
    localStorage.getItem(
        "lastMonthSpent"
    );

    if(lm){

        lastMonthSpent =
        Number(lm);

    }

    renderExpenses();

    updateDashboard();

}


loadData();
const analyticsBtn =
document.getElementById(
"analyticsBtn"
);

const analyticsModal =
document.getElementById(
"analyticsModal"
);

const closeAnalytics =
document.getElementById(
"closeAnalytics"
);

analyticsBtn.addEventListener(
"click",
function(){

    analyticsModal.classList.add(
        "show"
    );

    createPieChart();

}
);

closeAnalytics.addEventListener(
"click",
function(){

    analyticsModal.classList.remove(
        "show"
    );

}
);
const exitBtn =
document.getElementById("exitBtn");

exitBtn.addEventListener(
    "click",
    function(){

        let pages =
        document.querySelectorAll(".page");

        for(let i=0;i<pages.length;i++){

            pages[i].classList.remove("active");

        }

        document
        .getElementById("landingPage")
        .classList.add("active");

    }
);
