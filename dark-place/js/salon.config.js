/**
 * SALON MASTER CONFIGURATION
 * Dark Place Tattoo & Barbershop (Nha Trang, Vietnam)
 * PulseCore Technology by SYNAPTIQ Lab
 */

window.SALON_CONFIG = {
  // 1. ИДЕНТИФИКАЦИЯ И БРЕНД
  slug: "dark-place",
  name: "Dark Place",
  fullName: "Dark Place Tattoo & Barbershop",
  tagline: "Tattoo Art • Premium Barbershop",
  subTagline: "Стиль, качество и неповторимая атмосфера в Нячанге",
  shortDesc: "Пространство для тех, кто ценит точность формы, безупречное мастерство, авторскую татуировку и честный сервис без компромиссов.",

  // 2. ГЕОГРАФИЯ И КОНТАКТЫ
  city: "Нячанг",
  address: "Cao Văn Bé, 17/10 • Nha Trang, Khánh Hòa",
  addressShort: "ул. Cao Văn Bé, 17/10",
  phone: "+84 7 978 07 494",
  phoneRaw: "+84797807494",
  hours: "Ежедневно 10:00 – 21:00 (без выходных)",
  whatsapp: "https://wa.me/84797807494",
  telegram: "https://t.me/DarkPlace_tattoo_barbershop",
  instagram: "https://www.instagram.com/darkplace_tattoo_barbershop",

  // 3. ФИНАНСЫ И ЛОКАЛИЗАЦИЯ
  currency: "₫",
  currencyCode: "VND",
  currencyLocale: "ru-RU", // Форматирование разделителей тысяч (750 000 ₫)
  payrollPeriod: "weekly", // 'weekly' (раз в неделю) или 'biweekly', 'monthly'
  defaultCommissionRate: 40, // Базовая процентная ставка мастера по умолчанию

  // 4. БЕЗОПАСНОСТЬ ПО УМОЛЧАНИЮ
  defaultPin: "1234",
  ownerEmail: "darkplace@nhatrang.vn",

  // 5. ПРЕИМУЩЕСТВА / ФИЧИ ЗАВЕДЕНИЯ
  features: [
    "Команда барберов со стажем от 5 до 7 лет и преподавательским опытом",
    "Художественная татуировка любой сложности, авторские эскизы и перекрытие",
    "Многоступенчатая стерилизация инструмента медицинского класса",
    "Сложные удлинённые и текстурные стрижки, химическая завивка и окрашивание",
    "Фирменная тёмная атмосфера, спешелти-кофе, прохладительные напитки и музыка"
  ],

  // 6. ЦВЕТОВАЯ ПАЛИТРА И ТЕМА (Gothic Dark + Neon Red)
  theme: {
    accentGold: "#FF2B44",       // Фирменный неоновый красный
    accentGoldLight: "#FF5467",  // Светло-красный неоновый акцент
    bgMain: "#0A0B0E",           // Глубокий антрацит
    bgCard: "#13151D",           // Карточки
    textPrimary: "#FFFFFF",      // Четкий белый
    textMuted: "#9CA3AF"         // Смягченный серый
  }
};
