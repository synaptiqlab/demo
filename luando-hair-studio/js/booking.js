/**
 * TRUMP by LUANDO Hair Studio Nha Trang
 * Interactive 4-Step Booking Engine
 * Ready for PulseCore / Cloudflare D1 CRM Bridge
 */

class BookingEngine {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.bookingData = {
      serviceId: "airtouch",
      serviceName: "AirTouch Balayage & Toning",
      servicePrice: "3 000 000 ₫",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      clientName: "",
      clientPhone: "",
      notes: ""
    };

    this.overlay = document.getElementById("bookingModalOverlay");
    this.stepsContainer = document.getElementById("bookingStepsContent");
    this.stepIndicators = document.querySelectorAll(".step-indicator");
  }

  init() {
    // Event listeners
    const closeBtn = document.getElementById("bookingModalClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });
    }

    // Set default min date for datepicker
    const today = new Date();
    this.defaultMinDate = today.toISOString().split("T")[0];
  }

  open(preselectedServiceId = null) {
    if (preselectedServiceId) {
      this.selectServiceById(preselectedServiceId);
      this.currentStep = 2; // Jump directly to date & time selection
    } else {
      this.currentStep = 1;
    }

    this.render();
    if (this.overlay) {
      this.overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  selectServiceById(id) {
    const lang = window.appState ? window.appState.lang : "ru";
    const serviceList = translations[lang].services.items;
    const found = serviceList.find(s => s.id === id);
    if (found) {
      this.bookingData.serviceId = found.id;
      this.bookingData.serviceName = found.name;
      this.bookingData.servicePrice = `${found.price} ${translations[lang].services.currency}`;
    }
  }

  setStep(step) {
    this.currentStep = step;
    this.render();
  }

  updateIndicators() {
    const lang = window.appState ? window.appState.lang : "ru";
    const stepNames = (translations[lang] && translations[lang].booking && translations[lang].booking.stepIndicators) 
      || ["Услуга", "Время", "Контакты", "Готово"];

    this.stepIndicators.forEach((el, index) => {
      if (index + 1 <= this.currentStep) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
      const labelEl = el.querySelector(".step-text");
      if (labelEl && stepNames[index]) {
        labelEl.textContent = stepNames[index];
      }
    });
  }

  render() {
    this.updateIndicators();
    const lang = window.appState ? window.appState.lang : "ru";
    const t = translations[lang].booking;
    const services = translations[lang].services.items;

    let html = "";

    switch (this.currentStep) {
      case 1:
        html = `
          <h3 style="font-size: 18px; margin-bottom: 8px; color: #fff;">${t.step1Title}</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
            ${translations[lang].services.subtitle}
          </p>
          <div class="selection-list">
            ${services.map(s => `
              <div class="selectable-item ${this.bookingData.serviceId === s.id ? 'selected' : ''}" 
                   onclick="window.bookingEngine.handleSelectService('${s.id}', '${s.name.replace(/'/g, "\\'")}', '${s.price}')">
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 15px;">${s.name}</div>
                  <div style="font-size: 13px; color: var(--gold-primary); margin-top: 2px;">
                    ${translations[lang].services.from} ${s.price} ${translations[lang].services.currency} • ${s.duration}
                  </div>
                </div>
                <div class="item-check">${this.bookingData.serviceId === s.id ? '✓' : ''}</div>
              </div>
            `).join("")}
          </div>
          <div class="modal-nav-btns">
            <div></div>
            <button class="btn btn-primary" onclick="window.bookingEngine.setStep(2)">
              ${t.btnNext}
            </button>
          </div>
        `;
        break;

      case 2:
        const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
        html = `
          <h3 style="font-size: 18px; margin-bottom: 8px; color: #fff;">${t.step2Title}</h3>
          <div class="form-group" style="margin-top: 18px;">
            <label class="form-label">${t.dateLabel}</label>
            <input type="date" class="form-input" id="bookingDateInput" 
                   value="${this.bookingData.date}" min="${this.defaultMinDate}"
                   onchange="window.bookingEngine.bookingData.date = this.value">
          </div>
          <div class="form-group">
            <label class="form-label">${t.timeLabel}</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px;">
              ${timeSlots.map(time => `
                <button type="button" class="btn ${this.bookingData.time === time ? 'btn-primary' : 'btn-outline'}" 
                        style="padding: 10px; font-size: 13px;"
                        onclick="window.bookingEngine.handleSelectTime('${time}')">
                  ${time}
                </button>
              `).join("")}
            </div>
          </div>
          <div class="modal-nav-btns">
            <button class="btn btn-outline" onclick="window.bookingEngine.setStep(1)">
              ${t.btnPrev}
            </button>
            <button class="btn btn-primary" onclick="window.bookingEngine.setStep(3)">
              ${t.btnNext}
            </button>
          </div>
        `;
        break;

      case 3:
        html = `
          <h3 style="font-size: 18px; margin-bottom: 8px; color: #fff;">${t.step3Title}</h3>
          <div class="form-group" style="margin-top: 18px;">
            <label class="form-label">${t.nameLabel} *</label>
            <input type="text" class="form-input" id="clientNameInput" 
                   placeholder="${t.namePlaceholder || 'Например: Мария / Anna'}" value="${this.bookingData.clientName}"
                   oninput="window.bookingEngine.bookingData.clientName = this.value">
          </div>
          <div class="form-group">
            <label class="form-label">${t.notesLabel}</label>
            <textarea class="form-textarea" rows="2" 
                      placeholder="${t.notesPlaceholder}"
                      oninput="window.bookingEngine.bookingData.notes = this.value">${this.bookingData.notes}</textarea>
          </div>
          
          <div style="margin-top: 24px;">
            <div style="font-size: 13px; font-weight: 600; color: var(--gold-light); margin-bottom: 12px; text-align: center;">
              ${t.chooseMessengerLabel}
            </div>
            <div class="messenger-choice-grid">
              <button type="button" class="btn btn-whatsapp" onclick="window.bookingEngine.submitToMessenger('whatsapp')" style="padding: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>💬</span> ${t.btnBookWhatsApp}
              </button>
              <button type="button" class="btn btn-telegram" onclick="window.bookingEngine.submitToMessenger('telegram')" style="padding: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>✈️</span> ${t.btnBookTelegram}
              </button>
            </div>
          </div>

          <div class="modal-nav-btns" style="margin-top: 20px;">
            <button class="btn btn-outline" onclick="window.bookingEngine.setStep(2)">
              ${t.btnPrev}
            </button>
            <div style="font-size: 12px; color: var(--text-muted);">
              ${t.instantConfirmationNote}
            </div>
          </div>
        `;
        break;

      case 4:
        const summaryLabels = {
          ru: { service: "Услуга:", date: "Дата и время:", guest: "Гость:", note: "Заметка:" },
          en: { service: "Service:", date: "Date & Time:", guest: "Guest:", note: "Note:" },
          vi: { service: "Dịch vụ:", date: "Ngày & Giờ:", guest: "Khách hàng:", note: "Ghi chú:" }
        }[lang] || { service: "Услуга:", date: "Дата и время:", guest: "Гость:", note: "Заметка:" };

        const isWA = (this.selectedMessenger || 'whatsapp') === 'whatsapp';
        const messengerBtnText = isWA 
          ? (t.btnOpenWhatsAppAgain || 'Открыть чат WhatsApp снова ↗')
          : (t.btnOpenTelegramAgain || 'Открыть чат Telegram снова ↗');
        const messengerBtnClass = isWA ? 'btn-whatsapp' : 'btn-telegram';

        html = `
          <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 54px; margin-bottom: 16px;">✨</div>
            <h3 style="font-size: 22px; color: #fff; margin-bottom: 12px; font-family: var(--font-serif);">
              ${t.successTitle}
            </h3>
            <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; max-width: 440px; margin: 0 auto 22px;">
              ${t.successDesc}
            </p>
            <div style="background: rgba(220, 165, 74, 0.08); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; text-align: left; margin-bottom: 22px; font-size: 13px; line-height: 1.8;">
              <div><strong>${summaryLabels.service}</strong> ${this.bookingData.serviceName} (${this.bookingData.servicePrice})</div>
              <div><strong>${summaryLabels.date}</strong> ${this.bookingData.date} в ${this.bookingData.time}</div>
              <div><strong>${summaryLabels.guest}</strong> ${this.bookingData.clientName || 'Гость'}</div>
              ${this.bookingData.notes ? `<div><strong>${summaryLabels.note}</strong> ${this.bookingData.notes}</div>` : ''}
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <a href="${this.lastMessengerUrl || '#'}" target="_blank" class="btn ${messengerBtnClass}" style="width: 100%; padding: 14px; font-weight: 700;">
                ${isWA ? '💬' : '✈️'} ${messengerBtnText}
              </a>
              <button class="btn btn-outline" onclick="window.bookingEngine.close()" style="width: 100%; padding: 12px;">
                ${t.btnBackHome}
              </button>
            </div>
          </div>
        `;
        break;
    }

    if (this.stepsContainer) {
      this.stepsContainer.innerHTML = html;
    }
  }

  handleSelectService(id, name, price) {
    const lang = window.appState ? window.appState.lang : "ru";
    this.bookingData.serviceId = id;
    this.bookingData.serviceName = name;
    this.bookingData.servicePrice = `${price} ${translations[lang].services.currency}`;
    this.setStep(2); // Seamlessly advance directly to date & time
  }

  handleSelectTime(time) {
    this.bookingData.time = time;
    this.render();
  }

  submitToMessenger(type) {
    if (!this.bookingData.clientName || !this.bookingData.clientName.trim()) {
      const lang = window.appState ? window.appState.lang : "ru";
      const nameAlerts = {
        ru: "Пожалуйста, укажите ваше имя!",
        en: "Please enter your name!",
        vi: "Vui lòng nhập họ và tên của bạn!"
      };
      alert(nameAlerts[lang] || nameAlerts.ru);
      const input = document.getElementById("clientNameInput");
      if (input) input.focus();
      return;
    }

    this.selectedMessenger = type;

    // Compose concise English message for salon
    const msg = 
      `Hello TRUMP by LUANDO Hair Studio!\n` +
      `I would like to book an appointment:\n\n` +
      `• Service: ${this.bookingData.serviceName} (${this.bookingData.servicePrice})\n` +
      `• Date & Time: ${this.bookingData.date} at ${this.bookingData.time}\n` +
      `• Client: ${this.bookingData.clientName.trim()}\n` +
      (this.bookingData.notes && this.bookingData.notes.trim() ? `• Note: ${this.bookingData.notes.trim()}\n` : '');

    const encodedMsg = encodeURIComponent(msg);

    let targetUrl = "";
    if (type === "whatsapp") {
      targetUrl = `https://wa.me/84343800996?text=${encodedMsg}`;
    } else if (type === "telegram") {
      // Connects to salon's Telegram channel or direct handle
      targetUrl = `https://t.me/luando944?text=${encodedMsg}`;
    }

    this.lastMessengerUrl = targetUrl;
    window.open(targetUrl, "_blank");

    // Advance to confirmation screen
    this.currentStep = 4;
    this.render();
  }
}

// Global instance
window.bookingEngine = new BookingEngine();
document.addEventListener("DOMContentLoaded", () => {
  window.bookingEngine.init();
});
