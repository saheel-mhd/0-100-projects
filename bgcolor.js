const buttons = document.querySelectorAll("button");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.body.className = ""; // Clear existing classes
    document.body.classList.add(btn.id); // Add the button's id (Tailwind class) as body class
  });
});
