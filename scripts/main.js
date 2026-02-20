// scripts/main.js
import { loadData, saveData, loadBudget, saveBudget, rates } from './state.js';
import { isValidAmount, hasDuplicateWords, isValidDesc, isValidMpesa } from './validators.js';

let transactions = loadData();
let currentBudget = loadBudget();
let currentCurrency = 'KES';

// grab all the DOM elements
let form = document.getElementById('txn-form');
let tableBody = document.getElementById('txn-body');
let currencySelect = document.getElementById('currency-selector');
let budgetInput = document.getElementById('budget-input');
let saveBudgetBtn = document.getElementById('save-budget-btn');
let searchInput = document.getElementById('search-input');
let mpesaBtn = document.getElementById('btn-mpesa-stk');

// when the page first loads
document.addEventListener('DOMContentLoaded', function() {
    // console.log("App loaded!");
    budgetInput.value = currentBudget || '';
    renderTable(transactions);
    updateDashboard();
});

// save budget logic
saveBudgetBtn.addEventListener('click', function() {
    let val = parseFloat(budgetInput.value);
    if (val >= 0) {
        currentBudget = val;
        saveBudget(currentBudget);
        updateDashboard();
        alert("Monthly Budget Saved Successfully!");
    } else {
        alert("Budget cannot be negative");
    }
});

// form submission
form.addEventListener('submit', function(e) {
    e.preventDefault(); // stop the page from refreshing
    // console.log("form submitted");
    
    let desc = document.getElementById('txn-desc').value.trim();
    let amount = document.getElementById('txn-amount').value;
    let cat = document.getElementById('txn-cat').value;
    let mpesa = document.getElementById('mpesa-code').value.trim();

    let isValid = true;

    // validate description
    if (isValidDesc(desc) === false || hasDuplicateWords(desc) === true) {
        document.getElementById('desc-error').textContent = "Invalid description or duplicate words found.";
        isValid = false;
    } else {
        document.getElementById('desc-error').textContent = "";
    }

    // validate amount
    if (isValidAmount(amount) === false) {
        document.getElementById('amt-error').textContent = "Enter a valid amount.";
        isValid = false;
    } else {
        document.getElementById('amt-error').textContent = "";
    }

    // validate mpesa
    if (isValidMpesa(mpesa) === false) {
        document.getElementById('mpesa-error').textContent = "Invalid M-Pesa Reference (10 alphanumeric chars).";
        isValid = false;
    } else {
        document.getElementById('mpesa-error').textContent = "";
    }

    // if no errors, create the object and save
    if (isValid === true) {
        let newTxn = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0], // just get the YYYY-MM-DD part
            desc: desc,
            amount: parseFloat(amount),
            cat: cat,
            mpesa: mpesa
        };

        transactions.push(newTxn);
        saveData(transactions);
        renderTable(transactions);
        updateDashboard();
        form.reset();
    }
});

// fake mpesa integration
mpesaBtn.addEventListener('click', function() {
    let amount = document.getElementById('txn-amount').value;
    if (amount === "") {
        alert("Please enter an amount first to trigger M-Pesa.");
        return;
    }
    
    mpesaBtn.textContent = "Requesting...";
    
    // fake api delay
    setTimeout(function() {
        let randomNumber = Math.floor(10000000 + Math.random() * 90000000);
        let mockCode = "QW" + randomNumber;
        document.getElementById('mpesa-code').value = mockCode;
        mpesaBtn.textContent = "Trigger M-Pesa STK Push";
        alert("M-Pesa payment successfully received! Reference: " + mockCode);
    }, 1500);
});

// regex search filter
searchInput.addEventListener('input', function(e) {
    let query = e.target.value;
    // console.log("searching for: " + query);
    
    let filtered = [];
    try {
        let regex = new RegExp(query, 'i');
        // standard loop instead of filter()
        for (let i = 0; i < transactions.length; i++) {
            let t = transactions[i];
            if (regex.test(t.desc) || regex.test(t.cat)) {
                filtered.push(t);
            }
        }
        renderTable(filtered);
    } catch (err) {
        // if regex is incomplete while they type, show everything
        renderTable(transactions);
    }
});

// currency swapper
currencySelect.addEventListener('change', function(e) {
    currentCurrency = e.target.value;
    renderTable(transactions);
    updateDashboard();
});

// function to draw the table
function renderTable(data) {
    tableBody.innerHTML = '';
    let multiplier = rates[currentCurrency];

    for (let i = 0; i < data.length; i++) {
        let txn = data[i];
        let isIncome = false;
        
        if (txn.cat === 'Income') {
            isIncome = true;
        }
        
        let convertedAmt = (txn.amount * multiplier).toFixed(2);
        
        let sign = '';
        let colorClass = '';

        if (isIncome === true) {
            sign = '+';
            colorClass = 'text-income';
        } else {
            sign = '-';
            colorClass = 'text-expense';
        }

        let mpesaDisplay = txn.mpesa;
        if (mpesaDisplay === "") {
            mpesaDisplay = "N/A";
        }

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${txn.date}</td>
            <td>${txn.desc}</td>
            <td>${txn.cat}</td>
            <td class="${colorClass}">${sign} ${currentCurrency} ${convertedAmt}</td>
            <td>${mpesaDisplay}</td>
            <td><button class="delete-btn" data-id="${txn.id}">X</button></td>
        `;
        tableBody.appendChild(tr);
    }

    // add event listeners to all the delete buttons
    let deleteBtns = document.querySelectorAll('.delete-btn');
    for (let j = 0; j < deleteBtns.length; j++) {
        deleteBtns[j].addEventListener('click', function(e) {
            let idToRemove = e.target.getAttribute('data-id');
            // console.log("deleting row with id: " + idToRemove);
            
            let newTransactions = [];
            for (let k = 0; k < transactions.length; k++) {
                if (transactions[k].id !== idToRemove) {
                    newTransactions.push(transactions[k]);
                }
            }
            transactions = newTransactions;
            saveData(transactions);
            renderTable(transactions);
            updateDashboard();
        });
    }
}

// function to calculate and update dashboard stats
function updateDashboard() {
    let statsContainer = document.getElementById('stats-container');
    let multiplier = rates[currentCurrency];
    
    // get current year and month YYYY-MM
    let dateObj = new Date();
    let currentMonthStr = dateObj.toISOString().slice(0, 7); 
    
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    // manually calculate totals instead of using reduce()
    for (let i = 0; i < transactions.length; i++) {
        let txn = transactions[i];
        if (txn.date.startsWith(currentMonthStr)) {
            if (txn.cat === 'Income') {
                monthlyIncome += txn.amount;
            } else {
                monthlyExpense += txn.amount;
            }
        }
    }

    let isOverBudget = false;
    if (currentBudget > 0 && monthlyExpense > currentBudget) {
        isOverBudget = true;
    }
    
    let alertClass = '';
    let alertMessage = '';

    if (isOverBudget === true) {
        alertClass = 'budget-alert';
        alertMessage = '<p style="color: var(--error-color); margin-top: 10px; font-weight: bold;">⚠️ Alert: You have exceeded your monthly budget!</p>';
    }

    statsContainer.innerHTML = `
        <div class="budget-card ${alertClass}">
            <div class="stat-box">
                <h4>Budget (${currentCurrency})</h4>
                <p>${(currentBudget * multiplier).toFixed(2)}</p>
            </div>
            <div class="stat-box">
                <h4>Monthly Expenses</h4>
                <p class="text-expense">${(monthlyExpense * multiplier).toFixed(2)}</p>
            </div>
            <div class="stat-box">
                <h4>Monthly Income</h4>
                <p class="text-income">${(monthlyIncome * multiplier).toFixed(2)}</p>
            </div>
        </div>
        ${alertMessage}
    `;
}