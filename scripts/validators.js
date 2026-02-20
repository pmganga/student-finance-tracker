// scripts/validators.js
// I have applied the Week 1 Regex to the form

// check if amount is a number with optional 2 decimals
export function isValidAmount(val) {
    let regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(val);
}

// prevent weird symbols in the description
export function isValidDesc(text) {
    let regex = /^[a-zA-Z0-9\s\-_,.]+$/;
    return regex.test(text);
}

// Advanced Regex 1: check for duplicate words like "Fare Fare"
export function hasDuplicateWords(text) {
    let dupRegex = /\b(\w+)\s+\1\b/i;
    return dupRegex.test(text);
}

// Advanced Regex 2: M-Pesa must be exactly 10 alphanumeric chars
export function isValidMpesa(code) {
    if (code === "") {
        return true; // it's an optional field
    }
    let mpesaRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{10}$/;
    // console.log("testing mpesa code: " + code);
    return mpesaRegex.test(code.toUpperCase());
}