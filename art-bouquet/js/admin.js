/**
 * Art Bouquet CRM Engine
 * Manages orders log, bouquets availability (In Stock / Preorder),
 * price edits, adding new bouquets, and Telegram notifications.
 */

const PIN_CODE_DEFAULT = "1234";

// Local storage keys
const STORAGE_KEYS = {
  AUTH: 'art_bouquet_admin_auth',
  ORDERS: 'art_bouquet_orders_log',
  CUSTOM_BOUQUETS: 'art_bouquet_custom_items',
  AVAILABILITY: 'art_bouquet_availability_map',
  PRICES: 'art_bouquet_prices_map',
  DETAILS: 'art_bouquet_details_map', // id -> { title, package, color, photo }
  DELETED: 'art_bouquet_deleted_ids'  // array of deleted bouquet IDs
};

// Initial state
let currentTab = 'orders';
let allBouquets = [];
let ordersLog = [];
let availabilityMap = {}; // id -> 'in_stock' | 'preorder' | 'hidden'
let pricesMap = {};       // id -> custom price number
let detailsMap = {};      // id -> { title, package, color }
let deletedIds = [];      // array of deleted bouquet IDs
let uploadedNewPhotos = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  loadData();
  setupNavigation();
  setupEventListeners();
  renderKPIs();
  renderOrders();
  renderBouquetsTable();
});

// 1. PIN Authentication
function initAuth() {
  const pinLockScreen = document.getElementById('pinLockScreen');
  const adminMainLayout = document.getElementById('adminMainLayout');
  const pinForm = document.getElementById('pinForm');
  const pinInput = document.getElementById('pinInput');
  const pinError = document.getElementById('pinError');

  const isAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
  if (isAuth === 'true') {
    pinLockScreen.style.display = 'none';
    adminMainLayout.style.display = 'flex';
  } else {
    pinLockScreen.style.display = 'flex';
    adminMainLayout.style.display = 'none';
    setTimeout(() => pinInput.focus(), 200);
  }

  pinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (pinInput.value === PIN_CODE_DEFAULT) {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      pinError.style.display = 'none';
      pinLockScreen.style.display = 'none';
      adminMainLayout.style.display = 'flex';
      showToast('Успешный вход в CRM Art Bouquet 🌸');
    } else {
      pinError.style.display = 'block';
      pinInput.value = '';
      pinInput.focus();
    }
  });

  // Logout button
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    window.location.reload();
  });
}

// 2. Load and Sync Data
function loadData() {
  // Base bouquets from data.js
  const baseData = window.ART_BOUQUETS_DATA || [];
  
  // Custom added bouquets
  const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_BOUQUETS);
  const customItems = savedCustom ? JSON.parse(savedCustom) : [];
  
  // Availability map (default: all are in_stock)
  const savedAvail = localStorage.getItem(STORAGE_KEYS.AVAILABILITY);
  availabilityMap = savedAvail ? JSON.parse(savedAvail) : {};
  
  // Custom prices
  const savedPrices = localStorage.getItem(STORAGE_KEYS.PRICES);
  pricesMap = savedPrices ? JSON.parse(savedPrices) : {};

  // Custom details (title, package, color)
  const savedDetails = localStorage.getItem(STORAGE_KEYS.DETAILS);
  detailsMap = savedDetails ? JSON.parse(savedDetails) : {};

  // Deleted bouquets IDs
  const savedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED);
  deletedIds = savedDeleted ? JSON.parse(savedDeleted) : [];

  // Combine items and exclude deleted
  allBouquets = [...customItems, ...baseData].filter(b => !deletedIds.includes(b.id));

  // Apply details to allBouquets
  allBouquets.forEach(b => {
    if (detailsMap[b.id]) {
      if (detailsMap[b.id].title) b.title = detailsMap[b.id].title;
      if (detailsMap[b.id].package) b.package = detailsMap[b.id].package;
      if (detailsMap[b.id].color) b.color = detailsMap[b.id].color;
      if (detailsMap[b.id].photo) {
        b.primary_thumb = detailsMap[b.id].photo;
        b.primary_image = detailsMap[b.id].photo;
        b.images = [detailsMap[b.id].photo];
      }
    }
    if (pricesMap[b.id] !== undefined) {
      b.price = pricesMap[b.id];
      b.price_formatted = b.price.toLocaleString('ru-RU') + ' ₫';
    }
  });

  // Set default availability if not set
  allBouquets.forEach(b => {
    if (!availabilityMap[b.id]) {
      // For demo realism: mark first 35 as in_stock, others as preorder
      availabilityMap[b.id] = b.id <= 35 ? 'in_stock' : 'preorder';
    }
  });

  // Load orders
  const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (savedOrders) {
    try {
      ordersLog = JSON.parse(savedOrders).filter(o => o.id !== 4892 && o.id !== 4891 && o.id !== 4889);
    } catch (e) {
      ordersLog = [];
    }
  } else {
    ordersLog = [];
  }
  saveOrders();
}

function saveOrders() {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordersLog));
}

function saveAvailability() {
  localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(availabilityMap));
}

function savePrices() {
  localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(pricesMap));
}

function saveDetails() {
  localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(detailsMap));
}

function saveDeleted() {
  localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(deletedIds));
}

function saveCustomBouquets(items) {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_BOUQUETS, JSON.stringify(items));
}

// 3. Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = item.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.admin-nav-item[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.classList.toggle('active', tab.id === `tab-${tabName}`);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. Render KPIs
function renderKPIs() {
  const inStockCount = allBouquets.filter(b => availabilityMap[b.id] === 'in_stock').length;
  const preorderCount = allBouquets.filter(b => availabilityMap[b.id] === 'preorder').length;
  const newOrdersCount = ordersLog.filter(o => o.status === 'new').length;

  document.getElementById('kpiTotalBouquets').textContent = allBouquets.length;
  document.getElementById('kpiInStock').textContent = inStockCount;
  document.getElementById('kpiPreorder').textContent = preorderCount;
  document.getElementById('kpiNewOrders').textContent = newOrdersCount;
  
  const badgeEl = document.getElementById('ordersBadge');
  if (badgeEl) {
    badgeEl.textContent = newOrdersCount;
    badgeEl.style.display = newOrdersCount > 0 ? 'inline-block' : 'none';
  }
}

// 5. Render Orders Log
function renderOrders() {
  const container = document.getElementById('ordersTableBody');
  if (!container) return;

  if (ordersLog.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--admin-text-muted);">
          📭 Пока нет заказов. Оформите тестовый заказ на витрине сайта!
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = ordersLog.map(order => {
    let statusBadge = '';
    if (order.status === 'new') {
      statusBadge = `<span class="status-badge" style="background: #FEF3C7; color: #D97706;">⚡ Новый заказ</span>`;
    } else if (order.status === 'in_progress') {
      statusBadge = `<span class="status-badge" style="background: #DBEAFE; color: #1E40AF;">⏳ Собирается</span>`;
    } else {
      statusBadge = `<span class="status-badge status-in-stock">✓ Доставлен</span>`;
    }

    // Contact link
    let contactHtml = escapeHtml(order.customerContact);
    const tgMatch = (order.customerContact || '').match(/@([a-zA-Z0-9_]{3,32})/);
    if (tgMatch) {
      contactHtml = `<a href="https://t.me/${tgMatch[1]}" target="_blank" style="color: var(--admin-primary); text-decoration: underline; font-weight: 600;">${escapeHtml(order.customerContact)} ↗</a>`;
    }

    // Card/note text formatting: explicitly separate custom handwritten text from clean cards
    const hasCardText = order.card && order.card.trim() && order.card !== 'Чистая' && order.card !== 'Чистая открытка';
    let cardRowHtml = '';
    if (hasCardText) {
      cardRowHtml = `
        <div style="margin-top: 4px; font-size: 0.76rem;">
          <span style="color: var(--admin-text-light); font-weight: 500;">💌 Текст:</span>
          <span style="display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 2px 7px; border-radius: 5px; font-style: italic; font-weight: 500; margin-top: 2px;">«${escapeHtml(order.card)}»</span>
        </div>
      `;
    } else {
      const formatTitle = order.cardFormat ? order.cardFormat.split('(')[0].trim() : '💌 Открытка';
      cardRowHtml = `
        <div style="margin-top: 4px; font-size: 0.73rem; color: #94a3b8; font-style: italic;">
          ${escapeHtml(formatTitle)}: <span style="color: #64748b;">(без текста, приложить чистую)</span>
        </div>
      `;
    }

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--admin-text-main);">#${order.id}</div>
          <div style="font-size: 0.76rem; color: var(--admin-text-light);">${escapeHtml(order.date)}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(order.customerName)}</div>
          <div style="font-size: 0.82rem; margin-top: 2px;">${contactHtml}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(order.bouquetTitle)}</div>
          ${order.bouquetSku ? `<div style="font-size: 0.72rem; color: var(--admin-text-light);">Арт: #${escapeHtml(order.bouquetSku)}</div>` : ''}
          ${order.addon && order.addon !== 'Без дополнений' ? `<div style="font-size: 0.75rem; color: var(--admin-text-muted); margin-top: 2px;">${escapeHtml(order.addon)}</div>` : ''}
          ${cardRowHtml}
        </td>
        <td>
          <div style="font-size: 0.82rem; font-weight: 500;">${escapeHtml(order.orderType)}</div>
          <div style="font-size: 0.76rem; color: var(--admin-text-muted);">${escapeHtml(order.address || 'Студия')}</div>
        </td>
        <td>
          <strong style="color: var(--admin-primary-dark); font-size: 0.95rem;">${escapeHtml(order.total)}</strong>
        </td>
        <td>${statusBadge}</td>
        <td>
          <select class="admin-select" style="padding: 4px 8px; font-size: 0.78rem;" onchange="changeOrderStatus(${order.id}, this.value)">
            <option value="new" ${order.status === 'new' ? 'selected' : ''}>⚡ Новый</option>
            <option value="in_progress" ${order.status === 'in_progress' ? 'selected' : ''}>⏳ В сборке</option>
            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>✓ Доставлен</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function changeOrderStatus(orderId, newStatus) {
  const order = ordersLog.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrders();
    renderKPIs();
    renderOrders();
    showToast(`Статус заказа #${orderId} изменен`);
  }
}

// 6. Render Bouquets Table with Live In-Stock / Preorder toggles and inline editing
function renderBouquetsTable(filterKeyword = '') {
  const tbody = document.getElementById('bouquetsTableBody');
  if (!tbody) return;

  const keyword = filterKeyword.toLowerCase().trim();
  const items = allBouquets.filter(b => {
    if (!keyword) return true;
    return (b.title && b.title.toLowerCase().includes(keyword)) ||
           (b.sku && b.sku.toLowerCase().includes(keyword)) ||
           (b.package && b.package.toLowerCase().includes(keyword)) ||
           (b.color && b.color.toLowerCase().includes(keyword));
  });

  const packageOptions = ['Букет', 'В шляпной коробке', 'В корзине', 'В сумочке', 'Игрушки и Сладости'];
  const colorOptions = ['Нежно-розовые и Персик', 'Солнечные и Желтые', 'Красные и Бордо', 'Белые и Кремовые', 'Микс'];

  tbody.innerHTML = items.map(b => {
    const isAvail = availabilityMap[b.id] !== 'preorder';
    const currentPrice = pricesMap[b.id] !== undefined ? pricesMap[b.id] : b.price;
    const currentTitle = (detailsMap[b.id] && detailsMap[b.id].title) || b.title;
    const currentPkg = (detailsMap[b.id] && detailsMap[b.id].package) || b.package || 'Букет';
    const currentColor = (detailsMap[b.id] && detailsMap[b.id].color) || b.color || 'Нежно-розовые и Персик';
    const thumbImg = b.primary_thumb || b.primary_image || (b.images && b.images[0]) || 'images/logo.jpg';

    return `
      <tr data-bouquet-id="${b.id}">
        <td style="width: 50px;">
          <img src="${thumbImg}" alt="" style="width: 46px; height: 46px; border-radius: 8px; object-fit: cover; border: 1px solid var(--admin-border);">
        </td>
        <td style="white-space: nowrap;">
          <span style="font-weight: 700; font-family: monospace; font-size: 0.88rem; padding: 4px 8px; background: var(--admin-surface-subtle); border: 1px solid var(--admin-border); border-radius: 6px; color: var(--admin-primary-dark);">
            #${escapeHtml(b.sku || '---')}
          </span>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--admin-text-main); font-size: 0.95rem;">${escapeHtml(currentTitle)}</div>
          ${b.description ? `<div style="font-size: 0.74rem; color: var(--admin-text-light); max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(b.description)}</div>` : ''}
        </td>
        <td>
          <span class="status-badge" style="background: rgba(189, 117, 111, 0.08); color: var(--admin-text-main); border: 1px solid var(--admin-border);">
            ${escapeHtml(currentPkg)}
          </span>
        </td>
        <td>
          <span style="font-size: 0.82rem; color: var(--admin-text-muted);">
            ${escapeHtml(currentColor)}
          </span>
        </td>
        <td>
          <strong style="color: var(--admin-primary-dark); font-size: 0.96rem; white-space: nowrap;">
            ${currentPrice.toLocaleString('ru-RU')} ₫
          </strong>
        </td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${isAvail ? 'checked' : ''} onchange="toggleBouquetAvailability(${b.id}, this.checked)">
            <span class="toggle-slider"></span>
            <span style="font-size: 0.82rem; font-weight: 600; color: ${isAvail ? 'var(--admin-success)' : 'var(--admin-warning)'}; white-space: nowrap;">
              ${isAvail ? '🟢 В наличии' : '🟡 Под заказ'}
            </span>
          </label>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn-admin btn-admin-primary btn-admin-sm" onclick="openEditModal(${b.id})">
            <span>✏️</span>
            <span>Редактировать</span>
          </button>
          <button class="btn-admin btn-admin-sm" style="margin-left: 6px; background: rgba(239, 68, 68, 0.1); color: var(--admin-danger); border: 1px solid rgba(239, 68, 68, 0.25);" onclick="deleteBouquet(${b.id})" title="Удалить букет из каталога">
            <span>🗑️</span>
            <span>Удалить</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function deleteBouquet(bouquetId) {
  const bouquet = allBouquets.find(b => b.id == bouquetId);
  const title = bouquet ? bouquet.title : 'букет';
  if (confirm(`Вы уверены, что хотите удалить букет «${title}» из витрины?`)) {
    if (!deletedIds.includes(bouquetId)) {
      deletedIds.push(bouquetId);
      saveDeleted();
    }
    allBouquets = allBouquets.filter(b => b.id != bouquetId);
    renderKPIs();
    renderBouquetsTable();
    showToast(`🗑️ Букет «${title}» удален из витрины`);
  }
}

let tempEditPhoto = null; // Holds new photo base64 during edit

// Open Edit Bouquet Modal
function openEditModal(bouquetId) {
  const bouquet = allBouquets.find(b => b.id == bouquetId);
  if (!bouquet) return;

  const currentPrice = pricesMap[bouquet.id] !== undefined ? pricesMap[bouquet.id] : bouquet.price;
  const currentTitle = (detailsMap[bouquet.id] && detailsMap[bouquet.id].title) || bouquet.title;
  const currentPkg = (detailsMap[bouquet.id] && detailsMap[bouquet.id].package) || bouquet.package || 'Букет';
  const currentColor = (detailsMap[bouquet.id] && detailsMap[bouquet.id].color) || bouquet.color || 'Нежно-розовые и Персик';
  const currentStatus = availabilityMap[bouquet.id] || 'in_stock';
  const currentDesc = (detailsMap[bouquet.id] && detailsMap[bouquet.id].description) || bouquet.description || '';
  const currentPhoto = (detailsMap[bouquet.id] && detailsMap[bouquet.id].photo) || bouquet.primary_thumb || bouquet.primary_image || (bouquet.images && bouquet.images[0]) || 'images/logo.jpg';

  tempEditPhoto = null;
  document.getElementById('editBouquetId').value = bouquet.id;
  document.getElementById('editSku').value = '#' + (bouquet.sku || '---');
  document.getElementById('editTitle').value = currentTitle;
  document.getElementById('editPrice').value = currentPrice;
  document.getElementById('editPackage').value = currentPkg;
  document.getElementById('editColor').value = currentColor;
  document.getElementById('editStatus').value = currentStatus;
  document.getElementById('editDesc').value = currentDesc;

  const photoImg = document.getElementById('editCurrentPhotoImg');
  if (photoImg) photoImg.src = currentPhoto;

  document.getElementById('editModalHeaderTitle').textContent = `Редактирование: «${currentTitle}»`;
  document.getElementById('editBouquetModal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('editBouquetModal').style.display = 'none';
  tempEditPhoto = null;
}

function removeEditPhoto() {
  const photoImg = document.getElementById('editCurrentPhotoImg');
  if (photoImg) photoImg.src = 'images/logo.jpg';
  tempEditPhoto = 'images/logo.jpg';
  showToast('Фотография удалена (установлен фирменный логотип). Нажмите «Сохранить», чтобы применить.');
}

function toggleBouquetAvailability(id, isChecked) {
  availabilityMap[id] = isChecked ? 'in_stock' : 'preorder';
  saveAvailability();
  renderKPIs();
  showToast(isChecked ? '🟢 Статус: В наличии (доставка 60 мин)' : '🟡 Статус: Под заказ (1–2 дня)');
}

// 7. Add New Bouquet Form
function setupEventListeners() {
  // Search in table
  const searchTableInput = document.getElementById('searchBouquetTable');
  if (searchTableInput) {
    searchTableInput.addEventListener('input', (e) => {
      renderBouquetsTable(e.target.value);
    });
  }

  // Quick filter chips in admin
  document.querySelectorAll('.admin-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.admin-filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');
      if (filter === 'in_stock') {
        const items = allBouquets.filter(b => availabilityMap[b.id] === 'in_stock');
        renderFilteredTable(items);
      } else if (filter === 'preorder') {
        const items = allBouquets.filter(b => availabilityMap[b.id] === 'preorder');
        renderFilteredTable(items);
      } else {
        renderBouquetsTable();
      }
    });
  });

  // Photo Upload Simulation
  const photoInput = document.getElementById('newBouquetPhotoInput');
  const dropzone = document.getElementById('uploadDropzone');
  const previewWrap = document.getElementById('uploadPreviewWrap');

  if (dropzone && photoInput) {
    dropzone.addEventListener('click', () => photoInput.click());
    
    photoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedNewPhotos.push(event.target.result);
          renderUploadPreviews();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Form submit: Add bouquet
  const addForm = document.getElementById('addBouquetForm');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const title = document.getElementById('newTitle').value.trim();
      const rawSku = (document.getElementById('newSku')?.value || '').trim();
      const price = parseInt(document.getElementById('newPrice').value, 10);
      const pkg = document.getElementById('newPackage').value;
      const color = document.getElementById('newColor').value;
      const status = document.getElementById('newStatus').value;
      const desc = document.getElementById('newDesc').value.trim();

      if (!title || isNaN(price)) {
        alert('Пожалуйста, укажите название и цену букета');
        return;
      }

      if (!rawSku) {
        alert('Пожалуйста, укажите артикул SKU');
        return;
      }

      // Check for SKU uniqueness (case-insensitive)
      const skuClean = rawSku.replace(/^#/, '').trim();
      const skuExists = allBouquets.some(b => (b.sku && b.sku.toString().toLowerCase() === skuClean.toLowerCase()));
      if (skuExists) {
        alert(`❌ Ошибка: Букет с артикулом SKU #${skuClean} уже существует в базе!\nПожалуйста, укажите уникальный номер артикула.`);
        document.getElementById('newSku').focus();
        return;
      }

      const sku = skuClean;
      const defaultImg = uploadedNewPhotos.length > 0 ? uploadedNewPhotos[0] : 'images/logo.jpg';

      const newBouquet = {
        id: Date.now(),
        title: title,
        sku: sku,
        price: price,
        price_formatted: price.toLocaleString('ru-RU') + ' ₫',
        package: pkg,
        color: color,
        description: desc || 'Авторская композиция от флористов Art Bouquet.',
        primary_image: defaultImg,
        primary_thumb: defaultImg,
        images: uploadedNewPhotos.length > 0 ? [...uploadedNewPhotos] : [defaultImg],
        is_custom: true
      };

      // Add to beginning of array
      allBouquets.unshift(newBouquet);
      availabilityMap[newBouquet.id] = status;
      pricesMap[newBouquet.id] = price;

      // Save custom items
      const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_BOUQUETS);
      const customList = savedCustom ? JSON.parse(savedCustom) : [];
      customList.unshift(newBouquet);
      saveCustomBouquets(customList);
      saveAvailability();
      savePrices();

      // Reset form
      addForm.reset();
      uploadedNewPhotos = [];
      renderUploadPreviews();

      renderKPIs();
      renderBouquetsTable();
      switchTab('bouquets');
      showToast(`💐 Букет «${title}» успешно опубликован на сайте!`);
    });
  }

  // Photo Replace in Edit Modal
  const editPhotoInput = document.getElementById('editPhotoInput');
  const editDropzone = document.getElementById('editUploadDropzone');
  if (editDropzone && editPhotoInput) {
    editDropzone.addEventListener('click', () => editPhotoInput.click());
    editPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        tempEditPhoto = event.target.result;
        const photoImg = document.getElementById('editCurrentPhotoImg');
        if (photoImg) photoImg.src = tempEditPhoto;
        showToast('Новое фото загружено. Нажмите «Сохранить», чтобы применить.');
      };
      reader.readAsDataURL(file);
    });
  }

  // Form submit: Edit bouquet modal
  const editForm = document.getElementById('editBouquetForm');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bId = document.getElementById('editBouquetId').value;
      const bouquet = allBouquets.find(b => b.id == bId);
      if (!bouquet) return;

      const newTitle = document.getElementById('editTitle').value.trim();
      const newPrice = parseInt(document.getElementById('editPrice').value, 10);
      const newPkg = document.getElementById('editPackage').value;
      const newColor = document.getElementById('editColor').value;
      const newStatus = document.getElementById('editStatus').value;
      const newDesc = document.getElementById('editDesc').value.trim();

      if (!newTitle || isNaN(newPrice)) {
        alert('Пожалуйста, укажите название и цену букета');
        return;
      }

      // Update detailsMap
      if (!detailsMap[bId]) detailsMap[bId] = {};
      detailsMap[bId].title = newTitle;
      detailsMap[bId].package = newPkg;
      detailsMap[bId].color = newColor;
      detailsMap[bId].description = newDesc;

      // Update photo if changed or removed
      if (tempEditPhoto !== null) {
        detailsMap[bId].photo = tempEditPhoto;
        bouquet.primary_thumb = tempEditPhoto;
        bouquet.primary_image = tempEditPhoto;
        bouquet.images = [tempEditPhoto];
      }

      saveDetails();

      // Update price and availability
      pricesMap[bId] = newPrice;
      savePrices();
      availabilityMap[bId] = newStatus;
      saveAvailability();

      // Update local object
      bouquet.title = newTitle;
      bouquet.price = newPrice;
      bouquet.price_formatted = newPrice.toLocaleString('ru-RU') + ' ₫';
      bouquet.package = newPkg;
      bouquet.color = newColor;
      bouquet.description = newDesc;

      closeEditModal();
      renderKPIs();
      renderBouquetsTable();
      showToast(`✓ Изменения букета «${newTitle}» успешно сохранены!`);
    });
  }
}

function renderUploadPreviews() {
  const previewWrap = document.getElementById('uploadPreviewWrap');
  if (!previewWrap) return;
  previewWrap.innerHTML = uploadedNewPhotos.map((src, idx) => `
    <img src="${src}" class="upload-preview-thumb" alt="Preview ${idx + 1}">
  `).join('');
}

function renderFilteredTable(items) {
  const tbody = document.getElementById('bouquetsTableBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(b => {
    const isAvail = availabilityMap[b.id] !== 'preorder';
    const currentPrice = pricesMap[b.id] !== undefined ? pricesMap[b.id] : b.price;
    const formattedPrice = currentPrice.toLocaleString('ru-RU') + ' ₫';
    const thumbImg = b.primary_thumb || b.primary_image || 'images/logo.jpg';

    return `
      <tr>
        <td style="width: 50px;">
          <img src="${thumbImg}" alt="" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid var(--admin-border);">
        </td>
        <td>
          <div style="font-weight: 600; color: var(--admin-text-main);">${escapeHtml(b.title)}</div>
          <div style="font-size: 0.76rem; color: var(--admin-text-light);">
            ${b.sku ? `SKU #${escapeHtml(b.sku)} • ` : ''}${escapeHtml(b.package || 'Букет')} • ${escapeHtml(b.color || 'Розовый')}
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="number" step="50000" class="price-inline-input" value="${currentPrice}" onchange="updateBouquetPrice(${b.id}, this.value)">
            <span style="font-size: 0.8rem; color: var(--admin-text-light);">₫</span>
          </div>
        </td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${isAvail ? 'checked' : ''} onchange="toggleBouquetAvailability(${b.id}, this.checked)">
            <span class="toggle-slider"></span>
            <span style="font-size: 0.82rem; font-weight: 600; color: ${isAvail ? 'var(--admin-success)' : 'var(--admin-warning)'};">
              ${isAvail ? '🟢 В наличии' : '🟡 Под заказ'}
            </span>
          </label>
        </td>
        <td style="text-align: right;">
          <button class="btn-admin btn-admin-outline btn-admin-sm" onclick="previewBouquet(${b.id})">👁️ Посмотреть</button>
        </td>
      </tr>
    `;
  }).join('');
}

function previewBouquet(id) {
  window.open(`index.html#product-${id}`, '_blank');
}

// 8. Toast Helper
function showToast(msg) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✨</span><span>${escapeHtml(msg)}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Utility
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}
