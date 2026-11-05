/**
 * SALON MASTER CONFIGURATION
 * Единая точка конфигурации заведения для клонирования и кастомизации.
 * При создании сайта для нового клиента редактируется ТОЛЬКО этот файл!
 */

window.SALON_CONFIG = {
  // 1. ИДЕНТИФИКАЦИЯ И БРЕНД
  slug: "noir-atelier",
  tenantId: "noir-atelier",
  isDemo: true, // Режим песочницы для мастер-демо (защита от смены PIN)
  apiEndpoint: "https://synaptiq-crm-bot.dandeliondnd-vn.workers.dev",
  name: "NOIR",
  fullName: "NOIR Hair Atelier & SPA",
  tagline: "Премиальное ателье персонального стиля и SPA-ухода",
  subTagline: "Идеальная геометрия стрижек, премиальный уход и эстетика без компромиссов",
  shortDesc: "Пространство для тех, кто ценит точность формы, безупречный сервис и приватную атмосферу.",

  // 2. ГЕОГРАФИЯ И КОНТАКТЫ
  city: "Центральный район",
  address: "Центральный проспект, 14 • Atelier Suite #1",
  addressShort: "Центральный проспект, 14",
  phone: "+7 (999) 000-00-00",
  phoneRaw: "+79990000000",
  hours: "Ежедневно 10:00 – 21:00",
  whatsapp: "javascript:void(0)",
  telegram: "https://t.me/litt1e_roo",
  instagram: "javascript:void(0)",

  // 3. ФИНАНСЫ И ЛОКАЛИЗАЦИЯ
  currency: "₫",
  currencyCode: "VND",
  currencyLocale: "ru-RU", // Форматирование разделителей тысяч (1 250 000 ₫)
  payrollPeriod: "weekly", // 'weekly' (раз в неделю) или 'biweekly', 'monthly'
  defaultCommissionRate: 40, // Базовая процентная ставка мастера по умолчанию

  // 4. БЕЗОПАСНОСТЬ ПО УМОЛЧАНИЮ
  defaultPin: "1234",
  ownerEmail: "owner@noir-atelier.com",

  // 5. ПРЕИМУЩЕСТВА / ФИЧИ САЛОНА
  features: [
    "Команда топ-стилистов и экспертов с международным опытом",
    "Премиальная эстетика, приватные рабочие зоны и атмосфера лаунджа",
    "Многоступенчатая стерилизация инструмента медицинского уровня",
    "Эксклюзивная селективная косметика и индивидуальный SPA-протокол",
    "Напитки из коллекции Atelier Bar, спешелти-кофе и свежая пресса"
  ],

  // 6. ЦВЕТОВАЯ ПАЛИТРА И ТЕМА
  theme: {
    accentGold: "#D4AF37",
    accentGoldLight: "#E5C378",
    bgMain: "#0B0D12",
    bgCard: "#12151E",
    textPrimary: "#F3F4F6",
    textMuted: "#9CA3AF"
  }
};
