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

const setupCardCarousel = (carousel, trackSelector, slideSelector) => {
  const track = carousel.querySelector(trackSelector);
  const slides = Array.from(carousel.querySelectorAll(slideSelector));
  const dots = Array.from(carousel.querySelectorAll(".service-carousel__dots span"));
  const previousButton = carousel.querySelector("[data-service-prev], [data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-service-next], [data-carousel-next]");
  let activeIndex = 0;

  const updateDots = () => {
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const goToSlide = (index) => {
    if (!track || slides.length === 0) return;
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    updateDots();
  };

  previousButton?.addEventListener("click", () => goToSlide(activeIndex - 1));
  nextButton?.addEventListener("click", () => goToSlide(activeIndex + 1));

  track?.addEventListener("scroll", () => {
    if (slides.length === 0) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const nearestIndex = slides.reduce((nearest, slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const nearestSlide = slides[nearest];
      const nearestCenter = nearestSlide.offsetLeft + nearestSlide.clientWidth / 2;
      return Math.abs(slideCenter - trackCenter) < Math.abs(nearestCenter - trackCenter) ? index : nearest;
    }, activeIndex);

    if (nearestIndex !== activeIndex) {
      activeIndex = nearestIndex;
      updateDots();
    }
  }, { passive: true });
};

document.querySelectorAll(".service-carousel").forEach((carousel) => {
  setupCardCarousel(carousel, ".service-showcase", ".service-slide");
});

document.querySelectorAll(".care-carousel").forEach((carousel) => {
  setupCardCarousel(carousel, ".care-showcase", ".care-card");
});

const reviewComposer = document.querySelector(".review-composer");

if (reviewComposer) {
  const ratingButtons = Array.from(reviewComposer.querySelectorAll("[data-rating]"));
  const fields = reviewComposer.querySelector(".review-composer__fields");
  const reviewGrid = document.querySelector(".review-grid");
  let selectedRating = 0;

  const updateRating = (rating, revealFields = true) => {
    selectedRating = rating;
    ratingButtons.forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.rating) <= selectedRating);
    });
    if (fields && revealFields) fields.hidden = false;
  };

  ratingButtons.forEach((button) => {
    button.addEventListener("click", () => updateRating(Number(button.dataset.rating)));
  });

  reviewComposer.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!reviewGrid || selectedRating === 0) return;

    const formData = new FormData(reviewComposer);
    const name = String(formData.get("reviewer") || "D'Lux Patient").trim() || "D'Lux Patient";
    const treatment = String(formData.get("treatment") || "Patient Review").trim() || "Patient Review";
    const review = String(formData.get("review") || "").trim();
    if (!review) return;

    const card = document.createElement("article");
    const profile = document.createElement("div");
    const avatar = document.createElement("img");
    const profileText = document.createElement("div");
    const reviewerName = document.createElement("h3");
    const treatmentName = document.createElement("p");
    const stars = document.createElement("div");
    const body = document.createElement("p");

    card.className = "review-card";
    profile.className = "review-profile";
    avatar.src = "./assets/new-design/avatar-mask.png";
    avatar.alt = name;
    reviewerName.textContent = name;
    treatmentName.textContent = treatment;
    stars.className = "stars";
    stars.setAttribute("aria-label", `${selectedRating} star rating`);
    stars.textContent = "★★★★★".slice(0, selectedRating);
    body.textContent = review;

    profileText.append(reviewerName, treatmentName);
    profile.append(avatar, profileText);
    card.append(profile, stars, body);
    reviewGrid.prepend(card);
    reviewComposer.reset();
    if (fields) fields.hidden = true;
    updateRating(0, false);
  });
}
