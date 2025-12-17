// ---------------------------
// Config: update your links
// ---------------------------
const CONFIG = {
  email: "pavithra@example.com", // change to your email
  linkedin: "https://www.linkedin.com/in/your-linkedin-id", // change
  github: "https://github.com/your-github-id" // change
};

// ---------------------------
// Helpers
// ---------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

// ---------------------------
// Theme toggle with persistence
// ---------------------------
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

themeBtn?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// ---------------------------
// Mobile drawer
// ---------------------------
const drawer = $("#drawer");
const menuBtn = $("#menuBtn");
const closeDrawerBtn = $("#closeDrawerBtn");
const drawerBackdrop = $("#drawerBackdrop");

function openDrawer() {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

menuBtn?.addEventListener("click", openDrawer);
closeDrawerBtn?.addEventListener("click", closeDrawer);
drawerBackdrop?.addEventListener("click", closeDrawer);
$$(".drawer__link").forEach(a => a.addEventListener("click", closeDrawer));

// ---------------------------
// Smooth scrolling for anchor links
// ---------------------------
function enableSmoothAnchors() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
}
enableSmoothAnchors();

// ---------------------------
// Reveal on scroll
// ---------------------------
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ---------------------------
// Counters in hero
// ---------------------------
const counters = $$("[data-counter]");
let countersStarted = false;

function animateCounter(el, to) {
  const duration = 800;
  const start = performance.now();
  const from = 0;

  function frame(now) {
    const t = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = Math.round(from + (to - from) * eased).toString();
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(el => animateCounter(el, Number(el.dataset.counter || "0")));
    }
  });
}, { threshold: 0.25 });

const hero = $(".hero");
if (hero) heroObserver.observe(hero);

// ---------------------------
// Skills filter
// ---------------------------
const tabs = $$(".tab");
const skillCards = $$(".skill");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.skillFilter || "all";
    tabs.forEach(t => t.classList.remove("is-active"));
    tab.classList.add("is-active");

    skillCards.forEach(card => {
      const type = card.dataset.skill;
      const show = filter === "all" || type === filter;
      card.style.display = show ? "block" : "none";
    });
  });
});

// ---------------------------
// Project modal
// ---------------------------
const modal = $("#modal");
const modalBackdrop = $("#modalBackdrop");
const modalCloseBtn = $("#modalCloseBtn");
const modalKicker = $("#modalKicker");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalHighlights = $("#modalHighlights");
const modalTech = $("#modalTech");
const modalCopyBtn = $("#modalCopyBtn");
const modalCtaLink = $("#modalCtaLink");

const PROJECTS = {
  serv: {
    kicker: "Project",
    title: "SERV Attendance App",
    desc:
      "A practical learning project focused on attendance management. Work includes backend REST APIs, Firebase Firestore integration, and API testing with Postman. Frontend integration exposure with Flutter (basic).",
    highlights: [
      "Designed and tested REST endpoints (CRUD patterns)",
      "Configured Firebase/Firestore and service account setup",
      "Validated API responses and error handling using Postman",
      "Structured development as an iterative learning project"
    ],
    tech: ["Node.js", "TypeScript", "Firebase", "Firestore", "Postman", "Flutter (Basic)"]
  },
  eda: {
    kicker: "Mini Project",
    title: "EDA Practice Notebook",
    desc:
      "Exploratory data analysis practice using Pandas and Matplotlib. Focused on clean steps: loading data, cleaning, summary stats, and charts.",
    highlights: [
      "Data cleaning and preparation with Pandas",
      "Meaningful plots using Matplotlib",
      "Step-by-step EDA notes for readability",
      "Reusable notebook structure"
    ],
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "EDA"]
  },
  postman: {
    kicker: "Toolkit",
    title: "API Testing Templates",
    desc:
      "A reusable Postman workflow template to test authentication, CRUD, validations, and common error cases for REST APIs.",
    highlights: [
      "Standard request naming and folders",
      "Status code and error testing pattern",
      "Environment variable usage",
      "Repeatable workflow for new APIs"
    ],
    tech: ["Postman", "REST", "Testing", "Debugging"]
  }
};

function openModal(key) {
  const p = PROJECTS[key];
  if (!p) return;

  modalKicker.textContent = p.kicker;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;

  modalHighlights.innerHTML = "";
  p.highlights.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    modalHighlights.appendChild(li);
  });

  modalTech.innerHTML = "";
  p.tech.forEach(t => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    modalTech.appendChild(span);
  });

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  modalCopyBtn.onclick = async () => {
    const summary = `${p.title} — ${p.desc}\nTech: ${p.tech.join(", ")}\nHighlights: ${p.highlights.join("; ")}`;
    try {
      await navigator.clipboard.writeText(summary);
      modalCopyBtn.textContent = "Copied";
      setTimeout(() => (modalCopyBtn.textContent = "Copy Summary"), 1200);
    } catch {
      modalCopyBtn.textContent = "Copy failed";
      setTimeout(() => (modalCopyBtn.textContent = "Copy Summary"), 1200);
    }
  };

  modalCtaLink.onclick = () => closeModal();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$("[data-open-modal]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.openModal));
});

modalBackdrop?.addEventListener("click", closeModal);
modalCloseBtn?.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// ---------------------------
// Copy email button
// ---------------------------
const copyEmailBtn = $("#copyEmailBtn");
copyEmailBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONFIG.email);
    copyEmailBtn.textContent = "Copied";
    setTimeout(() => (copyEmailBtn.textContent = "Copy Email"), 1200);
  } catch {
    copyEmailBtn.textContent = "Copy failed";
    setTimeout(() => (copyEmailBtn.textContent = "Copy Email"), 1200);
  }
});

// ---------------------------
// Contact form: opens mail client (mailto)
// ---------------------------
const contactForm = $("#contactForm");
const formHint = $("#formHint");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    formHint.textContent = "Please fill all fields.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;

  formHint.textContent = "Opening your email app...";
  contactForm.reset();
  setTimeout(() => (formHint.textContent = ""), 1500);
});

// ---------------------------
// Footer year + link setup
// ---------------------------
$("#year").textContent = new Date().getFullYear().toString();

const linkedinLink = $("#linkedinLink");
const githubLink = $("#githubLink");
if (linkedinLink) linkedinLink.href = CONFIG.linkedin;
if (githubLink) githubLink.href = CONFIG.github;
