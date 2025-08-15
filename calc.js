const display = document.getElementById("display");
const buttons = document.querySelectorAll("button[data-value]");
const operators = "+-*/%";
const historyList = document.querySelector("#list ul");

function addToHistory(expression, result) {
  const li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;
  historyList.prepend(li);

  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.unshift(`${expression} = ${result}`);
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    const lastChar = display.textContent.slice(-1);

    if (!isNaN(value) || value === ".") {
      display.textContent += value;
    } else if (operators.includes(value)) {
      if (operators.includes(lastChar)) {
        display.textContent = display.textContent.slice(0, -1) + value;
      } else if (display.textContent !== "") {
        display.textContent += value;
      }
    } else if (value === "=") {
      try {
        const expression = display.textContent;
        const result = eval(expression);
        display.textContent = result;
        addToHistory(expression, result);
      } catch {
        display.textContent = "Error";
      }
    } else if (value === "⌫") {
      display.textContent = display.textContent.slice(0, -1);
    }  else if (value === "AC" || value === "C") {
  display.textContent = "";
  localStorage.removeItem("calcHistory");
  historyList.innerHTML = "";
}
  });
});

window.addEventListener("keydown", function (e) {
  const key = e.key;

  if (!display) return;

  if (!isNaN(key) || key === ".") {
    display.textContent += key;
  } else if (operators.includes(key)) {
    const lastChar = display.textContent.slice(-1);
    if (operators.includes(lastChar)) {
      display.textContent = display.textContent.slice(0, -1) + key;
    } else if (display.textContent !== "") {
      display.textContent += key;
    }
  } else if (key === "Enter") {
    try {
      const expression = display.textContent;
      const result = eval(expression);
      display.textContent = result;
      addToHistory(expression, result);
    } catch {
      display.textContent = "Error";
    }
  } else if (key === "Backspace") {
    display.textContent = display.textContent.slice(0, -1);
  } else if (key === "Escape") {
    display.textContent = "";
    historyList.innerHTML = "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    historyList.appendChild(li);
  });
});
