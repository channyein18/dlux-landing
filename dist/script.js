const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".primary-nav a");

menuButton?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation menu");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.body.classList.remove("nav-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation menu");
});

document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const icon = item.querySelector(".faq-question img");

  question?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("faq-item--open");
    question.setAttribute("aria-expanded", String(isOpen));
    if (answer) answer.hidden = !isOpen;
    if (icon) {
      icon.src = isOpen ? "./assets/new-design/faq-chevron-up.svg" : "./assets/new-design/faq-chevron-down.svg";
    }
  });
});
