# PesaWallet: Kenyan Market Case Study (UoN Edition)

## Overview
PesaWallet is a responsive, accessible single-page application (SPA) built for the **African Leadership University (ALU) Front-End Web Development Summative Assessment**. 

To demonstrate creative localization and user-centric product design, this application is styled as a targeted case study for students at the **University of Nairobi (UoN)**. It utilizes familiar terminology ("comrade float", "HELB"), UoN branding, and a simulated M-Pesa Express integration to solve real-world financial tracking problems for the Kenyan university demographic. 

## Setup Guide
1. Clone this repository to your local machine.
2. Ensure the `images/` folder contains the required UI image (`icon.png`).
3. Open the project using a local server (e.g., **VS Code Live Server**) to ensure ES6 JavaScript modules (`import`/`export`) load correctly without CORS policy errors.
4. Navigate to `index.html` to view the landing page, and click "Try for Free" to enter the main application (`app.html`).

## Key Features & Rubric Alignment
* **Smart Budget Alerts (JS Logic):** Calculates the current month's transactions against a user-defined monthly limit. The dashboard dynamically updates CSS classes to turn red if overspending occurs.
* **Data Persistence (LocalStorage):** All transactions and budget settings are securely stored, updated, and retrieved via the browser's `localStorage` API.
* **Modular Architecture:** Strict separation of concerns across `main.js` (DOM/Events), `state.js` (Storage), and `validators.js` (Regex).
* **Mobile-First Responsive Design:** Utilizes CSS Grid and Flexbox for seamless scaling across mobile, tablet, and desktop breakpoints. 
* **M-Pesa Mock API:** Simulates an STK push request with a `setTimeout` asynchronous delay, generating a validated 10-character alphanumeric receipt.

## Regex Catalog (Validation & Search)
1. **Amount Format:** `/^\d+(\.\d{1,2})?$/` 
   * *Ensures strictly numeric inputs with an optional two decimal places.*
2. **Standard Text Validation:** `/^[a-zA-Z0-9\s\-_,.]+$/`
   * *Prevents malicious or unsupported special characters in descriptions.*
3. **Description Backreference (Advanced):** `/\b(\w+)\s+\1\b/i` 
   * *Catches accidental consecutive duplicate word entries (e.g., typing "Fare Fare").*
4. **M-Pesa Lookahead (Advanced):** `/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{10}$/` 
   * *Ensures the reference code is exactly 10 characters and contains both letters and numbers.*
5. **Dynamic Search Field:** *Accepts valid Regex objects from the user interface to deeply filter the transaction history array.*

## Accessibility (A11y) Notes
* **Semantic HTML:** Utilizes `<header>`, `<main>`, `<section>`, and `<nav>` landmarks.
* **Screen Reader Support:** Features `aria-live="polite"` regions for dynamic budget updates and form error reporting. All inputs are explicitly tied to `<label>` tags.
* **Skip Navigation:** A `.skip-link` is available at the top of the DOM (visible on focus).

## Keyboard Map
* **`Tab` / `Shift+Tab`:** Navigate sequentially through form inputs, navigation links, and table action buttons.
* **`Enter` / `Space`:** Trigger the M-Pesa STK push button, submit forms, or activate the "X" (Delete) buttons.

## Demo Video
[Insert your YouTube/Loom/Drive Link Here]
