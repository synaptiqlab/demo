/**
 * Art Bouquet - Fast Modern Client Engine
 * Loads products from products.json, handles filtering, gallery preview,
 * and sends instant 1-click orders to Telegram Bot.
 */

// Telegram Bot credentials for instant orders
const TELEGRAM_CONFIG = {
  botToken: "8779642355:AAFw_hgImReYEd7HQQB8YXs3zXeLpYIGAfQ",
  chatId: "-1004490222393"
};

let allProducts = [];
let currentFiltered = [];
let activeFilters = {
  search: '',
  package: 'all',
  color: 'all',
  price: 'all',
  stock: 'all', // 'all' or 'in_stock'
  sort: 'default' // 'default', 'price_asc', 'price_desc'
};
let selectedProduct = null;

// Availability & custom prices map (synced with CRM admin)
let availabilityMap = {};
let pricesMap = {};
let defaultMaxPrice = 8500000;

let searchInput;
let searchClearBtn;
let filterToggleBtn;
let filterDrawer;
let filterCloseBtn;
let filterResetBtn;
let filterActiveBadge;
let bouquetsGrid;
let countDisplay;
let productModal;
let modalCloseBtn;
let modalMainImg;
let modalThumbsRow;
let modalPackage;
let modalSku;
let modalTitle;
let modalPrice;
let modalDesc;
let fastOrderForm;
let orderSuccessMsg;
let submitOrderBtn;
let optDelivery;
let optPickup;
let addressGroup;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  searchInput = document.getElementById('searchInput');
  searchClearBtn = document.getElementById('searchClearBtn');
  filterToggleBtn = document.getElementById('filterToggleBtn');
  filterDrawer = document.getElementById('filterDrawer');
  filterCloseBtn = document.getElementById('filterCloseBtn');
  filterResetBtn = document.getElementById('filterResetBtn');
  filterActiveBadge = document.getElementById('filterActiveBadge');
  bouquetsGrid = document.getElementById('bouquetsGrid');
  countDisplay = document.getElementById('countDisplay');
  productModal = document.getElementById('productModal');
  modalCloseBtn = document.getElementById('modalCloseBtn');
  modalMainImg = document.getElementById('modalMainImg');
  modalThumbsRow = document.getElementById('modalThumbsRow');
  modalPackage = document.getElementById('modalPackage');
  modalSku = document.getElementById('modalSku');
  modalTitle = document.getElementById('modalTitle');
  modalPrice = document.getElementById('modalPrice');
  modalDesc = document.getElementById('modalDesc');
  fastOrderForm = document.getElementById('fastOrderForm');
  orderSuccessMsg = document.getElementById('orderSuccessMsg');
  submitOrderBtn = document.getElementById('submitOrderBtn');
  optDelivery = document.getElementById('optDelivery');
  optPickup = document.getElementById('optPickup');
  addressGroup = document.getElementById('addressGroup');

  loadCatalogData();
  initDeliveryToggle();
  initFilters();
  initModalListeners();
});

// Load products
async function loadCatalogData() {
  try {
    // 1. Availability, Prices & Details from CRM LocalStorage
    const savedAvail = localStorage.getItem('art_bouquet_availability_map');
    availabilityMap = savedAvail ? JSON.parse(savedAvail) : {};
    
    const savedPrices = localStorage.getItem('art_bouquet_prices_map');
    pricesMap = savedPrices ? JSON.parse(savedPrices) : {};

    const savedDetails = localStorage.getItem('art_bouquet_details_map');
    const detailsMap = savedDetails ? JSON.parse(savedDetails) : {};

    // 2. Custom bouquets created in CRM
    const savedCustom = localStorage.getItem('art_bouquet_custom_items');
    const customItems = savedCustom ? JSON.parse(savedCustom) : [];

    let baseData = [];
    if (window.ART_BOUQUETS_DATA && Array.isArray(window.ART_BOUQUETS_DATA) && window.ART_BOUQUETS_DATA.length > 0) {
      baseData = window.ART_BOUQUETS_DATA;
    } else {
      const res = await fetch('products.json?v=' + Date.now());
      if (!res.ok) throw new Error('Failed to load products');
      baseData = await res.json();
    }
    
    const savedDeleted = localStorage.getItem('art_bouquet_deleted_ids');
    const deletedList = savedDeleted ? JSON.parse(savedDeleted) : [];

    allProducts = [...customItems, ...baseData].filter(p => !deletedList.includes(p.id));

    // Default availability logic: if not explicitly set, first 35 in_stock, rest preorder
    allProducts.forEach(p => {
      if (!availabilityMap[p.id]) {
        availabilityMap[p.id] = p.id <= 35 ? 'in_stock' : 'preorder';
      }
      if (pricesMap[p.id] !== undefined) {
        p.price = pricesMap[p.id];
        p.price_formatted = p.price.toLocaleString('ru-RU') + ' ₫';
      }
      if (detailsMap[p.id]) {
        if (detailsMap[p.id].title) p.title = detailsMap[p.id].title;
        if (detailsMap[p.id].package) p.package = detailsMap[p.id].package;
        if (detailsMap[p.id].color) p.color = detailsMap[p.id].color;
        if (detailsMap[p.id].photo) {
          p.primary_thumb = detailsMap[p.id].photo;
          p.primary_image = detailsMap[p.id].photo;
          p.images = [detailsMap[p.id].photo];
        }
      }
    });

    allProducts = allProducts.filter(p => p.primary_thumb || p.primary_image || p.title);
    
    initPriceSlider();
    applyFilters();
  } catch (err) {
    console.error('Error loading catalog:', err);
    if (window.ART_BOUQUETS_DATA) {
      allProducts = window.ART_BOUQUETS_DATA;
      initPriceSlider();
      applyFilters();
    }
  }
}

// Filter listeners
function initFilters() {
  // Search input live filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeFilters.search = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = activeFilters.search ? 'flex' : 'none';
      }
      applyFilters();
      updateFilterActiveBadge();
    });
  }

  // Clear search button
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      activeFilters.search = '';
      searchClearBtn.style.display = 'none';
      applyFilters();
      updateFilterActiveBadge();
    });
  }

  // Toggle filter drawer
  if (filterToggleBtn && filterDrawer) {
    filterToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = filterDrawer.classList.toggle('open');
      filterToggleBtn.classList.toggle('open', isOpen);
    });
  }

  // Close filter drawer button
  if (filterCloseBtn && filterDrawer) {
    filterCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeFilterDrawer();
    });
  }

  // Close drawer when clicking outside header
  document.addEventListener('click', (e) => {
    if (filterDrawer && filterDrawer.classList.contains('open')) {
      const header = document.getElementById('siteHeader');
      if (header && !header.contains(e.target)) {
        closeFilterDrawer();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterDrawer && filterDrawer.classList.contains('open')) {
      closeFilterDrawer();
    }
  });

  // Filter chips helper
  function setupChipGroup(containerId, filterKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const chips = container.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilters[filterKey] = chip.getAttribute('data-filter');
        applyFilters();
        updateFilterActiveBadge();
      });
    });
  }

  setupChipGroup('filterPackage', 'package');
  setupChipGroup('filterColor', 'color');

  // Setup Sort Chips
  const sortContainer = document.getElementById('filterSort');
  if (sortContainer) {
    const sortChips = sortContainer.querySelectorAll('.filter-chip');
    sortChips.forEach(chip => {
      chip.addEventListener('click', () => {
        sortChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilters.sort = chip.getAttribute('data-sort');
        applyFilters();
        updateFilterActiveBadge();
      });
    });
  }

  initStockToggle();
  initPriceSlider();

  // Reset all filters button
  if (filterResetBtn) {
    filterResetBtn.addEventListener('click', () => {
      resetAllFilters();
    });
  }
}

function closeFilterDrawer() {
  if (filterDrawer) filterDrawer.classList.remove('open');
  if (filterToggleBtn) filterToggleBtn.classList.remove('open');
}

function resetAllFilters() {
  if (searchInput) {
    searchInput.value = '';
  }
  if (searchClearBtn) {
    searchClearBtn.style.display = 'none';
  }
  activeFilters.search = '';
  activeFilters.package = 'all';
  activeFilters.color = 'all';
  activeFilters.stock = 'all';
  activeFilters.sort = 'default';

  // Reset package chips
  const pkgContainer = document.getElementById('filterPackage');
  if (pkgContainer) {
    const chips = pkgContainer.querySelectorAll('.filter-chip');
    chips.forEach(c => c.classList.remove('active'));
    const allChip = pkgContainer.querySelector('[data-filter="all"]');
    if (allChip) allChip.classList.add('active');
  }

  // Reset color chips
  const clrContainer = document.getElementById('filterColor');
  if (clrContainer) {
    const chips = clrContainer.querySelectorAll('.filter-chip');
    chips.forEach(c => c.classList.remove('active'));
    const allChip = clrContainer.querySelector('[data-filter="all"]');
    if (allChip) allChip.classList.add('active');
  }

  // Reset sort chips
  if (sortContainer) {
    const sortChips = sortContainer.querySelectorAll('.filter-chip');
    sortChips.forEach(c => c.classList.remove('active'));
    const defChip = sortContainer.querySelector('[data-sort="default"]');
    if (defChip) defChip.classList.add('active');
  }

  // Reset stock toggle
  const btnAll = document.getElementById('stockFilterAll');
  const btnInStock = document.getElementById('stockFilterInStock');
  if (btnAll && btnInStock) {
    btnAll.classList.add('active');
    btnInStock.classList.remove('active');
  }

  // Reset price slider
  const slider = document.getElementById('priceRangeInput');
  const maxLabel = document.getElementById('priceMaxLabel');
  if (slider && defaultMaxPrice) {
    slider.value = defaultMaxPrice;
    activeFilters.maxPrice = defaultMaxPrice;
    if (maxLabel) {
      maxLabel.textContent = defaultMaxPrice.toLocaleString('de-DE') + ' ₫';
    }
  }

  applyFilters();
  updateFilterActiveBadge();
}

function updateFilterActiveBadge() {
  if (!filterActiveBadge) return;
  let count = 0;
  if (activeFilters.package && activeFilters.package !== 'all') count++;
  if (activeFilters.color && activeFilters.color !== 'all') count++;
  if (activeFilters.sort && activeFilters.sort !== 'default') count++;
  if (activeFilters.maxPrice && defaultMaxPrice && activeFilters.maxPrice < defaultMaxPrice) count++;

  if (count > 0) {
    filterActiveBadge.textContent = count;
    filterActiveBadge.style.display = 'inline-block';
    if (filterToggleBtn) filterToggleBtn.classList.add('active');
  } else {
    filterActiveBadge.style.display = 'none';
    if (filterToggleBtn) filterToggleBtn.classList.remove('active');
  }
}

function initStockToggle() {
  const btnAll = document.getElementById('stockFilterAll');
  const btnInStock = document.getElementById('stockFilterInStock');
  const allBtns = [btnAll, btnInStock].filter(Boolean);

  allBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      allBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.stock = btn.getAttribute('data-stock');
      applyFilters();
    });
  });
}

function initPriceSlider() {
  const slider = document.getElementById('priceRangeInput');
  const minLabel = document.getElementById('priceMinLabel');
  const maxLabel = document.getElementById('priceMaxLabel');
  if (!slider) return;

  // Calculate min and max from loaded products
  const prices = allProducts.map(p => p.price).filter(p => typeof p === 'number' && p > 0);
  if (prices.length > 0) {
    const actualMin = Math.min(...prices);
    const actualMax = Math.max(...prices);

    // Round up max to nearest 100.000
    const roundedMax = Math.ceil(actualMax / 100000) * 100000;
    const roundedMin = Math.floor(actualMin / 100000) * 100000;

    slider.min = roundedMin;
    slider.max = roundedMax;
    slider.step = 100000;
    slider.value = roundedMax;

    if (minLabel) minLabel.textContent = actualMin.toLocaleString('de-DE') + ' ₫';
    if (maxLabel) maxLabel.textContent = roundedMax.toLocaleString('de-DE') + ' ₫';

    defaultMaxPrice = roundedMax;
    activeFilters.maxPrice = roundedMax;
  }

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    activeFilters.maxPrice = val;
    if (maxLabel) {
      maxLabel.textContent = val.toLocaleString('de-DE') + ' ₫';
    }
    applyFilters();
    updateFilterActiveBadge();
  });
}

// Apply filtering
function applyFilters() {
  currentFiltered = allProducts.filter(item => {
    // Search
    if (activeFilters.search) {
      const matchTitle = (item.title || '').toLowerCase().includes(activeFilters.search);
      const matchDesc = (item.description || '').toLowerCase().includes(activeFilters.search);
      const matchSku = (item.sku || '').toLowerCase().includes(activeFilters.search);
      if (!matchTitle && !matchDesc && !matchSku) return false;
    }

    // Package
    if (activeFilters.package !== 'all') {
      if (item.package !== activeFilters.package) return false;
    }

    // Color
    if (activeFilters.color !== 'all') {
      if (item.color !== activeFilters.color) return false;
    }

    // Stock status toggle
    if (activeFilters.stock === 'in_stock') {
      const status = availabilityMap[item.id] || 'in_stock';
      if (status !== 'in_stock') return false;
    }

    // Price range slider
    if (activeFilters.maxPrice !== undefined && activeFilters.maxPrice !== null) {
      const p = item.price || 0;
      if (p > activeFilters.maxPrice) return false;
    }

    return true;
  });

  // Price sorting
  if (activeFilters.sort === 'price_asc') {
    currentFiltered.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (activeFilters.sort === 'price_desc') {
    currentFiltered.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  countDisplay.textContent = currentFiltered.length;
  renderCatalog(currentFiltered);
}

// Render cards
function renderCatalog(items) {
  if (items.length === 0) {
    bouquetsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 2.5rem; margin-bottom: 10px;">🥀</div>
        <h3 style="font-family: var(--font-serif); font-size: 1.4rem; margin-bottom: 8px;">Композиции не найдены</h3>
        <p style="color: var(--color-text-muted); font-size: 0.95rem;">Попробуйте смягчить параметры фильтра или очистить поиск.</p>
      </div>
    `;
    return;
  }

  bouquetsGrid.innerHTML = items.map(item => {
    const photoCount = (item.images && item.images.length) || 1;
    const thumbImg = item.primary_thumb || item.primary_image || (item.images && item.images[0]) || 'images/logo.jpg';
    const isAvail = (availabilityMap[item.id] !== 'preorder');
    const currentPriceFormatted = item.price ? item.price.toLocaleString('ru-RU') + ' ₫' : (item.price_formatted || 'По запросу');

    return `
      <article class="bouquet-card" data-id="${item.id}">
        <div class="card-img-wrap" onclick="openProductModal(${item.id})">
          <img src="${thumbImg}" alt="${escapeHtml(item.title)}" class="card-img" loading="lazy">
          <span class="card-badge-stock ${isAvail ? 'in-stock' : 'preorder'}">
            ${isAvail ? '🟢 В наличии · 60 мин' : '🟡 Под заказ'}
          </span>
          ${photoCount > 1 ? `<span class="card-badge-photos">📷 ${photoCount}</span>` : ''}
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-title">${escapeHtml(item.title)}</h3>
            ${item.sku ? `<span class="card-sku">#${escapeHtml(item.sku)}</span>` : ''}
          </div>
          <p class="card-desc">${escapeHtml(item.description || 'Изысканная композиция из отборных свежих роз.')}</p>
          <div class="card-footer">
            <div class="card-price">${escapeHtml(currentPriceFormatted)}</div>
            <button class="btn-order-fast" onclick="openProductModal(${item.id})">
              <span>Заказать</span>
              <span>✨</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Modal Quick View & Order
function updateOrderTotal() {
  if (!selectedProduct) return;
  const basePrice = selectedProduct.price || 0;
  
  // Addon price
  const addonSelect = document.getElementById('orderAddonSelect');
  let addonPrice = 0;
  if (addonSelect && addonSelect.selectedIndex >= 0) {
    const selectedAddonOpt = addonSelect.options[addonSelect.selectedIndex];
    addonPrice = parseInt(selectedAddonOpt?.getAttribute('data-price') || '0', 10);
  }

  // Card price (+30.000 ₫ for postcard)
  const isPostcard = document.querySelector('input[name="cardFormat"]:checked')?.value === 'card';
  const cardPrice = isPostcard ? 30000 : 0;

  const total = basePrice + addonPrice + cardPrice;
  const formattedTotal = total.toLocaleString('de-DE') + ' ₫';

  // Update all total labels (both Step 1 and Step 2)
  document.querySelectorAll('.order-total-val').forEach(el => {
    el.textContent = formattedTotal;
  });

  // Also update hero header price if addon selected
  if (modalPrice) {
    modalPrice.textContent = formattedTotal;
  }
}
window.updateOrderTotal = updateOrderTotal;

function openProductModal(productId) {
  const prod = allProducts.find(p => p.id === productId);
  if (!prod) return;
  selectedProduct = prod;

  modalTitle.textContent = prod.title;
  modalSku.textContent = prod.sku ? `#${prod.sku}` : `#${prod.id}`;
  modalPackage.textContent = prod.package || 'Букет';
  modalPrice.textContent = prod.price_formatted || 'По запросу';
  modalDesc.textContent = prod.description || prod.original_caption || 'Свежие розы премиального качества с оперативной доставкой по городу Нячанг.';

  // Gallery
  const images = (prod.images && prod.images.length > 0) ? prod.images : [prod.primary_image || 'images/logo.jpg'];
  modalMainImg.src = images[0];

  modalThumbsRow.innerHTML = images.map((imgUrl, idx) => `
    <div class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" onclick="setModalGalleryImage('${imgUrl}', this)">
      <img src="${imgUrl}" alt="Фото ${idx+1}">
    </div>
  `).join('');

  // Reset order form
  fastOrderForm.style.display = 'block';
  orderSuccessMsg.style.display = 'none';
  fastOrderForm.reset();
  const cardInputEl = document.getElementById('orderCard');
  if (cardInputEl) cardInputEl.value = '';
  updateOrderTotal();

  productModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  if (productModal) {
    productModal.classList.remove('active');
  }
  document.body.style.overflow = '';
}
window.closeProductModal = closeProductModal;

function setModalGalleryImage(imgUrl, thumbEl) {
  if (modalMainImg) modalMainImg.src = imgUrl;
  if (modalThumbsRow) {
    const thumbs = modalThumbsRow.querySelectorAll('.gallery-thumb-item');
    thumbs.forEach(t => t.classList.remove('active'));
  }
  if (thumbEl) thumbEl.classList.add('active');
}
window.setModalGalleryImage = setModalGalleryImage;

function initModalListeners() {
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProductModal);
  }
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
      closeProductModal();
    }
  });

  // Recalculate on Addon change
  const addonSelect = document.getElementById('orderAddonSelect');
  if (addonSelect) {
    addonSelect.addEventListener('change', updateOrderTotal);
  }

  // Dynamic card format toggle
  const cardRadios = document.querySelectorAll('input[name="cardFormat"]');
  const orderCardInput = document.getElementById('orderCard');
  const btnNoteFree = document.getElementById('btnNoteFree');
  const btnCardPaid = document.getElementById('btnCardPaid');

  cardRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'card') {
        if (btnCardPaid) btnCardPaid.classList.add('active');
        if (btnNoteFree) btnNoteFree.classList.remove('active');
        if (orderCardInput) orderCardInput.placeholder = 'Текст для праздничной открытки (или оставьте пустым)';
      } else {
        if (btnNoteFree) btnNoteFree.classList.add('active');
        if (btnCardPaid) btnCardPaid.classList.remove('active');
        if (orderCardInput) orderCardInput.placeholder = 'Текст для крафтовой записки (или оставьте пустым)';
      }
      updateOrderTotal();
    });
  });

  // Fast order submit
  fastOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    submitOrderBtn.disabled = true;
    submitOrderBtn.innerHTML = `<span>Отправка заказа...</span>`;

    const orderType = document.querySelector('input[name="orderType"]:checked')?.value || 'Доставка';
    const customerName = (document.getElementById('orderName')?.value || '').trim();
    const customerContact = (document.getElementById('orderContact')?.value || '').trim();
    const customerAddress = (document.getElementById('orderAddress')?.value || '').trim();
    const customerCard = (document.getElementById('orderCard')?.value || '').trim();
    const cardFormatVal = document.querySelector('input[name="cardFormat"]:checked')?.value || 'note';
    const cardTypeTitle = cardFormatVal === 'card' ? '💌 Праздничная открытка (+30.000 ₫)' : '📜 Крафтовая записка (Бесплатно)';

    // Addon details
    const selectedAddonOpt = addonSelect.options[addonSelect.selectedIndex];
    const addonText = selectedAddonOpt.text;
    const hasAddon = addonSelect.value !== 'none';
    const totalDisplay = document.getElementById('orderTotalAmount').textContent;

    // Prepare Telegram message in clean, bullet-proof HTML format
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const bTitleSafe = escapeHtml(selectedProduct.title);
    const bSkuSafe = selectedProduct.sku ? '#' + escapeHtml(selectedProduct.sku) : '';
    const bPkgSafe = escapeHtml(selectedProduct.package || 'Букет');
    const bPriceSafe = escapeHtml(selectedProduct.price_formatted || '');
    const cNameSafe = escapeHtml(customerName);
    
    // Format contact: if it contains @username or starts with @, convert to clickable Telegram link
    let cContactFormatted = escapeHtml(customerContact);
    if (/@([a-zA-Z0-9_]{3,32})/.test(customerContact)) {
      cContactFormatted = escapeHtml(customerContact).replace(/@([a-zA-Z0-9_]{3,32})/g, '<a href="https://t.me/$1">@$1</a>');
    } else if (/^https?:\/\/t\.me\/([a-zA-Z0-9_]{3,32})/.test(customerContact.trim())) {
      const match = customerContact.trim().match(/^https?:\/\/t\.me\/([a-zA-Z0-9_]{3,32})/);
      cContactFormatted = `<a href="https://t.me/${match[1]}">@${match[1]}</a>`;
    } else if (/^[a-zA-Z0-9_]{4,32}$/.test(customerContact.trim()) && !/^\d+$/.test(customerContact.trim())) {
      const rawUser = customerContact.trim();
      cContactFormatted = `<a href="https://t.me/${rawUser}">@${rawUser}</a>`;
    }

    const cAddrSafe = escapeHtml(customerAddress || 'Не указан (уточнить)');
    const hasCardText = customerCard.length > 0;
    const cardTextDisplay = hasCardText 
      ? `«${escapeHtml(customerCard)}»` 
      : `<i>(Без текста — оставить чистой)</i>`;
    const addonSafe = escapeHtml(addonText);
    const cardTitleSafe = escapeHtml(cardTypeTitle);
    const totalSafe = escapeHtml(totalDisplay);

    const tgMessageHtml = `🌸 <b>НОВЫЙ ЗАКАЗ #${orderNum}</b> 🌸\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💐 <b>Букет:</b> ${bTitleSafe} (${bSkuSafe})\n` +
      `💰 <b>Базовая цена:</b> ${bPriceSafe}\n` +
      `📦 <b>Формат:</b> ${bPkgSafe}\n` +
      (hasAddon ? `🎁 <b>Дополнение:</b> ${addonSafe}\n` : '') +
      `💌 <b>Послание:</b> ${cardTitleSafe}\n` +
      `✍️ <b>Текст:</b> ${cardTextDisplay}\n` +
      `💎 <b>ИТОГО К ОПЛАТЕ: ${totalSafe}</b>\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 <b>Клиент:</b> ${cNameSafe}\n` +
      `📞 <b>Контакт:</b> ${cContactFormatted}\n` +
      `📍 <b>Способ:</b> ${orderType}\n` +
      (orderType === 'Доставка' ? `🏠 <b>Адрес:</b> ${cAddrSafe}\n` : '') +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⏰ ${new Date().toLocaleString('ru-RU')}`;

    // 1. Immediately save to CRM LocalStorage so order is never lost
    try {
      const savedOrders = localStorage.getItem('art_bouquet_orders_log');
      const ordersList = savedOrders ? JSON.parse(savedOrders) : [];
      const newCrmOrder = {
        id: orderNum,
        date: new Date().toLocaleString('ru-RU'),
        customerName: customerName,
        customerContact: customerContact,
        bouquetTitle: selectedProduct.title,
        bouquetSku: selectedProduct.sku || '',
        orderType: orderType,
        address: customerAddress || (orderType === 'Самовывоз' ? 'Студия' : 'Не указан'),
        addon: hasAddon ? addonText : 'Без дополнений',
        card: customerCard, // Exactly what user wrote or empty string! NEVER 'Чистая'
        cardFormat: cardTypeTitle,
        total: totalDisplay,
        status: 'new'
      };
      ordersList.unshift(newCrmOrder);
      localStorage.setItem('art_bouquet_orders_log', JSON.stringify(ordersList));
    } catch (storageErr) {
      console.warn('CRM storage err:', storageErr);
    }

    try {
      // 2. Send to Telegram Bot API with HTML parse_mode
      const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.chatId,
          text: tgMessageHtml,
          parse_mode: 'HTML'
        })
      });

      const tgData = await tgRes.json();
      if (!tgData.ok) {
        console.warn('Telegram API warning:', tgData);
      }

      fastOrderForm.style.display = 'none';
      orderSuccessMsg.style.display = 'block';
    } catch (err) {
      console.error('Order send error:', err);
      fastOrderForm.style.display = 'none';
      orderSuccessMsg.style.display = 'block';
    } finally {
      submitOrderBtn.disabled = false;
      submitOrderBtn.innerHTML = `<span>Подтвердить заказ</span><span>✓</span>`;
    }
  });
}

function initDeliveryToggle() {
  optDelivery.addEventListener('click', () => {
    optDelivery.classList.add('selected');
    optPickup.classList.remove('selected');
    optDelivery.querySelector('input').checked = true;
    addressGroup.style.display = 'block';
  });

  optPickup.addEventListener('click', () => {
    optPickup.classList.add('selected');
    optDelivery.classList.remove('selected');
    optPickup.querySelector('input').checked = true;
    addressGroup.style.display = 'none';
  });
}

// Utility
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}
