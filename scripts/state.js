// scripts/state.js
// saving to local storage so we don't lose data on page refresh

let STORAGE_KEY = 'pesawallet_data';
let BUDGET_KEY = 'pesawallet_budget';

// exchange rates based on KES
export let rates = {
    KES: 1, UGX: 28.5, TZS: 18.2, RWF: 9.8, USD: 0.0065, EUR: 0.0060
};

export function loadData() {
    let data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    } else {
        return []; // return an empty array if nothing is saved yet
    }
}

export function saveData(data) {
    // console.log("saving data to storage");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadBudget() {
    let savedBudget = localStorage.getItem(BUDGET_KEY);
    if (savedBudget) {
        return parseFloat(savedBudget);
    } else {
        return 0;
    }
}

export function saveBudget(amount) {
    localStorage.setItem(BUDGET_KEY, amount);
}