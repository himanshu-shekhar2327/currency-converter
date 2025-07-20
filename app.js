const BASE_URL = "https://v6.exchangerate-api.com/v6/546b46af005bd409624835ce/latest";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Fill dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag when currency changes
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch exchange rate and update message
async function getExchangeRate() {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();
    let rate = data.conversion_rates[toCurr.value];

    const msg = document.querySelector(".msg");
    msg.innerText = `${amtVal} ${fromCurr.value} = ${(rate * amtVal).toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    document.querySelector(".msg").innerText = "Something went wrong!";
  }
}

// Button click event
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  getExchangeRate();
});

// Load default conversion on page load
window.addEventListener("load", () => {
  getExchangeRate();
});
