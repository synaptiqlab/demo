/**
 * PulseCore™ Technology • Salon Engine Shared Core Runtime
 * Product: Salon Engine CRM & Operations
 * Version: 2.5.0 (Shared CDN Core)
 * Ecosystem: VietSites & SYNAPTIQ Lab
 * 
 * Features:
 * - Thin Shell auto-mount into #salonAppRoot
 * - Multi-tenant isolation by tenantId (Cloudflare D1 + LocalStorage)
 * - Timeline 15-min slots, Collision Guard, 98px responsive master column
 * - Dual-Bot integration (@synaptiq_crm_bot, @SYNAPTIQ_Lab_bot)
 * - Sales Sandbox Guard (isDemo)
 */

(function() {
  const config = window.SALON_CONFIG || {
    slug: 'noir-atelier',
    name: 'NOIR Atelier',
    fullName: 'NOIR Hair Atelier & SPA',
    currency: '₫',
    isDemo: true
  };

  const SALON_HTML_TEMPLATE = `<!-- PIN Lock Screen -->
  <div id="pinLockScreen" style="position: fixed; inset: 0; background: var(--bg-deep); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px;">
    <div id="pinLockCard" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 40px; max-width: 400px; width: 100%; text-align: center; box-shadow: var(--shadow-lg);">
      <div style="margin-bottom: 22px;">
        <div style="font-size: 26px; font-weight: 900; letter-spacing: -0.6px; color: var(--text-main); line-height: 1.1;">${config.name || 'NOIR'} Atelier</div>
        <div style="font-size: 11px; font-weight: 700; color: var(--accent-primary); letter-spacing: 1.2px; text-transform: uppercase; margin-top: 5px;">CRM &amp; Business Management</div>
      </div>
      <h3 style="font-size: 17px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">Вход в систему</h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">Введите PIN-код администратора (демо: 1234)</p>
      
      <form id="pinAuthForm">
        <div class="form-group" style="margin-bottom: 16px;">
          <input type="password" id="pinInput" class="form-input" placeholder="••••" maxlength="8" inputmode="numeric" pattern="[0-9]*" autocomplete="current-password" style="text-align: center; font-size: 24px; letter-spacing: 8px; font-family: var(--font-mono);" autofocus required>
        </div>
        <div id="pinErrorMsg" style="display: none; color: var(--color-danger); font-size: 13px; margin-bottom: 16px; font-weight: 600;">
          Неверный PIN-код. Проверьте правильность ввода
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px 20px; font-weight: 700; font-size: 14px;">
          Войти в систему →
        </button>
        <div style="margin-top: 18px;">
          <a href="javascript:void(0)" onclick="openPinRecoveryModal()" style="font-size: 12px; color: var(--accent-gold); text-decoration: none; opacity: 0.85; transition: opacity 0.2s ease;">
            Забыли PIN-код? Восстановление доступа →
          </a>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Восстановление забытого PIN-кода через Telegram -->
  <div class="modal-overlay" id="pinRecoveryModal" style="display: none; z-index: 10000;">
    <div class="modal-card" style="max-width: 440px; padding: 32px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
        <h3 style="font-size: 17px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; margin: 0;">
          <span>🔑</span>
          <span>Восстановление доступа к CRM</span>
        </h3>
        <button type="button" class="btn btn-secondary" onclick="closePinRecoveryModal()" style="padding: 4px 10px; font-size: 13px; border-radius: var(--radius-sm);">✕</button>
      </div>

      <div id="recoveryStep_request">
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 18px;">
          Забыли PIN-код? Мы отправим запрос на подтверждение личности владельца в вашу рабочую Telegram-группу заведения.
        </p>

        <div style="background: rgba(201, 162, 77, 0.08); border: 1px solid rgba(201, 162, 77, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 20px; font-size: 12px; color: var(--text-sub);">
          📲 Бот пришлёт в группу заведения кнопку <b>«Подтвердить, что вы владелец»</b>. После подтверждения новый PIN-код будет отправлен строго в закрытый Telegram-чат для ручного ввода.
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" onclick="closePinRecoveryModal()" style="padding: 8px 16px; font-size: 12px;">
            Отмена
          </button>
          <button type="button" id="sendTgRecoveryBtn" class="btn btn-primary" onclick="requestTelegramPinRecovery()" style="padding: 8px 18px; font-size: 12px; font-weight: 700;">
            Отправить запрос в Telegram →
          </button>
        </div>
      </div>

      <div id="recoveryStep_waiting" style="display: none; text-align: center; padding: 10px 0;">
        <div style="font-size: 36px; margin-bottom: 12px; animation: pulse 1.5s infinite;">📲</div>
        <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Запрос отправлен в Telegram!</h4>
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
          Откройте вашу рабочую Telegram-группу и нажмите кнопку <b>«✅ Да, я владелец»</b>.
        </p>
        <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: var(--accent-gold); background: rgba(201, 162, 77, 0.1); padding: 6px 14px; border-radius: 20px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--accent-gold); animation: blink 1s infinite;"></span>
          <span>Ожидаем подтверждения владельца...</span>
        </div>
      </div>

      <div id="recoveryStep_success" style="display: none; text-align: center; padding: 10px 0;">
        <div style="font-size: 38px; color: #10B981; margin-bottom: 12px;">✅</div>
        <h4 style="font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">Доступ подтверждён в Telegram!</h4>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
          Новый PIN-код отправлен в вашу рабочую Telegram-группу заведения.<br>
          Скопируйте его из Telegram и введите вручную в поле входа.
        </p>
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 20px; font-size: 12px; color: #34D399; text-align: left; line-height: 1.4;">
          🔒 <b>Безопасность:</b> В целях защиты данных код не отображается на сайте и не подставляется автоматически.
        </div>
        <button type="button" class="btn btn-primary" onclick="closePinRecoveryAndFocus()" style="width: 100%; padding: 11px; font-size: 13px; font-weight: 700;">
          Понятно, ввести PIN-код →
        </button>
      </div>

    </div>
  </div>


  <!-- Admin Main Layout -->
  <div class="admin-layout" id="adminMainLayout" style="display: none;">
    <!-- Mobile Top Header (Visible only on < 768px) -->
    <header class="admin-mobile-header">
      <div class="mobile-header-brand">
        <div>
          <div class="mobile-header-title" style="font-weight: 800; letter-spacing: -0.3px;">NOIR Atelier</div>
          <div class="mobile-header-sub" id="mobileActiveTabLabel">Расписание на день</div>
        </div>
      </div>
      <div class="mobile-header-actions">
        <button type="button" class="btn btn-primary btn-mobile-quick-book" onclick="openQuickBookingFor('any', '12:00')" title="Новая запись">
          <span>+</span>
        </button>
        <button type="button" class="btn-mobile-burger" id="adminBurgerBtn" onclick="toggleMobileAdminDrawer()" aria-label="Открыть меню">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <!-- Mobile Drawer Overlay & Menu -->
    <div class="admin-drawer-overlay" id="adminDrawerOverlay" onclick="closeMobileAdminDrawer()"></div>
    <div class="admin-mobile-drawer" id="adminMobileDrawer">
      <div class="drawer-header">
        <div>
          <div style="font-size: 16px; font-weight: 900; letter-spacing: -0.3px; color: var(--text-main);">NOIR Atelier</div>
          <div style="font-size: 11px; font-weight: 700; color: var(--accent-primary); letter-spacing: 0.8px; text-transform: uppercase; margin-top: 2px;">CRM Panel</div>
        </div>
        <button type="button" class="drawer-close-btn" onclick="closeMobileAdminDrawer()">✕</button>
      </div>

      <nav class="drawer-nav">
        <div class="drawer-nav-item active" data-tab="timeline" onclick="handleDrawerNavClick('timeline')">
          <span>📅</span>
          <span>Расписание на день</span>
        </div>
        <div class="drawer-nav-item" data-tab="appointments" onclick="handleDrawerNavClick('appointments')">
          <span>📋</span>
          <span>Журнал записей</span>
        </div>
        <div class="drawer-nav-item" data-tab="specialists" onclick="handleDrawerNavClick('specialists')">
          <span>👥</span>
          <span>Мастера и смены</span>
        </div>
        <div class="drawer-nav-item" data-tab="clients" onclick="handleDrawerNavClick('clients')">
          <span>👤</span>
          <span>База клиентов</span>
        </div>
        <div class="drawer-nav-item" data-tab="services" onclick="handleDrawerNavClick('services')">
          <span>🏷️</span>
          <span>Прейскурант и услуги</span>
        </div>
        <div class="drawer-nav-item" data-tab="payroll" onclick="handleDrawerNavClick('payroll')">
          <span>💰</span>
          <span>Расчёт зарплат</span>
        </div>
      </nav>

      <div class="drawer-footer">
        <!-- Theme Switcher (Mobile Drawer) - Directly above PIN change button -->
        <div class="crm-theme-switcher" style="margin-bottom: 12px;">
          <button type="button" class="crm-theme-btn theme-btn-dark" onclick="setTheme('dark')" id="themeBtnDarkMobile" title="Тёмная тема">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <span>Тёмная</span>
          </button>
          <button type="button" class="crm-theme-btn theme-btn-light" onclick="setTheme('light')" id="themeBtnLightMobile" title="Светлая тема">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <span>Светлая</span>
          </button>
        </div>
        <button type="button" class="btn btn-secondary" disabled style="width: 100%; font-size: 12px; margin-bottom: 8px; opacity: 0.45; cursor: not-allowed; pointer-events: none; border-color: var(--border-subtle);" title="Смена PIN заблокирована в демо-версии">
          🔒 Сменить PIN-код (Демо)
        </button>
        <a href="index.html" class="btn btn-secondary" style="width: 100%; font-size: 12px; text-align: center;">
          ← На витрину сайта
        </a>
      </div>
    </div>

    <!-- Sidebar (Desktop) -->
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header">
        <div class="crm-sidebar-brand">
          <span class="crm-sidebar-name">NOIR Atelier</span>
          <span class="crm-sidebar-sub">CRM &amp; Client Operations</span>
        </div>
        <div id="timelineCurrentDateDisplay" style="font-size: 11px; font-weight: 600; color: var(--accent-primary); margin-top: 6px; letter-spacing: 0.2px; text-transform: capitalize;">Сегодня</div>
        <div style="height: 1px; background: var(--border-subtle); margin: 14px 0 14px 0;"></div>
        <button type="button" class="btn btn-primary" onclick="openQuickBookingFor('any', '12:00')" style="width: 100%; padding: 10px 14px; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: var(--radius-sm); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.28);">
          <span style="font-size: 16px; font-weight: 800; line-height: 1;">+</span>
          <span>Новая запись</span>
        </button>
      </div>

      <nav class="admin-sidebar-nav">
        <div class="admin-nav-item active" data-tab="timeline">
          <span>📅</span>
          <span>Расписание на день</span>
        </div>
        <div class="admin-nav-item" data-tab="appointments">
          <span>📋</span>
          <span>Журнал записей</span>
        </div>
        <div class="admin-nav-item" data-tab="specialists">
          <span>👥</span>
          <span>Мастера и смены</span>
        </div>
        <div class="admin-nav-item" data-tab="clients">
          <span>👤</span>
          <span>База клиентов</span>
        </div>
        <div class="admin-nav-item" data-tab="services">
          <span>🏷️</span>
          <span>Прейскурант и услуги</span>
        </div>
        <div class="admin-nav-item" data-tab="payroll">
          <span>💰</span>
          <span>Расчёт зарплат</span>
        </div>
      </nav>

      <div style="padding: 16px 14px; border-top: 1px solid var(--border-subtle); margin-top: auto;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
          <button type="button" class="btn btn-secondary" id="timelineRefreshBtn" style="padding: 7px 8px; font-size: 11px; display: flex; align-items: center; justify-content: center; gap: 5px; border-radius: var(--radius-sm);" title="Обновить данные расписания">
            <span>🔄</span>
            <span>Обновить</span>
          </button>
          <button type="button" class="btn btn-secondary" disabled style="padding: 7px 8px; font-size: 11px; display: flex; align-items: center; justify-content: center; gap: 5px; border-radius: var(--radius-sm); opacity: 0.45; cursor: not-allowed; pointer-events: none; border-color: var(--border-subtle);" title="Смена PIN заблокирована в демо-версии">
            <span>🔒</span>
            <span>Сменить PIN</span>
          </button>
        </div>
        <!-- Theme Switcher (Desktop Sidebar) - Directly above website button -->
        <div class="crm-theme-switcher" style="margin-bottom: 12px;">
          <button type="button" class="crm-theme-btn theme-btn-dark" onclick="setTheme('dark')" id="themeBtnDarkDesktop" title="Тёмная тема">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <span>Тёмная</span>
          </button>
          <button type="button" class="crm-theme-btn theme-btn-light" onclick="setTheme('light')" id="themeBtnLightDesktop" title="Светлая тема">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <span>Светлая</span>
          </button>
        </div>
        <a href="index.html" class="btn btn-secondary" style="width: 100%; font-size: 13px; text-align: center; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; gap: 6px;">
          <span>←</span>
          <span>На витрину сайта</span>
          <span style="font-size: 11px; opacity: 0.6;">↗</span>
        </a>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="admin-main">


      <!-- Content Views -->
      <div class="admin-content">
        <!-- Top KPIs (4 Blocks) -->
        <div class="kpi-grid">
          <!-- 1. Новые заявки -->
          <div class="kpi-card">
            <span class="kpi-title">Новые заявки</span>
            <span class="kpi-value" id="kpiNewRequestsCount" style="color: var(--color-warning);">0</span>
            <span class="kpi-sub">Требуют подтверждения</span>
          </div>

          <!-- 2. Записей на сегодня -->
          <div class="kpi-card">
            <span class="kpi-title">Записей на сегодня</span>
            <span class="kpi-value" id="kpiTodayCount">0</span>
            <span class="kpi-sub">Подтверждённые визиты</span>
          </div>

          <!-- 3. Выручка сегодня -->
          <div class="kpi-card">
            <span class="kpi-title">Выручка сегодня</span>
            <span class="kpi-value" id="kpiTodayRevenue" style="color: var(--accent-gold);">0 ₫</span>
            <span class="kpi-sub">Сумма подтверждённых броней</span>
          </div>

          <!-- 4. В кассе (Оплачено) -->
          <div class="kpi-card">
            <span class="kpi-title">В кассе (Оплачено)</span>
            <span class="kpi-value" id="kpiCashRevenue" style="color: var(--color-success);">0 ₫</span>
            <span class="kpi-sub">Выполненные визиты</span>
          </div>
        </div>

        <!-- TAB 1: ТАЙМЛАЙН / СЕТКА РАСПИСАНИЯ -->
        <div class="admin-tab-pane" id="tabPane_timeline">
          <!-- Date Navigator Bar -->
          <div class="timeline-date-nav-bar">
            <div class="timeline-date-btns">
              <button type="button" class="btn btn-secondary btn-date-arrow" id="timelinePrevDayBtn">
                ‹
              </button>
              <button type="button" class="btn btn-secondary btn-date-today" id="timelineTodayBtn">
                Сегодня
              </button>
              <button type="button" class="btn btn-secondary btn-date-arrow" id="timelineNextDayBtn">
                ›
              </button>
            </div>

            <div class="timeline-date-picker-wrap">
              <label class="timeline-picker-label">Выбрать дату:</label>
              <input type="date" id="timelineDateInput" class="form-input timeline-picker-input">
            </div>
          </div>

          <!-- Timeline Grid Matrix -->
          <div class="timeline-table-wrapper">
            <table class="timeline-table">
              <thead>
                <tr>
                  <th class="timeline-master-col" style="text-align: left; position: sticky; left: 0; background: var(--bg-surface); z-index: 3;">Мастер</th>
                  <th colspan="4" class="timeline-th-hour">10:00</th>
                  <th colspan="4" class="timeline-th-hour">11:00</th>
                  <th colspan="4" class="timeline-th-hour">12:00</th>
                  <th colspan="4" class="timeline-th-hour">13:00</th>
                  <th colspan="4" class="timeline-th-hour">14:00</th>
                  <th colspan="4" class="timeline-th-hour">15:00</th>
                  <th colspan="4" class="timeline-th-hour">16:00</th>
                  <th colspan="4" class="timeline-th-hour">17:00</th>
                  <th colspan="4" class="timeline-th-hour">18:00</th>
                  <th colspan="4" class="timeline-th-hour">19:00</th>
                  <th colspan="4" class="timeline-th-hour">20:00</th>
                </tr>
              </thead>
              <tbody id="timelineTableBody">
                <!-- Rendered dynamically via admin.js -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- TAB 2: МАСТЕРА И СМЕНЫ -->
        <div class="admin-tab-pane" id="tabPane_specialists" style="display: none;">
          <div class="schedule-control-bar">
            <div class="schedule-week-btns">
              <button type="button" class="btn btn-secondary" id="schedulePrevWeekBtn">
                ‹ Пред. нед.
              </button>
              <button type="button" class="btn btn-secondary" id="scheduleCurrentWeekBtn">
                Текущая
              </button>
              <button type="button" class="btn btn-secondary" id="scheduleNextWeekBtn">
                След. нед. ›
              </button>
            </div>
            <div class="schedule-actions-wrap" style="display: flex; align-items: center; gap: 14px;">
              <div id="scheduleCurrentWeekLabel" class="schedule-week-label">
                Неделя
              </div>
              <button type="button" class="btn btn-primary" onclick="openCreateSpecialistModal()" style="padding: 7px 16px; font-size: 12px; font-weight: 700; white-space: nowrap;">
                + Добавить нового мастера
              </button>
            </div>
          </div>

          <div class="timeline-table-wrapper">
            <table class="timeline-table">
              <thead>
                <tr id="scheduleDaysHeader">
                  <!-- Rendered dynamically via admin.js -->
                </tr>
              </thead>
              <tbody id="specialistsScheduleTableBody">
                <!-- Rendered dynamically via admin.js -->
              </tbody>
            </table>
          </div>

          <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
            <button type="button" class="btn btn-primary" onclick="openCreateSpecialistModal()" style="padding: 8px 18px; font-size: 13px;">
              + Добавить нового мастера
            </button>
          </div>
        </div>

        <!-- TAB 3: ЖУРНАЛ ЗАПИСЕЙ -->
        <div class="admin-tab-pane" id="tabPane_appointments" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; background: var(--bg-card); padding: 14px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
            <div style="flex-grow: 1; max-width: 380px;">
              <input type="text" id="journalSearchInput" class="form-input" placeholder="🔍 Поиск по имени, номеру брони, телефону..." style="padding: 8px 14px; font-size: 13px;">
            </div>
            <div>
              <select id="journalStatusFilter" class="form-select" style="padding: 8px 14px; font-size: 13px;">
                <option value="all">Все статусы</option>
                <option value="new">Новые</option>
                <option value="confirmed">Подтверждённые</option>
                <option value="completed">Выполненные</option>
                <option value="cancelled">Отменённые</option>
              </select>
            </div>
          </div>

          <!-- Desktop Table (Hidden on mobile) -->
          <div class="journal-table-wrapper desktop-only-table">
            <table class="journal-table">
              <thead>
                <tr>
                  <th style="width: 100px;">Бронь #</th>
                  <th>Клиент</th>
                  <th>Услуга / Пакет</th>
                  <th>Мастер</th>
                  <th>Дата и время</th>
                  <th>Статус</th>
                  <th style="text-align: right;">Действия</th>
                </tr>
              </thead>
              <tbody id="journalTableBody">
                <!-- Rendered dynamically via admin.js -->
              </tbody>
            </table>
          </div>

          <!-- Mobile Accordion Cards (Visible only on mobile) -->
          <div class="journal-mobile-cards" id="journalMobileCardsContainer">
            <!-- Rendered dynamically via admin.js -->
          </div>
        </div>

        <!-- TAB 4: ПРЕЙСКУРАНТ И УСЛУГИ -->
        <div class="admin-tab-pane" id="tabPane_services" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 14px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main);">Прейскурант и услуги ателье NOIR</h3>
              <p style="font-size: 12px; color: var(--text-dim); margin-top: 2px;">Управление категориями, ценами, длительностью и протоколами процедур</p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary" onclick="toggleAllCategoryAccordions()" id="toggleAllCategoriesBtn" style="padding: 7px 12px; font-size: 12px; font-weight: 700;">
                📂 Развернуть все
              </button>
              <button type="button" class="btn btn-secondary" onclick="openAddCategoryModal()" style="padding: 7px 12px; font-size: 12px; font-weight: 700; color: var(--accent-primary);">
                ✨ Добавить категорию
              </button>
              <button type="button" class="btn btn-primary" onclick="openCreateServiceModal()" style="padding: 7px 16px; font-size: 12px; font-weight: 700;">
                + Добавить услугу
              </button>
            </div>
          </div>
          <div id="adminServicesContainer">
            <!-- Rendered dynamically via admin.js -->
          </div>
        </div>

        <!-- TAB 5: БАЗА КЛИЕНТОВ -->
        <div class="admin-tab-pane" id="tabPane_clients" style="display: none;">
          <div class="clients-tab-header-box" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 14px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px;">
            <div>
              <h3 style="font-size: 15px; font-weight: 800; color: var(--text-main);">База клиентов NOIR Hair Atelier</h3>
              <p style="font-size: 12px; color: var(--text-dim); margin-top: 2px;" id="clientsStatsSub">Карточки гостей, история процедур, статистика визитов и заметки мастеров</p>
            </div>
            <button type="button" class="btn btn-primary clients-add-btn" onclick="openCreateClientModal()" style="padding: 8px 16px; font-size: 13px; font-weight: 700;">
              + Новый гость
            </button>
          </div>

          <!-- Поиск и фильтры клиентов -->
          <div class="clients-filters-bar" style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
            <div class="filter-search-box" style="flex-grow: 1; min-width: 240px;">
              <input type="text" id="clientSearchInput" class="form-input" placeholder="🔍 Поиск по имени или номеру телефона..." style="padding: 10px 16px; font-size: 13px;">
            </div>
            <div class="filter-cat-box" style="width: 210px;">
              <select id="clientCategoryFilter" class="form-select" style="padding: 10px 14px; font-size: 13px;">
                <option value="all">Все категории гостей</option>
                <option value="vip">⭐ VIP гости</option>
                <option value="regular">💎 Постоянные гости</option>
                <option value="new">✨ Новые гости</option>
              </select>
            </div>
            <div class="filter-sort-box" style="width: 230px;">
              <select id="clientSortSelect" class="form-select" style="padding: 10px 14px; font-size: 13px;">
                <option value="spent_desc">Сортировка: По сумме чеков (LTV)</option>
                <option value="visits_desc">Сортировка: По числу визитов</option>
                <option value="recent">Сортировка: По дате визита</option>
                <option value="name_asc">Сортировка: По имени (А–Я)</option>
              </select>
            </div>
          </div>

          <!-- Список клиентов -->
          <div id="adminClientsContainer" style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Rendered dynamically via admin.js -->
          </div>
        </div>

        <!-- TAB 6: ЗАРПЛАТНАЯ ВЕДОМОСТЬ МАСТЕРОВ -->
        <div class="admin-tab-pane" id="tabPane_payroll" style="display: none;">
          <!-- Верхний переключатель: Расчёт начислений vs Журнал выплат -->
          <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px; flex-wrap: wrap; align-items: center;">
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-primary" id="payrollSubTab_calc" onclick="switchPayrollSubView('calc')" style="padding: 8px 18px; font-size: 13px; font-weight: 700;">
                💰 Расчёт начислений
              </button>
              <button type="button" class="btn btn-secondary" id="payrollSubTab_ledger" onclick="switchPayrollSubView('ledger')" style="padding: 8px 18px; font-size: 13px; font-weight: 700;">
                📜 Журнал кассовых выплат (<span id="payoutOrdersBadgeCount">0</span>)
              </button>
            </div>
            <div style="margin-left: auto; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary" onclick="openPayrollHelpModal()" style="padding: 8px 14px; font-size: 12px; font-weight: 700; border-color: rgba(255, 255, 255, 0.18); color: #FFFFFF; display: flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.05);" title="Открыть руководство по расчёту и выплате зарплат">
                <span>📖 Инструкция по расчёту</span>
              </button>
              <button type="button" class="btn btn-secondary" onclick="printWeeklyPayrollSummary()" style="padding: 8px 16px; font-size: 12px; font-weight: 700; border-color: rgba(212, 175, 55, 0.4); color: #E5C378; display: flex; align-items: center; gap: 6px;">
                <span>🖨️ Распечатать сводную ведомость на салон</span>
              </button>
            </div>
          </div>

          <!-- ВИД 1: КАЛЬКУЛЯТОР НАЧИСЛЕНИЙ ЗАРПЛАТ -->
          <div id="payrollSubView_calc">
            <!-- Шапка ведомости с настройками выплат -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 16px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); letter-spacing: 0.5px;">💰 Ведомость расчёта зарплат мастеров</h3>
                  <span style="background: rgba(212, 175, 55, 0.15); color: var(--accent-gold); border: 1px solid rgba(212, 175, 55, 0.3); padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;">Авторасчёт</span>
                </div>
                <p style="font-size: 12px; color: var(--text-dim); margin-top: 4px;" id="payrollSubHeader">
                  Начисления по выполненным услугам, процентная ставка каждого мастера и маржа салона
                </p>
              </div>

              <!-- Настройка графика выплат салона -->
              <div style="display: flex; align-items: center; gap: 12px; background: rgba(0, 0, 0, 0.35); padding: 8px 14px; border-radius: var(--radius-sm); border: 1px solid rgba(255, 255, 255, 0.08);">
                <label for="salonPayrollPeriodSelect" style="font-size: 12px; color: var(--text-muted); white-space: nowrap;">
                  Регламент выплат салона:
                </label>
                <select id="salonPayrollPeriodSelect" class="form-select" onchange="changeSalonDefaultPayrollPeriod(this.value)" style="padding: 6px 12px; font-size: 12px; border-color: rgba(212, 175, 55, 0.4); color: var(--accent-gold); font-weight: 700; width: auto;">
                  <option value="weekly">Раз в неделю (понедельник)</option>
                  <option value="daily">Каждый день (в конце смены)</option>
                </select>
              </div>
            </div>

            <!-- Панель переключения периодов и навигация -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); padding: 12px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary payroll-period-btn" id="payrollPeriodBtn_today" onclick="setPayrollPeriod('today')" style="padding: 7px 12px; font-size: 12px;">
                  📅 Сегодня
                </button>
                <button type="button" class="btn btn-primary payroll-period-btn" id="payrollPeriodBtn_weekly" onclick="setPayrollPeriod('weekly')" style="padding: 7px 12px; font-size: 12px;">
                  🗓️ Текущая неделя
                </button>
                <button type="button" class="btn btn-secondary payroll-period-btn" id="payrollPeriodBtn_lastweek" onclick="setPayrollPeriod('lastweek')" style="padding: 7px 12px; font-size: 12px;">
                  ⏮️ Прошлая неделя
                </button>
                <button type="button" class="btn btn-secondary payroll-period-btn" id="payrollPeriodBtn_month" onclick="setPayrollPeriod('month')" style="padding: 7px 12px; font-size: 12px;">
                  📆 Этот месяц
                </button>
              </div>

              <!-- Навигация ‹ период › -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <button type="button" class="btn btn-secondary" onclick="navigatePayrollPeriod(-1)" style="padding: 6px 10px; font-size: 12px;" title="Предыдущий период">
                  ‹
                </button>
                <div id="payrollCurrentPeriodLabel" style="font-weight: 700; color: var(--text-main); font-size: 13px; min-width: 170px; text-align: center;">
                  Загрузка...
                </div>
                <button type="button" class="btn btn-secondary" onclick="navigatePayrollPeriod(1)" style="padding: 6px 10px; font-size: 12px;" title="Следующий период">
                  ›
                </button>
              </div>

              <!-- Опция учета подтвержденных записей -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 12px; color: var(--text-sub); user-select: none;">
                  <input type="checkbox" id="payrollIncludeConfirmedCheckbox" onchange="togglePayrollIncludeConfirmed(this.checked)" style="accent-color: var(--accent-gold); cursor: pointer;">
                  <span>Включать подтверждённые записи (план)</span>
                </label>
              </div>
            </div>

            <!-- Сводные KPI за выбранный период -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 22px;">
              <div class="kpi-card" style="padding: 16px 18px;">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-dim);">💳 Выручка за период</div>
                <div class="kpi-value" id="payrollKpiTotalRevenue" style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-top: 6px;">0 ₫</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">Сумма оказанных услуг</div>
              </div>
              <div class="kpi-card" style="padding: 16px 18px; border-color: rgba(212, 175, 55, 0.35); background: linear-gradient(145deg, rgba(212, 175, 55, 0.08) 0%, rgba(18, 18, 18, 0.8) 100%);">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent-gold);">💰 Фонд оплаты мастеров</div>
                <div class="kpi-value" id="payrollKpiTotalPayroll" style="font-size: 24px; font-weight: 800; color: var(--accent-gold); margin-top: 6px;">0 ₫</div>
                <div style="font-size: 11px; color: var(--accent-gold-light); margin-top: 4px;">Итого к выплате специалистам</div>
              </div>
              <div class="kpi-card" style="padding: 16px 18px;">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-dim);">🏛️ Маржа салона (доход)</div>
                <div class="kpi-value" id="payrollKpiSalonMargin" style="font-size: 24px; font-weight: 800; color: #10B981; margin-top: 6px;">0 ₫</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">Остаётся после выплаты зарплат</div>
              </div>
              <div class="kpi-card" style="padding: 16px 18px;">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-dim);">✂️ Оказано услуг</div>
                <div class="kpi-value" id="payrollKpiServicesCount" style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-top: 6px;">0</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">Процедур в ведомости</div>
              </div>
            </div>

            <!-- Список мастеров и детализация начислений -->
            <div id="payrollTableContainer" style="display: flex; flex-direction: column; gap: 14px;">
              <!-- Rendered dynamically via admin.js -->
            </div>
          </div>

          <!-- ВИД 2: ЖУРНАЛ КАССОВЫХ ВЫПЛАТ (АРХИВ И ИСТОРИЯ) -->
          <div id="payrollSubView_ledger" style="display: none;">
            <!-- Фильтры журнала -->
            <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; background: var(--bg-card); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); align-items: center;">
              <div style="flex-grow: 1; min-width: 220px;">
                <input type="text" id="ledgerSearchInput" oninput="renderPayoutLedger()" class="form-input" placeholder="🔍 Поиск по номеру ордера или имени мастера..." style="padding: 9px 14px; font-size: 13px;">
              </div>
              <div style="width: 140px;">
                <select id="ledgerYearSelect" onchange="renderPayoutLedger()" class="form-select" style="padding: 9px 12px; font-size: 13px;">
                  <option value="all">Все годы</option>
                  <option value="2026" selected>2026 год</option>
                  <option value="2025">2025 год</option>
                </select>
              </div>
              <div style="width: 170px;">
                <select id="ledgerMonthSelect" onchange="renderPayoutLedger()" class="form-select" style="padding: 9px 12px; font-size: 13px;">
                  <option value="all">Все месяцы</option>
                  <option value="0">Январь</option>
                  <option value="1">Февраль</option>
                  <option value="2">Март</option>
                  <option value="3">Апрель</option>
                  <option value="4">Май</option>
                  <option value="5">Июнь</option>
                  <option value="6">Июль</option>
                  <option value="7">Август</option>
                  <option value="8">Сентябрь</option>
                  <option value="9">Октябрь</option>
                  <option value="10">Ноябрь</option>
                  <option value="11">Декабрь</option>
                </select>
              </div>
              <div style="width: 210px;">
                <select id="ledgerSpecialistSelect" onchange="renderPayoutLedger()" class="form-select" style="padding: 9px 12px; font-size: 13px;">
                  <!-- Rendered dynamically -->
                </select>
              </div>
            </div>

            <!-- Сводные KPI реестра выплат -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-bottom: 22px;">
              <div class="kpi-card" style="padding: 14px 18px;">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; color: var(--text-dim);">Проведено выплат</div>
                <div class="kpi-value" id="ledgerKpiCount" style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-top: 4px;">0</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Кассовых ордеров в архиве</div>
              </div>
              <div class="kpi-card" style="padding: 14px 18px; border-color: rgba(212, 175, 55, 0.35); background: linear-gradient(145deg, rgba(212, 175, 55, 0.08) 0%, rgba(18, 18, 18, 0.8) 100%);">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; color: var(--accent-gold);">Выдано на руки мастерам</div>
                <div class="kpi-value" id="ledgerKpiPaidTotal" style="font-size: 24px; font-weight: 800; color: var(--accent-gold); margin-top: 4px;">0 ₫</div>
                <div style="font-size: 11px; color: var(--accent-gold-light); margin-top: 2px;">Сумма закрытых расходных ордеров</div>
              </div>
              <div class="kpi-card" style="padding: 14px 18px;">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; color: var(--text-dim);">Валовая выручка по ордерам</div>
                <div class="kpi-value" id="ledgerKpiGrossTotal" style="font-size: 24px; font-weight: 800; color: var(--text-main); margin-top: 4px;">0 ₫</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Сумма оказанных услуг мастерами</div>
              </div>
              <div class="kpi-card" style="padding: 14px 18px;">
                <div class="kpi-label" style="font-size: 11px; text-transform: uppercase; color: var(--text-dim);">Доход салона</div>
                <div class="kpi-value" id="ledgerKpiMarginTotal" style="font-size: 24px; font-weight: 800; color: #10B981; margin-top: 4px;">0 ₫</div>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">Удержанная доля ателье</div>
              </div>
            </div>

            <!-- Таблица кассовых ордеров выплат -->
            <div id="payoutLedgerTableContainer">
              <!-- Rendered dynamically via admin.js -->
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- MODAL: РЕДАКТИРОВАНИЕ ЗАПИСИ (СМЕНА МАСТЕРА, ВРЕМЕНИ, ДОБАВЛЕНИЕ УСЛУГ) -->
  <div class="modal-overlay" id="adminEditAppointmentModal">
    <div class="modal-card client-modal-card" style="max-width: 680px;">
      <div class="modal-header client-modal-header">
        <div class="modal-title-box">
          <h3 id="editAppModalTitle" style="font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0;">Изменить запись</h3>
          <p id="editAppSubtitle" style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">Перенос времени, смена мастера или добавление услуг</p>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>

      <form id="adminEditAppForm" style="display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: hidden;">
        <input type="hidden" id="editAppId">
        <div class="modal-body client-modal-body" style="flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px 24px;">

          <!-- БЛОК 1: Клиент -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>👤</span>
              <span>Контактные данные клиента</span>
            </div>
            <div class="edit-app-grid-client" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div>
                <label class="form-label" style="font-size: 11px;">Имя клиента *</label>
                <input type="text" id="editAppClientName" class="form-input" required style="padding: 7px 11px; font-size: 13px;">
              </div>
              <div>
                <label class="form-label" style="font-size: 11px;">Телефон / Telegram *</label>
                <input type="text" id="editAppClientPhone" class="form-input" required style="padding: 7px 11px; font-size: 13px;">
              </div>
            </div>
          </div>

          <!-- БЛОК 2: Мастер, дата, время и статус -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>📅</span>
              <span>Мастер, дата и время визита</span>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 11px;">Назначенный специалист *</label>
              <select id="editAppSpecialist" class="form-select" style="padding: 7px 11px; font-size: 13px;">
                <!-- Rendered dynamically -->
              </select>
            </div>

            <div class="edit-app-grid-schedule" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div>
                <label class="form-label" style="font-size: 11px;">Дата визита *</label>
                <input type="date" id="editAppDate" class="form-input" required style="padding: 7px 11px; font-size: 13px;">
              </div>
              <div>
                <label class="form-label" style="font-size: 11px;">Время начала (15 мин) *</label>
                <input type="time" id="editAppTime" class="form-input" step="900" required onblur="roundTimeInput(this)" onchange="roundTimeInput(this)" style="padding: 6px 10px; font-size: 13px;">
                <div style="display: flex; gap: 3px; margin-top: 5px;">
                  <button type="button" class="btn btn-secondary" onclick="setEditTimeMinute(0)" style="padding: 2px 5px; font-size: 10px; flex: 1;">:00</button>
                  <button type="button" class="btn btn-secondary" onclick="setEditTimeMinute(15)" style="padding: 2px 5px; font-size: 10px; flex: 1;">:15</button>
                  <button type="button" class="btn btn-secondary" onclick="setEditTimeMinute(30)" style="padding: 2px 5px; font-size: 10px; flex: 1;">:30</button>
                  <button type="button" class="btn btn-secondary" onclick="setEditTimeMinute(45)" style="padding: 2px 5px; font-size: 10px; flex: 1;">:45</button>
                </div>
              </div>
              <div>
                <label class="form-label" style="font-size: 11px;">Статус записи</label>
                <select id="editAppStatus" class="form-select" style="padding: 7px 11px; font-size: 13px;">
                  <option value="new">Новая</option>
                  <option value="confirmed">Подтверждена</option>
                  <option value="completed">Выполнена</option>
                  <option value="cancelled">Отменена</option>
                </select>
              </div>
            </div>
          </div>

          <!-- БЛОК 3: Услуги в чеке -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
              <div class="client-block-title" style="margin-bottom: 0;">
                <span>✂️</span>
                <span>Услуги в чеке</span>
              </div>
              <div style="font-size: 12px; color: var(--text-dim);">
                Итого: <strong style="color: var(--color-success); font-size: 14px;" id="editAppTotalPriceDisplay">0 ₫</strong> (<span id="editAppTotalDurationDisplay">60 мин</span>)
              </div>
            </div>

            <div id="editAppServicesList" style="margin-bottom: 12px;">
              <!-- Rendered dynamically via admin.js -->
            </div>

            <div class="edit-app-add-service-row" style="display: flex; gap: 8px;">
              <select id="editAppAddServiceSelect" class="form-select" style="font-size: 12px; flex-grow: 1; padding: 7px 10px;">
                <!-- Rendered dynamically -->
              </select>
              <button type="button" class="btn btn-secondary" onclick="addServiceToEditingApp()" style="padding: 7px 14px; font-size: 12px; white-space: nowrap; font-weight: 700;">
                + Добавить
              </button>
            </div>
          </div>

          <!-- БЛОК 4: Пожелания и комментарий -->
          <div class="client-modal-block">
            <div class="client-block-title">
              <span>💬</span>
              <span>Комментарий мастера / пожелания</span>
            </div>
            <textarea id="editAppComment" class="form-textarea" rows="2" placeholder="Заметки о стрижке, формуле тонирования или аллергии..." style="font-size: 12px; resize: vertical;"></textarea>
          </div>

          <div id="editAppConflictAlert" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: var(--radius-sm); padding: 10px 14px; margin-top: 14px; font-size: 12px; color: #EF4444; line-height: 1.4; font-weight: 600;">
            <!-- Dynamic conflict text -->
          </div>
        </div>

        <div class="modal-footer client-modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; flex-shrink: 0;">
          <button type="button" class="btn btn-secondary modal-close-trigger" style="padding: 10px 18px; font-size: 13px;">Отмена</button>
          <button type="submit" class="btn btn-primary" id="saveEditAppSubmitBtn" style="padding: 10px 26px; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);">
            <span>💾</span>
            <span>Сохранить изменения</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: БЫСТРАЯ ЗАПИСЬ / НОВАЯ ЗАПИСЬ КЛИЕНТА -->
  <div class="modal-overlay" id="adminQuickBookingModal">
    <div class="modal-card client-modal-card" style="max-width: 580px;">
      <div class="modal-header client-modal-header">
        <div class="modal-title-box">
          <h3 id="quickBookingModalTitle" style="font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0;">Новая запись клиента</h3>
          <p id="quickBookingModalSubtitle" style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">Связанный выбор услуги, мастера и точного времени</p>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>

      <form id="adminQuickBookingForm" style="display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: hidden;">
        <div class="modal-body client-modal-body" style="flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px 24px;">
          
          <!-- БЛОК 1: Контактные данные -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>👤</span>
              <span>Контактные данные клиента</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div>
                <label class="form-label" style="font-size: 11px;">Имя клиента *</label>
                <input type="text" id="adminClientName" class="form-input" placeholder="Имя клиента" required style="padding: 7px 11px; font-size: 13px;">
              </div>
              <div>
                <label class="form-label" style="font-size: 11px;">Телефон / Telegram *</label>
                <input type="text" id="adminClientPhone" class="form-input" placeholder="+7 (999) 000-00-00" required style="padding: 7px 11px; font-size: 13px;">
              </div>
            </div>

            <div id="quickBookingDiscountInfo" style="display: none; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); padding: 8px 12px; margin-top: 10px; font-size: 12px; color: var(--color-success);">
              <!-- Populated via JS -->
            </div>
          </div>

          <!-- БЛОК 2: Выбор мастера и услуги (связанный фильтр) -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>✂️</span>
              <span>Мастер и услуга (умный фильтр)</span>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 11px;">Мастер *</label>
              <select id="adminSpecialistSelect" class="form-select" required style="padding: 8px 12px; font-size: 13px;">
                <!-- Rendered dynamically with auto-filter -->
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Услуга *</label>
              <select id="adminServiceSelect" class="form-select" required style="padding: 8px 12px; font-size: 13px;">
                <option value="">-- Выберите услугу из каталога --</option>
              </select>
            </div>
          </div>

          <!-- БЛОК 3: Дата, время и статус -->
          <div class="client-modal-block">
            <div class="client-block-title">
              <span>📅</span>
              <span>Дата, время (шаг 15 мин) и статус</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px;">
              <div>
                <label class="form-label" style="font-size: 11px;">Дата визита *</label>
                <input type="date" id="adminBookingDate" class="form-input" required style="padding: 7px 11px; font-size: 13px;">
              </div>
              <div>
                <label class="form-label" style="font-size: 11px;">Время (шаг 15 мин) *</label>
                <input type="time" id="adminBookingTime" class="form-input" step="900" required onblur="roundTimeInput(this)" onchange="roundTimeInput(this)" style="padding: 6px 10px; font-size: 13px;">
                <div style="display: flex; gap: 4px; margin-top: 5px;">
                  <button type="button" class="btn btn-secondary" onclick="setQuickTimeMinute(0)" style="padding: 2px 7px; font-size: 11px; flex: 1;">:00</button>
                  <button type="button" class="btn btn-secondary" onclick="setQuickTimeMinute(15)" style="padding: 2px 7px; font-size: 11px; flex: 1;">:15</button>
                  <button type="button" class="btn btn-secondary" onclick="setQuickTimeMinute(30)" style="padding: 2px 7px; font-size: 11px; flex: 1;">:30</button>
                  <button type="button" class="btn btn-secondary" onclick="setQuickTimeMinute(45)" style="padding: 2px 7px; font-size: 11px; flex: 1;">:45</button>
                </div>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Статус записи</label>
              <select id="adminBookingStatus" class="form-select" style="padding: 7px 11px; font-size: 13px;">
                <option value="confirmed" selected>🟢 Подтверждена (по телефону)</option>
                <option value="new">🟡 Новая (требует звонка)</option>
                <option value="completed">✅ Выполнена</option>
              </select>
            </div>
          </div>

          <div id="quickBookingConflictAlert" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: var(--radius-sm); padding: 10px 14px; margin-top: 14px; font-size: 12px; color: #EF4444; line-height: 1.4; font-weight: 600;">
            <!-- Dynamic conflict text -->
          </div>
        </div>

        <div class="modal-footer client-modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; flex-shrink: 0;">
          <button type="button" class="btn btn-secondary modal-close-trigger" style="padding: 10px 18px; font-size: 13px;">Отмена</button>
          <button type="submit" class="btn btn-primary" id="saveQuickBookingSubmitBtn" style="padding: 10px 26px; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);">
            <span>💾</span>
            <span>Сохранить запись</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: СОЗДАНИЕ И РЕДАКТИРОВАНИЕ ПРОФИЛЯ МАСТЕРА -->
  <div class="modal-overlay" id="adminSpecialistModal">
    <div class="modal-card client-modal-card" style="max-width: 820px;">
      <div class="modal-header client-modal-header">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div id="specialistModalAvatarPreview" class="client-avatar" style="width: 48px; height: 48px; font-size: 18px; flex-shrink: 0; overflow: hidden;">
            <img id="specialistModalAvatarImg" src="" alt="" style="width: 100%; height: 100%; object-fit: cover; display: none;">
            <span id="specialistModalMonogram">М</span>
          </div>
          <div>
            <h3 id="specialistModalTitle" style="font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0;">Профиль мастера</h3>
            <p id="specialistModalSubtitle" style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">Специализация, процент зарплаты и график смен</p>
          </div>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>

      <form id="adminSpecialistForm">
        <input type="hidden" id="specEditId">
        <div class="modal-body client-modal-body" style="max-height: calc(88vh - 140px); overflow-y: auto; padding: 20px 24px;">
          
          <!-- Сетка 2 основных блоков: 1. Данные мастера, 2. Финансы и процент -->
          <div class="client-modal-sections-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            
            <!-- БЛОК 1: Основные данные мастера -->
            <div class="client-modal-block">
              <div class="client-block-title">
                <span>👤</span>
                <span>Основные данные мастера</span>
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 11px;">Имя мастера *</label>
                <input type="text" id="specEditName" class="form-input" required placeholder="Например: Владимир Клим" style="padding: 7px 11px; font-size: 13px;" oninput="onSpecialistNameInput(this.value)">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 11px;">Должность / Специализация *</label>
                <input type="text" id="specEditRole" class="form-input" required placeholder="Например: Ведущий топ-стилист, шеф-барбер" style="padding: 7px 11px; font-size: 13px;">
              </div>

              <div class="form-group" style="margin-bottom: 12px;">
                <label class="form-label" style="font-size: 11px;">Ссылка на фото (аватар)</label>
                <input type="url" id="specEditAvatar" class="form-input" placeholder="https://images.unsplash.com/photo-..." style="padding: 7px 11px; font-size: 13px;" oninput="onSpecialistAvatarInput(this.value)">
              </div>

              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 11px;">Опыт работы / Регалии</label>
                <textarea id="specEditExperience" class="form-textarea" rows="3" placeholder="Опыт более 8 лет, сложная геометрия стрижек, Fade, борода..." style="resize: vertical; font-size: 12px;"></textarea>
              </div>
            </div>

            <!-- БЛОК 2: Финансовые условия и процент от услуг -->
            <div class="client-modal-block">
              <div class="client-block-title">
                <span>💰</span>
                <span>Финансовые условия и процент</span>
              </div>

              <div class="client-loyalty-card" style="border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <label class="form-label" style="font-size: 11px; color: var(--accent-primary); font-weight: 700; margin: 0;">
                    Процент мастера от выручки (%): *
                  </label>
                  <span id="specCommissionBadge" style="font-size: 11px; font-weight: 800; color: var(--accent-primary); background: var(--accent-primary-bg); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-accent);">40%</span>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <input type="number" id="specEditCommission" class="form-input" min="0" max="100" step="1" required placeholder="40" style="width: 68px; padding: 6px 8px; font-size: 13px; font-weight: 800; text-align: center; color: var(--accent-primary);" oninput="document.getElementById('specCommissionBadge').textContent = (this.value || 0) + '%'">
                  <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                    <button type="button" class="btn btn-secondary" onclick="setSpecCommission(30)" style="padding: 4px 7px; font-size: 11px;">30%</button>
                    <button type="button" class="btn btn-secondary" onclick="setSpecCommission(35)" style="padding: 4px 7px; font-size: 11px;">35%</button>
                    <button type="button" class="btn btn-secondary" onclick="setSpecCommission(40)" style="padding: 4px 7px; font-size: 11px;">40%</button>
                    <button type="button" class="btn btn-secondary" onclick="setSpecCommission(45)" style="padding: 4px 7px; font-size: 11px;">45%</button>
                    <button type="button" class="btn btn-secondary" onclick="setSpecCommission(50)" style="padding: 4px 7px; font-size: 11px;">50%</button>
                  </div>
                </div>
                <div style="font-size: 10px; color: var(--text-dim); margin-top: 6px; line-height: 1.3;">
                  От суммы каждой выполненной услуги мастер получает этот процент в зарплатную ведомость.
                </div>
              </div>

              <div>
                <label class="form-label" style="font-size: 11px; margin-bottom: 8px;">
                  Направления услуг мастера:
                </label>
                <div id="specCategoryCheckboxes" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                  <!-- Rendered dynamically via admin.js -->
                </div>
              </div>
            </div>

          </div>

          <!-- БЛОК 3: График работы и смены -->
          <div class="client-modal-block">
            <div class="client-block-title">
              <span>📅</span>
              <span>Постоянные рабочие смены мастера</span>
            </div>
            <p style="font-size: 11px; color: var(--text-dim); margin-top: -8px; margin-bottom: 12px;">
              Отметьте дни недели, в которые мастер по умолчанию выходит на смену:
            </p>
            <div id="specWorkDaysCheckboxes" style="display: flex; gap: 8px; flex-wrap: wrap;">
              <label style="padding: 7px 12px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-medium); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" name="workday" value="1" checked style="accent-color: var(--accent-primary);"> Пн
              </label>
              <label style="padding: 7px 12px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-medium); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" name="workday" value="2" checked style="accent-color: var(--accent-primary);"> Вт
              </label>
              <label style="padding: 7px 12px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-medium); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" name="workday" value="3" checked style="accent-color: var(--accent-primary);"> Ср
              </label>
              <label style="padding: 7px 12px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-medium); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" name="workday" value="4" checked style="accent-color: var(--accent-primary);"> Чт
              </label>
              <label style="padding: 7px 12px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-medium); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" name="workday" value="5" checked style="accent-color: var(--accent-primary);"> Пт
              </label>
              <label style="padding: 7px 12px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-medium); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" name="workday" value="6" checked style="accent-color: var(--accent-primary);"> Сб
              </label>
              <label style="padding: 7px 12px; border-radius: var(--radius-sm); background: var(--bg-surface); border: 1px solid var(--border-medium); cursor: pointer; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" name="workday" value="7" checked style="accent-color: var(--accent-primary);"> Вс
              </label>
            </div>
          </div>

        </div>

        <div class="modal-footer client-modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <button type="button" class="btn btn-secondary" id="specDeleteBtn" onclick="deleteCurrentSpecialist()" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.35); font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              🗑️ Удалить мастера
            </button>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button type="button" class="btn btn-secondary modal-close-trigger">Отмена</button>
            <button type="submit" class="btn btn-primary" id="saveSpecialistSubmitBtn" style="padding: 9px 22px; font-weight: 800;">
              💾 Сохранить мастера
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: СОЗДАНИЕ И РЕДАКТИРОВАНИЕ УСЛУГИ -->
  <div class="modal-overlay" id="adminServiceModal">
    <div class="modal-card client-modal-card" style="max-width: 680px;">
      <div class="modal-header client-modal-header">
        <div class="modal-title-box">
          <h3 id="serviceModalTitle" style="font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0;">Редактирование услуги</h3>
          <p id="serviceModalSubtitle" style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">Параметры услуги, цены, длительность и протокол процедуры</p>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>

      <form id="adminServiceForm" style="display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: hidden;">
        <input type="hidden" id="serviceEditId">
        <div class="modal-body client-modal-body" style="flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px 24px;">
          
          <!-- БЛОК 1: Направление и название -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>✂️</span>
              <span>Основная информация об услуге</span>
            </div>

            <!-- Направление с кнопкой добавления новой категории -->
            <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                  <label class="form-label" style="margin-bottom: 0; font-size: 11px;">Направление / Категория *</label>
                  <button type="button" class="btn btn-secondary" onclick="openAddCategoryModal()" style="padding: 2px 8px; font-size: 11px; font-weight: 700; color: var(--accent-primary); border-radius: var(--radius-sm);">
                    + Новая категория
                  </button>
                </div>
                <select id="serviceEditCategory" class="form-select" required style="padding: 8px 12px; font-size: 13px;"></select>
              </div>

              <div style="display: flex; flex-direction: column; justify-content: flex-end;">
                <label style="display: flex; align-items: center; gap: 8px; background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 8px 12px; border-radius: var(--radius-sm); cursor: pointer; height: 38px;">
                  <input type="checkbox" id="serviceEditPopular" style="accent-color: var(--accent-gold); width: 16px; height: 16px; cursor: pointer;">
                  <span style="font-size: 12px; font-weight: 700; color: var(--text-main);">⭐ Популярная услуга</span>
                </label>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Название услуги *</label>
              <input type="text" id="serviceEditName" class="form-input" required placeholder="Например: Авторская стрижка NOIR (Signature Cut)" style="padding: 8px 12px; font-size: 13px;">
            </div>
          </div>

          <!-- БЛОК 2: Финансы и тайминг -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>⏱️</span>
              <span>Стоимость и время выполнения</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div>
                <label class="form-label" style="font-size: 11px;">Стоимость (₫) *</label>
                <input type="number" id="serviceEditPrice" class="form-input" required min="0" step="10000" placeholder="450000" style="padding: 8px 12px; font-size: 13px;">
              </div>
              <div>
                <label class="form-label" style="font-size: 11px;">Длительность (минут) *</label>
                <input type="number" id="serviceEditDuration" class="form-input" required min="5" step="5" placeholder="60" style="padding: 8px 12px; font-size: 13px;">
              </div>
            </div>
          </div>

          <!-- БЛОК 3: Описание услуги -->
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>📝</span>
              <span>Описания процедуры</span>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 11px;">Краткое описание (для карточки и витрины) *</label>
              <textarea id="serviceEditShortDesc" class="form-textarea" rows="2" required placeholder="Консультация стилиста, мытье головы премиальным шампунем, стрижка ножницами и машинкой, стайлинг" style="font-size: 12px; resize: vertical;"></textarea>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Полное подробное описание (для окна «О процедуре»)</label>
              <textarea id="serviceEditFullDesc" class="form-textarea" rows="2" placeholder="Фирменная стрижка с индивидуальной адаптацией под форму черепа и черты лица..." style="font-size: 12px; resize: vertical;"></textarea>
            </div>
          </div>

          <!-- БЛОК 4: Протокол процедуры -->
          <div class="client-modal-block">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div class="client-block-title" style="margin-bottom: 0;">
                <span>📋</span>
                <span>Что входит в стоимость (Протокол процедуры)</span>
              </div>
              <button type="button" class="btn btn-secondary" onclick="addServiceIncludeItem()" style="padding: 3px 10px; font-size: 11px; font-weight: 700;">
                + Добавить пункт
              </button>
            </div>
            <div id="serviceEditIncludesList" style="display: flex; flex-direction: column; gap: 8px;">
              <!-- Dynamic list of inputs -->
            </div>
          </div>
        </div>

        <div class="modal-footer client-modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; flex-shrink: 0;">
          <div>
            <button type="button" class="btn" id="serviceDeleteBtn" onclick="deleteCurrentService()" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--color-danger); font-size: 12px; padding: 8px 14px; display: none; font-weight: 700;">
              🗑️ Удалить услугу
            </button>
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="btn btn-secondary modal-close-trigger" style="padding: 10px 18px; font-size: 13px;">Отмена</button>
            <button type="submit" class="btn btn-primary" id="saveServiceSubmitBtn" style="padding: 10px 24px; font-weight: 800; font-size: 13px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);">
              💾 Сохранить услугу
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: СОЗДАНИЕ НОВОЙ КАТЕГОРИИ / НАПРАВЛЕНИЯ -->
  <div class="modal-overlay" id="adminAddCategoryModal" style="display: none; z-index: 10002;">
    <div class="modal-card client-modal-card" style="max-width: 480px;">
      <div class="modal-header client-modal-header">
        <div class="modal-title-box">
          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 8px;">
            <span>✨</span>
            <span>Новое направление / категория</span>
          </h3>
          <p style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">Добавление категории услуг в каталог, прейскурант и расписание</p>
        </div>
        <button type="button" class="modal-close-btn" onclick="closeAddCategoryModal()">✕</button>
      </div>

      <form id="adminAddCategoryForm" onsubmit="handleAddCategorySubmit(event)" style="display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: hidden;">
        <div class="modal-body client-modal-body" style="flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 20px 24px;">
          
          <div class="client-modal-block" style="margin-bottom: 14px;">
            <div class="client-block-title">
              <span>🏷️</span>
              <span>Параметры направления</span>
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 11px;">Название направления / категории *</label>
              <input type="text" id="newCategoryName" class="form-input" required placeholder="Например: Ногтевой сервис &amp; Маникюр" style="padding: 8px 12px; font-size: 13px;">
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Краткое описание направления</label>
              <textarea id="newCategoryDesc" class="form-textarea" rows="2" placeholder="Например: Аппаратный маникюр, педикюр, наращивание, дизайн и уходовые SPA-ванночки" style="font-size: 12px; resize: vertical;"></textarea>
            </div>
          </div>

          <div id="newCategoryErrorAlert" style="display: none; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: #EF4444; font-weight: 600;">
            <!-- Dynamic error message -->
          </div>
        </div>

        <div class="modal-footer client-modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; flex-shrink: 0;">
          <button type="button" class="btn btn-secondary" onclick="closeAddCategoryModal()" style="padding: 10px 18px; font-size: 13px;">Отмена</button>
          <button type="submit" class="btn btn-primary" style="padding: 10px 24px; font-weight: 800; font-size: 13px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);">
            <span>💾</span>
            <span>Создать категорию</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: КАРТОЧКА ГОСТЯ -->
  <div class="modal-overlay" id="adminClientModal">
    <div class="modal-card client-modal-card" style="max-width: 920px;">
      <div class="modal-header client-modal-header">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div id="clientModalAvatar" class="client-avatar" style="width: 48px; height: 48px; font-size: 18px;">
            АВ
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <h3 id="clientModalName" style="font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0;">Имя гостя</h3>
              <span id="clientModalBadge" class="badge-client badge-client-vip" style="font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 800; text-transform: uppercase;">VIP</span>
            </div>
            <p id="clientModalSubtitle" style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">+7 (999) 000-00-00 &bull; Клиент с 15 июня 2026</p>
          </div>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>

      <div class="modal-body client-modal-body" style="max-height: calc(88vh - 150px); overflow-y: auto; padding: 20px 24px;">
        <input type="hidden" id="clientModalId">

        <!-- 4 KPI Блока гостя (Наверху) -->
        <div class="client-modal-kpi-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px;">
          <div class="client-modal-kpi-item">
            <div class="client-kpi-label">Всего визитов</div>
            <div id="clientModalTotalVisits" class="client-kpi-val">0</div>
          </div>
          <div class="client-modal-kpi-item">
            <div class="client-kpi-label">Сумма покупок (LTV)</div>
            <div id="clientModalTotalSpent" class="client-kpi-val client-kpi-accent">0 ₫</div>
          </div>
          <div class="client-modal-kpi-item">
            <div class="client-kpi-label">Средний чек</div>
            <div id="clientModalAvgCheck" class="client-kpi-val client-kpi-success">0 ₫</div>
          </div>
          <div class="client-modal-kpi-item">
            <div class="client-kpi-label">Любимый мастер</div>
            <div id="clientModalFavSpecialist" class="client-kpi-val client-kpi-master">—</div>
          </div>
        </div>

        <!-- Сетка 2 основных блоков: 1. Профиль и лояльность, 2. Заметки мастера -->
        <div class="client-modal-sections-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          
          <!-- БЛОК 1: Профиль и программа лояльности -->
          <div class="client-modal-block">
            <div class="client-block-title">
              <span>👤</span>
              <span>Профиль и программа лояльности</span>
            </div>

            <div style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 11px;">Имя гостя (редактируемое):</label>
              <input type="text" id="clientModalNameInput" class="form-input" style="padding: 7px 11px; font-size: 13px;" placeholder="Имя Фамилия гостя">
            </div>

            <div class="client-modal-phone-tele-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
              <div>
                <label class="form-label" style="font-size: 11px;">Телефон</label>
                <input type="text" id="clientModalPhoneInput" class="form-input" style="padding: 7px 11px; font-size: 13px;">
              </div>
              <div>
                <label class="form-label" style="font-size: 11px;">Telegram</label>
                <input type="text" id="clientModalTelegramInput" class="form-input" placeholder="@username" style="padding: 7px 11px; font-size: 13px;">
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label class="form-label" style="font-size: 11px;">Статус гостя в CRM</label>
              <select id="clientModalCategorySelect" class="form-select" style="padding: 7px 11px; font-size: 13px;">
                <option value="new">Новый гость</option>
                <option value="regular">Постоянный гость</option>
                <option value="vip">VIP гость</option>
              </select>
            </div>

            <!-- Программа лояльности и персональная скидка -->
            <div class="client-loyalty-card" style="border-radius: var(--radius-sm); padding: 12px 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label class="form-label" style="font-size: 11px; color: var(--accent-primary); font-weight: 700; margin: 0;">
                  ⭐ Персональная скидка (%)
                </label>
                <span id="clientModalDiscountBadge" style="font-size: 11px; font-weight: 800; color: var(--accent-primary); background: var(--accent-primary-bg); padding: 2px 7px; border-radius: 4px; border: 1px solid var(--border-accent);">0%</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="number" id="clientModalDiscountInput" class="form-input" min="0" max="100" step="1" value="0" style="width: 68px; padding: 6px 8px; font-size: 13px; font-weight: 700; text-align: center; color: var(--accent-primary);">
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                  <button type="button" class="btn btn-secondary" onclick="setClientModalDiscount(0)" style="padding: 4px 7px; font-size: 11px;">0%</button>
                  <button type="button" class="btn btn-secondary" onclick="setClientModalDiscount(5)" style="padding: 4px 7px; font-size: 11px;">5%</button>
                  <button type="button" class="btn btn-secondary" onclick="setClientModalDiscount(10)" style="padding: 4px 7px; font-size: 11px;">10%</button>
                  <button type="button" class="btn btn-secondary" onclick="setClientModalDiscount(15)" style="padding: 4px 7px; font-size: 11px;">15%</button>
                  <button type="button" class="btn btn-secondary" onclick="setClientModalDiscount(20)" style="padding: 4px 7px; font-size: 11px;">20%</button>
                </div>
              </div>
              <div style="font-size: 10px; color: var(--text-dim); margin-top: 6px; line-height: 1.3;">
                Скидка автоматически применяется при онлайн-записи и при записи администратором.
              </div>
            </div>
          </div>

          <!-- БЛОК 2: Заметки мастера и предпочтения -->
          <div class="client-modal-block" style="display: flex; flex-direction: column;">
            <div class="client-block-title">
              <span>📝</span>
              <span>Заметки мастера и предпочтения</span>
            </div>

            <div class="form-group" style="margin-bottom: 12px; flex: 1;">
              <label class="form-label" style="font-size: 11px;">Особенности волос, кожи и формулы:</label>
              <textarea id="clientModalHairNotes" class="form-textarea" rows="3" placeholder="Формулы тонирования, особенности черепа, длина фейда, чувствительность кожи..." style="height: calc(50% - 14px); min-height: 70px; resize: vertical;"></textarea>
            </div>

            <div class="form-group" style="margin-bottom: 14px; flex: 1;">
              <label class="form-label" style="font-size: 11px;">Пожелания гостя и сервис:</label>
              <textarea id="clientModalNotes" class="form-textarea" rows="3" placeholder="Любимый кофе/чай, темы бесед, аллергии, комфортная температура..." style="height: calc(50% - 14px); min-height: 70px; resize: vertical;"></textarea>
            </div>

            <button type="button" class="btn btn-secondary" onclick="saveCurrentClientProfile()" style="width: 100%; font-size: 12px; padding: 9px 14px; font-weight: 700; margin-top: auto;">
              💾 Сохранить заметки и профиль
            </button>
          </div>

        </div>

        <!-- БЛОК 3: Хронология визитов и процедур (Аккордеон) -->
        <div class="client-modal-block client-accordion-block">
          <div class="client-accordion-header" id="clientHistoryAccordionHeader" onclick="toggleClientHistoryAccordion()">
            <div class="client-accordion-header-left">
              <span>🗓️</span>
              <span class="client-block-title-text">Хронология визитов и процедур</span>
              <span id="clientModalHistoryCount" class="client-history-badge">0 визитов</span>
            </div>
            <div class="client-accordion-header-right">
              <span class="accordion-toggle-label" id="clientHistoryToggleLabel">Развернуть</span>
              <span class="accordion-toggle-arrow" id="clientHistoryToggleArrow">▼</span>
            </div>
          </div>

          <div class="client-accordion-body" id="clientHistoryAccordionBody" style="display: none;">
            <div id="clientModalVisitsHistoryList" style="display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
              <!-- Dynamic list of visit cards rendered via admin.js -->
            </div>
          </div>
        </div>

      </div>

      <div class="modal-footer client-modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
        <button type="button" class="btn btn-secondary modal-close-trigger">
          Закрыть
        </button>
        <button type="button" class="btn btn-primary" id="clientModalQuickBookBtn" onclick="bookAppointmentForCurrentClient()">
          + Записать гостя на процедуру
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL: СОЗДАНИЕ НОВОГО ГОСТЯ -->
  <div class="modal-overlay" id="adminClientCreateModal">
    <div class="modal-card" style="max-width: 500px;">
      <div class="modal-header">
        <div class="modal-title-box">
          <h3>Новый гость в базе</h3>
          <p>Ручное добавление карточки клиента</p>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>
      <form id="adminClientCreateForm">
        <div class="modal-body" style="padding: 20px 28px;">
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Имя и фамилия гостя *</label>
            <input type="text" id="newClientName" class="form-input" required placeholder="Например: Роман Кравцов">
          </div>
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Телефон *</label>
            <input type="text" id="newClientPhone" class="form-input" required placeholder="+7 (999) 000-00-00">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div>
              <label class="form-label">Telegram (опционально)</label>
              <input type="text" id="newClientTelegram" class="form-input" placeholder="@username">
            </div>
            <div>
              <label class="form-label">Категория</label>
              <select id="newClientCategory" class="form-select">
                <option value="new">Новый гость</option>
                <option value="regular">Постоянный гость</option>
                <option value="vip">VIP гость</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Персональная скидка гостя (%)</label>
            <input type="number" id="newClientDiscount" class="form-input" min="0" max="100" step="1" value="0" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label">Заметки о пожеланиях гостя</label>
            <textarea id="newClientNotes" class="form-textarea" rows="2" placeholder="Предпочитаемые напитки, стиль, пожелания..."></textarea>
          </div>
        </div>
        <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn btn-secondary modal-close-trigger">Отмена</button>
          <button type="submit" class="btn btn-primary">Добавить в базу</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ОФОРМЛЕНИЕ КАССОВОЙ ВЫПЛАТЫ МАСТЕРУ -->
  <div class="modal-overlay" id="adminPayoutConfirmModal">
    <div class="modal-card" style="max-width: 520px;">
      <div class="modal-header">
        <div class="modal-title-box">
          <h3>Оформление кассовой выплаты</h3>
          <p id="payoutConfirmSubtitle">Формирование расходного ордера и расчётного листка</p>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>

      <form id="adminPayoutConfirmForm">
        <input type="hidden" id="payoutFormSpecId">
        <input type="hidden" id="payoutFormStartDate">
        <input type="hidden" id="payoutFormEndDate">
        <input type="hidden" id="payoutFormAmount">
        <input type="hidden" id="payoutFormGross">
        <input type="hidden" id="payoutFormMargin">
        <input type="hidden" id="payoutFormCount">

        <div class="modal-body" style="padding: 20px 28px;">
          <div style="display: flex; align-items: center; gap: 14px; background: rgba(0,0,0,0.3); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 16px;">
            <img id="payoutModalAvatar" src="" alt="" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-gold);">
            <div>
              <div style="font-weight: 800; color: var(--text-main); font-size: 15px;" id="payoutModalMasterName">Master Name</div>
              <div style="font-size: 12px; color: var(--text-dim);" id="payoutModalMasterRole">Role</div>
              <div style="font-size: 11px; color: var(--accent-gold); margin-top: 2px;" id="payoutModalPeriod">Период: 12 — 18 окт. 2026</div>
            </div>
          </div>

          <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: var(--radius-md); padding: 16px; text-align: center; margin-bottom: 18px;">
            <div style="font-size: 11px; color: var(--accent-gold); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Сумма к выдаче на руки:</div>
            <div style="font-size: 32px; font-weight: 900; color: var(--accent-gold); margin: 4px 0;" id="payoutModalAmountDisplay">0 ₫</div>
            <div style="font-size: 12px; color: var(--text-dim);" id="payoutModalStatsSummary">
              По 2 выполненным услугам (касса: 1 200 000 ₫, ставка: 45%)
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Способ выдачи денежных средств *</label>
            <select id="payoutMethodSelect" class="form-select" required>
              <option value="Наличные из кассы">💵 Наличные из кассы (расходный ордер)</option>
              <option value="Безналичный перевод / СБП">💳 Безналичный перевод / СБП на карту</option>
              <option value="Банковский перевод по реквизитам">🏦 Банковский перевод по реквизитам</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Кто произвёл выплату *</label>
            <input type="text" id="payoutIssuedByInput" class="form-input" value="Владелец NOIR Atelier" required>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Комментарий / Примечание к ордеру</label>
            <textarea id="payoutNotesInput" class="form-textarea" rows="2" placeholder="Зарплата за расчётный период выдана в полном объёме..."></textarea>
          </div>

          <div style="margin-top: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #FFFFFF;">
              <input type="checkbox" id="payoutAutoPrintCheckbox" checked style="accent-color: var(--accent-gold); width: 16px; height: 16px; cursor: pointer;">
              <span>Сразу открыть расчётный листок для печати (А4)</span>
            </label>
          </div>
        </div>

        <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="btn btn-secondary modal-close-trigger">Отмена</button>
          <button type="submit" class="btn btn-primary" style="padding: 10px 22px; font-weight: 800;">
            ✓ Провести выплату и сформировать ордер
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: ИНСТРУКЦИЯ И РЕГЛАМЕНТ РАСЧЁТА ЗАРПЛАТ -->
  <div class="modal-overlay" id="adminPayrollHelpModal">
    <div class="modal-card" style="max-width: 760px;">
      <div class="modal-header">
        <div class="modal-title-box">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">📖</span>
            <h3 style="margin: 0;">Инструкция: Регламент расчёта и выплат зарплат</h3>
          </div>
          <p style="margin-top: 4px;">Универсальное руководство для управляющего, администратора и владельца бизнеса</p>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger">✕</button>
      </div>

      <div class="modal-body" style="padding: 24px 28px; max-height: 72vh; overflow-y: auto;">
        <!-- Блок 1: Принцип авторасчёта -->
        <div style="background: rgba(212, 175, 55, 0.06); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 18px;">💡</span>
            <h4 style="font-size: 15px; font-weight: 800; color: var(--accent-gold); margin: 0;">Базовый принцип автоматического расчёта</h4>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0 0 10px;">
            Когда визит клиента получает статус <strong>«Выполнена»</strong>, система моментально делит сумму чека на две части:
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-gold);">
              <div style="font-size: 11px; text-transform: uppercase; color: var(--accent-gold); font-weight: 700;">1. Доля мастера</div>
              <div style="font-size: 12px; color: var(--text-main); margin-top: 2px;">Стоимость услуги × Процент мастера (%)</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: var(--radius-sm); border-left: 3px solid #10B981;">
              <div style="font-size: 11px; text-transform: uppercase; color: #10B981; font-weight: 700;">2. Чистая маржа салона</div>
              <div style="font-size: 12px; color: var(--text-main); margin-top: 2px;">Стоимость услуги − Доля мастера</div>
            </div>
          </div>
          <div style="font-size: 12px; color: var(--text-dim); background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: var(--radius-sm);">
            <strong>Наглядный пример:</strong> Процедура стоит <strong>$100</strong>. У мастера ставка <strong>40%</strong>. Мастер зарабатывает <strong>$40</strong>, а доход салона составляет <strong>$60</strong>. При 10 процедурах за период мастер получит <strong>$400</strong>, а салон удержит <strong>$600</strong>. Ручной подсчёт исключён полностью.
          </div>
        </div>

        <!-- Блок 2: Сценарий Каждый день -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="font-size: 18px;">📅</span>
            <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); margin: 0;">Сценарий 1: Выплата КАЖДЫЙ ДЕНЬ (в конце смены)</h4>
          </div>
          <ol style="font-size: 13px; color: var(--text-sub); line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 6px;">
              <strong>Выбор периода:</strong> В строке <em>«Регламент выплат салона»</em> установите <strong>«Каждый день (в конце смены)»</strong> и нажмите кнопку <strong>«📅 Сегодня»</strong> (стрелки ‹ / › позволяют выбрать вчерашний день или любую другую дату).
            </li>
            <li style="margin-bottom: 6px;">
              <strong>Оценка кассы:</strong> В верхней карточке <strong>«💰 Фонд оплаты мастеров»</strong> отображается общая сумма, которую необходимо выдать всем специалистам смены (например, <strong>$240</strong>).
            </li>
            <li style="margin-bottom: 6px;">
              <strong>Проверка мастера:</strong> В списке отображаются мастера, работавшие сегодня. Нажав <em>«Детализация ▾»</em>, можно увидеть каждую проведённую стрижку с временем и именами клиентов.
            </li>
            <li>
              <strong>Выдача денег:</strong> Нажмите золотую кнопку <strong>[ Выплатить ]</strong> напротив мастера. Выберите форму выдачи (<em>💵 Наличные</em> или <em>💳 Перевод</em>) и нажмите <em>«✓ Провести выплату»</em>. Сформируется ордер, карточка подсветится зелёным, а на принтер отправится расчётный листок под роспись.
            </li>
          </ol>
        </div>

        <!-- Блок 3: Сценарий Раз в неделю -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="font-size: 18px;">🗓️</span>
            <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); margin: 0;">Сценарий 2: Выплата РАЗ В НЕДЕЛЮ (понедельник)</h4>
          </div>
          <ol style="font-size: 13px; color: var(--text-sub); line-height: 1.6; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 6px;">
              <strong>Выбор периода:</strong> Установите регламент <strong>«Раз в неделю (понедельник)»</strong> и нажмите кнопку <strong>«⏮️ Прошлая неделя»</strong>. Система автоматически объединит все чеки за 7 дней с понедельника по воскресенье.
            </li>
            <li style="margin-bottom: 6px;">
              <strong>Итоги за неделю:</strong> Для каждого мастера выведен полный итог: количество процедур (например, 12 или 25), валовая касса и сумма к выдаче на руки за всю неделю.
            </li>
            <li style="margin-bottom: 6px;">
              <strong>Вариант А (Индивидуально):</strong> Мастер подходит к кассе → нажимаете <strong>[ Выплатить ]</strong> → выдаёте сумму и распечатываете индивидуальный расчётный листок (Payslip) формата А4.
            </li>
            <li>
              <strong>Вариант Б (Сводная ведомость на весь салон):</strong> Вверху страницы нажмите <strong>«🖨️ Распечатать сводную ведомость на салон»</strong>. Будет сформирован один общий лист со всеми мастерами и пустой колонкой для личной подписи каждого мастера в получении денег.
            </li>
          </ol>
        </div>

        <!-- Блок 4: Как понимать статусы -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="font-size: 18px;">🚦</span>
            <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); margin: 0;">Индикация статусов: Кому выплачено, а кому ещё нет</h4>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: var(--radius-sm); padding: 12px 14px;">
              <div style="display: flex; align-items: center; gap: 6px; color: var(--accent-gold); font-weight: 800; font-size: 13px;">
                <span>🟡</span> Золотая кнопка «Выплатить»
              </div>
              <p style="font-size: 12px; color: var(--text-sub); margin: 6px 0 0; line-height: 1.4;">
                Зарплата за выбранный период <strong>ещё не выдана</strong>. Сумма долга отображается золотыми цифрами и учитывается в общем зарплатном фонде салона.
              </p>
            </div>

            <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: var(--radius-sm); padding: 12px 14px;">
              <div style="display: flex; align-items: center; gap: 6px; color: #10B981; font-weight: 800; font-size: 13px;">
                <span>🟢</span> Зелёный бейдж «✓ Выплачено»
              </div>
              <p style="font-size: 12px; color: var(--text-sub); margin: 6px 0 0; line-height: 1.4;">
                Ордер <strong>проведён и зафиксирован</strong> (например, <em>#PAY-1003</em>). Карточка подсвечена изумрудом. Случайный клик не сбросит выплату. Доступна повторная печать листка.
              </p>
            </div>
          </div>
        </div>

        <!-- Блок 5: Журнал кассовых выплат -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 18px;">📜</span>
            <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); margin: 0;">Журнал кассовых выплат (Архив всех периодов)</h4>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 0;">
            Вся история проведённых выплат сохраняется в под-вкладке <strong>«Журнал кассовых выплат»</strong>. Вы можете выбрать любой прошлый год, месяц или конкретного мастера, чтобы проверить дату и время выдачи денег, способ оплаты и распечатать дубликат ордера в случае любых вопросов или сверок.
          </p>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; justify-content: flex-end; padding: 14px 28px;">
        <button type="button" class="btn btn-primary modal-close-trigger" style="padding: 9px 24px; font-weight: 700;">
          Понятно, закрыть
        </button>
      </div>
    </div>
  </div>

  <!-- Modal: Уведомление об ограничении смены PIN в демо-версии -->
  <div class="modal-overlay" id="demoPinNoticeModal" onclick="if(event.target === this) closeDemoPinNoticeModal()" style="display: none; z-index: 10005;">
    <div class="modal-card" style="max-width: 440px; padding: 28px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
        <h3 style="font-size: 16px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; margin: 0;">
          <span>🔒</span>
          <span>Ограничение демо-версии</span>
        </h3>
        <button type="button" class="btn btn-secondary" onclick="closeDemoPinNoticeModal()" style="padding: 4px 10px; font-size: 13px; border-radius: var(--radius-sm);">✕</button>
      </div>

      <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 16px;">
        <div style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
          <span>ℹ️</span>
          <span>Смена мастер-PIN заблокирована</span>
        </div>
        <p style="font-size: 12px; color: var(--text-sub); line-height: 1.5; margin: 0;">
          В этой демонстрационной витрине функция смены PIN-кода отключена для сохранения публичного доступа (PIN по умолчанию: <b style="color: #FFFFFF;">1234</b>).
        </p>
      </div>

      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 22px; font-size: 12px; color: var(--text-sub); line-height: 1.5;">
        🛡️ <b style="color: #FFFFFF;">В коммерческой версии:</b> каждому заведению назначается индивидуальный зашифрованный PIN-код с двухфакторным подтверждением личности через закрытую группу Telegram.
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button type="button" class="btn btn-primary" onclick="closeDemoPinNoticeModal()" style="padding: 9px 22px; font-size: 12px; font-weight: 700;">
          Понятно
        </button>
      </div>
    </div>
  </div>

  <!-- Modal: Смена PIN-кода администратора -->
  <div class="modal-overlay" id="adminPinChangeModal" style="display: none; z-index: 10000;">
    <div class="modal-card" style="max-width: 440px; padding: 32px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
        <h3 style="font-size: 17px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; margin: 0;">
          <span>🔒</span>
          <span>Безопасность &bull; Смена PIN-кода</span>
        </h3>
        <button type="button" class="btn btn-secondary" onclick="closePinChangeModal()" style="padding: 4px 10px; font-size: 13px; border-radius: var(--radius-sm);">✕</button>
      </div>

      <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px;">
        Задайте новый 4-значный цифровой PIN-код для входа в панель управления CRM на всех устройствах.
      </p>

      <form id="adminPinChangeForm" onsubmit="handleAdminPinChangeSubmit(event)">
        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" style="font-size: 12px;">Текущий PIN-код</label>
          <input type="password" id="currentPinInput" class="form-input" placeholder="••••" maxlength="8" style="font-size: 18px; letter-spacing: 4px; font-family: var(--font-mono);" required>
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" style="font-size: 12px;">Новый PIN-код (4–6 цифр)</label>
          <input type="password" id="newPinInput" class="form-input" placeholder="••••" maxlength="8" style="font-size: 18px; letter-spacing: 4px; font-family: var(--font-mono);" required>
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label" style="font-size: 12px;">Повторите новый PIN-код</label>
          <input type="password" id="confirmNewPinInput" class="form-input" placeholder="••••" maxlength="8" style="font-size: 18px; letter-spacing: 4px; font-family: var(--font-mono);" required>
        </div>

        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label" style="font-size: 12px;">Email владельца для восстановления</label>
          <input type="email" id="changeOwnerEmailInput" class="form-input" placeholder="owner@noir-atelier.com" style="font-size: 13px;">
        </div>

        <div id="pinChangeErrorMsg" style="display: none; color: var(--color-danger); font-size: 12px; margin-bottom: 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 8px 12px; border-radius: var(--radius-sm);">
          Ошибка смены PIN-кода
        </div>

        <div id="pinChangeSuccessMsg" style="display: none; color: #10B981; font-size: 12px; margin-bottom: 14px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 8px 12px; border-radius: var(--radius-sm);">
          ✓ Новый PIN-код успешно сохранён и активирован!
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="closePinChangeModal()" style="padding: 8px 16px; font-size: 12px;">
            Отмена
          </button>
          <button type="submit" class="btn btn-primary" style="padding: 8px 18px; font-size: 12px; font-weight: 700;">
            Сохранить новый PIN
          </button>
        </div>
      </form>
    </div>
  </div>


  <!-- PRINT CONTAINER: ПОЛИГРАФИЧЕСКИЙ ДОКУМЕНТ А4 ПОД ПЕЧАТЬ -->
  <div id="printableDocumentArea" style="display: none;">
    <!-- Rendered dynamically during window.print() -->
  </div>

  <style>
    @media print {
      body * {
        visibility: hidden !important;
      }
      #printableDocumentArea, #printableDocumentArea * {
        visibility: visible !important;
      }
      #printableDocumentArea {
        display: block !important;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        background: #FFFFFF !important;
        color: #000000 !important;
        padding: 0 !important;
        margin: 0 !important;
        font-family: 'Plus Jakarta Sans', Arial, sans-serif !important;
      }
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
    }
  </style>`;

  function mountSalonEngine() {
    const root = document.getElementById('salonAppRoot');
    if (root) {
      root.innerHTML = SALON_HTML_TEMPLATE;
    } else {
      const div = document.createElement('div');
      div.id = 'salonAppRoot';
      div.innerHTML = SALON_HTML_TEMPLATE;
      document.body.prepend(div);
    }
  }

  // Auto-mount immediately so elements exist before script setup
  mountSalonEngine();

  // Expose configuration globally
  window.currentSalonTenant = config.slug || config.tenantId || 'noir-atelier';
  window.isSalonDemoMode = config.isDemo !== false;

/**
 * NOIR Hair Atelier - Admin CRM Controller
 * Управление расписанием мастеров, живой редактор записей, смены и прейскурант
 */

// initAdmin is called at the end of engine bundle after all declarations

const ADMIN_PIN = "1234";
let currentDate = new Date().toISOString().split('T')[0];
let currentTab = 'timeline';
let currentWeekOffset = 0; // 0 = текущая неделя, 1 = следующая и т.д.
let adminServiceSearchQuery = '';

function initAdmin() {
  initTheme();
  setupAuth();
  setupNav();
  setupModals();
  setupLiveSync();
}

// Universal B2B Theme Controller
function initTheme() {
  let saved = 'light';
  try {
    const params = new URLSearchParams(window.location.search);
    const urlTheme = params.get('theme');
    if (urlTheme === 'light' || urlTheme === 'dark') {
      saved = urlTheme;
      localStorage.setItem('noir_crm_theme', urlTheme);
    } else {
      saved = localStorage.getItem('noir_crm_theme') || 'light';
    }
  } catch (e) {}
  setTheme(saved, false);
}

function setTheme(theme, save = true) {
  const current = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', current);
  if (save) {
    try {
      localStorage.setItem('noir_crm_theme', current);
    } catch (e) {}
  }

  // Update button active states across all switchers (Desktop, Mobile)
  ['Desktop', 'Mobile'].forEach(mode => {
    const darkBtn = document.getElementById(`themeBtnDark${mode}`);
    const lightBtn = document.getElementById(`themeBtnLight${mode}`);
    if (darkBtn && lightBtn) {
      if (current === 'dark') {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
      } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
      }
    }
  });
}
window.setTheme = setTheme;

function setupLiveSync() {
  // Мгновенная синхронизация между вкладками через событие storage
  window.addEventListener('storage', (e) => {
    if (e.key === window.noirData.STORAGE_KEYS.APPOINTMENTS || 
        e.key === window.noirData.STORAGE_KEYS.SPECIALISTS || 
        e.key === window.noirData.STORAGE_KEYS.SERVICES ||
        e.key === window.noirData.STORAGE_KEYS.CLIENTS) {
      updateKPIs();
      if (currentTab === 'timeline') renderTimeline();
      if (currentTab === 'specialists') renderSpecialistsSchedule();
      if (currentTab === 'appointments') renderJournal();
      if (currentTab === 'services') renderServicesAdmin();
      if (currentTab === 'clients') renderClientsAdmin();
      if (currentTab === 'payroll') renderPayrollAdmin();
    }
  });

  // Реакция на синхронизацию с облачной базой D1 (синхронизация из Telegram-бота)
  window.addEventListener('noir_appointments_synced', () => {
    updateKPIs();
    if (currentTab === 'timeline') renderTimeline();
    if (currentTab === 'specialists') renderSpecialistsSchedule();
    if (currentTab === 'appointments') renderJournal();
  });

  // Быстрый пульс (Heartbeat) синхронизации каждые 3 секунды
  setInterval(async () => {
    if (sessionStorage.getItem('noir_admin_token') && window.noirData && typeof window.noirData.syncFromCloud === 'function') {
      await window.noirData.syncFromCloud();
    }
  }, 3000);

  // Мгновенная синхронизация при возврате на вкладку браузера
  const syncOnActive = () => {
    updateKPIs();
    if (currentTab === 'timeline') renderTimeline();
    if (currentTab === 'specialists') renderSpecialistsSchedule();
    if (currentTab === 'appointments') renderJournal();
    if (currentTab === 'services') renderServicesAdmin();
    if (currentTab === 'clients') renderClientsAdmin();
    if (currentTab === 'payroll') renderPayrollAdmin();

    if (sessionStorage.getItem('noir_admin_token') && window.noirData && typeof window.noirData.syncFromCloud === 'function') {
      window.noirData.syncFromCloud();
    }
  };

  window.addEventListener('focus', syncOnActive);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncOnActive();
  });
}

function setupAuth() {
  const pinForm = document.getElementById('pinAuthForm');
  const pinInput = document.getElementById('pinInput');
  const pinError = document.getElementById('pinErrorMsg');
  const pinScreen = document.getElementById('pinLockScreen');
  const mainLayout = document.getElementById('adminMainLayout');

  const href = window.location.href;
  const isAutoLogin = href.includes('autologin=1');

  if (href.includes('openRecovery=1')) {
    openPinRecoveryModal();
  }

  let isAuth = isAutoLogin;
  try {
    if (sessionStorage.getItem('noir_admin_auth') === 'true' || localStorage.getItem('noir_admin_auth') === 'true') {
      isAuth = true;
    }
  } catch (e) {}

  const tenantId = window.currentSalonTenant || (window.SALON_CONFIG && (window.SALON_CONFIG.slug || window.SALON_CONFIG.tenantId)) || 'noir-atelier';

  // Проверка сессии или параметра autologin
  if (isAuth || (pinScreen && pinScreen.style.display === 'none')) {
    if (pinScreen) pinScreen.style.display = 'none';
    if (mainLayout) mainLayout.style.display = 'flex';

    // Автоматическое получение HMAC токена если его нет в текущей сессии
    let token = sessionStorage.getItem('noir_admin_token');
    if (!token) {
      try { token = localStorage.getItem('noir_admin_token'); } catch(e) {}
    }

    if (!token) {
      fetch("https://synaptiq-crm-bot.dandeliondnd-vn.workers.dev/api/salon/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId, pin: "1234" })
      }).then(r => r.json()).then(d => {
        if (d && d.token) {
          sessionStorage.setItem('noir_admin_token', d.token);
          try { localStorage.setItem('noir_admin_token', d.token); } catch(e) {}
          if (window.noirData && typeof window.noirData.syncFromCloud === 'function') {
            window.noirData.syncFromCloud();
          }
        }
      }).catch(err => console.warn("Auto-token fetch failed:", err));
    }

    loadDashboard();
    return;
  }

  // Экспортируем глобальный обработчик завершения сессии
  window.handleSessionExpired = function() {
    if (window.isSalonDemoMode) {
      console.warn("Session 401 suppressed in demo mode");
      return;
    }
    const pScreen = document.getElementById('pinLockScreen');
    if (pScreen && pScreen.style.display !== 'none') return;

    sessionStorage.removeItem('noir_admin_auth');
    sessionStorage.removeItem('noir_admin_token');
    try {
      localStorage.removeItem('noir_admin_auth');
      localStorage.removeItem('noir_admin_token');
    } catch(e) {}

    const mLayout = document.getElementById('adminMainLayout');
    const pError = document.getElementById('pinErrorMsg');
    if (mLayout) mLayout.style.display = 'none';
    if (pScreen) pScreen.style.display = 'flex';
    if (pError) {
      pError.textContent = 'Сессия истекла или недействительна. Пожалуйста, введите PIN-код заново.';
      pError.style.display = 'block';
    }
  };

  if (pinForm) {
    if (pinForm._authAttached) return;
    pinForm._authAttached = true;

    pinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const entered = pinInput ? pinInput.value.trim() : '';
      if (!entered) return;

      const submitBtn = pinForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Проверка...';
      }

      let isValid = false;
      let token = null;
      let errorMsg = "Неверный PIN-код. Проверьте правильность ввода";

      try {
        const resp = await fetch("https://synaptiq-crm-bot.dandeliondnd-vn.workers.dev/api/salon/verify-pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant_id: tenantId, pin: entered })
        });
        const resData = await resp.json();
        if (resData && resData.success) {
          isValid = true;
          token = resData.token || null;
        } else if (resData && resData.error) {
          errorMsg = resData.error;
        }
      } catch (err) {
        console.warn("ClientBase PIN check offline, using local verification:", err);
        isValid = window.noirData ? window.noirData.verifyAdminPin(entered) : (entered === "1234");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Войти в систему →';
        }
      }
      
      if (isValid) {
        sessionStorage.setItem('noir_admin_auth', 'true');
        try {
          localStorage.setItem('noir_admin_auth', 'true');
          localStorage.setItem('noir_admin_auth_time', Date.now().toString());
        } catch(e) {}

        if (token) {
          sessionStorage.setItem('noir_admin_token', token);
          try { localStorage.setItem('noir_admin_token', token); } catch(e) {}
        }
        if (pinScreen) pinScreen.style.display = 'none';
        if (mainLayout) mainLayout.style.display = 'flex';
        loadDashboard();
      } else {
        if (pinError) {
          pinError.textContent = errorMsg;
          pinError.style.display = 'block';
        }
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    });
  }
}

// ==========================================
// УПРАВЛЕНИЕ PIN-КОДОМ И ВОССТАНОВЛЕНИЕ ДОСТУПА
// ==========================================

let recoveryPollTimer = null;
let activeRecoveryRequestId = null;
let lastReceivedPin = null;

function openPinRecoveryModal() {
  const modal = document.getElementById('pinRecoveryModal');
  const stepReq = document.getElementById('recoveryStep_request');
  const stepWait = document.getElementById('recoveryStep_waiting');
  const stepSucc = document.getElementById('recoveryStep_success');

  if (stepReq) stepReq.style.display = 'block';
  if (stepWait) stepWait.style.display = 'none';
  if (stepSucc) stepSucc.style.display = 'none';

  if (recoveryPollTimer) {
    clearInterval(recoveryPollTimer);
    recoveryPollTimer = null;
  }

  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}
window.openPinRecoveryModal = openPinRecoveryModal;

function closePinRecoveryModal() {
  const modal = document.getElementById('pinRecoveryModal');
  if (recoveryPollTimer) {
    clearInterval(recoveryPollTimer);
    recoveryPollTimer = null;
  }
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
window.closePinRecoveryModal = closePinRecoveryModal;

async function requestTelegramPinRecovery() {
  const btn = document.getElementById('sendTgRecoveryBtn');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch("https://synaptiq-crm-bot.dandeliondnd-vn.workers.dev/api/salon/request-pin-recovery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenant_id: "noir-atelier" })
    });
    const data = await res.json();
    if (data && data.success && data.request_id) {
      activeRecoveryRequestId = data.request_id;
      document.getElementById('recoveryStep_request').style.display = 'none';
      document.getElementById('recoveryStep_waiting').style.display = 'block';

      // Start polling status every 2 seconds
      recoveryPollTimer = setInterval(pollTelegramPinRecoveryStatus, 2000);
    } else {
      alert("Не удалось отправить запрос: " + (data.error || "Ошибка сети"));
      if (btn) btn.disabled = false;
    }
  } catch (err) {
    alert("Ошибка соединения: " + err.message);
    if (btn) btn.disabled = false;
  }
}
window.requestTelegramPinRecovery = requestTelegramPinRecovery;

async function pollTelegramPinRecoveryStatus() {
  if (!activeRecoveryRequestId) return;

  try {
    const res = await fetch(`https://synaptiq-crm-bot.dandeliondnd-vn.workers.dev/api/salon/check-pin-recovery?request_id=${activeRecoveryRequestId}`);
    const data = await res.json();

    if (data && data.status === 'approved') {
      clearInterval(recoveryPollTimer);
      recoveryPollTimer = null;

      document.getElementById('recoveryStep_waiting').style.display = 'none';
      const succBox = document.getElementById('recoveryStep_success');
      if (succBox) succBox.style.display = 'block';

      // Keep PIN input clean so user enters the PIN manually from Telegram
      const pinInp = document.getElementById('pinInput');
      if (pinInp) pinInp.value = '';
    } else if (data && data.status === 'denied') {
      clearInterval(recoveryPollTimer);
      recoveryPollTimer = null;
      alert("Запрос на сброс PIN-кода был отклонён администратором в Telegram.");
      closePinRecoveryModal();
    }
  } catch (e) {
    console.warn("Poll recovery error:", e);
  }
}

function closePinRecoveryAndFocus() {
  closePinRecoveryModal();
  const pinInp = document.getElementById('pinInput');
  if (pinInp) {
    pinInp.value = '';
    pinInp.focus();
  }
}
// Демо-режим витрины: блокирует изменение мастер-PIN для сохранения стабильного публичного доступа (PIN 1234)
const IS_DEMO_MODE = true;

function openDemoPinNoticeModal() {
  const modal = document.getElementById('demoPinNoticeModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}
window.openDemoPinNoticeModal = openDemoPinNoticeModal;

function closeDemoPinNoticeModal() {
  const modal = document.getElementById('demoPinNoticeModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
window.closeDemoPinNoticeModal = closeDemoPinNoticeModal;

function openPinChangeModal() {
  if (IS_DEMO_MODE) {
    openDemoPinNoticeModal();
    return;
  }
  const modal = document.getElementById('adminPinChangeModal');
  const err = document.getElementById('pinChangeErrorMsg');
  const succ = document.getElementById('pinChangeSuccessMsg');
  if (err) err.style.display = 'none';
  if (succ) succ.style.display = 'none';
  
  const curInp = document.getElementById('currentPinInput');
  const newInp = document.getElementById('newPinInput');
  const confInp = document.getElementById('confirmNewPinInput');
  if (curInp) curInp.value = '';
  if (newInp) newInp.value = '';
  if (confInp) confInp.value = '';

  const sec = window.noirData ? window.noirData.getSecurityInfo() : null;
  const emailInp = document.getElementById('changeOwnerEmailInput');
  if (emailInp && sec && sec.ownerEmail) {
    emailInp.value = sec.ownerEmail;
  }

  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}
window.openPinChangeModal = openPinChangeModal;

function closePinChangeModal() {
  const modal = document.getElementById('adminPinChangeModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}
window.closePinChangeModal = closePinChangeModal;


function handleAdminPinChangeSubmit(e) {
  e.preventDefault();
  if (IS_DEMO_MODE) {
    openDemoPinNoticeModal();
    return;
  }
  const curVal = document.getElementById('currentPinInput').value.trim();
  const newVal = document.getElementById('newPinInput').value.trim();
  const confVal = document.getElementById('confirmNewPinInput').value.trim();
  const emailVal = document.getElementById('changeOwnerEmailInput') ? document.getElementById('changeOwnerEmailInput').value.trim() : '';
  const errEl = document.getElementById('pinChangeErrorMsg');
  const succEl = document.getElementById('pinChangeSuccessMsg');

  if (errEl) errEl.style.display = 'none';
  if (succEl) succEl.style.display = 'none';

  // 1. Проверяем текущий PIN
  const isCurValid = window.noirData ? window.noirData.verifyAdminPin(curVal) : (curVal === "1234");
  if (!isCurValid) {
    if (errEl) {
      errEl.textContent = "Неверный текущий PIN-код! Проверьте и попробуйте снова.";
      errEl.style.display = 'block';
    }
    return;
  }

  // 2. Проверяем формат нового PIN
  if (!/^\d{4,8}$/.test(newVal)) {
    if (errEl) {
      errEl.textContent = "Новый PIN-код должен содержать от 4 до 8 цифр.";
      errEl.style.display = 'block';
    }
    return;
  }

  // 3. Сверяем подтверждение
  if (newVal !== confVal) {
    if (errEl) {
      errEl.textContent = "Новый PIN-код и подтверждение не совпадают.";
      errEl.style.display = 'block';
    }
    return;
  }

  // 4. Сохраняем в базу
  if (window.noirData) {
    window.noirData.updateAdminPin(newVal, emailVal);
  }

  if (succEl) {
    succEl.style.display = 'block';
  }

  setTimeout(() => {
    closePinChangeModal();
  }, 1000);
}
window.handleAdminPinChangeSubmit = handleAdminPinChangeSubmit;


function setupNav() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  const dateInput = document.getElementById('timelineDateInput');
  const dateDisplay = document.getElementById('timelineCurrentDateDisplay');
  const prevDayBtn = document.getElementById('timelinePrevDayBtn');
  const nextDayBtn = document.getElementById('timelineNextDayBtn');
  const todayBtn = document.getElementById('timelineTodayBtn');
  const refreshBtn = document.getElementById('timelineRefreshBtn');

  function updateTimelineDateDisplay() {
    if (dateInput) dateInput.value = currentDate;
    if (dateDisplay) {
      const d = new Date(currentDate);
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const formatted = d.toLocaleDateString('ru-RU', options);
      dateDisplay.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
  }

  updateTimelineDateDisplay();

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      currentDate = e.target.value;
      updateTimelineDateDisplay();
      renderTimeline();
    });
  }

  if (prevDayBtn) {
    prevDayBtn.addEventListener('click', () => {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      currentDate = d.toISOString().split('T')[0];
      updateTimelineDateDisplay();
      renderTimeline();
    });
  }

  if (nextDayBtn) {
    nextDayBtn.addEventListener('click', () => {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      currentDate = d.toISOString().split('T')[0];
      updateTimelineDateDisplay();
      renderTimeline();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentDate = new Date().toISOString().split('T')[0];
      updateTimelineDateDisplay();
      renderTimeline();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      updateKPIs();
      renderTimeline();
    });
  }

  // Недельный навигатор в расписании мастеров
  const prevWeekBtn = document.getElementById('schedulePrevWeekBtn');
  const nextWeekBtn = document.getElementById('scheduleNextWeekBtn');
  const currentWeekBtn = document.getElementById('scheduleCurrentWeekBtn');

  if (prevWeekBtn) {
    prevWeekBtn.addEventListener('click', () => {
      currentWeekOffset--;
      renderSpecialistsSchedule();
    });
  }

  if (nextWeekBtn) {
    nextWeekBtn.addEventListener('click', () => {
      currentWeekOffset++;
      renderSpecialistsSchedule();
    });
  }

  if (currentWeekBtn) {
    currentWeekBtn.addEventListener('click', () => {
      currentWeekOffset = 0;
      renderSpecialistsSchedule();
    });
  }
}

function switchTab(tabId) {
  currentTab = tabId;

  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    }
  });

  document.querySelectorAll('.drawer-nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    }
  });

  const tabLabels = {
    'timeline': 'Расписание на день',
    'specialists': 'Мастера и смены',
    'appointments': 'Журнал записей',
    'services': 'Прейскурант и услуги',
    'clients': 'База клиентов',
    'payroll': 'Расчёт зарплат'
  };
  const activeLabel = document.getElementById('mobileActiveTabLabel');
  if (activeLabel && tabLabels[tabId]) {
    activeLabel.textContent = tabLabels[tabId];
  }

  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.style.display = 'none';
  });

  const activePane = document.getElementById(`tabPane_${tabId}`);
  if (activePane) {
    activePane.style.display = 'block';
  }

  if (tabId === 'timeline') renderTimeline();
  if (tabId === 'specialists') renderSpecialistsSchedule();
  if (tabId === 'appointments') renderJournal();
  if (tabId === 'services') renderServicesAdmin();
  if (tabId === 'clients') renderClientsAdmin();
  if (tabId === 'payroll') renderPayrollAdmin();
}

function loadDashboard() {
  updateKPIs();
  switchTab(currentTab);

  if (window.noirData && typeof window.noirData.syncFromCloud === 'function') {
    window.noirData.syncFromCloud().then(() => {
      updateKPIs();
      if (currentTab === 'appointments') renderJournal();
      if (currentTab === 'timeline') renderTimeline();
    }).catch(e => console.warn("Background cloud sync error:", e));
  }

  const href = window.location.href;
  const search = window.location.search || (href.includes('?') ? href.substring(href.indexOf('?')) : '');
  const urlParams = new URLSearchParams(search);
  const targetTab = urlParams.get('tab');
  const openSpec = urlParams.get('openSpec');
  const addSpec = urlParams.get('addSpec');

  if (targetTab) {
    switchTab(targetTab);
  }

  if (openSpec) {
    switchTab('specialists');
    setTimeout(() => {
      openEditSpecialistModal(openSpec);
    }, 150);
  } else if (addSpec === '1') {
    switchTab('specialists');
    setTimeout(() => {
      openCreateSpecialistModal();
    }, 150);
  }

  const openService = urlParams.get('openService');
  const addService = urlParams.get('addService');
  if (openService) {
    switchTab('services');
    setTimeout(() => {
      openEditServiceModal(openService);
    }, 150);
  } else if (addService === '1') {
    switchTab('services');
    setTimeout(() => {
      openCreateServiceModal();
    }, 150);
  }

  const openClient = urlParams.get('openClient');
  const addClient = urlParams.get('addClient');
  if (openClient) {
    switchTab('clients');
    setTimeout(() => {
      openClientModal(openClient);
    }, 150);
  } else if (addClient === '1') {
    switchTab('clients');
    setTimeout(() => {
      openCreateClientModal();
    }, 150);
  }

  const expandPayroll = urlParams.get('expandPayroll');
  if (expandPayroll) {
    switchTab('payroll');
    setTimeout(() => {
      expandedPayrollMasters[expandPayroll === '1' ? 'spec-alex' : expandPayroll] = true;
      renderPayrollAdmin();
    }, 150);
  }

  const payrollPeriod = urlParams.get('payrollPeriod');
  if (payrollPeriod) {
    switchTab('payroll');
    setTimeout(() => {
      setPayrollPeriod(payrollPeriod);
    }, 150);
  }

  const payrollSubView = urlParams.get('payrollSubView');
  if (payrollSubView) {
    switchTab('payroll');
    setTimeout(() => {
      switchPayrollSubView(payrollSubView);
    }, 150);
  }

  const openPayout = urlParams.get('openPayout');
  if (openPayout) {
    switchTab('payroll');
    setTimeout(() => {
      const dateRange = getPayrollDateRange();
      openPayoutModal(openPayout === '1' ? 'spec-alex' : openPayout, dateRange.startDate, dateRange.endDate);
    }, 200);
  }

  const openPayrollHelp = urlParams.get('openPayrollHelp');
  if (openPayrollHelp || href.includes('openPayrollHelp') || href.includes('payroll-help') || window.location.hash.includes('help')) {
    switchTab('payroll');
    openPayrollHelpModal();
  }

  const openPinChange = urlParams.get('openPinChange');
  if (openPinChange || href.includes('openPinChange=1')) {
    openPinChangeModal();
  }
}


function updateKPIs() {
  const appointments = window.noirData.getAppointments();
  const today = new Date().toISOString().split('T')[0];

  // 1. Новые заявки (требуют подтверждения)
  const newRequests = appointments.filter(a => a.status === 'new').length;

  // 2. Записей на сегодня (подтверждённые и выполненные визиты на сегодня)
  const todayConfirmedApps = appointments.filter(a => a.date === today && (a.status === 'confirmed' || a.status === 'completed'));
  const todayCount = todayConfirmedApps.length;

  // 3. Выручка сегодня (сумма подтверждённых броней на сегодня)
  const todayConfirmedRevenue = todayConfirmedApps.reduce((acc, a) => acc + (a.price || 0), 0);

  // 4. В кассе / Оплачено (сумма по выполненным записям за сегодня)
  const todayCompletedApps = appointments.filter(a => a.date === today && a.status === 'completed');
  const todayCashRevenue = todayCompletedApps.reduce((acc, a) => acc + (a.price || 0), 0);

  const kpiNewCount = document.getElementById('kpiNewRequestsCount');
  const kpiTodayCount = document.getElementById('kpiTodayCount');
  const kpiTodayRev = document.getElementById('kpiTodayRevenue');
  const kpiCashRev = document.getElementById('kpiCashRevenue');

  if (kpiNewCount) kpiNewCount.textContent = newRequests;
  if (kpiTodayCount) kpiTodayCount.textContent = todayCount;
  if (kpiTodayRev) kpiTodayRev.textContent = window.noirData.formatMoney(todayConfirmedRevenue);
  if (kpiCashRev) kpiCashRev.textContent = window.noirData.formatMoney(todayCashRevenue);
}

// ==========================================
// 1. ТАЙМЛАЙН / СЕТКА РАСПИСАНИЯ НА ДЕНЬ
// ==========================================
function renderTimeline() {
  const tbody = document.getElementById('timelineTableBody');
  if (!tbody) return;

  const specialists = window.noirData.getSpecialists();
  const appointments = window.noirData.getAppointments().filter(a => a.date === currentDate);
  
  const START_HOUR = 10;
  const END_HOUR = 21; // 10:00 to 21:00 = 11 hours
  const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 4; // 44 slots of 15 min

  function timeToSlot(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || '0', 10);
    const mins = (h - START_HOUR) * 60 + m;
    return Math.max(0, Math.min(TOTAL_SLOTS - 1, Math.round(mins / 15)));
  }

  function slotToTime(slot) {
    const totalMin = START_HOUR * 60 + slot * 15;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  const d = new Date(currentDate);
  const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();

  let html = '';

  specialists.forEach(sp => {
    let isWorking = true;
    if (sp.customSchedule && sp.customSchedule[currentDate]) {
      isWorking = sp.customSchedule[currentDate].isWorking;
    } else if (sp.workDays) {
      isWorking = sp.workDays.includes(dayOfWeek);
    }

    // Filter appointments for this specialist
    const spApps = appointments.filter(a => {
      if (a.status === 'cancelled') return false;
      if (a.specialistId === sp.id) return true;
      if (a.specialistName && a.specialistName.includes(sp.name)) return true;
      return false;
    });

    // Sort by time
    spApps.sort((a, b) => timeToSlot(a.time) - timeToSlot(b.time));

    html += `
      <tr style="${!isWorking ? 'opacity: 0.65; background: rgba(0,0,0,0.12);' : ''}">
        <td class="timeline-master-col" style="border-right: 2px solid var(--border-medium); position: sticky; left: 0; background: var(--bg-surface); z-index: 2;">
          <div class="timeline-master-info">
            <div class="timeline-master-name" title="${sp.name}">${sp.name}</div>
            <div class="timeline-master-status ${isWorking ? 'status-working' : 'status-off'}">
              ${isWorking ? '● На смене' : '○ Выходной'}
            </div>
          </div>
        </td>
    `;

    let currentSlot = 0;
    while (currentSlot < TOTAL_SLOTS) {
      const app = spApps.find(a => timeToSlot(a.time) === currentSlot);

      if (app) {
        const dur = app.duration || 60;
        const spanSlots = Math.max(1, Math.round(dur / 15));
        const actualColspan = Math.min(spanSlots, TOTAL_SLOTS - currentSlot);

        const startMin = parseInt((app.time.split(':')[1] || '0'), 10);
        const startHour = parseInt(app.time.split(':')[0], 10);
        const totalEndMin = startHour * 60 + startMin + dur;
        const endHour = Math.floor(totalEndMin / 60);
        const endMin = totalEndMin % 60;
        const endTimeStr = String(endHour).padStart(2, '0') + ':' + String(endMin).padStart(2, '0');

        let statusClass = 'badge-status-confirmed';
        let statusLabel = 'Подтверждена';
        if (app.status === 'new') {
          statusClass = 'badge-status-new';
          statusLabel = 'Новая';
        } else if (app.status === 'completed') {
          statusClass = 'badge-status-completed';
          statusLabel = 'Выполнена';
        }

        html += `
          <td colspan="${actualColspan}" class="timeline-app-cell" style="vertical-align: middle;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 2px;">
              <span class="timeline-app-client" style="font-size: 12px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${app.clientName}
              </span>
              <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                <span class="badge-status ${statusClass}" style="font-size: 9px; padding: 1px 5px;">
                  ${statusLabel}
                </span>
                <button type="button" class="btn btn-secondary" onclick="openEditAppointmentModal('${app.id}')" style="padding: 1px 5px; font-size: 10px; line-height: 1.2; box-shadow: none;" title="Изменить запись">
                  ✏️
                </button>
              </div>
            </div>
            <div class="timeline-app-service" style="font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500;">
              ${app.serviceName}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 3px; font-size: 10px;">
              <span style="font-family: var(--font-mono); font-weight: 600; opacity: 0.85;">${app.time}–${endTimeStr} (${dur} мин)</span>
              <span class="timeline-app-price" style="font-weight: 800;">${window.noirData.formatMoney(app.price)}</span>
            </div>
          </td>
        `;
        currentSlot += actualColspan;
      } else {
        const slotTime = slotToTime(currentSlot);
        const isHourEnd = (currentSlot + 1) % 4 === 0;
        const borderClass = isHourEnd ? 'timeline-slot-hour-end' : 'timeline-slot-quarter';

        if (!isWorking) {
          html += `
            <td class="timeline-slot-cell ${borderClass}" style="opacity: 0.35; background: rgba(0,0,0,0.06); font-size: 10px; color: var(--text-dim);">
              ${currentSlot % 4 === 0 ? 'вых' : ''}
            </td>
          `;
        } else {
          html += `
            <td class="timeline-slot-cell slot-clickable ${borderClass}" onclick="openQuickBookingFor('${sp.id}', '${slotTime}')" title="Нажмите, чтобы записать на ${slotTime}">
              <span class="slot-add-icon">+</span>
            </td>
          `;
        }
        currentSlot++;
      }
    }

    html += `</tr>`;
  });

  // Строка нераспределённых записей (Любой свободный мастер)
  const unassignedApps = appointments.filter(a => {
    return a.status !== 'cancelled' && !specialists.some(sp => (a.specialistId === sp.id || (a.specialistName && a.specialistName.includes(sp.name))));
  });
  unassignedApps.sort((a, b) => timeToSlot(a.time) - timeToSlot(b.time));

  if (unassignedApps.length > 0) {
    html += `
      <tr style="background: rgba(245, 158, 11, 0.06); border-top: 2px dashed #F59E0B;">
        <td style="border-right: 2px solid var(--border-medium); padding: 10px 14px; width: 200px; min-width: 200px; position: sticky; left: 0; background: var(--bg-surface); z-index: 2;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: center; font-size: 15px; color: #F59E0B; font-weight: 800; flex-shrink: 0;">
              !
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #F59E0B; font-size: 13px; font-weight: 800;">Не назначен</span>
                <span class="badge-status badge-status-new" style="font-size: 9px; padding: 1px 5px;">Требует мастера</span>
              </div>
              <div style="font-size: 11px; color: var(--text-dim);">Любой свободный мастер</div>
            </div>
          </div>
        </td>
    `;

    let currentSlot = 0;
    while (currentSlot < TOTAL_SLOTS) {
      const app = unassignedApps.find(a => timeToSlot(a.time) === currentSlot);
      if (app) {
        const dur = app.duration || 60;
        const spanSlots = Math.max(1, Math.round(dur / 15));
        const actualColspan = Math.min(spanSlots, TOTAL_SLOTS - currentSlot);

        const startMin = parseInt((app.time.split(':')[1] || '0'), 10);
        const startHour = parseInt(app.time.split(':')[0], 10);
        const totalEndMin = startHour * 60 + startMin + dur;
        const endHour = Math.floor(totalEndMin / 60);
        const endMin = totalEndMin % 60;
        const endTimeStr = String(endHour).padStart(2, '0') + ':' + String(endMin).padStart(2, '0');

        html += `
          <td colspan="${actualColspan}" class="timeline-app-cell" style="background: rgba(245, 158, 11, 0.12) !important; border: 1px solid rgba(245, 158, 11, 0.35) !important; border-left: 4px solid #F59E0B !important; vertical-align: middle;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 2px;">
              <span style="font-size: 12px; font-weight: 800; color: var(--text-main);">${app.clientName}</span>
              <button type="button" class="btn btn-primary" onclick="openEditAppointmentModal('${app.id}')" style="padding: 1px 6px; font-size: 10px; line-height: 1.2;">
                ✏️ Назначить
              </button>
            </div>
            <div style="font-size: 11px; color: #FCD34D;">${app.serviceName}</div>
            <div style="font-size: 10px; color: #F59E0B; margin-top: 2px; font-family: var(--font-mono);">
              ${app.time}–${endTimeStr} (${dur} мин)
            </div>
          </td>
        `;
        currentSlot += actualColspan;
      } else {
        const isHourEnd = (currentSlot + 1) % 4 === 0;
        const borderClass = isHourEnd ? 'timeline-slot-hour-end' : 'timeline-slot-quarter';
        html += `<td class="timeline-slot-cell ${borderClass}" style="color: var(--text-dim); opacity: 0.18;">—</td>`;
        currentSlot++;
      }
    }

    html += `</tr>`;
  }

  tbody.innerHTML = html;
}

// ==========================================
// 2. РАСПИСАНИЕ И СМЕНЫ МАСТЕРОВ
// ==========================================
function getWeekDays(offset = 0) {
  const now = new Date();
  const currentDay = now.getDay() === 0 ? 7 : now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - currentDay + 1 + (offset * 7));

  const days = [];
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = `${dayNames[i]} ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    days.push({
      dateStr,
      dayNum: i + 1,
      label: dayLabel
    });
  }
  return days;
}

function renderSpecialistsSchedule() {
  const headerRow = document.getElementById('scheduleDaysHeader');
  const tbody = document.getElementById('specialistsScheduleTableBody');
  const weekLabel = document.getElementById('scheduleCurrentWeekLabel');
  if (!headerRow || !tbody) return;

  const week = getWeekDays(currentWeekOffset);
  const specialists = window.noirData.getSpecialists();

  const firstDay = week[0].label.split(' ')[1];
  const lastDay = week[6].label.split(' ')[1];
  if (weekLabel) {
    weekLabel.textContent = `${firstDay} — ${lastDay} (${currentWeekOffset === 0 ? 'Текущая' : currentWeekOffset > 0 ? '+' + currentWeekOffset + ' нед.' : currentWeekOffset + ' нед.'})`;
  }

  let headerHtml = `
    <th style="width: 220px;">Специалист</th>
    ${week.map(w => `<th style="text-align: center; font-size: 12px;">${w.label}</th>`).join('')}
    <th style="width: 110px; text-align: right;">Действия</th>
  `;
  headerRow.innerHTML = headerHtml;

  let bodyHtml = '';
  specialists.forEach(sp => {
    bodyHtml += `
      <tr>
        <td style="border-right: 1px solid var(--border-subtle); padding: 12px 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${sp.avatar}" alt="${sp.name}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-medium);">
            <div>
              <div style="font-weight: 800; color: var(--text-main); font-size: 14px;">${sp.name}</div>
              <div style="font-size: 11px; color: var(--accent-gold);">${sp.role.split(',')[0]}</div>
            </div>
          </div>
        </td>
    `;

    week.forEach(w => {
      let isWorking = true;
      let hours = "10:00 - 20:00";

      if (sp.customSchedule && sp.customSchedule[w.dateStr]) {
        isWorking = sp.customSchedule[w.dateStr].isWorking;
        hours = sp.customSchedule[w.dateStr].hours || hours;
      } else if (sp.workDays) {
        isWorking = sp.workDays.includes(w.dayNum);
      }

      bodyHtml += `
        <td style="text-align: center; padding: 10px 6px;">
          <button type="button" onclick="toggleSpecialistDay('${sp.id}', '${w.dateStr}')" style="width: 100%; padding: 8px 6px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; ${isWorking ? 'background: var(--color-success-bg); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.35);' : 'background: rgba(255,255,255,0.03); color: var(--text-dim); border: 1px solid var(--border-subtle);'}" title="Нажмите, чтобы переключить рабочий/выходной">
            ${isWorking ? '10:00–20:00' : 'Выходной'}
          </button>
        </td>
      `;
    });

    bodyHtml += `
        <td style="text-align: right; padding: 12px 14px;">
          <button type="button" class="btn btn-secondary" onclick="openEditSpecialistModal('${sp.id}')" style="padding: 4px 10px; font-size: 12px;">
            Профиль
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = bodyHtml;
}

window.toggleSpecialistDay = function(specId, dateStr) {
  const specialists = window.noirData.getSpecialists();
  const sp = specialists.find(s => s.id === specId);
  if (!sp) return;

  if (!sp.customSchedule) sp.customSchedule = {};

  const d = new Date(dateStr);
  const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
  const defaultWorking = (sp.workDays || [1,2,3,4,5,6,7]).includes(dayOfWeek);

  const currentStatus = sp.customSchedule[dateStr] 
    ? sp.customSchedule[dateStr].isWorking 
    : defaultWorking;

  sp.customSchedule[dateStr] = {
    isWorking: !currentStatus,
    hours: !currentStatus ? "10:00 - 20:00" : ""
  };

  window.noirData.saveSpecialists(specialists);
  renderSpecialistsSchedule();
  renderTimeline();
};

// ==========================================
// 3. ЖУРНАЛ ЗАПИСЕЙ (ТАБЛИЦА + ПОИСК/ФИЛЬТР)
// ==========================================
function renderJournal() {
  const tbody = document.getElementById('journalTableBody');
  if (!tbody) return;

  const appointments = window.noirData.getAppointments();
  const searchInput = document.getElementById('journalSearchInput');
  const statusFilter = document.getElementById('journalStatusFilter');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filter = statusFilter ? statusFilter.value : 'all';

  const filtered = appointments.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (query) {
      const matchName = a.clientName.toLowerCase().includes(query);
      const matchPhone = (a.phone || '').toLowerCase().includes(query);
      const matchService = (a.serviceName || '').toLowerCase().includes(query);
      const matchId = (a.id || '').toLowerCase().includes(query);
      return matchName || matchPhone || matchService || matchId;
    }
    return true;
  });

  let mobileContainer = document.getElementById('journalMobileCardsContainer');
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-dim);">
          Записи не найдены
        </td>
      </tr>
    `;
    if (mobileContainer) {
      mobileContainer.innerHTML = `
        <div style="padding: 30px; text-align: center; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
          Записи не найдены
        </div>
      `;
    }
    return;
  }

  let html = '';
  let mobileHtml = '';

  filtered.forEach(a => {
    let statusClass = 'badge-status-confirmed';
    let statusLabel = 'Подтверждена';
    if (a.status === 'new') { statusClass = 'badge-status-new'; statusLabel = 'Новая'; }
    if (a.status === 'completed') { statusClass = 'badge-status-completed'; statusLabel = 'Выполнена'; }
    if (a.status === 'cancelled') { statusClass = 'badge-status-cancelled'; statusLabel = 'Отменена'; }

    html += `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-gold);">${a.id}</td>
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${a.clientName}</div>
          <div style="font-size: 11px; color: var(--text-dim);">${a.phone || '—'}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${a.serviceName}</div>
          <div style="font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 2px;">
            <span>${a.duration || 60} мин</span>
            <span>•</span>
            <span style="font-weight: 700; color: ${a.discountPercent > 0 ? 'var(--accent-gold)' : 'inherit'};">${window.noirData.formatMoney(a.price)}</span>
            ${(a.discountPercent && a.discountPercent > 0) ? `<span style="background: rgba(229, 169, 60, 0.15); color: var(--accent-gold); border: 1px solid rgba(229, 169, 60, 0.35); padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 800;" title="Скидка лояльности гостя">-${a.discountPercent}%</span>` : ''}
          </div>
        </td>
        <td style="color: var(--text-sub);">${a.specialistName}</td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${a.date}</div>
          <div style="font-size: 11px; color: var(--accent-gold); font-family: var(--font-mono);">${a.time}</div>
        </td>
        <td>
          <select class="status-select ${statusClass}" onchange="handleQuickStatusChange('${a.id}', this.value)" title="Быстрая смена статуса записи">
            <option value="new" ${a.status === 'new' ? 'selected' : ''}>Новая</option>
            <option value="confirmed" ${a.status === 'confirmed' ? 'selected' : ''}>Подтверждена</option>
            <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Выполнена</option>
            <option value="cancelled" ${a.status === 'cancelled' ? 'selected' : ''}>Отменена</option>
          </select>
        </td>
        <td style="text-align: right;">
          <button type="button" class="btn btn-secondary" onclick="openEditAppointmentModal('${a.id}')" style="padding: 4px 10px; font-size: 12px;">
            Изменить
          </button>
        </td>
      </tr>
    `;

    // Mobile Accordion Card
    const cleanPhone = (a.phone || '').replace(/[^\d+]/g, '');
    const phoneDisplay = cleanPhone 
      ? `<a href="tel:${cleanPhone}" class="mobile-app-phone" onclick="event.stopPropagation();" style="color: inherit; text-decoration: none;">📞 ${a.phone}</a>` 
      : '<span style="color:var(--text-dim); font-size:11px;">Нет тел.</span>';

    mobileHtml += `
      <div class="mobile-app-card" onclick="toggleMobileAppCard('${a.id}')">
        <!-- Свёрнутая видимая часть -->
        <div class="mobile-app-summary">
          <div class="mobile-app-top">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="mobile-app-time">⏰ ${a.time}</span>
              <span class="mobile-app-date">${a.date}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge-status ${statusClass}" style="font-size: 10px; padding: 2px 7px;">${statusLabel}</span>
              <span class="mobile-app-chevron">▾</span>
            </div>
          </div>

          <div class="mobile-app-client-row">
            <span class="mobile-app-client-name">${a.clientName}</span>
            ${phoneDisplay}
          </div>

          <div class="mobile-app-service-row">
            <span class="mobile-app-service-name">${a.serviceName}</span>
            <span class="mobile-app-price">${window.noirData.formatMoney(a.price)}</span>
          </div>
        </div>

        <!-- Раскрывающийся блок деталей -->
        <div class="mobile-app-details" id="mobileAppDetails_${a.id}" style="display: none;">
          <div class="mobile-app-details-grid">
            <div class="mobile-detail-item">
              <span class="detail-label">Мастер:</span>
              <span class="detail-val">${a.specialistName || 'Не назначен'}</span>
            </div>
            <div class="mobile-detail-item">
              <span class="detail-label">Длительность:</span>
              <span class="detail-val">${a.duration || 60} мин</span>
            </div>
            <div class="mobile-detail-item">
              <span class="detail-label">Номер брони:</span>
              <span class="detail-val mono" style="color: var(--accent-gold);">${a.id}</span>
            </div>
            ${a.discountPercent > 0 ? `
              <div class="mobile-detail-item">
                <span class="detail-label">Скидка:</span>
                <span class="detail-val" style="color: var(--color-success); font-weight: 700;">-${a.discountPercent}%</span>
              </div>
            ` : ''}
          </div>

          ${a.comment ? `
            <div class="mobile-app-comment">
              💬 <em>${a.comment}</em>
            </div>
          ` : ''}

          <div class="mobile-app-actions-row">
            <div style="flex: 1;">
              <select class="status-select ${statusClass}" style="width: 100%; font-size: 12.5px; padding: 7px 10px;" onchange="handleQuickStatusChange('${a.id}', this.value)" onclick="event.stopPropagation();" title="Сменить статус">
                <option value="new" ${a.status === 'new' ? 'selected' : ''}>Новая</option>
                <option value="confirmed" ${a.status === 'confirmed' ? 'selected' : ''}>Подтверждена</option>
                <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Выполнена</option>
                <option value="cancelled" ${a.status === 'cancelled' ? 'selected' : ''}>Отменена</option>
              </select>
            </div>
            <button type="button" class="btn btn-primary" onclick="event.stopPropagation(); openEditAppointmentModal('${a.id}');" style="padding: 7px 14px; font-size: 12px; font-weight: 700;">
              ✏️ Изменить
            </button>
          </div>
        </div>
      </div>
    `;
  });

  tbody.innerHTML = html;

  if (mobileContainer) {
    mobileContainer.innerHTML = mobileHtml;
  }
}

window.toggleMobileAppCard = function(appId) {
  const details = document.getElementById(`mobileAppDetails_${appId}`);
  if (!details) return;
  const isHidden = details.style.display === 'none';
  details.style.display = isHidden ? 'block' : 'none';
  const card = details.closest('.mobile-app-card');
  if (card) {
    if (isHidden) card.classList.add('expanded');
    else card.classList.remove('expanded');
  }
};

window.toggleMobileAdminDrawer = function() {
  const drawer = document.getElementById('adminMobileDrawer');
  const overlay = document.getElementById('adminDrawerOverlay');
  if (!drawer || !overlay) return;
  const isActive = drawer.classList.contains('active');
  if (isActive) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  } else {
    drawer.classList.add('active');
    overlay.classList.add('active');
  }
};

window.closeMobileAdminDrawer = function() {
  const drawer = document.getElementById('adminMobileDrawer');
  const overlay = document.getElementById('adminDrawerOverlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
};

window.handleDrawerNavClick = function(tabId) {
  switchTab(tabId);
  closeMobileAdminDrawer();
};

window.handleQuickStatusChange = function(appId, newStatus) {
  window.noirData.updateAppointmentStatus(appId, newStatus);
  updateKPIs();
  renderJournal();
  if (currentTab === 'timeline') renderTimeline();
};

// ==========================================
// 4. ПРЕЙСКУРАНТ / УСЛУГИ АДМИН (АККОРДЕОНЫ КАТЕГОРИЙ)
// ==========================================
window.noirCategoryAccordionState = window.noirCategoryAccordionState || new Set();

function pluralizeServices(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'услуг';
  if (mod10 === 1) return 'услуга';
  if (mod10 >= 2 && mod10 <= 4) return 'услуги';
  return 'услуг';
}

window.toggleCategoryAccordion = function(catId) {
  if (window.noirCategoryAccordionState.has(catId)) {
    window.noirCategoryAccordionState.delete(catId);
  } else {
    window.noirCategoryAccordionState.add(catId);
  }
  renderServicesAdmin();
};

window.toggleAllCategoryAccordions = function() {
  const categories = window.noirData.getCategories();
  const allOpen = categories.length > 0 && categories.every(c => window.noirCategoryAccordionState.has(c.id));
  if (allOpen) {
    window.noirCategoryAccordionState.clear();
  } else {
    categories.forEach(c => window.noirCategoryAccordionState.add(c.id));
  }
  renderServicesAdmin();
};

function renderServicesAdmin() {
  const container = document.getElementById('adminServicesContainer');
  if (!container) return;

  const categories = window.noirData.getCategories();
  const services = window.noirData.getServices();

  // Если состояние ещё не инициализировано, раскрываем первую категорию по умолчанию
  if (window.noirCategoryAccordionState.size === 0 && categories.length > 0 && !window.noirCategoryAccordionTouched) {
    window.noirCategoryAccordionState.add(categories[0].id);
    window.noirCategoryAccordionTouched = true;
  }

  const allOpen = categories.length > 0 && categories.every(c => window.noirCategoryAccordionState.has(c.id));
  const toggleBtn = document.getElementById('toggleAllCategoriesBtn');
  if (toggleBtn) {
    toggleBtn.innerHTML = allOpen ? '📁 Свернуть все' : '📂 Развернуть все';
  }

  let html = '';
  categories.forEach((cat) => {
    const catServices = services.filter(s => s.categoryId === cat.id);
    const isOpen = window.noirCategoryAccordionState.has(cat.id);
    const popularCount = catServices.filter(s => s.popular).length;

    html += `
      <div class="service-category-accordion">
        <div class="service-accordion-header ${isOpen ? 'expanded' : ''}" onclick="toggleCategoryAccordion('${cat.id}')">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); margin: 0;">
                  ${cat.name}
                </h4>
                <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: var(--accent-primary-bg); color: var(--accent-primary); border: 1px solid var(--border-accent);">
                  ${catServices.length} ${pluralizeServices(catServices.length)}
                </span>
                ${popularCount > 0 ? `
                  <span style="font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 10px; background: rgba(201, 162, 77, 0.15); color: var(--accent-gold); border: 1px solid rgba(201, 162, 77, 0.35);">
                    ⭐ ${popularCount} хит
                  </span>
                ` : ''}
              </div>
              <div style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">
                ${cat.desc || 'Услуги данного направления'}
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button type="button" class="btn btn-secondary" onclick="event.stopPropagation(); openCreateServiceModal('${cat.id}')" style="padding: 5px 12px; font-size: 12px; font-weight: 700; border-radius: var(--radius-sm);">
              + Добавить услугу
            </button>
            <span class="service-accordion-chevron">▼</span>
          </div>
        </div>

        <div class="service-accordion-body" style="display: ${isOpen ? 'block' : 'none'};">
          <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    if (catServices.length === 0) {
      html += `
        <div style="padding: 20px; text-align: center; color: var(--text-dim); font-size: 13px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle);">
          В этом направлении пока нет добавленных услуг.<br>
          <button type="button" class="btn btn-primary" onclick="openCreateServiceModal('${cat.id}')" style="margin-top: 10px; padding: 6px 14px; font-size: 12px; font-weight: 700;">
            + Добавить первую услугу
          </button>
        </div>
      `;
    } else {
      catServices.forEach(s => {
        const popularBadge = s.popular 
          ? `<span style="background: rgba(201, 162, 77, 0.15); color: var(--accent-gold); border: 1px solid rgba(201, 162, 77, 0.3); border-radius: 12px; padding: 2px 8px; font-size: 10px; margin-left: 6px; font-weight: 800; text-transform: uppercase;">Хит</span>` 
          : '';
        const includesCount = (s.includes && Array.isArray(s.includes)) ? s.includes.length : 0;

        html += `
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); gap: 12px; flex-wrap: wrap;">
            <div style="max-width: 70%; min-width: 260px;">
              <div style="font-weight: 700; color: var(--text-main); font-size: 14px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                ${s.name} ${popularBadge}
              </div>
              <div style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">
                ${s.duration} мин • ${s.shortDesc || 'Без краткого описания'}
              </div>
              ${includesCount > 0 ? `
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
                  📋 Протокол: ${includesCount} ${includesCount === 1 ? 'пункт' : (includesCount < 5 ? 'пункта' : 'пунктов')}
                </div>
              ` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 14px; margin-left: auto;">
              <span style="font-weight: 800; color: var(--accent-gold); font-size: 14px; white-space: nowrap;">
                ${window.noirData.formatMoney(s.price)}
              </span>
              <button type="button" class="btn btn-secondary" onclick="openEditServiceModal('${s.id}')" style="padding: 5px 12px; font-size: 12px; white-space: nowrap; font-weight: 700;">
                Редактировать
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `</div></div></div>`;
  });

  container.innerHTML = html;
}

// ==========================================
// 5. РЕДАКТИРОВАНИЕ ЗАПИСИ (СМЕНА МАСТЕРА, ВРЕМЕНИ, УСЛУГ)
// ==========================================

// Округление минут времени до шага в 15 минут (:00, :15, :30, :45)
window.roundTimeInput = function(input) {
  if (!input || !input.value) return;
  const parts = input.value.trim().split(':');
  if (parts.length < 2) return;

  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (isNaN(h)) h = 10;
  if (isNaN(m)) m = 0;

  let roundedM = Math.round(m / 15) * 15;
  if (roundedM >= 60) {
    h = (h + 1) % 24;
    roundedM = 0;
  }
  input.value = String(h).padStart(2, '0') + ':' + String(roundedM).padStart(2, '0');
};

window.setQuickTimeMinute = function(min) {
  const inp = document.getElementById('adminBookingTime');
  if (!inp) return;
  const currentVal = inp.value || '12:00';
  const h = (currentVal.split(':')[0] || '12').padStart(2, '0');
  inp.value = h + ':' + String(min).padStart(2, '0');
};

window.setEditTimeMinute = function(min) {
  const inp = document.getElementById('editAppTime');
  if (!inp) return;
  const currentVal = inp.value || '12:00';
  const h = (currentVal.split(':')[0] || '12').padStart(2, '0');
  inp.value = h + ':' + String(min).padStart(2, '0');
};

// Проверка пересечения времени записей для мастера
window.checkAppointmentTimeConflict = function({ id, specialistId, date, time, duration }) {
  if (!date || !time) return { hasConflict: false };

  const [newH, newM] = time.split(':').map(v => parseInt(v, 10));
  const newStartMin = newH * 60 + (newM || 0);
  const newEndMin = newStartMin + (duration || 60);

  const appointments = window.noirData.getAppointments();
  const specialists = window.noirData.getSpecialists();
  const targetSpecialist = specialists.find(s => s.id === specialistId);

  for (const a of appointments) {
    if (a.status === 'cancelled') continue;
    if (id && String(a.id) === String(id)) continue;
    if (a.date !== date) continue;

    // Сверяем мастера (только если выбран конкретный специалист)
    if (specialistId && specialistId !== 'any') {
      const matchId = (a.specialistId === specialistId);
      const matchName = targetSpecialist && a.specialistName && a.specialistName.includes(targetSpecialist.name);
      if (!matchId && !matchName) continue;
    } else {
      continue;
    }

    const [aH, aM] = (a.time || '10:00').split(':').map(v => parseInt(v, 10));
    const aStartMin = aH * 60 + (aM || 0);
    const aEndMin = aStartMin + (a.duration || 60);

    // Математическое условие пересечения полуинтервалов: [newStart, newEnd) пересекается с [aStart, aEnd)
    if (newStartMin < aEndMin && newEndMin > aStartMin) {
      const aEndHour = Math.floor(aEndMin / 60);
      const aEndMinute = aEndMin % 60;
      const aEndTimeStr = String(aEndHour).padStart(2, '0') + ':' + String(aEndMinute).padStart(2, '0');

      return {
        hasConflict: true,
        conflictApp: a,
        conflictStart: a.time,
        conflictEnd: aEndTimeStr,
        specialistName: a.specialistName || (targetSpecialist ? targetSpecialist.name : 'Мастер'),
        clientName: a.clientName || 'Гость',
        serviceName: a.serviceName || 'Услуга'
      };
    }
  }

  return { hasConflict: false };
};

let currentEditingAppItems = [];

window.openEditAppointmentModal = function(appId) {
  const modal = document.getElementById('adminEditAppointmentModal');
  if (!modal) return;

  const appointments = window.noirData.getAppointments();
  const app = appointments.find(a => a.id === appId);
  if (!app) return;

  const conflictAlert = document.getElementById('editAppConflictAlert');
  if (conflictAlert) conflictAlert.style.display = 'none';

  document.getElementById('editAppModalTitle').textContent = `Изменить запись #${app.id}`;
  document.getElementById('editAppSubtitle').textContent = `Клиент: ${app.clientName} • ${app.date} в ${app.time}`;
  document.getElementById('editAppId').value = app.id;
  document.getElementById('editAppClientName').value = app.clientName || '';
  document.getElementById('editAppClientPhone').value = app.phone || '';
  document.getElementById('editAppDate').value = app.date;
  const editTimeInp = document.getElementById('editAppTime');
  if (editTimeInp) {
    editTimeInp.value = app.time;
    window.roundTimeInput(editTimeInp);
  }
  document.getElementById('editAppStatus').value = app.status || 'confirmed';
  document.getElementById('editAppComment').value = app.comment || '';

  // Динамический фильтр доступных услуг для выбранного мастера
  const updateEditAppAddServiceOptions = function(specialistId) {
    const addServiceSel = document.getElementById('editAppAddServiceSelect');
    if (!addServiceSel) return;
    const allServices = window.noirData.getServices();
    const allSpecialists = window.noirData.getSpecialists();

    let filtered = allServices;
    if (specialistId && specialistId !== 'any') {
      const sp = allSpecialists.find(s => s.id === specialistId);
      if (sp && Array.isArray(sp.categories) && sp.categories.length > 0) {
        filtered = allServices.filter(s => sp.categories.includes(s.categoryId));
      }
    }

    addServiceSel.innerHTML = `
      <option value="">-- Выберите услугу для добавления в чек --</option>
      ${filtered.map(s => `<option value="${s.id}">${s.name} (${window.noirData.formatMoney(s.price)} • ${s.duration} мин)</option>`).join('')}
    `;
  };

  // Селектор мастеров
  const specSel = document.getElementById('editAppSpecialist');
  if (specSel) {
    const specialists = window.noirData.getSpecialists();
    specSel.innerHTML = `
      <option value="any">Любой свободный мастер</option>
      ${specialists.map(sp => `<option value="${sp.id}" ${sp.id === app.specialistId ? 'selected' : ''}>${sp.name} (${sp.role.split(',')[0]})</option>`).join('')}
    `;
    specSel.onchange = function() {
      updateEditAppAddServiceOptions(specSel.value);
    };
  }

  // Селектор добавления доп. услуги с первичной фильтрацией
  updateEditAppAddServiceOptions(app.specialistId || 'any');

  // Инициализация списка услуг
  if (app.items && Array.isArray(app.items) && app.items.length > 0) {
    currentEditingAppItems = JSON.parse(JSON.stringify(app.items));
  } else {
    currentEditingAppItems = [
      {
        serviceId: app.serviceId || '',
        name: app.serviceName || 'Услуга студии',
        price: app.price || 0,
        duration: app.duration || 60
      }
    ];
  }

  renderEditingAppItems();
  modal.classList.add('active');
};

function renderEditingAppItems() {
  const container = document.getElementById('editAppServicesList');
  const totalPriceEl = document.getElementById('editAppTotalPriceDisplay');
  const totalDurEl = document.getElementById('editAppTotalDurationDisplay');
  if (!container) return;

  let totalP = 0;
  let totalD = 0;

  let html = '';
  currentEditingAppItems.forEach((item, idx) => {
    totalP += (item.price || 0);
    totalD += (item.duration || 60);

    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 6px;">
        <div>
          <span style="font-weight: 700; color: var(--text-main); font-size: 13px;">${item.name}</span>
          <span style="font-size: 11px; color: var(--text-dim); margin-left: 6px;">⏱️ ${item.duration} мин</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-weight: 800; color: var(--accent-gold); font-size: 13px;">${window.noirData.formatMoney(item.price)}</span>
          ${currentEditingAppItems.length > 1 ? `
            <button type="button" onclick="removeEditingAppItem(${idx})" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: var(--color-danger); border-radius: 4px; padding: 2px 6px; font-size: 11px; cursor: pointer;">
              ✕
            </button>
          ` : ''}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (totalPriceEl) totalPriceEl.textContent = window.noirData.formatMoney(totalP);
  if (totalDurEl) totalDurEl.textContent = `${totalD} мин`;
}

window.addServiceToEditingApp = function() {
  const addServiceSel = document.getElementById('editAppAddServiceSelect');
  if (!addServiceSel || !addServiceSel.value) return;

  const srvId = addServiceSel.value;
  const srv = window.noirData.getServices().find(s => s.id === srvId);
  if (!srv) return;

  currentEditingAppItems.push({
    serviceId: srv.id,
    name: srv.name,
    price: srv.price,
    duration: srv.duration || 60
  });

  addServiceSel.value = "";
  renderEditingAppItems();
};

window.removeEditingAppItem = function(idx) {
  if (currentEditingAppItems.length > 1) {
    currentEditingAppItems.splice(idx, 1);
    renderEditingAppItems();
  }
};

function setupModals() {
  // Закрытие модальных окон
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Сохранение изменений в модалке записи
  const saveAppForm = document.getElementById('adminEditAppForm');
  if (saveAppForm) {
    saveAppForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editAppId').value;
      const clientName = document.getElementById('editAppClientName').value.trim();
      const phone = document.getElementById('editAppClientPhone').value.trim();
      const date = document.getElementById('editAppDate').value;
      
      const timeInp = document.getElementById('editAppTime');
      if (timeInp) window.roundTimeInput(timeInp);
      const time = timeInp ? timeInp.value : '';

      const specialistId = document.getElementById('editAppSpecialist').value;
      const status = document.getElementById('editAppStatus').value;
      const comment = document.getElementById('editAppComment').value.trim();

      let totalP = 0;
      let totalD = 0;
      const serviceNames = [];

      currentEditingAppItems.forEach(item => {
        totalP += (item.price || 0);
        totalD += (item.duration || 60);
        serviceNames.push(item.name);
      });

      // ПРОВЕРКА КОНФЛИКТА ПЕРЕСЕЧЕНИЯ ВРЕМЕНИ ДЛЯ МАСТЕРА
      const conflict = window.checkAppointmentTimeConflict({
        id: id,
        specialistId: specialistId,
        date: date,
        time: time,
        duration: totalD || 60
      });

      const errBox = document.getElementById('editAppConflictAlert');
      if (conflict.hasConflict) {
        const errMsg = `Это время уже занято, выберите другое.\n\nМастер ${conflict.specialistName} уже занят(а) с ${conflict.conflictStart} до ${conflict.conflictEnd} (${conflict.clientName} — ${conflict.serviceName}).`;
        if (errBox) {
          errBox.textContent = `⚠️ Это время уже занято, выберите другое! Мастер ${conflict.specialistName} занят(а) с ${conflict.conflictStart} до ${conflict.conflictEnd} (${conflict.clientName} — ${conflict.serviceName}).`;
          errBox.style.display = 'block';
        }
        alert(errMsg);
        return;
      } else if (errBox) {
        errBox.style.display = 'none';
      }

      let specialistName = "Любой свободный мастер";
      if (specialistId !== 'any') {
        const sp = window.noirData.getSpecialists().find(s => s.id === specialistId);
        if (sp) specialistName = sp.name;
      }

      window.noirData.updateAppointment(id, {
        clientName,
        phone,
        date,
        time,
        specialistId,
        specialistName,
        status,
        comment,
        serviceId: currentEditingAppItems[0] ? currentEditingAppItems[0].serviceId : '',
        serviceName: serviceNames.join(' + '),
        price: totalP,
        duration: totalD,
        items: currentEditingAppItems
      });

      document.getElementById('adminEditAppointmentModal').classList.remove('active');
      updateKPIs();
      if (currentTab === 'timeline') renderTimeline();
      if (currentTab === 'appointments') renderJournal();
    });
  }

  // Быстрая запись из свободной ячейки
  const quickForm = document.getElementById('adminQuickBookingForm');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const srvId = document.getElementById('adminServiceSelect').value;
      const specId = document.getElementById('adminSpecialistSelect').value;

      if (!srvId) {
        alert("Пожалуйста, выберите услугу из списка!");
        return;
      }

      const date = document.getElementById('adminBookingDate').value;
      
      const timeInp = document.getElementById('adminBookingTime');
      if (timeInp) window.roundTimeInput(timeInp);
      const time = timeInp ? timeInp.value : '';

      const clientName = document.getElementById('adminClientName').value.trim();
      const phone = document.getElementById('adminClientPhone').value.trim();

      const srv = window.noirData.getServices().find(s => s.id === srvId);
      const sp = window.noirData.getSpecialists().find(s => s.id === specId);
      const dur = srv ? srv.duration : 60;

      // ПРОВЕРКА КОНФЛИКТА ПЕРЕСЕЧЕНИЯ ВРЕМЕНИ ДЛЯ МАСТЕРА
      const conflict = window.checkAppointmentTimeConflict({
        specialistId: specId,
        date: date,
        time: time,
        duration: dur
      });

      const errBox = document.getElementById('quickBookingConflictAlert');
      if (conflict.hasConflict) {
        const errMsg = `Это время уже занято, выберите другое.\n\nМастер ${conflict.specialistName} уже занят(а) с ${conflict.conflictStart} до ${conflict.conflictEnd} (${conflict.clientName} — ${conflict.serviceName}).`;
        if (errBox) {
          errBox.textContent = `⚠️ Это время уже занято, выберите другое! Мастер ${conflict.specialistName} занят(а) с ${conflict.conflictStart} до ${conflict.conflictEnd} (${conflict.clientName} — ${conflict.serviceName}).`;
          errBox.style.display = 'block';
        }
        alert(errMsg);
        return;
      } else if (errBox) {
        errBox.style.display = 'none';
      }

      const client = window.noirData.findClientByContact(phone) || window.noirData.getClientByPhone(phone);
      const discount = (client && client.discountPercent) ? client.discountPercent : 0;
      const basePrice = srv ? srv.price : 0;
      const finalPrice = discount > 0 ? Math.round(basePrice * (100 - discount) / 100) : basePrice;

      const statusSelect = document.getElementById('adminBookingStatus');
      const bookingStatus = statusSelect ? statusSelect.value : "confirmed";

      const createdRecord = window.noirData.addAppointment({
        clientName,
        phone,
        serviceId: srvId,
        serviceName: srv ? srv.name : "Услуга",
        specialistId: specId,
        specialistName: sp ? sp.name : "Любой свободный мастер",
        date,
        time,
        duration: dur,
        price: finalPrice,
        discountPercent: discount,
        status: bookingStatus,
        comment: discount > 0 ? `Применена скидка гостя ${discount}% (базовая цена ${window.noirData.formatMoney(basePrice)})` : ""
      });

      // Мгновенная отправка созданной из CRM записи в Telegram-группу
      try {
        const orderSummaryText = `💇 Услуга: ${srv ? srv.name : "Услуга"}
👤 Мастер: ${sp ? sp.name : "Мастер"}
📅 Дата и время: ${date} в ${time} (${dur} мин)
${discount > 0 ? `⭐ Скидка лояльности: ${discount}%\n` : ''}<i>(Запись создана администратором в CRM)</i>`;

        fetch("https://synaptiq-crm-bot.dandeliondnd-vn.workers.dev/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_slug: "noir-atelier",
            order_type: "salon_booking",
            client_name: clientName,
            client_phone: phone,
            order_title: orderSummaryText,
            total_amount: finalPrice,
            currency: "VND",
            appointment_id: createdRecord.id,
            service_id: srvId || "",
            service_name: srv ? srv.name : "Услуга",
            specialist_id: specId || "",
            specialist_name: sp ? sp.name : "Любой свободный мастер",
            app_date: date,
            app_time: time,
            duration: dur,
            discount_percent: discount || 0,
            comment: createdRecord.comment || ""
          })
        }).then(r => r.json()).then(resData => {
          if (resData && resData.order_id) {
            window.noirData.updateAppointment(createdRecord.id, {
              order_id: resData.order_id,
              tg_chat_id: resData.tg_chat_id,
              tg_message_id: resData.tg_message_id
            });
          }
        }).catch(e => console.warn("CRM bot dispatch error:", e));
      } catch (dispatchErr) {
        console.warn("CRM dispatch error:", dispatchErr);
      }

      document.getElementById('adminQuickBookingModal').classList.remove('active');
      quickForm.reset();
      updateKPIs();
      renderTimeline();
      if (typeof renderJournal === 'function') renderJournal();
      if (typeof renderAppointmentsList === 'function') renderAppointmentsList();
    });
  }

  // Динамическое отображение скидки в быстрой записи
  function updateQuickBookingDiscountDisplay() {
    const quickDiscountBox = document.getElementById('quickBookingDiscountInfo');
    if (!quickDiscountBox) return;
    const phoneInp = document.getElementById('adminClientPhone');
    const phone = phoneInp ? phoneInp.value.trim() : '';
    const client = window.noirData.findClientByContact(phone) || window.noirData.getClientByPhone(phone);
    const serviceSel = document.getElementById('adminServiceSelect');
    const srvId = serviceSel ? serviceSel.value : '';
    const srv = window.noirData.getServices().find(s => s.id === srvId);
    const basePrice = srv ? srv.price : 0;

    if (client && client.discountPercent > 0) {
      const discount = client.discountPercent;
      const saved = Math.round(basePrice * discount / 100);
      const finalP = basePrice - saved;
      quickDiscountBox.style.display = 'block';
      quickDiscountBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <div>
            <span>⭐ Персональная скидка гостя (${client.name}): <strong>${discount}%</strong></span>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Экономия: -${window.noirData.formatMoney(saved)}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-size: 14px; color: var(--accent-gold);">${window.noirData.formatMoney(finalP)}</div>
            <div style="text-decoration: line-through; opacity: 0.6; font-size: 11px;">${window.noirData.formatMoney(basePrice)}</div>
          </div>
        </div>
      `;
    } else {
      quickDiscountBox.style.display = 'none';
      quickDiscountBox.innerHTML = '';
    }
  }
  window.updateQuickBookingDiscountDisplay = updateQuickBookingDiscountDisplay;

  const adminClientPhoneInp = document.getElementById('adminClientPhone');
  const adminServiceSel = document.getElementById('adminServiceSelect');

  if (adminClientPhoneInp) {
    adminClientPhoneInp.addEventListener('input', () => {
      const phone = adminClientPhoneInp.value.trim();
      const client = window.noirData.findClientByContact(phone);
      if (client) {
        const nameInp = document.getElementById('adminClientName');
        if (nameInp && (!nameInp.value || nameInp.value === 'Гость')) {
          nameInp.value = client.name;
        }
      }
      updateQuickBookingDiscountDisplay();
    });
  }

  if (adminServiceSel) {
    adminServiceSel.addEventListener('change', () => {
      if (window.noirQuickFilter) {
        window.noirQuickFilter.onServiceChange();
      } else {
        updateQuickBookingDiscountDisplay();
      }
    });
  }

  const adminSpecialistSel = document.getElementById('adminSpecialistSelect');
  if (adminSpecialistSel) {
    adminSpecialistSel.addEventListener('change', () => {
      if (window.noirQuickFilter) {
        window.noirQuickFilter.onSpecialistChange();
      }
    });
  }

  // Поиск в журнале
  const journalSearch = document.getElementById('journalSearchInput');
  if (journalSearch) {
    journalSearch.addEventListener('input', () => {
      renderJournal();
    });
  }

  const journalStatus = document.getElementById('journalStatusFilter');
  if (journalStatus) {
    journalStatus.addEventListener('change', () => {
      renderJournal();
    });
  }

  // Редактирование и добавление мастера
  const specForm = document.getElementById('adminSpecialistForm');
  if (specForm) {
    specForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('specEditId').value;
      const name = document.getElementById('specEditName').value.trim();
      const role = document.getElementById('specEditRole').value.trim();
      const exp = document.getElementById('specEditExperience').value.trim();
      const avatar = document.getElementById('specEditAvatar').value.trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
      const commissionPercent = parseInt(document.getElementById('specEditCommission').value, 10) || 40;

      // Собираем категории
      const selectedCats = [];
      document.querySelectorAll('#specCategoryCheckboxes input:checked').forEach(ch => {
        selectedCats.push(ch.value);
      });

      // Собираем дни недели
      const selectedWorkDays = [];
      document.querySelectorAll('#specWorkDaysCheckboxes input:checked').forEach(ch => {
        selectedWorkDays.push(parseInt(ch.value, 10));
      });

      const finalCategories = selectedCats.length > 0 ? selectedCats : ["men-style", "women-style"];
      const finalWorkDays = selectedWorkDays.length > 0 ? selectedWorkDays : [1, 2, 3, 4, 5, 6, 7];

      if (id) {
        // Редактирование существующего мастера
        window.noirData.updateSpecialist(id, {
          name,
          role,
          experience: exp,
          avatar,
          categories: finalCategories,
          workDays: finalWorkDays,
          commissionPercent
        });
      } else {
        // Создание нового мастера
        window.noirData.addSpecialist({
          name,
          role,
          experience: exp,
          avatar,
          categories: finalCategories,
          workDays: finalWorkDays,
          commissionPercent
        });
      }

      const specModal = document.getElementById('adminSpecialistModal');
      if (specModal) specModal.classList.remove('active');
      updateKPIs();
      renderSpecialistsSchedule();
      renderTimeline();
      if (currentTab === 'payroll') renderPayrollAdmin();
    });
  }

  // Редактирование и создание услуги
  const serviceForm = document.getElementById('adminServiceForm');
  if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('serviceEditId').value;
      const categoryId = document.getElementById('serviceEditCategory').value;
      const popular = document.getElementById('serviceEditPopular').checked;
      const name = document.getElementById('serviceEditName').value.trim();
      const price = parseInt(document.getElementById('serviceEditPrice').value, 10) || 0;
      const duration = parseInt(document.getElementById('serviceEditDuration').value, 10) || 60;
      const shortDesc = document.getElementById('serviceEditShortDesc').value.trim();
      const fullDesc = document.getElementById('serviceEditFullDesc').value.trim();

      const includes = [];
      document.querySelectorAll('#serviceEditIncludesList .service-include-input').forEach(inp => {
        const val = inp.value.trim();
        if (val) includes.push(val);
      });

      const servicePayload = {
        categoryId,
        name,
        price,
        duration,
        popular,
        shortDesc,
        fullDesc: fullDesc || shortDesc,
        includes: includes.length > 0 ? includes : [
          "Консультация стилиста NOIR",
          "Основная процедура с авторской адаптацией",
          "Финишный стайлинг и рекомендации"
        ]
      };

      if (id) {
        window.noirData.updateService(id, servicePayload);
      } else {
        window.noirData.addService(servicePayload);
      }

      const modal = document.getElementById('adminServiceModal');
      if (modal) modal.classList.remove('active');
      renderServicesAdmin();
    });
  }

  // Поиск и фильтрация в базе клиентов
  const clientSearch = document.getElementById('clientSearchInput');
  if (clientSearch) {
    clientSearch.addEventListener('input', () => {
      renderClientsAdmin();
    });
  }

  const clientCatFilter = document.getElementById('clientCategoryFilter');
  if (clientCatFilter) {
    clientCatFilter.addEventListener('change', () => {
      renderClientsAdmin();
    });
  }

  const clientSort = document.getElementById('clientSortSelect');
  if (clientSort) {
    clientSort.addEventListener('change', () => {
      renderClientsAdmin();
    });
  }

  // Создание нового гостя вручную
  const clientCreateForm = document.getElementById('adminClientCreateForm');
  if (clientCreateForm) {
    clientCreateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newClientName').value.trim();
      const phone = document.getElementById('newClientPhone').value.trim();
      const telegram = document.getElementById('newClientTelegram').value.trim();
      const category = document.getElementById('newClientCategory').value;
      const discountPercent = parseInt(document.getElementById('newClientDiscount').value, 10) || 0;
      const notes = document.getElementById('newClientNotes').value.trim();

      const newClient = window.noirData.addClient({
        name,
        phone,
        telegram,
        category,
        discountPercent,
        notes,
        tags: [category === 'vip' ? 'VIP' : (category === 'regular' ? 'Постоянный' : 'Новый гость')]
      });

      const modal = document.getElementById('adminClientCreateModal');
      if (modal) modal.classList.remove('active');
      renderClientsAdmin();
      if (newClient) {
        openClientModal(newClient.id);
      }
    });
  }

  // Оформление кассовой выплаты мастеру
  const payoutForm = document.getElementById('adminPayoutConfirmForm');
  if (payoutForm) {
    payoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const specId = document.getElementById('payoutFormSpecId').value;
      const startDate = document.getElementById('payoutFormStartDate').value;
      const endDate = document.getElementById('payoutFormEndDate').value;
      const amount = parseInt(document.getElementById('payoutFormAmount').value, 10) || 0;
      const grossRevenue = parseInt(document.getElementById('payoutFormGross').value, 10) || 0;
      const salonMargin = parseInt(document.getElementById('payoutFormMargin').value, 10) || 0;
      const servicesCount = parseInt(document.getElementById('payoutFormCount').value, 10) || 0;
      const paymentMethod = document.getElementById('payoutMethodSelect').value;
      const issuedBy = document.getElementById('payoutIssuedByInput').value.trim() || 'Владелец NOIR Atelier';
      const notes = document.getElementById('payoutNotesInput').value.trim();
      const autoPrint = document.getElementById('payoutAutoPrintCheckbox').checked;

      // Детализация услуг мастера за этот период
      const payrollData = window.noirData.calculatePayroll({
        startDate,
        endDate,
        includeConfirmed: payrollIncludeConfirmed
      });
      const sp = payrollData.specialists.find(s => s.specialistId === specId);
      const items = sp ? sp.items : [];
      const periodLabel = getPayrollDateRange().label;

      const newOrder = window.noirData.createPayoutOrder({
        specialistId: specId,
        startDate,
        endDate,
        periodLabel,
        amount,
        grossRevenue,
        salonMargin,
        servicesCount,
        paymentMethod,
        notes,
        issuedBy,
        items
      });

      const modal = document.getElementById('adminPayoutConfirmModal');
      if (modal) modal.classList.remove('active');

      renderPayrollAdmin();
      if (typeof renderPayoutLedger === 'function') {
        renderPayoutLedger();
      }

      if (autoPrint && newOrder) {
        setTimeout(() => {
          printSpecialistPayslip(newOrder.id);
        }, 200);
      }
    });
  }
}

// ==========================================================================
// СВЯЗАННЫЙ ДВУНАПРАВЛЕННЫЙ ФИЛЬТР: МАСТЕР <-> УСЛУГА (Quick Booking)
// ==========================================================================
window.noirQuickFilter = {
  isUpdating: false,

  renderServices(specialistId, targetServiceId = null) {
    const serviceSel = document.getElementById('adminServiceSelect');
    if (!serviceSel) return;

    const allServices = window.noirData.getServices();
    const allSpecialists = window.noirData.getSpecialists();
    const currentSrvId = targetServiceId !== null ? targetServiceId : serviceSel.value;

    let filtered = allServices;
    let placeholder = '-- Выберите услугу из каталога --';

    if (specialistId && specialistId !== 'any') {
      const sp = allSpecialists.find(s => s.id === specialistId);
      if (sp) {
        placeholder = `-- Выберите услугу (${sp.name}) --`;
        if (Array.isArray(sp.categories) && sp.categories.length > 0) {
          filtered = allServices.filter(s => sp.categories.includes(s.categoryId));
        }
      }
    }

    let html = `<option value="">${placeholder}</option>`;
    filtered.forEach(s => {
      html += `<option value="${s.id}">${s.name} (${window.noirData.formatMoney(s.price)} • ${s.duration} мин)</option>`;
    });

    serviceSel.innerHTML = html;

    // Сохраняем выбранную услугу, только если она действительно была выбрана и входит в список
    const stillValid = currentSrvId && filtered.some(s => s.id === currentSrvId);
    if (stillValid) {
      serviceSel.value = currentSrvId;
    } else {
      // Изначально услуга НЕ предвыбирается, чтобы список мастеров оставался полным!
      serviceSel.value = '';
    }
  },

  renderSpecialists(serviceId, targetSpecId = null) {
    const specSel = document.getElementById('adminSpecialistSelect');
    if (!specSel) return;

    const allServices = window.noirData.getServices();
    const allSpecialists = window.noirData.getSpecialists();
    const currentSpecId = targetSpecId !== null ? targetSpecId : specSel.value;

    let filtered = allSpecialists;
    if (serviceId) {
      const srv = allServices.find(s => s.id === serviceId);
      if (srv && srv.categoryId) {
        filtered = allSpecialists.filter(sp => {
          if (!sp.categories || sp.categories.length === 0) return true;
          return sp.categories.includes(srv.categoryId);
        });
      }
    }

    let html = '<option value="any">Любой свободный мастер</option>';
    filtered.forEach(sp => {
      const roleShort = (sp.role || '').split(',')[0];
      html += `<option value="${sp.id}">${sp.name} (${roleShort})</option>`;
    });

    specSel.innerHTML = html;

    // Если ранее выбранный мастер есть в списке подходящих — сохраняем его
    const stillValid = (currentSpecId === 'any') || (currentSpecId && filtered.some(sp => sp.id === currentSpecId));
    if (stillValid) {
      specSel.value = currentSpecId;
    } else {
      specSel.value = 'any';
    }
  },

  onSpecialistChange() {
    if (this.isUpdating) return;
    this.isUpdating = true;
    try {
      const serviceSel = document.getElementById('adminServiceSelect');
      const specSel = document.getElementById('adminSpecialistSelect');
      const specId = specSel ? specSel.value : 'any';
      const currentSrv = serviceSel ? serviceSel.value : '';

      // Перестраиваем список услуг под выбранного мастера
      this.renderServices(specId, currentSrv);

      if (typeof window.updateQuickBookingDiscountDisplay === 'function') {
        window.updateQuickBookingDiscountDisplay();
      }
    } finally {
      this.isUpdating = false;
    }
  },

  onServiceChange() {
    if (this.isUpdating) return;
    this.isUpdating = true;
    try {
      const serviceSel = document.getElementById('adminServiceSelect');
      const specSel = document.getElementById('adminSpecialistSelect');
      const srvId = serviceSel ? serviceSel.value : '';
      const currentSpec = specSel ? specSel.value : 'any';

      // Перестраиваем список мастеров под выбранную услугу
      this.renderSpecialists(srvId, currentSpec);

      if (typeof window.updateQuickBookingDiscountDisplay === 'function') {
        window.updateQuickBookingDiscountDisplay();
      }
    } finally {
      this.isUpdating = false;
    }
  },

  init(initialSpecId = 'any') {
    const serviceSel = document.getElementById('adminServiceSelect');
    const specSel = document.getElementById('adminSpecialistSelect');
    if (!serviceSel || !specSel) return;

    this.isUpdating = true;
    try {
      if (initialSpecId && initialSpecId !== 'any') {
        // Открытие для конкретного мастера (например, клик по ячейке таймлайна мастера)
        this.renderSpecialists('', initialSpecId);
        specSel.value = initialSpecId;
        // Услуги фильтруются под этого мастера, но изначально стоит плейсхолдер
        this.renderServices(initialSpecId, '');
      } else {
        // Открытие по общей кнопке "+ Новая запись": мастер "Любой свободный", все мастера доступны
        this.renderSpecialists('', 'any');
        specSel.value = 'any';
        // Услуга не выбрана (плейсхолдер), все услуги доступны
        this.renderServices('any', '');
      }
    } finally {
      this.isUpdating = false;
    }

    if (typeof window.updateQuickBookingDiscountDisplay === 'function') {
      window.updateQuickBookingDiscountDisplay();
    }
  }
};

window.openQuickBookingFor = function(specialistId, time) {
  const quickModal = document.getElementById('adminQuickBookingModal');
  if (!quickModal) return;

  const errBox = document.getElementById('quickBookingConflictAlert');
  if (errBox) errBox.style.display = 'none';

  const dateInput = document.getElementById('adminBookingDate');
  const timeInput = document.getElementById('adminBookingTime');

  if (dateInput) dateInput.value = currentDate;
  if (timeInput) {
    timeInput.value = time || '12:00';
    window.roundTimeInput(timeInput);
  }

  // Запуск двунаправленной инициализации фильтра (Мастер <-> Услуга)
  if (window.noirQuickFilter) {
    window.noirQuickFilter.init(specialistId || 'any');
  }

  quickModal.classList.add('active');
};

window.updateSpecialistModalPreview = function() {
  const name = (document.getElementById('specEditName')?.value || '').trim();
  const avatar = (document.getElementById('specEditAvatar')?.value || '').trim();
  const img = document.getElementById('specialistModalAvatarImg');
  const mono = document.getElementById('specialistModalMonogram');

  if (avatar && img && mono) {
    img.src = avatar;
    img.style.display = 'block';
    mono.style.display = 'none';
  } else if (img && mono) {
    img.style.display = 'none';
    mono.style.display = 'inline-block';
    mono.textContent = getClientMonogram(name) || 'М';
  }
};

window.onSpecialistNameInput = function(name) {
  const id = document.getElementById('specEditId')?.value;
  const titleEl = document.getElementById('specialistModalTitle');
  if (titleEl) {
    titleEl.textContent = id
      ? ('Редактирование профиля: ' + (name.trim() || 'Мастер'))
      : (name.trim() ? ('Новый мастер: ' + name.trim()) : 'Новый мастер ателье');
  }
  window.updateSpecialistModalPreview();
};

window.onSpecialistAvatarInput = function(url) {
  window.updateSpecialistModalPreview();
};

window.openCreateSpecialistModal = function() {
  const modal = document.getElementById('adminSpecialistModal');
  if (!modal) return;

  const titleEl = document.getElementById('specialistModalTitle');
  if (titleEl) titleEl.textContent = "Новый мастер ателье";

  document.getElementById('specEditId').value = "";
  document.getElementById('specEditName').value = "";
  document.getElementById('specEditRole').value = "";
  document.getElementById('specEditExperience').value = "";
  document.getElementById('specEditAvatar').value = "";
  const commInput = document.getElementById('specEditCommission');
  if (commInput) commInput.value = "40";
  const badge = document.getElementById('specCommissionBadge');
  if (badge) badge.textContent = "40%";

  const delBtn = document.getElementById('specDeleteBtn');
  if (delBtn) delBtn.style.display = 'none';

  populateCategoryCheckboxes([]);
  document.querySelectorAll('#specWorkDaysCheckboxes input').forEach(ch => ch.checked = true);

  window.updateSpecialistModalPreview();
  modal.classList.add('active');
};

window.openEditSpecialistModal = function(specId) {
  const modal = document.getElementById('adminSpecialistModal');
  const specialists = window.noirData.getSpecialists();
  const spec = specialists.find(s => s.id === specId);
  if (!modal || !spec) return;

  const titleEl = document.getElementById('specialistModalTitle');
  if (titleEl) titleEl.textContent = "Редактирование профиля: " + spec.name;

  document.getElementById('specEditId').value = spec.id;
  document.getElementById('specEditName').value = spec.name;
  document.getElementById('specEditRole').value = spec.role;
  document.getElementById('specEditExperience').value = spec.experience || "";
  document.getElementById('specEditAvatar').value = spec.avatar || "";
  const commVal = spec.commissionPercent != null ? spec.commissionPercent : 40;
  const commInput = document.getElementById('specEditCommission');
  if (commInput) commInput.value = commVal;
  const badge = document.getElementById('specCommissionBadge');
  if (badge) badge.textContent = commVal + "%";

  const delBtn = document.getElementById('specDeleteBtn');
  if (delBtn) delBtn.style.display = 'inline-flex';

  populateCategoryCheckboxes(spec.categories || []);

  const days = spec.workDays || [1, 2, 3, 4, 5, 6, 7];
  document.querySelectorAll('#specWorkDaysCheckboxes input').forEach(ch => {
    ch.checked = days.includes(parseInt(ch.value, 10));
  });

  window.updateSpecialistModalPreview();
  modal.classList.add('active');
};

window.setSpecCommission = function(val) {
  const commInput = document.getElementById('specEditCommission');
  if (commInput) commInput.value = val;
  const badge = document.getElementById('specCommissionBadge');
  if (badge) badge.textContent = val + "%";
};

window.deleteCurrentSpecialist = function() {
  const specId = document.getElementById('specEditId')?.value;
  if (!specId) return;

  const specialists = window.noirData.getSpecialists();
  const spec = specialists.find(s => s.id === specId);
  const specName = spec ? spec.name : 'этого мастера';

  if (!confirm(`Вы действительно хотите удалить мастера «${specName}» из системы?`)) {
    return;
  }

  const success = window.noirData.deleteSpecialist(specId);
  if (success) {
    const modal = document.getElementById('adminSpecialistModal');
    if (modal) modal.classList.remove('active');
    updateKPIs();
    renderSpecialistsSchedule();
    renderTimeline();
    if (currentTab === 'payroll') renderPayrollAdmin();
  }
};

function populateCategoryCheckboxes(selectedCategories = []) {
  const container = document.getElementById('specCategoryCheckboxes');
  if (!container) return;

  const categories = window.noirData.getCategories();
  let html = '';

  categories.forEach(cat => {
    const isChecked = selectedCategories.length === 0 || selectedCategories.includes(cat.id);
    html += `
      <label style="display: flex; align-items: center; gap: 8px; background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 8px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: border-color 0.2s ease;">
        <input type="checkbox" value="${cat.id}" ${isChecked ? 'checked' : ''} style="accent-color: var(--accent-gold); width: 16px; height: 16px; cursor: pointer;">
        <span style="font-weight: 600; color: var(--text-main); font-size: 13px;">${cat.name}</span>
      </label>
    `;
  });

  container.innerHTML = html;
}

// ==========================================
// 6. УПРАВЛЕНИЕ УСЛУГАМИ (СОЗДАНИЕ / РЕДАКТИРОВАНИЕ / УДАЛЕНИЕ)
// ==========================================
window.openAddCategoryModal = function() {
  const modal = document.getElementById('adminAddCategoryModal');
  if (!modal) return;
  const nameInp = document.getElementById('newCategoryName');
  const descInp = document.getElementById('newCategoryDesc');
  if (nameInp) nameInp.value = '';
  if (descInp) descInp.value = '';
  const err = document.getElementById('newCategoryErrorAlert');
  if (err) err.style.display = 'none';
  modal.classList.add('active');
  modal.style.display = 'flex';
  setTimeout(() => nameInp?.focus(), 50);
};

window.closeAddCategoryModal = function() {
  const modal = document.getElementById('adminAddCategoryModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.style.display = 'none';
};

window.handleAddCategorySubmit = function(e) {
  e.preventDefault();
  const nameInput = document.getElementById('newCategoryName');
  const name = nameInput ? nameInput.value.trim() : '';
  const descInput = document.getElementById('newCategoryDesc');
  const desc = descInput ? descInput.value.trim() : '';
  const err = document.getElementById('newCategoryErrorAlert');

  if (!name) {
    if (err) {
      err.textContent = 'Пожалуйста, укажите название категории!';
      err.style.display = 'block';
    }
    return;
  }

  // Проверка на дубликат названия
  const existing = window.noirData.getCategories().find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    if (err) {
      err.textContent = `Категория «${name}» уже существует!`;
      err.style.display = 'block';
    }
    return;
  }

  const createdCat = window.noirData.addCategory({ name, desc });
  closeAddCategoryModal();

  // Обновляем селектор в модалке редактирования услуги и сразу выбираем новую категорию
  populateServiceCategorySelect(createdCat.id);

  // Автоматически раскрываем аккордеон новой категории
  if (window.noirCategoryAccordionState) {
    window.noirCategoryAccordionState.add(createdCat.id);
  }

  // Перерендериваем прейскурант
  renderServicesAdmin();

  // Обновляем чекбоксы специализаций мастеров
  if (typeof populateCategoryCheckboxes === 'function') {
    populateCategoryCheckboxes();
  }
};

function populateServiceCategorySelect(selectedCategoryId = null) {
  const select = document.getElementById('serviceEditCategory');
  if (!select) return;

  const categories = window.noirData.getCategories();
  select.innerHTML = categories.map(cat => `
    <option value="${cat.id}" ${cat.id === selectedCategoryId ? 'selected' : ''}>
      ${cat.name}
    </option>
  `).join('');
}

window.addServiceIncludeItem = function(text = '') {
  const container = document.getElementById('serviceEditIncludesList');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'service-include-row';
  row.style.cssText = 'display: flex; gap: 8px; align-items: center;';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-input service-include-input';
  input.value = text;
  input.placeholder = 'Пункт протокола (например: Мытьё головы премиальным шампунем)';
  input.style.cssText = 'flex-grow: 1; padding: 7px 12px; font-size: 13px;';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.innerHTML = '✕';
  delBtn.title = 'Удалить пункт';
  delBtn.style.cssText = 'background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: var(--color-danger); border-radius: var(--radius-sm); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; font-size: 13px; font-weight: 700;';
  delBtn.onclick = function() {
    row.remove();
  };

  row.appendChild(input);
  row.appendChild(delBtn);
  container.appendChild(row);
};

window.openCreateServiceModal = function(preselectedCategoryId = null) {
  const modal = document.getElementById('adminServiceModal');
  if (!modal) return;

  const titleEl = document.getElementById('serviceModalTitle');
  if (titleEl) titleEl.textContent = 'Новая услуга ателье NOIR';

  document.getElementById('serviceEditId').value = '';
  populateServiceCategorySelect(preselectedCategoryId);

  const popEl = document.getElementById('serviceEditPopular');
  if (popEl) popEl.checked = false;

  document.getElementById('serviceEditName').value = '';
  document.getElementById('serviceEditPrice').value = '450000';
  document.getElementById('serviceEditDuration').value = '60';
  document.getElementById('serviceEditShortDesc').value = '';
  document.getElementById('serviceEditFullDesc').value = '';

  const deleteBtn = document.getElementById('serviceDeleteBtn');
  if (deleteBtn) deleteBtn.style.display = 'none';

  const includesContainer = document.getElementById('serviceEditIncludesList');
  if (includesContainer) {
    includesContainer.innerHTML = '';
    // Предустанавливаем 4 базовых пункта для удобства заполнения
    window.addServiceIncludeItem('Консультация стилиста NOIR и диагностика');
    window.addServiceIncludeItem('Мытье головы премиальным шампунем до и после процедуры');
    window.addServiceIncludeItem('Основная авторская процедура с индивидуальной адаптацией');
    window.addServiceIncludeItem('Финишный стайлинг и рекомендации по домашнему уходу');
  }

  modal.classList.add('active');
};

window.openEditServiceModal = function(serviceId) {
  const modal = document.getElementById('adminServiceModal');
  if (!modal) return;

  const services = window.noirData.getServices();
  const service = services.find(s => s.id === serviceId);
  if (!service) return;

  const titleEl = document.getElementById('serviceModalTitle');
  if (titleEl) titleEl.textContent = `Редактирование: ${service.name}`;

  document.getElementById('serviceEditId').value = service.id;
  populateServiceCategorySelect(service.categoryId);

  const popEl = document.getElementById('serviceEditPopular');
  if (popEl) popEl.checked = !!service.popular;

  document.getElementById('serviceEditName').value = service.name || '';
  document.getElementById('serviceEditPrice').value = service.price || 0;
  document.getElementById('serviceEditDuration').value = service.duration || 60;
  document.getElementById('serviceEditShortDesc').value = service.shortDesc || '';
  document.getElementById('serviceEditFullDesc').value = service.fullDesc || service.shortDesc || '';

  const deleteBtn = document.getElementById('serviceDeleteBtn');
  if (deleteBtn) deleteBtn.style.display = 'inline-block';

  const includesContainer = document.getElementById('serviceEditIncludesList');
  if (includesContainer) {
    includesContainer.innerHTML = '';
    if (service.includes && Array.isArray(service.includes) && service.includes.length > 0) {
      service.includes.forEach(item => {
        window.addServiceIncludeItem(item);
      });
    } else {
      window.addServiceIncludeItem('Консультация мастера NOIR');
      window.addServiceIncludeItem('Основная процедура с авторской адаптацией');
      window.addServiceIncludeItem('Финишный стайлинг и рекомендации');
    }
  }

  modal.classList.add('active');
};

window.deleteCurrentService = function() {
  const id = document.getElementById('serviceEditId').value;
  if (!id) return;

  const service = window.noirData.getServices().find(s => s.id === id);
  const name = service ? service.name : 'эту услугу';

  if (confirm(`Вы уверены, что хотите удалить услугу «${name}» из прейскуранта?`)) {
    window.noirData.deleteService(id);
    const modal = document.getElementById('adminServiceModal');
    if (modal) modal.classList.remove('active');
    renderServicesAdmin();
  }
};

// ==========================================
// 7. БАЗА КЛИЕНТОВ И КАРТОЧКА ГОСТЯ (CRM)
// ==========================================

function getClientMonogram(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function renderClientsAdmin() {
  const container = document.getElementById('adminClientsContainer');
  const statsSub = document.getElementById('clientsStatsSub');
  if (!container) return;

  const clients = window.noirData.getClients();
  const searchInput = document.getElementById('clientSearchInput');
  const categoryFilter = document.getElementById('clientCategoryFilter');
  const sortSelect = document.getElementById('clientSortSelect');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const cat = categoryFilter ? categoryFilter.value : 'all';
  const sortBy = sortSelect ? sortSelect.value : 'spent_desc';

  // Статистика
  const totalCount = clients.length;
  const vipCount = clients.filter(c => c.category === 'vip').length;
  const regularCount = clients.filter(c => c.category === 'regular').length;
  const newCount = clients.filter(c => c.category === 'new').length;

  if (statsSub) {
    statsSub.innerHTML = `Всего гостей в базе: <strong style="color: var(--text-main);">${totalCount}</strong> • VIP: <strong style="color: var(--accent-gold);">${vipCount}</strong> • Постоянных: <strong style="color: var(--color-success);">${regularCount}</strong> • Новых: <strong style="color: var(--color-warning);">${newCount}</strong>`;
  }

  // Фильтрация
  let filtered = clients.filter(c => {
    if (cat !== 'all' && c.category !== cat) return false;
    if (query) {
      const matchName = (c.name || '').toLowerCase().includes(query);
      const matchPhone = (c.phone || '').toLowerCase().includes(query);
      const matchTele = (c.telegram || '').toLowerCase().includes(query);
      return matchName || matchPhone || matchTele;
    }
    return true;
  });

  // Сортировка
  filtered.sort((a, b) => {
    if (sortBy === 'spent_desc') return (b.totalSpent || 0) - (a.totalSpent || 0);
    if (sortBy === 'visits_desc') return (b.totalVisits || 0) - (a.totalVisits || 0);
    if (sortBy === 'recent') return (b.lastVisit || '').localeCompare(a.lastVisit || '');
    if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text-dim); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        Гости по заданным критериям не найдены
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(client => {
    const mono = getClientMonogram(client.name);
    let badgeHtml = '<span class="badge-client badge-client-new">Новый</span>';
    let avatarClass = 'client-avatar';

    if (client.category === 'vip') {
      badgeHtml = '<span class="badge-client badge-client-vip">⭐ VIP</span>';
      avatarClass += ' avatar-vip';
    } else if (client.category === 'regular') {
      badgeHtml = '<span class="badge-client badge-client-regular">💎 Постоянный</span>';
      avatarClass += ' avatar-regular';
    }

    const discountBadge = (client.discountPercent && client.discountPercent > 0)
      ? `<span class="badge-client-discount">-${client.discountPercent}%</span>`
      : '';

    const apps = window.noirData.getClientAppointments(client.id);
    const lastApp = apps.length > 0 ? apps[0] : null;

    const cleanPhone = (client.phone || '').replace(/[^\d+]/g, '');
    const telLink = cleanPhone 
      ? `<a href="tel:${cleanPhone}" class="client-phone-link" style="color: inherit; text-decoration: none;">📞 ${client.phone}</a>` 
      : '<span>📞 —</span>';
    const tgLink = client.telegram 
      ? `<a href="https://t.me/${client.telegram.replace('@', '')}" target="_blank" rel="noopener" style="color: var(--accent-primary); font-family: var(--font-mono); text-decoration: none;">${client.telegram}</a>` 
      : '';

    html += `
      <div class="client-list-row">
        <!-- 1. Имя, статус и контакты гостя -->
        <div class="client-cell-user">
          <div class="${avatarClass}">
            ${mono}
          </div>
          <div class="client-user-info" style="min-width: 0; flex: 1;">
            <div class="client-name-line" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="client-name" style="font-size: 15px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${client.name}</span>
              ${badgeHtml}
              ${discountBadge}
            </div>
            <div class="client-contact-line" style="font-size: 12px; color: var(--text-dim); margin-top: 3px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              ${telLink}
              ${tgLink}
            </div>
          </div>
        </div>

        <!-- 2. Визитов (Desktop) -->
        <div class="client-cell-visits" style="text-align: center;">
          <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Визитов</div>
          <div style="font-size: 15px; font-weight: 800; color: var(--text-main); margin-top: 2px;">${client.totalVisits || 1}</div>
        </div>

        <!-- 3. Сумма LTV (Desktop) -->
        <div class="client-cell-ltv" style="text-align: center;">
          <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Сумма (LTV)</div>
          <div style="font-size: 15px; font-weight: 800; color: var(--accent-gold); margin-top: 2px;">${window.noirData.formatMoney(client.totalSpent)}</div>
        </div>

        <!-- 4. Последний визит (Desktop) -->
        <div class="client-cell-recent" style="min-width: 0;">
          <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Последний визит</div>
          <div style="font-size: 12px; color: var(--text-main); font-weight: 600; margin-top: 2px;">
            ${client.lastVisit || '—'}
          </div>
          <div style="font-size: 11px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${lastApp ? lastApp.serviceName : (client.favoriteSpecialistName ? 'Мастер: ' + client.favoriteSpecialistName : 'Визит в ателье')}
          </div>
        </div>

        <!-- Mobile Stats Strip (Visible only on mobile) -->
        <div class="client-mobile-stats-strip">
          <div class="stat-pill">
            <span class="pill-lbl">Визитов</span>
            <span class="pill-val">${client.totalVisits || 1}</span>
          </div>
          <div class="stat-pill">
            <span class="pill-lbl">Сумма LTV</span>
            <span class="pill-val-gold">${window.noirData.formatMoney(client.totalSpent)}</span>
          </div>
          <div class="stat-pill">
            <span class="pill-lbl">Последний</span>
            <span class="pill-val">${client.lastVisit ? client.lastVisit.slice(5) : '—'}</span>
          </div>
        </div>

        <!-- 5. Действия -->
        <div class="client-cell-actions">
          <button type="button" class="btn btn-secondary btn-card-guest" onclick="openClientModal('${client.id}')">
            👤 Карточка
          </button>
          <button type="button" class="btn btn-primary btn-quick-book" onclick="quickBookForClient('${client.id}')">
            + Записать
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.setClientModalDiscount = function(val) {
  const input = document.getElementById('clientModalDiscountInput');
  const badge = document.getElementById('clientModalDiscountBadge');
  const cleanVal = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
  if (input) input.value = cleanVal;
  if (badge) badge.textContent = cleanVal + '%';
};

window.openClientModal = function(clientId) {
  const modal = document.getElementById('adminClientModal');
  if (!modal) return;

  const client = window.noirData.getClientById(clientId);
  if (!client) return;

  document.getElementById('clientModalId').value = client.id;
  document.getElementById('clientModalName').textContent = client.name;
  if (document.getElementById('clientModalNameInput')) {
    document.getElementById('clientModalNameInput').value = client.name;
  }

  const discount = (client.discountPercent !== undefined && client.discountPercent !== null) ? client.discountPercent : 0;
  if (document.getElementById('clientModalDiscountInput')) {
    document.getElementById('clientModalDiscountInput').value = discount;
  }
  if (document.getElementById('clientModalDiscountBadge')) {
    document.getElementById('clientModalDiscountBadge').textContent = discount + '%';
  }

  const mono = getClientMonogram(client.name);
  const avatarEl = document.getElementById('clientModalAvatar');
  const badgeEl = document.getElementById('clientModalBadge');

  if (avatarEl) {
    avatarEl.textContent = mono;
    avatarEl.className = 'client-avatar';
    avatarEl.style.background = '';
    avatarEl.style.color = '';
    avatarEl.style.borderColor = '';
  }

  if (badgeEl) {
    let badgeText = '';
    if (client.category === 'vip') {
      badgeText = '⭐ VIP ГОСТЬ';
      badgeEl.style.background = 'rgba(201, 162, 77, 0.15)';
      badgeEl.style.color = 'var(--accent-gold)';
      badgeEl.style.border = '1px solid rgba(201, 162, 77, 0.35)';
    } else if (client.category === 'regular') {
      badgeText = '💎 ПОСТОЯННЫЙ ГОСТЬ';
      badgeEl.style.background = 'rgba(16, 185, 129, 0.15)';
      badgeEl.style.color = 'var(--color-success)';
      badgeEl.style.border = '1px solid rgba(16, 185, 129, 0.35)';
    } else {
      badgeText = '✨ НОВЫЙ ГОСТЬ';
      badgeEl.style.background = 'rgba(255, 255, 255, 0.06)';
      badgeEl.style.color = 'var(--text-dim)';
      badgeEl.style.border = '1px solid var(--border-subtle)';
    }

    if (discount > 0) {
      badgeText += ` • СКИДКА ${discount}%`;
    }
    badgeEl.textContent = badgeText;
  }

  const subEl = document.getElementById('clientModalSubtitle');
  if (subEl) {
    subEl.textContent = `${client.phone || 'Телефон не указан'} • Клиент с ${client.firstVisit || '2026'}`;
  }

  // KPI
  const visits = client.totalVisits || 1;
  const spent = client.totalSpent || 0;
  const avg = visits > 0 ? Math.round(spent / visits) : 0;

  document.getElementById('clientModalTotalVisits').textContent = visits;
  document.getElementById('clientModalTotalSpent').textContent = window.noirData.formatMoney(spent);
  document.getElementById('clientModalAvgCheck').textContent = window.noirData.formatMoney(avg);
  document.getElementById('clientModalFavSpecialist').textContent = client.favoriteSpecialistName || 'Любой свободный мастер';

  // Поля ввода
  document.getElementById('clientModalHairNotes').value = client.hairNotes || '';
  document.getElementById('clientModalNotes').value = client.notes || '';
  document.getElementById('clientModalPhoneInput').value = client.phone || '';
  document.getElementById('clientModalTelegramInput').value = client.telegram || '';
  document.getElementById('clientModalCategorySelect').value = client.category || 'new';

  // История визитов
  const historyList = document.getElementById('clientModalVisitsHistoryList');
  const countEl = document.getElementById('clientModalHistoryCount');
  const appointments = window.noirData.getClientAppointments(client.id);

  appointments.sort((a, b) => {
    return (b.date + ' ' + b.time).localeCompare(a.date + ' ' + a.time);
  });

  if (countEl) {
    countEl.textContent = `${appointments.length} ${appointments.length === 1 ? 'визит' : (appointments.length < 5 ? 'визита' : 'визитов')}`;
  }

  if (historyList) {
    if (appointments.length === 0) {
      historyList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-dim); background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px dashed var(--border-subtle); font-size: 13px;">
          Записей визитов пока нет. Нажмите «+ Записать гостя» ниже.
        </div>
      `;
    } else {
      let historyHtml = '';
      appointments.forEach(app => {
        let statusBadge = '<span style="font-size: 10px; padding: 2px 6px; border-radius: 8px; background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3);">Новая</span>';
        if (app.status === 'confirmed') {
          statusBadge = '<span style="font-size: 10px; padding: 2px 6px; border-radius: 8px; background: rgba(201, 162, 77, 0.15); color: var(--accent-gold); border: 1px solid rgba(201, 162, 77, 0.3);">Подтверждена</span>';
        } else if (app.status === 'completed') {
          statusBadge = '<span style="font-size: 10px; padding: 2px 6px; border-radius: 8px; background: rgba(16, 185, 129, 0.15); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.3);">Выполнена</span>';
        } else if (app.status === 'cancelled') {
          statusBadge = '<span style="font-size: 10px; padding: 2px 6px; border-radius: 8px; background: rgba(239, 68, 68, 0.15); color: var(--color-danger); border: 1px solid rgba(239, 68, 68, 0.3);">Отменена</span>';
        }

        historyHtml += `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 13px; font-weight: 700; color: var(--text-main);">
                📅 ${app.date} в ${app.time}
              </span>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${statusBadge}
                <span style="font-size: 13px; font-weight: 800; color: var(--accent-gold);">${window.noirData.formatMoney(app.price)}</span>
              </div>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-main);">
              ✂️ ${app.serviceName}
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 3px; display: flex; justify-content: space-between;">
              <span>Мастер: <strong style="color: var(--text-sub);">${app.specialistName}</strong></span>
              <span>Длительность: ${app.duration || 60} мин</span>
            </div>
            ${app.comment ? `
              <div style="margin-top: 6px; font-size: 11px; color: var(--text-muted); background: rgba(0,0,0,0.25); padding: 6px 10px; border-radius: 4px; border-left: 2px solid var(--accent-gold);">
                💬 ${app.comment}
              </div>
            ` : ''}
          </div>
        `;
      });
      historyList.innerHTML = historyHtml;
    }
  }

  // Сворачиваем аккордеон истории визитов по умолчанию при открытии
  if (typeof window.toggleClientHistoryAccordion === 'function') {
    window.toggleClientHistoryAccordion(false);
  }

  modal.classList.add('active');
};

window.toggleClientHistoryAccordion = function(forceState) {
  const body = document.getElementById('clientHistoryAccordionBody');
  const label = document.getElementById('clientHistoryToggleLabel');
  const arrow = document.getElementById('clientHistoryToggleArrow');
  const header = document.getElementById('clientHistoryAccordionHeader');
  if (!body) return;

  const isClosed = body.style.display === 'none' || !body.style.display;
  const shouldOpen = typeof forceState === 'boolean' ? forceState : isClosed;

  if (shouldOpen) {
    body.style.display = 'block';
    if (label) label.textContent = 'Свернуть';
    if (arrow) arrow.textContent = '▲';
    if (header) header.classList.add('expanded');
  } else {
    body.style.display = 'none';
    if (label) label.textContent = 'Развернуть';
    if (arrow) arrow.textContent = '▼';
    if (header) header.classList.remove('expanded');
  }
};

window.saveCurrentClientProfile = function() {
  const clientId = document.getElementById('clientModalId').value;
  if (!clientId) return;

  const nameInput = document.getElementById('clientModalNameInput');
  const name = nameInput ? nameInput.value.trim() : '';

  const discountInput = document.getElementById('clientModalDiscountInput');
  const discountPercent = discountInput ? Math.max(0, Math.min(100, parseInt(discountInput.value, 10) || 0)) : 0;

  const hairNotes = document.getElementById('clientModalHairNotes').value.trim();
  const notes = document.getElementById('clientModalNotes').value.trim();
  const phone = document.getElementById('clientModalPhoneInput').value.trim();
  const telegram = document.getElementById('clientModalTelegramInput').value.trim();
  const category = document.getElementById('clientModalCategorySelect').value;

  const updatePayload = {
    hairNotes,
    notes,
    phone,
    telegram,
    category,
    discountPercent
  };

  if (name) {
    updatePayload.name = name;
  }

  window.noirData.updateClient(clientId, updatePayload);

  // Обновляем заголовок модалки и монограмму
  if (name) {
    document.getElementById('clientModalName').textContent = name;
    const avatarEl = document.getElementById('clientModalAvatar');
    if (avatarEl) avatarEl.textContent = getClientMonogram(name);
  }

  // Обновляем визуальный бейдж
  const badgeEl = document.getElementById('clientModalBadge');
  if (badgeEl) {
    let badgeText = '';
    if (category === 'vip') {
      badgeText = '⭐ VIP ГОСТЬ';
      badgeEl.style.background = 'rgba(201, 162, 77, 0.15)';
      badgeEl.style.color = 'var(--accent-gold)';
    } else if (category === 'regular') {
      badgeText = '💎 ПОСТОЯННЫЙ ГОСТЬ';
      badgeEl.style.background = 'rgba(16, 185, 129, 0.15)';
      badgeEl.style.color = 'var(--color-success)';
    } else {
      badgeText = '✨ НОВЫЙ ГОСТЬ';
      badgeEl.style.background = 'rgba(255, 255, 255, 0.06)';
      badgeEl.style.color = 'var(--text-dim)';
    }

    if (discountPercent > 0) {
      badgeText += ` • СКИДКА ${discountPercent}%`;
    }
    badgeEl.textContent = badgeText;
  }

  renderClientsAdmin();

  // Обратная связь на кнопке
  const saveBtn = window.event ? window.event.target : null;
  if (saveBtn) {
    const origText = saveBtn.innerHTML;
    saveBtn.innerHTML = '✓ Сохранено!';
    saveBtn.style.background = 'rgba(16, 185, 129, 0.2)';
    saveBtn.style.color = 'var(--color-success)';
    setTimeout(() => {
      saveBtn.innerHTML = origText;
      saveBtn.style.background = '';
      saveBtn.style.color = '';
    }, 1200);
  }
};

window.quickBookForClient = function(clientId) {
  const client = window.noirData.getClientById(clientId);
  if (!client) return;

  const modal = document.getElementById('adminClientModal');
  if (modal) modal.classList.remove('active');

  openQuickBookingFor(client.favoriteSpecialistId || 'any', '14:00');

  // Предзаполняем поля клиента
  const nameInput = document.getElementById('adminClientName');
  const phoneInput = document.getElementById('adminClientPhone');
  if (nameInput) nameInput.value = client.name;
  if (phoneInput) {
    phoneInput.value = client.phone;
  }

  updateQuickBookingDiscountDisplay();
};

window.bookAppointmentForCurrentClient = function() {
  const clientId = document.getElementById('clientModalId').value;
  if (clientId) {
    quickBookForClient(clientId);
  }
};

window.openCreateClientModal = function() {
  const modal = document.getElementById('adminClientCreateModal');
  if (!modal) return;

  document.getElementById('newClientName').value = '';
  document.getElementById('newClientPhone').value = '';
  document.getElementById('newClientTelegram').value = '';
  document.getElementById('newClientCategory').value = 'new';
  const discInp = document.getElementById('newClientDiscount');
  if (discInp) discInp.value = '0';
  document.getElementById('newClientNotes').value = '';

  modal.classList.add('active');
};

// ==========================================
// 8. ЗАРПЛАТНАЯ ВЕДОМОСТЬ МАСТЕРОВ (PAYROLL)
// ==========================================
let payrollPeriodMode = 'weekly'; // 'today', 'weekly', 'lastweek', 'month'
let payrollWeekOffset = 0;
let payrollIncludeConfirmed = false;
const expandedPayrollMasters = {};

function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPayrollDateRange() {
  const baseToday = new Date();

  let startDateStr = '';
  let endDateStr = '';
  let label = '';

  if (payrollPeriodMode === 'today') {
    const target = new Date(baseToday);
    target.setDate(target.getDate() + payrollWeekOffset);
    startDateStr = formatLocalDate(target);
    endDateStr = startDateStr;
    const isBase = payrollWeekOffset === 0;
    label = target.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' }) + (isBase ? ' (Сегодня)' : '');
  } else if (payrollPeriodMode === 'weekly' || payrollPeriodMode === 'lastweek') {
    const target = new Date(baseToday);
    const dayOfWeek = target.getDay() === 0 ? 7 : target.getDay();
    target.setDate(target.getDate() - (dayOfWeek - 1) + (payrollWeekOffset * 7));

    const mon = new Date(target);
    const sun = new Date(target);
    sun.setDate(mon.getDate() + 6);

    startDateStr = formatLocalDate(mon);
    endDateStr = formatLocalDate(sun);

    const monFmt = mon.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const sunFmt = sun.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    const weekNote = payrollWeekOffset === 0 ? ' (Текущая неделя)' : (payrollWeekOffset === -1 ? ' (Прошлая неделя)' : '');
    label = `${monFmt} — ${sunFmt}${weekNote}`;
  } else if (payrollPeriodMode === 'month') {
    const target = new Date(baseToday);
    target.setMonth(target.getMonth() + payrollWeekOffset);
    const y = target.getFullYear();
    const m = target.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    startDateStr = formatLocalDate(firstDay);
    endDateStr = formatLocalDate(lastDay);

    const monthName = target.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    label = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  }

  return { startDate: startDateStr, endDate: endDateStr, label };
}

window.setPayrollPeriod = function(mode) {
  payrollPeriodMode = mode;
  if (mode === 'today') {
    payrollWeekOffset = 0;
  } else if (mode === 'weekly') {
    payrollWeekOffset = 0;
  } else if (mode === 'lastweek') {
    payrollPeriodMode = 'weekly';
    payrollWeekOffset = -1;
  } else if (mode === 'month') {
    payrollWeekOffset = 0;
  }

  // Обновляем визуальное состояние кнопок
  document.querySelectorAll('.payroll-period-btn').forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  });

  const activeBtnId = mode === 'lastweek' ? 'payrollPeriodBtn_lastweek' : `payrollPeriodBtn_${mode}`;
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) {
    activeBtn.classList.remove('btn-secondary');
    activeBtn.classList.add('btn-primary');
  }

  renderPayrollAdmin();
};

window.navigatePayrollPeriod = function(dir) {
  payrollWeekOffset += dir;
  renderPayrollAdmin();
};

window.togglePayrollIncludeConfirmed = function(checked) {
  payrollIncludeConfirmed = checked;
  renderPayrollAdmin();
};

window.changeSalonDefaultPayrollPeriod = function(val) {
  window.noirData.saveSalonInfo({ payrollPeriod: val });
  const select = document.getElementById('salonPayrollPeriodSelect');
  if (select) select.value = val;
  const sub = document.getElementById('payrollSubHeader');
  if (sub) {
    const periodName = val === 'weekly' ? 'раз в неделю' : 'каждый день';
    sub.innerHTML = `Регламент выплат: <strong style="color: var(--accent-gold);">${periodName}</strong>. Начисления по выполненным услугам и процентная ставка каждого мастера.`;
  }
};

window.toggleMasterPayrollDetails = function(specId) {
  expandedPayrollMasters[specId] = !expandedPayrollMasters[specId];
  renderPayrollAdmin();
};

let currentPayrollSubView = 'calc';

window.switchPayrollSubView = function(subView) {
  currentPayrollSubView = subView;
  const calcTabBtn = document.getElementById('payrollSubTab_calc');
  const ledgerTabBtn = document.getElementById('payrollSubTab_ledger');
  const calcView = document.getElementById('payrollSubView_calc');
  const ledgerView = document.getElementById('payrollSubView_ledger');

  if (subView === 'calc') {
    if (calcTabBtn) {
      calcTabBtn.classList.remove('btn-secondary');
      calcTabBtn.classList.add('btn-primary');
    }
    if (ledgerTabBtn) {
      ledgerTabBtn.classList.remove('btn-primary');
      ledgerTabBtn.classList.add('btn-secondary');
    }
    if (calcView) calcView.style.display = 'block';
    if (ledgerView) ledgerView.style.display = 'none';
    renderPayrollAdmin();
  } else {
    if (calcTabBtn) {
      calcTabBtn.classList.remove('btn-primary');
      calcTabBtn.classList.add('btn-secondary');
    }
    if (ledgerTabBtn) {
      ledgerTabBtn.classList.remove('btn-secondary');
      ledgerTabBtn.classList.add('btn-primary');
    }
    if (calcView) calcView.style.display = 'none';
    if (ledgerView) ledgerView.style.display = 'block';
    renderPayoutLedger();
  }

  // Обновляем бейдж общего количества ордеров
  const orders = window.noirData.getPayoutOrders();
  const badgeEl = document.getElementById('payoutOrdersBadgeCount');
  if (badgeEl) badgeEl.textContent = orders.length;
};

function openPayrollHelpModal() {
  const modal = document.getElementById('adminPayrollHelpModal');
  if (modal) modal.classList.add('active');
}
window.openPayrollHelpModal = openPayrollHelpModal;

window.openPayoutModal = function(specId, startDate, endDate) {
  const modal = document.getElementById('adminPayoutConfirmModal');
  if (!modal) return;

  const dateRange = getPayrollDateRange();
  const payrollData = window.noirData.calculatePayroll({
    startDate: startDate || dateRange.startDate,
    endDate: endDate || dateRange.endDate,
    includeConfirmed: payrollIncludeConfirmed
  });

  const sp = payrollData.specialists.find(s => s.specialistId === specId);
  if (!sp) return;

  document.getElementById('payoutFormSpecId').value = sp.specialistId;
  document.getElementById('payoutFormStartDate').value = startDate || dateRange.startDate;
  document.getElementById('payoutFormEndDate').value = endDate || dateRange.endDate;
  document.getElementById('payoutFormAmount').value = sp.masterPayroll;
  document.getElementById('payoutFormGross').value = sp.grossRevenue;
  document.getElementById('payoutFormMargin').value = sp.salonMargin;
  document.getElementById('payoutFormCount').value = sp.totalServicesCount;

  const avatarEl = document.getElementById('payoutModalAvatar');
  if (avatarEl) avatarEl.src = sp.specialistAvatar;

  const nameEl = document.getElementById('payoutModalMasterName');
  if (nameEl) nameEl.textContent = sp.specialistName;

  const roleEl = document.getElementById('payoutModalMasterRole');
  if (roleEl) roleEl.textContent = `${sp.specialistRole} • Ставка ${sp.commissionPercent}%`;

  const periodEl = document.getElementById('payoutModalPeriod');
  if (periodEl) periodEl.textContent = `Период: ${dateRange.label}`;

  const amountEl = document.getElementById('payoutModalAmountDisplay');
  if (amountEl) amountEl.textContent = window.noirData.formatMoney(sp.masterPayroll);

  const statsEl = document.getElementById('payoutModalStatsSummary');
  if (statsEl) {
    statsEl.textContent = `По ${sp.totalServicesCount} выполненным услугам (касса: ${window.noirData.formatMoney(sp.grossRevenue)}, маржа салона: ${window.noirData.formatMoney(sp.salonMargin)})`;
  }

  const notesEl = document.getElementById('payoutNotesInput');
  if (notesEl) {
    notesEl.value = `Выплата зарплаты мастеру ${sp.specialistName} за период ${dateRange.label}.`;
  }

  modal.classList.add('active');
};

function renderPayrollAdmin() {
  const container = document.getElementById('payrollTableContainer');
  if (!container) return;

  const dateRange = getPayrollDateRange();

  // Обновляем бейдж кассовых ордеров в под-вкладке
  const allOrders = window.noirData.getPayoutOrders();
  const badgeEl = document.getElementById('payoutOrdersBadgeCount');
  if (badgeEl) badgeEl.textContent = allOrders.length;

  // Обновляем плашку периода
  const labelEl = document.getElementById('payrollCurrentPeriodLabel');
  if (labelEl) labelEl.textContent = dateRange.label;

  // Селектор периодичности салона
  const salonInfo = window.noirData.getSalonInfo();
  const salonPeriodSelect = document.getElementById('salonPayrollPeriodSelect');
  if (salonPeriodSelect && salonInfo.payrollPeriod) {
    salonPeriodSelect.value = salonInfo.payrollPeriod;
  }

  // Расчёт ведомости
  const payrollData = window.noirData.calculatePayroll({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    includeConfirmed: payrollIncludeConfirmed
  });

  // Обновляем KPI
  const revEl = document.getElementById('payrollKpiTotalRevenue');
  const payEl = document.getElementById('payrollKpiTotalPayroll');
  const marginEl = document.getElementById('payrollKpiSalonMargin');
  const countEl = document.getElementById('payrollKpiServicesCount');

  if (revEl) revEl.textContent = window.noirData.formatMoney(payrollData.summary.totalRevenue);
  if (payEl) payEl.textContent = window.noirData.formatMoney(payrollData.summary.totalPayroll);
  if (marginEl) marginEl.textContent = window.noirData.formatMoney(payrollData.summary.salonMargin);
  if (countEl) countEl.textContent = payrollData.summary.totalServicesCount;

  // Отрисовка списка мастеров
  if (!payrollData.specialists || payrollData.specialists.length === 0) {
    container.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 36px; text-align: center; color: var(--text-dim);">
        В базе нет зарегистрированных мастеров.
      </div>
    `;
    return;
  }

  let html = '';

  payrollData.specialists.forEach(sp => {
    const isExpanded = !!expandedPayrollMasters[sp.specialistId];
    
    // Проверяем наличие защищённого кассового ордера на этот период
    const paidOrder = window.noirData.getPayoutOrderForPeriod(sp.specialistId, dateRange.startDate, dateRange.endDate);
    const isPaid = !!paidOrder;

    html += `
      <div style="background: var(--bg-card); border: 1px solid ${isPaid ? 'rgba(16, 185, 129, 0.45)' : 'var(--border-subtle)'}; ${isPaid ? 'box-shadow: 0 0 16px -4px rgba(16, 185, 129, 0.25);' : ''} border-radius: var(--radius-md); overflow: hidden; transition: all 0.2s ease;">
        <!-- Основная строка мастера с фиксированной сеткой колонок -->
        <div class="payroll-master-row" style="background: ${isPaid ? 'rgba(16, 185, 129, 0.05)' : 'transparent'};">
          <!-- 1. Фото и данные мастера -->
          <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
            <img src="${sp.specialistAvatar}" alt="${sp.specialistName}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid ${isPaid ? '#10B981' : 'var(--accent-gold)'}; flex-shrink: 0;">
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <h4 style="font-size: 15px; font-weight: 800; color: var(--text-main); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sp.specialistName}</h4>
                <span style="background: rgba(212, 175, 55, 0.15); color: var(--accent-gold); border: 1px solid rgba(212, 175, 55, 0.3); padding: 2px 7px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 800; white-space: nowrap;">
                  ${sp.commissionPercent}% ставка
                </span>
                ${isPaid ? `
                  <span style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 9px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;">
                    <span>✓ Выплачено</span>
                    <span style="color: #6EE7B7; font-size: 10px; font-family: var(--font-mono);">(#${paidOrder.id})</span>
                  </span>
                ` : ''}
              </div>
              <p style="font-size: 12px; color: var(--text-dim); margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${sp.specialistRole}</p>
            </div>
          </div>

          <!-- 2. Услуг -->
          <div style="text-align: center;">
            <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Услуг</div>
            <div style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-top: 2px;">${sp.totalServicesCount}</div>
          </div>

          <!-- 3. Касса мастера -->
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Касса мастера</div>
            <div style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-top: 2px;">${window.noirData.formatMoney(sp.grossRevenue)}</div>
          </div>

          <!-- 4. Доход салона -->
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--text-dim); text-transform: uppercase;">Доход салона</div>
            <div style="font-size: 14px; font-weight: 700; color: #10B981; margin-top: 2px;">${window.noirData.formatMoney(sp.salonMargin)}</div>
          </div>

          <!-- 5. К выплате мастеру -->
          <div style="text-align: right; background: ${isPaid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(212, 175, 55, 0.08)'}; padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid ${isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(212, 175, 55, 0.25)'};">
            <div style="font-size: 10px; color: ${isPaid ? '#10B981' : 'var(--accent-gold)'}; text-transform: uppercase; font-weight: 700; white-space: nowrap;">
              ${isPaid ? 'Выплачено на руки' : 'К выплате мастеру'}
            </div>
            <div style="font-size: 16px; font-weight: 900; color: ${isPaid ? '#10B981' : 'var(--accent-gold)'}; margin-top: 1px; white-space: nowrap;">
              ${window.noirData.formatMoney(isPaid ? paidOrder.amount : sp.masterPayroll)}
            </div>
          </div>

          <!-- 6. Действия -->
          <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-end;">
            <button type="button" class="btn btn-secondary" onclick="toggleMasterPayrollDetails('${sp.specialistId}')" style="padding: 7px 12px; font-size: 12px; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
              <span>Детализация (${sp.totalServicesCount})</span>
              <span style="font-size: 10px; transition: transform 0.2s ease; ${isExpanded ? 'transform: rotate(180deg);' : ''}">▼</span>
            </button>

            ${isPaid ? `
              <!-- Защищённая выплата: случайный клик не сбросит ордер, доступна печать расчётного листка -->
              <button type="button" class="btn btn-secondary" onclick="printSpecialistPayslip('${paidOrder.id}')" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 7px 14px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; white-space: nowrap;" title="Распечатать расчётный листок (А4)">
                <span>🖨️ Листок (Payslip)</span>
              </button>
            ` : `
              <button type="button" class="btn btn-primary" onclick="openPayoutModal('${sp.specialistId}', '${dateRange.startDate}', '${dateRange.endDate}')" style="padding: 7px 16px; font-size: 12px; font-weight: 800; white-space: nowrap;" ${sp.masterPayroll === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
                Выплатить
              </button>
            `}
          </div>
        </div>


        <!-- Разворачиваемая таблица услуг -->
        ${isExpanded ? `
          <div style="border-top: 1px solid var(--border-subtle); padding: 14px 20px; background: rgba(0, 0, 0, 0.25);">
            ${sp.items.length === 0 ? `
              <div style="font-size: 12px; color: var(--text-dim); text-align: center; padding: 16px;">
                В выбранный период у мастера нет записей с подходящим статусом.
              </div>
            ` : `
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border-subtle); color: var(--text-dim);">
                      <th style="padding: 8px 10px; font-weight: 600;">Дата и время</th>
                      <th style="padding: 8px 10px; font-weight: 600;">Клиент</th>
                      <th style="padding: 8px 10px; font-weight: 600;">Услуга</th>
                      <th style="padding: 8px 10px; font-weight: 600; text-align: right;">Оплачено гостем</th>
                      <th style="padding: 8px 10px; font-weight: 600; text-align: center;">Ставка</th>
                      <th style="padding: 8px 10px; font-weight: 600; text-align: right;">Мастеру (${sp.commissionPercent}%)</th>
                      <th style="padding: 8px 10px; font-weight: 600; text-align: right;">Салону</th>
                      <th style="padding: 8px 10px; font-weight: 600; text-align: center;">Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sp.items.map(it => `
                      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #FFFFFF;">
                        <td style="padding: 10px 10px; font-weight: 600; white-space: nowrap;">
                          ${it.date} в ${it.time}
                        </td>
                        <td style="padding: 10px 10px;">
                          <div style="font-weight: 600;">${it.clientName}</div>
                          <div style="font-size: 11px; color: var(--text-dim);">${it.clientPhone}</div>
                        </td>
                        <td style="padding: 10px 10px; color: var(--accent-gold-light); font-weight: 600;">
                          ${it.serviceName}
                        </td>
                        <td style="padding: 10px 10px; text-align: right; font-weight: 700;">
                          ${window.noirData.formatMoney(it.price)}
                        </td>
                        <td style="padding: 10px 10px; text-align: center; color: var(--text-dim);">
                          ${it.commissionPercent}%
                        </td>
                        <td style="padding: 10px 10px; text-align: right; font-weight: 800; color: var(--accent-gold);">
                          ${window.noirData.formatMoney(it.masterShare)}
                        </td>
                        <td style="padding: 10px 10px; text-align: right; color: #10B981; font-weight: 700;">
                          ${window.noirData.formatMoney(it.salonShare)}
                        </td>
                        <td style="padding: 10px 10px; text-align: center;">
                          <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; background: ${it.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)'}; color: ${it.status === 'completed' ? '#10B981' : '#60A5FA'}; border: 1px solid ${it.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'};">
                            ${it.status === 'completed' ? 'Выполнена' : 'Подтверждена'}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        ` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

// ==========================================
// 6.2 ЖУРНАЛ КАССОВЫХ ВЫПЛАТ (АРХИВ И ИСТОРИЯ)
// ==========================================
window.renderPayoutLedger = function() {
  const container = document.getElementById('payoutLedgerTableContainer');
  if (!container) return;

  // Динамически заполняем селектор специалистов, если ещё не заполнен
  const specSelect = document.getElementById('ledgerSpecialistSelect');
  if (specSelect && (!specSelect.options || specSelect.options.length <= 1)) {
    const specialists = window.noirData.getSpecialists();
    specSelect.innerHTML = `<option value="all">Все мастера</option>` + specialists.map(s => `
      <option value="${s.id}">${s.name}</option>
    `).join('');
  }

  const searchVal = (document.getElementById('ledgerSearchInput')?.value || '').toLowerCase().trim();
  const yearVal = document.getElementById('ledgerYearSelect')?.value || 'all';
  const monthVal = document.getElementById('ledgerMonthSelect')?.value || 'all';
  const specVal = document.getElementById('ledgerSpecialistSelect')?.value || 'all';

  const orders = window.noirData.getPayoutOrders();

  // Фильтрация ордеров
  const filtered = orders.filter(o => {
    if (o.status === 'cancelled') return false;

    const orderDate = o.createdAt ? new Date(o.createdAt) : new Date(o.startDate);

    if (yearVal !== 'all') {
      const orderYear = orderDate.getFullYear().toString();
      if (orderYear !== yearVal && !(o.startDate && o.startDate.startsWith(yearVal))) return false;
    }

    if (monthVal !== 'all') {
      if (orderDate.getMonth().toString() !== monthVal) return false;
    }

    if (specVal !== 'all' && o.specialistId !== specVal) {
      return false;
    }

    if (searchVal) {
      const searchTarget = `${o.id} ${o.specialistName} ${o.paymentMethod || ''} ${o.notes || ''} ${o.issuedBy || ''}`.toLowerCase();
      if (!searchTarget.includes(searchVal)) return false;
    }

    return true;
  });

  // Расчёт и обновление сводных KPI
  const count = filtered.length;
  const paidTotal = filtered.reduce((acc, o) => acc + (o.amount || 0), 0);
  const grossTotal = filtered.reduce((acc, o) => acc + (o.grossRevenue || 0), 0);
  const marginTotal = filtered.reduce((acc, o) => acc + (o.salonMargin || 0), 0);

  const kpiCount = document.getElementById('ledgerKpiCount');
  const kpiPaid = document.getElementById('ledgerKpiPaidTotal');
  const kpiGross = document.getElementById('ledgerKpiGrossTotal');
  const kpiMargin = document.getElementById('ledgerKpiMarginTotal');

  if (kpiCount) kpiCount.textContent = count;
  if (kpiPaid) kpiPaid.textContent = window.noirData.formatMoney(paidTotal);
  if (kpiGross) kpiGross.textContent = window.noirData.formatMoney(grossTotal);
  if (kpiMargin) kpiMargin.textContent = window.noirData.formatMoney(marginTotal);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 48px 20px; text-align: center; color: var(--text-dim);">
        <div style="font-size: 36px; margin-bottom: 10px;">📜</div>
        <div style="font-size: 15px; font-weight: 800; color: var(--text-main);">Кассовых ордеров не найдено</div>
        <div style="font-size: 12px; margin-top: 4px; color: var(--text-muted);">
          По выбранным фильтрам периода или поисковому запросу нет проведённых выплат.
        </div>
      </div>
    `;
    return;
  }

  let html = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden;">
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--border-subtle); color: var(--text-dim); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
              <th style="padding: 12px 16px; font-weight: 700;">№ Ордера</th>
              <th style="padding: 12px 14px; font-weight: 700;">Дата и время</th>
              <th style="padding: 12px 16px; font-weight: 700;">Мастер</th>
              <th style="padding: 12px 14px; font-weight: 700;">Период начисления</th>
              <th style="padding: 12px 12px; font-weight: 700; text-align: center;">Услуг</th>
              <th style="padding: 12px 14px; font-weight: 700; text-align: right;">Касса мастера</th>
              <th style="padding: 12px 14px; font-weight: 700; text-align: right;">Доход салона</th>
              <th style="padding: 12px 16px; font-weight: 700; text-align: right;">Выдано на руки</th>
              <th style="padding: 12px 14px; font-weight: 700;">Способ выдачи</th>
              <th style="padding: 12px 16px; font-weight: 700; text-align: center;">Документ</th>
            </tr>
          </thead>
          <tbody>
  `;

  filtered.forEach(o => {
    html += `
      <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.15s ease;" onmouseenter="this.style.background='rgba(255,255,255,0.02)'" onmouseleave="this.style.background='transparent'">
        <td style="padding: 14px 16px; font-family: var(--font-mono); font-weight: 800; color: var(--accent-gold); white-space: nowrap;">
          #${o.id}
        </td>
        <td style="padding: 14px 14px; white-space: nowrap;">
          <div style="font-weight: 600; color: var(--text-main);">${o.dateFormatted}</div>
          <div style="font-size: 11px; color: var(--text-dim);">${o.timeFormatted || '18:00'}</div>
        </td>
        <td style="padding: 14px 16px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${o.specialistAvatar}" alt="${o.specialistName}" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-gold);">
            <div>
              <div style="font-weight: 800; color: var(--text-main); font-size: 13px;">${o.specialistName}</div>
              <div style="font-size: 11px; color: var(--text-dim);">${o.commissionPercent}% ставка</div>
            </div>
          </div>
        </td>
        <td style="padding: 14px 14px; font-size: 12px; color: var(--text-sub);">
          ${o.periodLabel || (o.startDate + ' — ' + o.endDate)}
        </td>
        <td style="padding: 14px 12px; text-align: center; font-weight: 700; color: var(--text-main);">
          ${o.servicesCount || (o.items ? o.items.length : 0)}
        </td>
        <td style="padding: 14px 14px; text-align: right; font-weight: 600; color: var(--text-sub); white-space: nowrap;">
          ${window.noirData.formatMoney(o.grossRevenue)}
        </td>
        <td style="padding: 14px 14px; text-align: right; font-weight: 700; color: #10B981; white-space: nowrap;">
          ${window.noirData.formatMoney(o.salonMargin)}
        </td>
        <td style="padding: 14px 16px; text-align: right; white-space: nowrap;">
          <div style="font-size: 15px; font-weight: 900; color: var(--accent-gold);">
            ${window.noirData.formatMoney(o.amount)}
          </div>
        </td>
        <td style="padding: 14px 14px; font-size: 12px; color: var(--text-muted);">
          <span style="background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 4px; font-size: 11px;">
            ${o.paymentMethod || 'Наличные из кассы'}
          </span>
        </td>
        <td style="padding: 14px 16px; text-align: center; white-space: nowrap;">
          <button type="button" class="btn btn-secondary" onclick="printSpecialistPayslip('${o.id}')" style="padding: 6px 12px; font-size: 11px; font-weight: 700; border-color: rgba(212, 175, 55, 0.4); color: #E5C378; display: inline-flex; align-items: center; gap: 5px;" title="Распечатать расчётный листок А4">
            <span>🖨️ Листок (А4)</span>
          </button>
        </td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
};

// ==========================================
// 6.3 ПЕЧАТЬ РАСЧЁТНОГО ЛИСТКА МАСТЕРА (А4)
// ==========================================
window.printSpecialistPayslip = function(orderId) {
  const orders = window.noirData.getPayoutOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    alert("Ордер #" + orderId + " не найден в базе кассовых выплат.");
    return;
  }

  const printArea = document.getElementById('printableDocumentArea');
  if (!printArea) return;

  const salon = window.noirData.getSalonInfo();

  let itemsHtml = '';
  if (order.items && order.items.length > 0) {
    itemsHtml = order.items.map((it, idx) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 7px 8px; color: #6B7280; text-align: center;">${idx + 1}</td>
        <td style="padding: 7px 8px; font-weight: 600; white-space: nowrap;">${it.date} в ${it.time}</td>
        <td style="padding: 7px 8px;">${it.clientName || 'Гость салона'}</td>
        <td style="padding: 7px 8px; font-weight: 600;">${it.serviceName}</td>
        <td style="padding: 7px 8px; text-align: right; font-weight: 600;">${window.noirData.formatMoney(it.price)}</td>
        <td style="padding: 7px 8px; text-align: center; color: #6B7280;">${it.commissionPercent || order.commissionPercent}%</td>
        <td style="padding: 7px 8px; text-align: right; font-weight: 800; color: #000000;">${window.noirData.formatMoney(it.masterShare)}</td>
        <td style="padding: 7px 8px; text-align: right; color: #059669; font-weight: 600;">${window.noirData.formatMoney(it.salonShare)}</td>
      </tr>
    `).join('');
  } else {
    itemsHtml = `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td colspan="8" style="padding: 14px 10px; text-align: center; color: #6B7280;">
          Выполненные услуги за расчётный период (${order.servicesCount} услуг, валовая касса ${window.noirData.formatMoney(order.grossRevenue)}).
        </td>
      </tr>
    `;
  }

  printArea.innerHTML = `
    <div style="padding: 24px 32px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #111827; background: #FFFFFF; line-height: 1.45;">
      <!-- Шапка салона -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h1 style="font-size: 24px; font-weight: 900; letter-spacing: 1.5px; margin: 0; color: #000000;">NOIR HAIR ATELIER</h1>
            <span style="font-size: 11px; background: #111827; color: var(--text-main); padding: 2px 6px; border-radius: 3px; font-weight: 700;">ORIGINAL</span>
          </div>
          <p style="font-size: 12px; color: #4B5563; margin: 4px 0 0;">Премиальное ателье авторских стрижек, сложного окрашивания и SPA</p>
          <p style="font-size: 11px; color: #6B7280; margin: 2px 0 0;">📍 ${salon.address || '48 An Thuong 2, Da Nang'} • 📞 ${salon.phone || '+84 90 123 4567'} • 🌐 noir.viet</p>
        </div>
        <div style="text-align: right;">
          <div style="display: inline-block; background: #F3F4F6; border: 1px solid #D1D5DB; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
            Расходный кассовый ордер
          </div>
          <h2 style="font-size: 20px; font-weight: 900; margin: 6px 0 2px; color: #111827; font-family: monospace;">Ордер #${order.id}</h2>
          <p style="font-size: 11px; color: #6B7280; margin: 0;">Выдан: ${order.dateFormatted} в ${order.timeFormatted || '18:00'}</p>
        </div>
      </div>

      <!-- Данные мастера и период начисления -->
      <div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 16px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px;">
        <div>
          <div style="font-size: 10px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Получатель денежных средств (Мастер):</div>
          <div style="font-size: 17px; font-weight: 900; color: #111827; margin-top: 2px;">${order.specialistName}</div>
          <div style="font-size: 12px; color: #4B5563; margin-top: 2px;">
            ${order.specialistRole} • Индивидуальная ставка: <strong>${order.commissionPercent}%</strong>
          </div>
        </div>
        <div style="border-left: 1px solid #E5E7EB; padding-left: 16px;">
          <div style="font-size: 10px; color: #6B7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Расчётный период:</div>
          <div style="font-size: 13px; font-weight: 800; color: #111827; margin-top: 2px;">${order.periodLabel || (order.startDate + ' — ' + order.endDate)}</div>
          <div style="font-size: 11px; color: #059669; font-weight: 800; margin-top: 3px;">
            ✓ Закрыт и проведён по кассе
          </div>
        </div>
      </div>

      <!-- Детализация оказанных услуг -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; margin: 0;">
            Детализация услуг мастера за расчётный период
          </h3>
          <span style="font-size: 11px; color: #6B7280;">Всего процедур: <strong>${order.servicesCount || (order.items ? order.items.length : 0)}</strong></span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
          <thead>
            <tr style="background: #F3F4F6; border-top: 1px solid #D1D5DB; border-bottom: 1px solid #D1D5DB; color: #374151;">
              <th style="padding: 7px 8px; width: 28px; text-align: center;">№</th>
              <th style="padding: 7px 8px;">Дата / Время</th>
              <th style="padding: 7px 8px;">Гость</th>
              <th style="padding: 7px 8px;">Наименование процедуры</th>
              <th style="padding: 7px 8px; text-align: right;">Чек гостя</th>
              <th style="padding: 7px 8px; text-align: center;">Ставка</th>
              <th style="padding: 7px 8px; text-align: right;">Мастеру (${order.commissionPercent}%)</th>
              <th style="padding: 7px 8px; text-align: right;">Салону</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #F9FAFB; border-top: 2px solid #D1D5DB; font-weight: 800;">
              <td colspan="4" style="padding: 8px 8px; text-align: right;">ИТОГО ПО ВЕДОМОСТИ:</td>
              <td style="padding: 8px 8px; text-align: right;">${window.noirData.formatMoney(order.grossRevenue)}</td>
              <td style="padding: 8px 8px; text-align: center;">—</td>
              <td style="padding: 8px 8px; text-align: right; font-size: 12px; color: #000000;">${window.noirData.formatMoney(order.amount)}</td>
              <td style="padding: 8px 8px; text-align: right; color: #059669;">${window.noirData.formatMoney(order.salonMargin)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Итоговый кассовый блок -->
      <div style="background: #F3F4F6; border: 2px solid #111827; border-radius: 6px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
        <div>
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111827; letter-spacing: 0.5px;">СУММА К ВЫДАЧЕ НА РУКИ:</div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 3px;">
            Способ выдачи: <strong>${order.paymentMethod || 'Наличные из кассы'}</strong> • Примечание: ${order.notes || 'Выплата произведена полностью'}
          </div>
        </div>
        <div style="font-size: 26px; font-weight: 900; color: #000000; letter-spacing: 0.5px;">
          ${window.noirData.formatMoney(order.amount)}
        </div>
      </div>

      <!-- Юридический блок подписей -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 26px; padding-top: 14px; border-top: 1px dashed #D1D5DB;">
        <div style="border: 1px solid #E5E7EB; border-radius: 6px; padding: 14px 16px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111827; margin-bottom: 4px;">Выплату из кассы произвёл:</div>
          <div style="font-size: 12px; color: #4B5563;">Администратор / Управляющий: <strong>${order.issuedBy || 'Владелец NOIR Atelier'}</strong></div>
          <div style="margin-top: 34px; border-top: 1px solid #111827; padding-top: 4px; display: flex; justify-content: space-between; font-size: 10px; color: #6B7280;">
            <span>(подпись)</span>
            <span>(М.П. / дата)</span>
          </div>
        </div>

        <div style="border: 1px solid #E5E7EB; border-radius: 6px; padding: 14px 16px;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #111827; margin-bottom: 4px;">Сумму получил в полном объёме:</div>
          <div style="font-size: 11px; color: #4B5563; line-height: 1.35;">
            Мастер: <strong>${order.specialistName}</strong><br>
            <em>«С расчётом ознакомлен и согласен, денежные средства в сумме ${window.noirData.formatMoney(order.amount)} получил полностью, претензий к ателье не имею»</em>
          </div>
          <div style="margin-top: 18px; border-top: 1px solid #111827; padding-top: 4px; display: flex; justify-content: space-between; font-size: 10px; color: #6B7280;">
            <span>(личная подпись мастера)</span>
            <span>(дата: ${order.dateFormatted})</span>
          </div>
        </div>
      </div>
    </div>
  `;

  window.print();
};

// ==========================================
// 6.4 ПЕЧАТЬ СВОДНОЙ ВЕДОМОСТИ НА САЛОН (А4)
// ==========================================
window.printWeeklyPayrollSummary = function(startDate, endDate) {
  const dateRange = getPayrollDateRange();
  const start = startDate || dateRange.startDate;
  const end = endDate || dateRange.endDate;

  const payrollData = window.noirData.calculatePayroll({
    startDate: start,
    endDate: end,
    includeConfirmed: payrollIncludeConfirmed
  });

  const printArea = document.getElementById('printableDocumentArea');
  if (!printArea) return;

  const salon = window.noirData.getSalonInfo();
  const now = new Date();
  const printDateStr = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const printTimeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  let rowsHtml = '';
  payrollData.specialists.forEach((sp, idx) => {
    const paidOrder = window.noirData.getPayoutOrderForPeriod(sp.specialistId, start, end);
    const isPaid = !!paidOrder;

    rowsHtml += `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 8px; text-align: center; color: #6B7280;">${idx + 1}</td>
        <td style="padding: 8px; font-weight: 800; color: #000000;">${sp.specialistName}</td>
        <td style="padding: 8px; color: #4B5563; font-size: 11px;">${sp.specialistRole}</td>
        <td style="padding: 8px; text-align: center; font-weight: 700;">${sp.commissionPercent}%</td>
        <td style="padding: 8px; text-align: center; font-weight: 700;">${sp.totalServicesCount}</td>
        <td style="padding: 8px; text-align: right; font-weight: 600;">${window.noirData.formatMoney(sp.grossRevenue)}</td>
        <td style="padding: 8px; text-align: right; color: #059669; font-weight: 700;">${window.noirData.formatMoney(sp.salonMargin)}</td>
        <td style="padding: 8px; text-align: right; font-weight: 900; font-size: 13px; color: #000000;">${window.noirData.formatMoney(sp.masterPayroll)}</td>
        <td style="padding: 8px; text-align: center;">
          ${isPaid ? `
            <span style="display: inline-block; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
              ✓ Выплачено (#${paidOrder.id})
            </span>
          ` : `
            <span style="color: #9CA3AF; font-size: 11px;">К начислению</span>
          `}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #D1D5DB; width: 140px; text-align: center;">
          ${isPaid ? `
            <span style="font-size: 10px; color: #059669; font-weight: 700;">Подписано в ордере</span>
          ` : `
            <div style="border-bottom: 1px solid #9CA3AF; margin-top: 14px;"></div>
          `}
        </td>
      </tr>
    `;
  });

  printArea.innerHTML = `
    <div style="padding: 24px 32px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #111827; background: #FFFFFF; line-height: 1.45;">
      <!-- Шапка ведомости -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111827; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 24px; font-weight: 900; letter-spacing: 1.5px; margin: 0; color: #000000;">NOIR HAIR ATELIER</h1>
          <p style="font-size: 12px; color: #4B5563; margin: 4px 0 0;">Сводная зарплатная ведомость мастеров и специалистов ателье</p>
          <p style="font-size: 11px; color: #6B7280; margin: 2px 0 0;">📍 ${salon.address || '48 An Thuong 2, Da Nang'} • 📞 ${salon.phone || '+84 90 123 4567'}</p>
        </div>
        <div style="text-align: right;">
          <div style="display: inline-block; background: #F3F4F6; border: 1px solid #D1D5DB; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
            Сводный реестр выплат
          </div>
          <div style="font-size: 14px; font-weight: 800; margin-top: 6px; color: #111827;">Период: ${dateRange.label}</div>
          <p style="font-size: 11px; color: #6B7280; margin: 2px 0 0;">Сформировано: ${printDateStr} в ${printTimeStr}</p>
        </div>
      </div>

      <!-- Таблица мастеров -->
      <div style="margin-bottom: 22px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
          <thead>
            <tr style="background: #F3F4F6; border-top: 1px solid #D1D5DB; border-bottom: 1px solid #D1D5DB; color: #374151;">
              <th style="padding: 8px; width: 28px; text-align: center;">№</th>
              <th style="padding: 8px;">Специалист</th>
              <th style="padding: 8px;">Должность</th>
              <th style="padding: 8px; text-align: center;">Ставка</th>
              <th style="padding: 8px; text-align: center;">Услуг</th>
              <th style="padding: 8px; text-align: right;">Касса мастера</th>
              <th style="padding: 8px; text-align: right;">Доход салона</th>
              <th style="padding: 8px; text-align: right;">К выплате</th>
              <th style="padding: 8px; text-align: center;">Статус ордера</th>
              <th style="padding: 8px; text-align: center;">Подпись в получении</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #F9FAFB; border-top: 2px solid #111827; font-weight: 800; font-size: 12px;">
              <td colspan="4" style="padding: 10px 8px; text-align: right;">ИТОГО ПО САЛОНУ:</td>
              <td style="padding: 10px 8px; text-align: center;">${payrollData.summary.totalServicesCount}</td>
              <td style="padding: 10px 8px; text-align: right;">${window.noirData.formatMoney(payrollData.summary.totalRevenue)}</td>
              <td style="padding: 10px 8px; text-align: right; color: #059669;">${window.noirData.formatMoney(payrollData.summary.salonMargin)}</td>
              <td style="padding: 10px 8px; text-align: right; font-size: 14px; color: #000000;">${window.noirData.formatMoney(payrollData.summary.totalPayroll)}</td>
              <td colspan="2" style="padding: 10px 8px;"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Сводка и финансовый итог -->
      <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 14px 18px; margin-bottom: 26px; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: #4B5563;">
          Общий фонд начисленной заработной платы за период составляет: <strong style="color: #000000;">${window.noirData.formatMoney(payrollData.summary.totalPayroll)}</strong><br>
          Чистый доход ателье после выплат мастерам: <strong style="color: #059669;">${window.noirData.formatMoney(payrollData.summary.salonMargin)}</strong>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 10px; color: #6B7280; text-transform: uppercase; font-weight: 700;">Фонд оплаты труда:</div>
          <div style="font-size: 22px; font-weight: 900; color: #111827;">${window.noirData.formatMoney(payrollData.summary.totalPayroll)}</div>
        </div>
      </div>

      <!-- Подписи руководства -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 36px; padding-top: 16px; border-top: 1px dashed #D1D5DB;">
        <div>
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #374151;">Сводную ведомость составил:</div>
          <div style="font-size: 12px; color: #4B5563; margin-top: 2px;">Главный администратор NOIR Atelier</div>
          <div style="margin-top: 32px; border-top: 1px solid #111827; padding-top: 4px; display: flex; justify-content: space-between; font-size: 10px; color: #6B7280;">
            <span>(подпись)</span>
            <span>(Ф.И.О.)</span>
          </div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #374151;">Выплату зарплатного фонда утвердил:</div>
          <div style="font-size: 12px; color: #4B5563; margin-top: 2px;">Управляющий / Владелец ателье</div>
          <div style="margin-top: 32px; border-top: 1px solid #111827; padding-top: 4px; display: flex; justify-content: space-between; font-size: 10px; color: #6B7280;">
            <span>(подпись)</span>
            <span>(М.П. / дата)</span>
          </div>
        </div>
      </div>
    </div>
  `;

  window.print();
};






  // ==========================================
  // PULSECORE ENGINE INGESTION & BOOTSTRAP
  // Runs after ALL state, variables, and controllers are fully initialized
  // ==========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAdmin();
    });
  } else {
    initAdmin();
  }
})();
