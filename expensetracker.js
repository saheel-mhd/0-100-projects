document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const toggleSwitch = document.getElementById("toggleSwitch");
  const toggleKnob = document.getElementById("toggleKnob");
  const currentType = document.getElementById("currentType");
  const categorySelect = document.getElementById("category");
  const entryForm = document.getElementById("entryForm");
  const titleInput = document.getElementById("title");
  const amountInput = document.getElementById("amount");
  const addBtn = document.getElementById("addBtn");
  const expenseTable = document.getElementById("expenseTable");
  const incomeTable = document.getElementById("incomeTable");
  const chartCanvas = document.getElementById("expenseChart");

  // Data
  let entryType = "expense";
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let income = JSON.parse(localStorage.getItem("income")) || [];

  const categoryColors = {
    food: "#f87171",
    transport: "#60a5fa",
    entertainment: "#facc15",
    utilities: "#a78bfa"
  };



// Array of input/select elements
const formInputs = [titleInput, amountInput, categorySelect];

// Toggle Switch
toggleSwitch.addEventListener("click", () => {
  if (entryType === "expense") {
    entryType = "income";

    // Move knob
    toggleKnob.classList.remove("left-1");
    toggleKnob.classList.add("right-1");

    // Switch toggle background and add button color
    toggleSwitch.classList.replace("bg-red-500", "bg-green-500");
    addBtn.classList.replace("bg-red-500", "bg-green-500");

    // Change input/select borders to green
    formInputs.forEach(input => {
      input.classList.remove("border-red-500");
      input.classList.add("border-green-500");
    });

    // Update category options
    categorySelect.innerHTML = `
      <option value="salary">Salary</option>
      <option value="bonus">Bonus</option>
      <option value="investment">Investment</option>
      <option value="other">Other</option>
    `;
  } else {
    entryType = "expense";

    // Move knob
    toggleKnob.classList.remove("right-1");
    toggleKnob.classList.add("left-1");

    // Switch toggle background and add button color
    toggleSwitch.classList.replace("bg-green-500", "bg-red-500");
    addBtn.classList.replace("bg-green-500", "bg-red-500");

    // Change input/select borders to red
    formInputs.forEach(input => {
      input.classList.remove("border-green-500");
      input.classList.add("border-red-500");
    });

    // Update category options
    categorySelect.innerHTML = `
      <option value="food">Food</option>
      <option value="transport">Transport</option>
      <option value="entertainment">Entertainment</option>
      <option value="utilities">Utilities</option>
    `;
  }

  currentType.textContent = entryType.charAt(0).toUpperCase() + entryType.slice(1);
});



  // Save to localStorage
  const saveData = () => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("income", JSON.stringify(income));
  };

  // Render Tables
  const renderTables = () => {
    expenseTable.innerHTML = "";
    incomeTable.innerHTML = "";

    expenses.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-2 py-1">${item.title}</td>
        <td class="border px-2 py-1">${item.category}</td>
        <td class="border px-2 py-1">$${item.amount}</td>
        <td class="border px-2 py-1 text-red-500 cursor-pointer">Delete</td>
      `;
      row.querySelector("td:last-child").addEventListener("click", () => {
        expenses.splice(index, 1);
        saveData();
        renderTables();
        renderChart();
      });
      expenseTable.appendChild(row);
    });

    income.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border px-2 py-1">${item.title}</td>
        <td class="border px-2 py-1">${item.category}</td>
        <td class="border px-2 py-1">$${item.amount}</td>
        <td class="border px-2 py-1 text-red-500 cursor-pointer">Delete</td>
      `;
      row.querySelector("td:last-child").addEventListener("click", () => {
        income.splice(index, 1);
        saveData();
        renderTables();
      });
      incomeTable.appendChild(row);
    });
  };

  // Render Pie Chart
  const renderChart = () => {
    const ctx = chartCanvas.getContext("2d");
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    const totals = {};
    expenses.forEach(exp => totals[exp.category] = (totals[exp.category] || 0) + parseFloat(exp.amount));
    const totalAmount = Object.values(totals).reduce((a,b) => a+b,0);

    let startAngle = -0.5 * Math.PI;
    Object.keys(totals).forEach(cat => {
      const sliceAngle = (totals[cat]/totalAmount)*2*Math.PI;
      ctx.beginPath();
      ctx.moveTo(chartCanvas.width/2, chartCanvas.height/2);
      ctx.arc(chartCanvas.width/2, chartCanvas.height/2, chartCanvas.width/2 - 10, startAngle, startAngle+sliceAngle);
      ctx.closePath();
      ctx.fillStyle = categoryColors[cat] || "#d1d5db";
      ctx.fill();
      startAngle += sliceAngle;
    });
  };

  // Form Submit
  entryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    if(!title || isNaN(amount) || !category) return;

    const entry = {title, amount, category};
    if(entryType==="expense") expenses.push(entry);
    else income.push(entry);

    saveData();
    renderTables();
    renderChart();
    entryForm.reset();
  });

  // Initial render
  renderTables();
  renderChart();
});
