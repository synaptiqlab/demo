/**
 * TRUMP by LUANDO Hair Studio Nha Trang
 * Core Application Controller & Trilingual Reactive Engine
 */

window.appState = {
  lang: localStorage.getItem("luando_lang") || "ru",
  activeCategory: "all"
};

// Portfolio images extracted from original salon works
const portfolioItems = [
  {
    category: "blond",
    title: "AirTouch Cool Nordic Blonde",
    tag: "AirTouch",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/03/IMG_3362-16-768x1152.jpg"
  },
  {
    category: "color",
    title: "Signature Golden Balayage",
    tag: "Balayage",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/03/IMG_0504-edited-768x1024.jpg"
  },
  {
    category: "blond",
    title: "Total Blonde & Ice Pearl Tone",
    tag: "Blonde",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/03/IMG_0269-edited-1-768x1024.jpeg"
  },
  {
    category: "extensions",
    title: "Feather Micro-Capsule Extensions",
    tag: "Extensions",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/03/IMG_8201-edited-768x1024.png"
  },
  {
    category: "blond",
    title: "Delicate Babylights & Tone Correction",
    tag: "Babylights",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/04/IMG_0612-768x1024.jpg"
  },
  {
    category: "color",
    title: "Caramel Honey Balayage & Olaplex",
    tag: "Balayage",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/03/IMG_4591-edited-1-768x1025.jpg"
  },
  {
    category: "extensions",
    title: "Seamless Volume Blend & Long Cut",
    tag: "Volume",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/04/IMG_3544-edited-1-768x1024.png"
  },
  {
    category: "blond",
    title: "Clean Vanilla Blonde & Steam Care",
    tag: "Blonde",
    img: "https://nhatranghairsalon.com/wp-content/uploads/2026/04/IMG_2778-2-edited-768x1024.png"
  }
];

function setLanguage(lang) {
  if (!translations[lang]) return;
  window.appState.lang = lang;
  localStorage.setItem("luando_lang", lang);

  // Update active state on language buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Render dynamic sections
  renderStaticTexts();
  renderServices();
  renderWhyUs();
  renderReviews();
  renderPortfolio();

  // If booking modal is open, re-render it
  if (window.bookingEngine) {
    window.bookingEngine.render();
  }
}

function renderStaticTexts() {
  const lang = window.appState.lang;
  const t = translations[lang];

  // Navigation
  document.getElementById("nav-about").textContent = t.nav.about;
  document.getElementById("nav-founder").textContent = t.nav.founder;
  document.getElementById("nav-services").textContent = t.nav.services;
  document.getElementById("nav-portfolio").textContent = t.nav.portfolio;
  document.getElementById("nav-reviews").textContent = t.nav.reviews;
  document.getElementById("nav-contacts").textContent = t.nav.contacts;
  document.getElementById("btn-header-book").textContent = t.nav.bookOnline;
  const mobileBookBtn = document.getElementById("btn-mobile-nav-book");
  if (mobileBookBtn) mobileBookBtn.textContent = t.nav.bookOnline;

  // Hero
  document.getElementById("hero-location-badge").textContent = t.hero.locationBadge;
  document.getElementById("hero-title").innerHTML = t.hero.title;
  document.getElementById("hero-subtitle").textContent = t.hero.subtitle;
  document.getElementById("hero-btn-book").textContent = t.hero.btnBook;
  document.getElementById("hero-btn-work").textContent = t.hero.btnWork;
  document.getElementById("stat-years-label").textContent = t.hero.statYears;
  document.getElementById("stat-rating-label").textContent = t.hero.statRating;
  document.getElementById("stat-clients-label").textContent = t.hero.statClients;
  document.getElementById("stat-blondes-label").textContent = t.hero.statBlondes;

  // Founder Section
  document.getElementById("founder-tag").textContent = t.founder.tag;
  document.getElementById("founder-title").textContent = t.founder.title;
  document.getElementById("founder-lead").textContent = t.founder.lead;
  document.getElementById("founder-bio1").innerHTML = t.founder.bio1.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  document.getElementById("founder-bio2").textContent = t.founder.bio2;
  document.getElementById("founder-quote").textContent = t.founder.quote;
  document.getElementById("founder-sig-name").textContent = t.founder.signatureName;
  document.getElementById("founder-sig-role").textContent = t.founder.signatureRole;

  // Services Head
  document.getElementById("services-tag").textContent = t.services.tag;
  document.getElementById("services-title").textContent = t.services.title;
  document.getElementById("services-subtitle").textContent = t.services.subtitle;

  // Services Filter Buttons
  const fAll = document.getElementById("filter-all");
  if (fAll) fAll.textContent = t.services.filterAll;
  const fStyling = document.getElementById("filter-styling");
  if (fStyling) fStyling.textContent = t.services.filterStyling;
  const fCare = document.getElementById("filter-care");
  if (fCare) fCare.textContent = t.services.filterCare;

  // Portfolio Head
  document.getElementById("portfolio-tag").textContent = t.portfolio.tag;
  document.getElementById("portfolio-title").textContent = t.portfolio.title;
  document.getElementById("portfolio-subtitle").textContent = t.portfolio.subtitle;

  // Why Us Head
  document.getElementById("why-tag").textContent = t.whyUs.tag;
  document.getElementById("why-title").textContent = t.whyUs.title;

  // Reviews Head
  document.getElementById("reviews-tag").textContent = t.reviews.tag;
  document.getElementById("reviews-title").textContent = t.reviews.title;
  document.getElementById("reviews-subtitle").textContent = t.reviews.subtitle;
  document.getElementById("reviews-badge-text").textContent = t.reviews.badge;

  // Contacts
  document.getElementById("contacts-tag").textContent = t.contacts.tag;
  document.getElementById("contacts-title").textContent = t.contacts.title;
  document.getElementById("contacts-subtitle").textContent = t.contacts.subtitle;
  document.getElementById("contact-address-label").textContent = t.contacts.addressLabel;
  document.getElementById("contact-address-val").textContent = t.contacts.addressVal;
  document.getElementById("contact-address-note").textContent = t.contacts.addressNote;
  document.getElementById("contact-hours-label").textContent = t.contacts.hoursLabel;
  document.getElementById("contact-hours-val").textContent = t.contacts.hoursVal;
  document.getElementById("contact-hours-note").textContent = t.contacts.hoursNote;
  document.getElementById("contact-direct-label").textContent = t.contacts.contactLabel;

  // Footer
  document.getElementById("footer-rights").textContent = t.footer.rights;
  document.getElementById("footer-badge").textContent = t.footer.badge;
}

function renderServices() {
  const lang = window.appState.lang;
  const items = translations[lang].services.items;
  const container = document.getElementById("servicesGrid");
  if (!container) return;

  const filtered = window.appState.activeCategory === "all" 
    ? items 
    : items.filter(s => s.cat === window.appState.activeCategory);

  container.innerHTML = filtered.map(service => `
    <div class="service-card" data-id="${service.id}">
      <div>
        <div class="service-header">
          <h3 class="service-name">${service.name}</h3>
          <span class="service-duration">${service.duration}</span>
        </div>
        <p class="service-desc">${service.desc}</p>
      </div>
      <div class="service-footer">
        <div class="service-price-box">
          <span class="price-prefix">${translations[lang].services.from}</span>
          <span class="price-amount">${service.price} ${translations[lang].services.currency}</span>
        </div>
        <button class="btn-card-select" onclick="window.bookingEngine.open('${service.id}')">
          ${translations[lang].services.bookBtn} ✨
        </button>
      </div>
    </div>
  `).join("");
}

function filterCategory(cat, btnElement) {
  window.appState.activeCategory = cat;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
  renderServices();
}

function renderPortfolio() {
  const container = document.getElementById("portfolioGrid");
  if (!container) return;

  container.innerHTML = portfolioItems.map(item => `
    <div class="portfolio-item">
      <img src="${item.img}" alt="${item.title}" loading="lazy">
      <div class="portfolio-overlay">
        <span class="portfolio-item-tag">${item.tag}</span>
        <h4 class="portfolio-item-title">${item.title}</h4>
      </div>
    </div>
  `).join("");
}

function renderWhyUs() {
  const lang = window.appState.lang;
  const items = translations[lang].whyUs.items;
  const container = document.getElementById("whyGrid");
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="why-card">
      <div class="why-icon">${item.icon}</div>
      <h3 class="why-title">${item.title}</h3>
      <p class="why-text">${item.text}</p>
    </div>
  `).join("");
}

function renderReviews() {
  const lang = window.appState.lang;
  const items = translations[lang].reviews.items;
  const container = document.getElementById("reviewsGrid");
  if (!container) return;

  container.innerHTML = items.map(r => `
    <div class="review-card">
      <div>
        <div class="review-header">
          <div class="review-author-box">
            <div class="review-avatar-char">${r.author.charAt(0)}</div>
            <div>
              <div class="review-author-name">${r.author}</div>
              <div class="review-origin">${r.origin}</div>
            </div>
          </div>
          <div class="review-stars">★★★★★</div>
        </div>
        <p class="review-body">"${r.text}"</p>
      </div>
      ${r.reply ? `<div class="review-reply">${r.reply}</div>` : ""}
    </div>
  `).join("");
}

// Mobile navigation toggle
function toggleMobileMenu() {
  const nav = document.getElementById("mainNav");
  const btn = document.getElementById("mobileMenuBtn");
  if (nav) {
    nav.classList.toggle("active");
    if (btn) btn.classList.toggle("active");
    const isOpen = nav.classList.contains("active");
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
}

function closeMobileMenu() {
  const nav = document.getElementById("mainNav");
  const btn = document.getElementById("mobileMenuBtn");
  if (nav && nav.classList.contains("active")) {
    nav.classList.remove("active");
    if (btn) btn.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Initialization on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  // Bind language buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // Mobile menu button
  const mobileBtn = document.getElementById("mobileMenuBtn");
  if (mobileBtn) {
    mobileBtn.addEventListener("click", toggleMobileMenu);
  }

  // Initial render with saved or default language
  setLanguage(window.appState.lang);
});
