// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com

import {getConversionRateFromUsdTo, logAllData} from "../../utils.js";

//const WARN_SUBMIT_CHECKBOX = document.getElementById("submit-warn");
const PAYRATE_INPUT = document.getElementById("payrate");
//const CURRENCY_SELECT = document.getElementById("currencies");

render();
saveSettingsHandler();

function render() {
    logAllData();
    //renderSupportedCurrencies();

    // noinspection JSUnresolvedVariable
    chrome.storage.sync.get(["settings"], (data) => {
        //WARN_SUBMIT_CHECKBOX.checked = data.settings.warnIfForgotToStart;

        PAYRATE_INPUT.value = data.settings.moneyEarned.payrate;

        //CURRENCY_SELECT.value = data.settings.moneyEarned.currency;
    })

}

function renderSupportedCurrencies() {
    const currencies = ["HUF", "USD", "CAD", "HKD", "ISK", "PHP", "DKK",
        "CZK", "GBP", "RON", "SEK", "IDR", "INR",
        "BRL", "RUB", "HRK", "JPY", "THB", "CHF", "EUR", "MYR", "BGN",
        "TRY", "CNY", "NOK", "NZD", "ZAR", "MXN", "SGD", "AUD", "ILS", "KRW", "PLN"];

    let currenciesDropdown = document.getElementById("currencies");

    for (const currency of currencies) {
        let opt = document.createElement("option");
        opt.value = currency;
        opt.innerHTML = currency;
        currenciesDropdown.appendChild(opt);
    }
}

function saveSettingsHandler() {
    const saveBtn = document.getElementById("save-btn");
    const saveStatus = document.getElementById("save-status");

    saveBtn.addEventListener("click", () => {
        saveStatus.textContent = "Saving settings...";
        // noinspection JSUnresolvedVariable
        chrome.storage.sync.get(["settings"], async (data) => {
            //data.settings.warnIfForgotToStart = WARN_SUBMIT_CHECKBOX.checked;
            // noinspection JSUnresolvedVariable
            chrome.storage.sync.set({"settings": data.settings});

            if (shouldUpdateMoneyEarned(data)) {
                await updateMoneyEarnedSettings(data);
            } else {
                saveStatus.textContent = "Settings saved";
            }

            setTimeout(() => {
                saveStatus.textContent = "";
            }, 2000);


        })

    })

    async function updateMoneyEarnedSettings(data) {
        try {
            //const conversionRate = await getConversionRateFromUsdTo(CURRENCY_SELECT.value);
            //console.log(conversionRate);
            //data.settings.moneyEarned.payrate = parseFloat(PAYRATE_INPUT.value);
            data.settings.moneyEarned.payrate = PAYRATE_INPUT.value;
            //data.settings.moneyEarned.currency = CURRENCY_SELECT.value;
            //data.settings.moneyEarned.conversionRate = conversionRate;
	    //data.settings.usuario = USUARIO.value;
            // noinspection JSUnresolvedVariable
            chrome.storage.sync.set({"settings": data.settings});
            saveStatus.textContent = "Settings saved";


        } catch (e) {
            saveStatus.textContent = "Failed to save settings due to network error. Try later again.";
            saveStatus.classList.add("class", "text-red");
        }
    }

    function shouldUpdateMoneyEarned(data) {
        return data.settings.moneyEarned.payrate !== parseFloat(PAYRATE_INPUT.value) || data.settings.moneyEarned.currency !== CURRENCY_SELECT.value;
    }


}
