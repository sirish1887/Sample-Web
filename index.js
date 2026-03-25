const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt-card]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const magneticItems = document.querySelectorAll(".magnetic");
const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const actionButtons = document.querySelectorAll("[data-demo-action]");
const navLinks = document.querySelectorAll("[data-nav]");
const toast = document.querySelector("[data-toast]");

const activePage = document.body.dataset.page;
if (activePage) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === activePage);
  });
}

const showToast = (message) => {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2400);
};

if (revealItems.length && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

tiltCards.forEach((card) => {
  const onMove = (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = (0.5 - (y / rect.height)) * 14;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    card.classList.add("is-hovered");
  };

  const reset = () => {
    card.style.transform = "";
    card.classList.remove("is-hovered");
  };

  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerleave", reset);
});

window.addEventListener("scroll", () => {
  const offset = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.08);
    item.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
  });
});

magneticItems.forEach((item) => {
  const moveMagnet = (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  };

  const resetMagnet = () => {
    item.style.transform = "";
  };

  item.addEventListener("pointermove", moveMagnet);
  item.addEventListener("pointerleave", resetMagnet);
});

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selector = button.dataset.scrollTarget;
    const target = selector ? document.querySelector(selector) : null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.dataset.demoAction || "Interaction triggered");
  });
});

document.querySelectorAll("[data-expand-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const card = toggle.closest(".expand-card");
    const isOpen = card.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});

document.querySelectorAll("[data-faq-question]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const testimonialTrack = document.querySelector("[data-testimonial-track]");
const testimonialSlides = testimonialTrack ? Array.from(testimonialTrack.children) : [];
const dotsContainer = document.querySelector("[data-carousel-dots]");
let testimonialIndex = 0;
let testimonialTimer = null;

const updateCarousel = () => {
  if (!testimonialTrack) {
    return;
  }

  testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
  if (dotsContainer) {
    dotsContainer.querySelectorAll("button").forEach((dot, index) => {
      dot.classList.toggle("active", index === testimonialIndex);
    });
  }
};

const moveCarousel = (direction) => {
  if (!testimonialSlides.length) {
    return;
  }
  testimonialIndex = (testimonialIndex + direction + testimonialSlides.length) % testimonialSlides.length;
  updateCarousel();
};

const restartCarousel = () => {
  if (!testimonialSlides.length) {
    return;
  }

  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    moveCarousel(1);
  }, 5200);
};

if (dotsContainer && testimonialSlides.length) {
  testimonialSlides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      testimonialIndex = index;
      updateCarousel();
      restartCarousel();
    });
    dotsContainer.appendChild(dot);
  });
}

document.querySelectorAll("[data-carousel]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.carousel === "next" ? 1 : -1;
    moveCarousel(direction);
    restartCarousel();
  });
});

updateCarousel();
restartCarousel();

const modal = document.querySelector("[data-project-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalSummary = document.querySelector("[data-modal-summary]");
const modalMetrics = document.querySelector("[data-modal-metrics]");
const modalScope = document.querySelector("[data-modal-scope]");
const modalOutcome = document.querySelector("[data-modal-outcome]");

document.querySelectorAll("[data-open-project]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!modal) {
      return;
    }

    modalTitle.textContent = button.dataset.title || "Case Study";
    modalSummary.textContent = button.dataset.summary || "";
    modalScope.textContent = button.dataset.scope || "";
    modalOutcome.textContent = button.dataset.outcome || "";

    if (modalMetrics) {
      modalMetrics.innerHTML = "";
      const metrics = (button.dataset.metrics || "").split("|").filter(Boolean);
      metrics.forEach((metric) => {
        const li = document.createElement("li");
        li.textContent = metric;
        modalMetrics.appendChild(li);
      });
    }

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

const closeModal = () => {
  if (!modal) {
    return;
  }
  modal.classList.remove("open");
  document.body.style.overflow = "";
};

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

document.querySelectorAll("[data-filter-button]").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest("[data-filter-group]");
    const value = button.dataset.filterButton;
    const cards = document.querySelectorAll("[data-filter-item]");

    group?.querySelectorAll("[data-filter-button]").forEach((peer) => {
      peer.classList.toggle("active", peer === button);
    });

    cards.forEach((card) => {
      const match = value === "all" || card.dataset.filterItem === value;
      card.hidden = !match;
    });
  });
});

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;
    const fields = Array.from(form.querySelectorAll("[data-required]"));

    fields.forEach((field) => {
      const error = field.parentElement.querySelector(".field-error");
      let message = "";

      if (!field.value.trim()) {
        message = "This field is required.";
      } else if (field.type === "email" && !validateEmail(field.value.trim())) {
        message = "Please enter a valid email address.";
      }

      if (error) {
        error.textContent = message;
      }

      if (message) {
        isValid = false;
      }
    });

    if (!isValid) {
      showToast("Please review the highlighted form fields.");
      return;
    }

    const name = form.querySelector('[name="name"]')?.value || "there";
    const note = form.querySelector("[data-form-note]");
    if (note) {
      note.textContent = `Thanks, ${name}. Your message is ready for follow-up.`;
    }

    form.reset();
    showToast("Inquiry submitted successfully.");
  });
});

document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailField = form.querySelector('input[type="email"]');
    if (!emailField || !validateEmail(emailField.value.trim())) {
      showToast("Enter a valid email to join the newsletter.");
      return;
    }

    form.reset();
    showToast("Newsletter signup confirmed.");
  });
});

const locationPanel = document.querySelector("[data-location-panel]");
const locationTitle = document.querySelector("[data-location-title]");
const locationText = document.querySelector("[data-location-text]");

document.querySelectorAll("[data-location]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-location]").forEach((dot) => {
      dot.classList.toggle("active", dot === button);
    });

    if (locationPanel && locationTitle && locationText) {
      locationTitle.textContent = button.dataset.city || "Studio";
      locationText.textContent = button.dataset.detail || "";
    }
  });
});
