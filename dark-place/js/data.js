/**
 * Dark Place Tattoo & Barbershop - Database & Data Service
 * Salon Engine (PulseCore Technology by SYNAPTIQ Lab)
 */

const DEFAULT_SALON_INFO = {
  name: "Dark Place",
  brandName: "DARK PLACE TATTOO & BARBERSHOP",
  tagline: "Tattoo Art • Premium Barbershop",
  subTagline: "Стиль, качество и неповторимая атмосфера в Нячанге",
  city: "Нячанг",
  address: "Cao Văn Bé, 17/10 • Nha Trang, Khánh Hòa",
  addressShort: "ул. Cao Văn Bé, 17/10",
  phone: "+84 7 978 07 494",
  whatsapp: "https://wa.me/84797807494",
  telegram: "https://t.me/DarkPlace_tattoo_barbershop",
  instagram: "https://www.instagram.com/darkplace_tattoo_barbershop",
  hours: "Ежедневно 10:00 – 21:00 (без выходных)",
  currency: "₫",
  payrollPeriod: "weekly",
  features: [
    "Команда барберов со стажем от 5 до 7 лет и преподавательским опытом",
    "Художественная татуировка любой сложности, авторские эскизы и перекрытие",
    "Многоступенчатая стерилизация инструмента медицинского класса",
    "Сложные удлинённые и текстурные стрижки, химическая завивка и окрашивание",
    "Фирменная тёмная атмосфера, спешелти-кофе, прохладительные напитки и музыка"
  ]
};

const DEFAULT_CATEGORIES = [
  { 
    id: "complex", 
    name: "Комплексные сеты", 
    icon: "⚡", 
    desc: "Популярные комплексные комбо для мужчин и семейный формат" 
  },
  { 
    id: "haircuts", 
    name: "Мужские стрижки & Стиль", 
    icon: "✂️", 
    desc: "Классические, текстурные и удлинённые стрижки, фейды, химзавивка и окрашивание" 
  },
  { 
    id: "beard", 
    name: "Борода & Королевское бритьё", 
    icon: "🪒", 
    desc: "Моделирование контуров, бритьё шейвером, традиционное бритьё и тонирование" 
  },
  { 
    id: "tattoo-art", 
    name: "Tattoo Art & Авторская тату", 
    icon: "🎨", 
    desc: "Художественная татуировка любой сложности, разработка эскизов и Cover-Up" 
  }
];

const DEFAULT_SPECIALISTS = [
  {
    id: "spec-ruslan",
    name: "Руслан",
    role: "Барбер, мастер удлинённых стрижек",
    experience: "Опыт 5 лет. Выполняет стрижки любой сложности. Эксперт по текстурным, свежим трендовым и удлинённым стрижкам.",
    commissionPercent: 40,
    categories: ["complex", "haircuts", "beard"],
    avatar: "assets/master-ruslan.jpg",
    workDays: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: "spec-zhora",
    name: "Жора",
    role: "Барбер-эксперт",
    experience: "Опыт 7 лет. Простой парень из Сибири, найдет общий язык с каждым гостем. Выполняет стрижки любого уровня сложности с душой.",
    commissionPercent: 40,
    categories: ["complex", "haircuts", "beard"],
    avatar: "assets/master-zhora.jpg",
    workDays: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: "spec-max",
    name: "Макс",
    role: "Барбер, колорист & биозавивка",
    experience: "Опыт более 6 лет. Стрижет мужчин и детей, делает хим. завивку и окрашивание волос в любой цвет. Харизматичный и общительный мастер.",
    commissionPercent: 40,
    categories: ["complex", "haircuts", "beard"],
    avatar: "assets/master-max.jpg",
    workDays: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: "spec-sunnat",
    name: "Суннат",
    role: "Шеф-барбер & наставник",
    experience: "Опыт 6 лет. Постоянно развивается, обучается и обучает учеников. Цель — не просто стричь, а формировать уверенность и мужской стиль.",
    commissionPercent: 45,
    categories: ["complex", "haircuts", "beard"],
    avatar: "assets/master-sunnat.jpg",
    workDays: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: "spec-tattoo",
    name: "Tattoo Team",
    role: "Художники-татуировщики Dark Place",
    experience: "Опыт от 6 до 10 лет. Авторские эскизы, реализм, графика, леттеринг, блэк-энд-грей, перекрытие старых работ любой сложности.",
    commissionPercent: 50,
    categories: ["tattoo-art"],
    avatar: "assets/tattoo-artist.jpg",
    workDays: [1, 2, 3, 4, 5, 6, 7]
  }
];

const DEFAULT_SERVICES = [
  // 1. КОМПЛЕКСНЫЕ СЕТЫ
  {
    id: "srv-complex-1",
    categoryId: "complex",
    name: "Стрижка + Моделирование бороды",
    shortDesc: "Полная мужская стрижка с мытьем головы + моделирование формы бороды и четкие контуры",
    fullDesc: "Флагманский комплекс Dark Place: индивидуальный подбор формы стрижки, мытье головы, укладка премиум-стайлингом и ювелирное моделирование бороды с распариванием и обработкой контуров.",
    includes: [
      "Консультация барбера и подбор геометрии образа",
      "Мужская стрижка ножницами и машинкой с чистым фейдом",
      "Моделирование бороды, подбор длины и контуров",
      "Мытье головы до и после с массажем кожи головы",
      "Финишный стайлинг и уход за бородой питательным маслом"
    ],
    price: 750000,
    duration: 75,
    popular: true
  },
  {
    id: "srv-complex-2",
    categoryId: "complex",
    name: "Комплекс «Папа + Сын»",
    shortDesc: "Синхронная стрижка отца и сына в соседних креслах с напитками и укладкой",
    fullDesc: "Отличный формат провести время по-мужски: полноценная мужская стрижка для отца и модная стрижка для сына с напитками из бара студии.",
    includes: [
      "Синхронное обслуживание отца и сына",
      "Стрижка для папы со стайлингом",
      "Детская или подростковая стрижка для сына",
      "Мытье головы и фирменная укладка для обоих",
      "Прохладительные напитки или кофе"
    ],
    price: 750000,
    duration: 80,
    popular: true
  },

  // 2. МУЖСКИЕ СТРИЖКИ & СТИЛЬ
  {
    id: "srv-cut-1",
    categoryId: "haircuts",
    name: "Мужская стрижка",
    shortDesc: "Классическая или современная стрижка с мытьем головы и стайлингом",
    fullDesc: "Индивидуальный подбор формы под тип лица и волос: Fade, Crop, Pompadour, Undercut или классика. Включает мытье головы до и после, оформление окантовки шейвером и укладку.",
    includes: [
      "Консультация барбера",
      "Стрижка машинкой и ножницами с точной окантовкой",
      "Мытье головы с массажем",
      "Сушка и премиальный матовый стайлинг"
    ],
    price: 400000,
    duration: 50,
    popular: true
  },
  {
    id: "srv-cut-2",
    categoryId: "haircuts",
    name: "Стрижка ножницами",
    shortDesc: "Сложная работа ножницами для средней и удлиненной длины волос",
    fullDesc: "Технически сложная стрижка исключительно прямыми и филировочными ножницами. Идеально для текстурных удлиненных форм, шегги, каре и каскадных силуэтов.",
    includes: [
      "Проработка длины и плотности ножницами",
      "Персонализированная текстуризация прядей",
      "Мытье головы и кондиционирование",
      "Естественная укладка с текстурирующим спреем"
    ],
    price: 500000,
    duration: 60,
    popular: false
  },
  {
    id: "srv-cut-3",
    categoryId: "haircuts",
    name: "Стрижка машинкой",
    shortDesc: "Стрижка под 1-2 насадки с аккуратным сведением и окантовкой",
    fullDesc: "Быстрая, ровная и аккуратная стрижка под машинку с чистым оформлением височных и шейных зон.",
    includes: [
      "Стрижка машинкой с 1-2 насадками",
      "Четкая окантовка триммером и шейвером",
      "Мытье головы после стрижки"
    ],
    price: 250000,
    duration: 30,
    popular: false
  },
  {
    id: "srv-cut-4",
    categoryId: "haircuts",
    name: "Бритье головы шейвером",
    shortDesc: "Идеально гладкое бритье под ноль профессиональным шейвером",
    fullDesc: "Комфортное и чистое бритье кожи головы с обработкой антисептиком и охлаждающим лосьоном после бритья.",
    includes: [
      "Подготовка волос триммером",
      "Чистое бритье шейвером без раздражения",
      "Освежающий лосьон после бритья"
    ],
    price: 250000,
    duration: 35,
    popular: false
  },
  {
    id: "srv-cut-5",
    categoryId: "haircuts",
    name: "Химическая завивка",
    shortDesc: "Трендовые кудри и долговременная текстура волос на профессиональном составе",
    fullDesc: "Создание объема, легких волн или выразительных кудрей на срок от 3 до 6 месяцев. Процедура выполняется щадящими составами с сохранением здоровья волос.",
    includes: [
      "Диагностика структуры волоса и подбор диаметра коклюшек",
      "Нанесение защитного состава и накрутка",
      "Фиксация и нейтрализация",
      "Уход и обучение стайлингу кудрявых волос"
    ],
    price: 1200000,
    duration: 120,
    popular: true
  },
  {
    id: "srv-cut-6",
    categoryId: "haircuts",
    name: "Окрашивание волос",
    shortDesc: "Тонирование, осветление или креативное окрашивание в любой цвет",
    fullDesc: "Полное преображение: платиновый блонд, пепельный оттенок, яркие акцентные цвета или маскировка седины профессиональными красителями.",
    includes: [
      "Подбор формулы красителя и тест пряди",
      "Осветление/окрашивание по протоколу",
      "Стабилизация цвета и питательный уход"
    ],
    price: 1400000,
    duration: 90,
    popular: false
  },
  {
    id: "srv-cut-7",
    categoryId: "haircuts",
    name: "Тонирование головы",
    shortDesc: "Камуфляж седины и придание волосам глубокого естественного оттенка",
    fullDesc: "Безаммиачное тонирование за 15-20 минут, создающее абсолютно натуральный вид волос без эффекта окрашенности.",
    includes: [
      "Подбор тона под родной цвет волос",
      "Экспресс-нанесение состава в мойке",
      "Увлажняющий уход и сушка"
    ],
    price: 350000,
    duration: 30,
    popular: false
  },
  {
    id: "srv-cut-8",
    categoryId: "haircuts",
    name: "Hair Tattoo",
    shortDesc: "Фигурный графический выстриг: полосы, молнии или авторский рисунок на висках",
    fullDesc: "Артистичный графический акцент на виске или затылке, выполненный триммером и лезвием.",
    includes: [
      "Согласование эскиза узора",
      "Выстриг контуров триммером",
      "Успокаивающий лосьон"
    ],
    price: 100000,
    duration: 20,
    popular: false
  },
  {
    id: "srv-cut-9",
    categoryId: "haircuts",
    name: "Удаление волос воском",
    shortDesc: "Депиляция нежелательных волос в зоне носа, ушей и между бровей",
    fullDesc: "Быстрая и безболезненная процедура профессиональным горячим воском для идеальной чистоты лица.",
    includes: [
      "Обработка зоны очищающим лосьоном",
      "Удаление воском (нос, уши, монобровь)",
      "Успокаивающее масло после депиляции"
    ],
    price: 150000,
    duration: 15,
    popular: false
  },

  // 3. БОРОДА & КОРОЛЕВСКОЕ БРИТЬЕ
  {
    id: "srv-beard-1",
    categoryId: "beard",
    name: "Моделирование бороды",
    shortDesc: "Подбор индивидуальной геометрии, коррекция длины и создание четких контуров",
    fullDesc: "Полноценная архитектура бороды: оформление линии щек, шеи и усов с учетом формы подбородка, филировка объема и уход с горячим полотенцем.",
    includes: [
      "Анализ формы лица и роста щетины",
      "Стрижка формы ножницами и машинкой",
      "Четкая подводка линий бритвой/шейвером",
      "Горячий компресс и масло для бороды"
    ],
    price: 400000,
    duration: 40,
    popular: true
  },
  {
    id: "srv-beard-2",
    categoryId: "beard",
    name: "Традиционное бритье",
    shortDesc: "Классическое королевское бритье опасной бритвой с распариванием кожи",
    fullDesc: "Истинный мужской ритуал: распаривание горячими полотенцами с эфирными маслами, плотная теплая пена, филигранное бритье опасной бритвой и ледяной компресс.",
    includes: [
      "Масло до бритья (Pre-shave) и горячее распаривание",
      "Взбивание плотной теплой пены помазком",
      "Бритье опасным лезвием в два прохода",
      "Холодный компресс и успокаивающий одеколон"
    ],
    price: 350000,
    duration: 40,
    popular: false
  },
  {
    id: "srv-beard-3",
    categoryId: "beard",
    name: "Стрижка бороды и усов",
    shortDesc: "Коррекция длины бороды без опасного бритья",
    fullDesc: "Быстрое освежение формы бороды машинкой и триммером без глубокого влажного бритья.",
    includes: [
      "Стрижка длины под насадку",
      "Окантовка контуров триммером",
      "Смягчающий бальзам для бороды"
    ],
    price: 200000,
    duration: 30,
    popular: false
  },
  {
    id: "srv-beard-4",
    categoryId: "beard",
    name: "Бритье бороды шейвером",
    shortDesc: "Гладкое бритье щетины без лезвий и порезов",
    fullDesc: "Сухое бритье гипоаллергенной сеткой шейвера до идеальной гладкости.",
    includes: [
      "Подготовка триммером",
      "Бритье шейвером под ноль",
      "Освежающий лосьон"
    ],
    price: 200000,
    duration: 25,
    popular: false
  },
  {
    id: "srv-beard-5",
    categoryId: "beard",
    name: "Бритье бороды триммером",
    shortDesc: "Быстрое снятие щетины до легкой трехдневной небритости",
    fullDesc: "Снятие длины триммером для тех, кто предпочитает легкую брутальную тень вместо гладкого бритья.",
    includes: [
      "Проход триммером на минимальной высоте",
      "Очищение кожи и тоник"
    ],
    price: 150000,
    duration: 20,
    popular: false
  },
  {
    id: "srv-beard-6",
    categoryId: "beard",
    name: "Тонирование бороды",
    shortDesc: "Камуфляж седых волос и придание бороде равномерного насыщенного цвета",
    fullDesc: "Быстрое тонирование бороды специальным безаммиачным красителем. Борода выглядит гуще и опрятнее.",
    includes: [
      "Подбор естественного оттенка",
      "Нанесение состава на 10-15 минут",
      "Смывание и уход увлажняющим маслом"
    ],
    price: 250000,
    duration: 25,
    popular: false
  },

  // 4. TATTOO ART & АВТОРСКАЯ ТАТУИРОВКА
  {
    id: "srv-tattoo-1",
    categoryId: "tattoo-art",
    name: "Художественная татуировка (Сеанс)",
    shortDesc: "Сеанс авторской татуировки: реализм, графика, блэк-энд-грей, леттеринг, традишнл",
    fullDesc: "Профессиональное нанесение татуировки в оборудованном кабинете со 100% стерилизацией. Включает одноразовые картриджи ведущих мировых брендов, премиальные пигменты (Dynamic, Kuro Sumi) и заживляющую пленку.",
    includes: [
      "Консультация с тату-мастером и примерка эскиза на теле",
      "Стерильная подготовка рабочего места и одноразовые материалы",
      "Сеанс нанесения татуировки",
      "Обработка и наклейка профессиональной заживляющей мембраны",
      "Памятка по уходу и онлайн-поддержка мастера"
    ],
    price: 1500000,
    duration: 180,
    popular: true
  },
  {
    id: "srv-tattoo-2",
    categoryId: "tattoo-art",
    name: "Разработка авторского эскиза",
    shortDesc: "Создание уникального дизайн-проекта татуировки под анатомию тела клиента",
    fullDesc: "Индивидуальная отрисовка эскиза художником студии по вашей идее, референсам или концепции.",
    includes: [
      "Личная консультация и разбор идеи",
      "Отрисовка концепт-арта в 2-3 вариантах",
      "Финальная доработка с учетом анатомии тела",
      "Учет стоимости эскиза в счет будущего сеанса"
    ],
    price: 500000,
    duration: 60,
    popular: false
  },
  {
    id: "srv-tattoo-3",
    categoryId: "tattoo-art",
    name: "Перекрытие тату (Cover-Up) & Реставрация",
    shortDesc: "Перекрытие неудачных старых татуировок или качественное обновление цвета и контуров",
    fullDesc: "Сложная работа по интеграции нового плотного рисунка поверх старой некачественной работы без лазерного сведения.",
    includes: [
      "Анализ старого пигмента и плотности",
      "Создание плотного перекрывающего эскиза",
      "Сеанс перекрытия пигментами повышенной укрывистости",
      "Заживляющая повязка и инструкция"
    ],
    price: 1800000,
    duration: 180,
    popular: true
  }
];

const DEFAULT_CLIENTS = [];
const DEFAULT_APPOINTMENTS = [];
const DEFAULT_PAYOUT_ORDERS = [];

class NoirDataService {
  constructor() {
    this.STORAGE_KEYS = {
      SALON: "darkplace_salon_info",
      CATEGORIES: "darkplace_categories",
      SERVICES: "darkplace_services",
      SPECIALISTS: "darkplace_specialists",
      APPOINTMENTS: "darkplace_appointments",
      CLIENTS: "darkplace_clients",
      PAYOUT_ORDERS: "darkplace_payout_ledger",
      SECURITY: "darkplace_admin_security"
    };

    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem(this.STORAGE_KEYS.SALON)) {
      localStorage.setItem(this.STORAGE_KEYS.SALON, JSON.stringify(DEFAULT_SALON_INFO));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(this.STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.SPECIALISTS)) {
      localStorage.setItem(this.STORAGE_KEYS.SPECIALISTS, JSON.stringify(DEFAULT_SPECIALISTS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(this.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.CLIENTS)) {
      localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(DEFAULT_CLIENTS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.PAYOUT_ORDERS)) {
      localStorage.setItem(this.STORAGE_KEYS.PAYOUT_ORDERS, JSON.stringify(DEFAULT_PAYOUT_ORDERS));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.SECURITY)) {
      localStorage.setItem(this.STORAGE_KEYS.SECURITY, JSON.stringify({
        pin: "1234",
        ownerEmail: "darkplace@nhatrang.vn",
        updatedAt: new Date().toISOString()
      }));
    }
  }

  getSecurityInfo() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SECURITY));
      return stored || { pin: "1234", ownerEmail: "darkplace@nhatrang.vn" };
    } catch (e) {
      return { pin: "1234", ownerEmail: "darkplace@nhatrang.vn" };
    }
  }

  verifyAdminPin(enteredPin) {
    const sec = this.getSecurityInfo();
    const cleanEntered = String(enteredPin).trim();
    return cleanEntered === String(sec.pin).trim();
  }

  updateAdminPin(newPin, ownerEmail) {
    const current = this.getSecurityInfo();
    const updated = {
      ...current,
      pin: String(newPin).trim(),
      ownerEmail: ownerEmail ? ownerEmail.trim() : current.ownerEmail,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.SECURITY, JSON.stringify(updated));
    return updated;
  }

  resetAdminPinToDefault() {
    const current = this.getSecurityInfo();
    const reset = {
      ...current,
      pin: "1234",
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.SECURITY, JSON.stringify(reset));
    return reset;
  }

  getSalonInfo() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SALON));
      if (stored) {
        return {
          ...DEFAULT_SALON_INFO,
          ...stored,
          payrollPeriod: stored.payrollPeriod || DEFAULT_SALON_INFO.payrollPeriod || "weekly"
        };
      }
      return DEFAULT_SALON_INFO;
    } catch (e) {
      return DEFAULT_SALON_INFO;
    }
  }

  saveSalonInfo(info) {
    localStorage.setItem(this.STORAGE_KEYS.SALON, JSON.stringify(info));
  }

  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CATEGORIES)) || DEFAULT_CATEGORIES;
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  }

  getServices() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SERVICES)) || DEFAULT_SERVICES;
    } catch (e) {
      return DEFAULT_SERVICES;
    }
  }

  saveServices(services) {
    localStorage.setItem(this.STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }

  addService(newService) {
    const services = this.getServices();
    const serviceId = "srv-" + Date.now();
    const service = { id: serviceId, ...newService };
    services.push(service);
    this.saveServices(services);
    return service;
  }

  updateService(id, updatedFields) {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx !== -1) {
      services[idx] = { ...services[idx], ...updatedFields };
      this.saveServices(services);
      return services[idx];
    }
    return null;
  }

  deleteService(id) {
    let services = this.getServices();
    services = services.filter(s => s.id !== id);
    this.saveServices(services);
    return true;
  }

  getSpecialists() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.SPECIALISTS));
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.map(sp => ({
          ...sp,
          commissionPercent: (sp.commissionPercent !== undefined && sp.commissionPercent !== null)
            ? Math.max(0, Math.min(100, parseInt(sp.commissionPercent, 10) || 0))
            : 40
        }));
      }
      return DEFAULT_SPECIALISTS;
    } catch (e) {
      return DEFAULT_SPECIALISTS;
    }
  }

  saveSpecialists(specialists) {
    localStorage.setItem(this.STORAGE_KEYS.SPECIALISTS, JSON.stringify(specialists));
  }

  addSpecialist(spec) {
    const specialists = this.getSpecialists();
    const newSpec = {
      id: "spec-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      name: spec.name,
      role: spec.role || "Мастер Dark Place",
      experience: spec.experience || "",
      commissionPercent: Math.max(0, Math.min(100, parseInt(spec.commissionPercent, 10) || 40)),
      categories: spec.categories || ["complex", "haircuts", "beard"],
      avatar: spec.avatar || "assets/master-ruslan.jpg",
      workDays: spec.workDays || [1, 2, 3, 4, 5, 6, 7]
    };
    specialists.push(newSpec);
    this.saveSpecialists(specialists);
    return newSpec;
  }

  updateSpecialist(id, updatedFields) {
    const specialists = this.getSpecialists();
    const idx = specialists.findIndex(s => s.id === id);
    if (idx !== -1) {
      if (updatedFields.commissionPercent !== undefined) {
        updatedFields.commissionPercent = Math.max(0, Math.min(100, parseInt(updatedFields.commissionPercent, 10) || 0));
      }
      specialists[idx] = { ...specialists[idx], ...updatedFields };
      this.saveSpecialists(specialists);
      return specialists[idx];
    }
    return null;
  }

  deleteSpecialist(id) {
    let specialists = this.getSpecialists();
    specialists = specialists.filter(s => s.id !== id);
    this.saveSpecialists(specialists);
    return true;
  }

  getAppointments() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.APPOINTMENTS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveAppointments(appointments) {
    localStorage.setItem(this.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  addAppointment(app) {
    const appointments = this.getAppointments();
    const newId = "DP-" + Math.floor(1000 + Math.random() * 9000);
    const newApp = {
      id: newId,
      createdAt: new Date().toISOString(),
      status: "new",
      ...app
    };
    appointments.unshift(newApp);
    this.saveAppointments(appointments);

    try {
      this.syncClientForAppointment(newApp);
    } catch (e) {
      console.error("Error auto-syncing client for appointment:", e);
    }

    return newApp;
  }

  updateAppointment(id, updatedFields) {
    const appointments = this.getAppointments();
    const idx = appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      appointments[idx] = { ...appointments[idx], ...updatedFields };
      this.saveAppointments(appointments);
      try {
        this.syncClientForAppointment(appointments[idx]);
      } catch (e) {
        console.error("Error auto-syncing client on appointment update:", e);
      }
      return appointments[idx];
    }
    return null;
  }

  deleteAppointment(id) {
    let appointments = this.getAppointments();
    appointments = appointments.filter(a => a.id !== id);
    this.saveAppointments(appointments);
    return true;
  }

  updateAppointmentStatus(id, newStatus) {
    const appointments = this.getAppointments();
    const item = appointments.find(a => a.id === id);
    if (item) {
      item.status = newStatus;
      this.saveAppointments(appointments);
      try {
        this.syncClientForAppointment(item);
      } catch (e) {
        console.error("Error syncing client:", e);
      }
      return true;
    }
    return false;
  }

  // ==========================================
  // КЛИЕНТСКАЯ БАЗА И КАРТОЧКА ГОСТЯ (CRM)
  // ==========================================
  normalizePhone(phone) {
    if (!phone) return "";
    return String(phone).replace(/\D/g, "");
  }

  getClients() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.CLIENTS));
      if (Array.isArray(stored)) {
        return stored.map(c => ({
          ...c,
          discountPercent: (c.discountPercent !== undefined && c.discountPercent !== null)
            ? Math.max(0, Math.min(100, parseInt(c.discountPercent, 10) || 0))
            : (c.category === 'vip' ? 10 : (c.category === 'regular' ? 5 : 0))
        }));
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  saveClients(clients) {
    localStorage.setItem(this.STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }

  getClientById(id) {
    const clients = this.getClients();
    return clients.find(c => c.id === id) || null;
  }

  getClientByPhone(phone) {
    const norm = this.normalizePhone(phone);
    if (!norm) return null;
    const clients = this.getClients();
    return clients.find(c => {
      const cNorm = this.normalizePhone(c.phone);
      return cNorm && (cNorm === norm || (norm.length >= 8 && cNorm.endsWith(norm.slice(-8))) || (cNorm.length >= 8 && norm.endsWith(cNorm.slice(-8))));
    }) || null;
  }

  getClientByTelegram(telegram) {
    if (!telegram) return null;
    const cleanTg = String(telegram).replace(/^@/, '').toLowerCase().trim();
    if (!cleanTg) return null;
    const clients = this.getClients();
    return clients.find(c => {
      if (!c.telegram) return false;
      return c.telegram.replace(/^@/, '').toLowerCase().trim() === cleanTg;
    }) || null;
  }

  findClientByContact(contact) {
    if (!contact) return null;
    const trimmed = String(contact).trim();
    if (trimmed.startsWith('@')) {
      return this.getClientByTelegram(trimmed);
    }
    const byPhone = this.getClientByPhone(trimmed);
    if (byPhone) return byPhone;
    return this.getClientByTelegram(trimmed);
  }

  addClient(clientData) {
    const clients = this.getClients();
    const newId = "client-" + Date.now();
    const newClient = {
      id: newId,
      name: clientData.name || "Гость",
      phone: clientData.phone || "",
      normalizedPhone: this.normalizePhone(clientData.phone),
      telegram: clientData.telegram || "",
      gender: clientData.gender || "male",
      category: clientData.category || "new",
      discountPercent: Math.max(0, Math.min(100, parseInt(clientData.discountPercent, 10) || 0)),
      notes: clientData.notes || "",
      hairNotes: clientData.hairNotes || "",
      firstVisit: clientData.firstVisit || new Date().toISOString().split('T')[0],
      lastVisit: clientData.lastVisit || new Date().toISOString().split('T')[0],
      totalVisits: parseInt(clientData.totalVisits, 10) || 0,
      totalSpent: parseInt(clientData.totalSpent, 10) || 0,
      favoriteSpecialistId: clientData.favoriteSpecialistId || "",
      favoriteSpecialistName: clientData.favoriteSpecialistName || "",
      tags: Array.isArray(clientData.tags) ? clientData.tags : ["Новый гость"]
    };
    clients.unshift(newClient);
    this.saveClients(clients);
    return newClient;
  }

  updateClient(id, updatedFields) {
    const clients = this.getClients();
    const idx = clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      if (updatedFields.phone) {
        updatedFields.normalizedPhone = this.normalizePhone(updatedFields.phone);
      }
      if (updatedFields.discountPercent !== undefined) {
        updatedFields.discountPercent = Math.max(0, Math.min(100, parseInt(updatedFields.discountPercent, 10) || 0));
      }
      clients[idx] = { ...clients[idx], ...updatedFields };
      this.saveClients(clients);
      return clients[idx];
    }
    return null;
  }

  deleteClient(id) {
    let clients = this.getClients();
    clients = clients.filter(c => c.id !== id);
    this.saveClients(clients);
    return true;
  }

  getClientAppointments(clientId) {
    const client = this.getClientById(clientId);
    if (!client) return [];
    const appointments = this.getAppointments();
    const targetPhone = client.normalizedPhone;
    const targetName = (client.name || '').toLowerCase().trim();

    return appointments.filter(a => {
      if (a.clientId && a.clientId === clientId) return true;
      if (targetPhone && a.phone) {
        const aNorm = this.normalizePhone(a.phone);
        if (aNorm && (aNorm === targetPhone || aNorm.endsWith(targetPhone.slice(-8)) || targetPhone.endsWith(aNorm.slice(-8)))) {
          return true;
        }
      }
      if (targetName && a.clientName && a.clientName.toLowerCase().trim() === targetName) {
        return true;
      }
      return false;
    });
  }

  syncClientForAppointment(app) {
    if (!app || (!app.phone && !app.clientName)) return;

    const clients = this.getClients();
    const appNorm = this.normalizePhone(app.phone);
    const appName = (app.clientName || '').trim();

    let clientIdx = -1;

    if (appNorm) {
      clientIdx = clients.findIndex(c => {
        const cNorm = this.normalizePhone(c.phone);
        return cNorm && (cNorm === appNorm || (appNorm.length >= 8 && cNorm.endsWith(appNorm.slice(-8))));
      });
    }

    if (clientIdx === -1 && appName) {
      clientIdx = clients.findIndex(c => c.name.toLowerCase().trim() === appName.toLowerCase());
    }

    if (clientIdx !== -1) {
      const client = { ...clients[clientIdx] };
      const clientApps = this.getClientAppointments(client.id);

      let totalVisits = 0;
      let totalSpent = 0;
      let lastDate = client.lastVisit || app.date || new Date().toISOString().split('T')[0];
      const specialistFreq = {};

      clientApps.forEach(a => {
        if (a.status !== 'cancelled') {
          totalVisits++;
          totalSpent += (a.price || 0);
          if (a.date && a.date >= lastDate) {
            lastDate = a.date;
          }
          if (a.specialistName) {
            specialistFreq[a.specialistName] = (specialistFreq[a.specialistName] || 0) + 1;
          }
        }
      });

      let topMaster = client.favoriteSpecialistName || app.specialistName;
      let maxCount = 0;
      for (const [mName, cnt] of Object.entries(specialistFreq)) {
        if (cnt > maxCount) {
          maxCount = cnt;
          topMaster = mName;
        }
      }

      let category = client.category;
      if (totalVisits >= 5 || totalSpent >= 2500000) {
        category = 'vip';
      } else if (totalVisits >= 2) {
        category = 'regular';
      } else {
        category = 'new';
      }

      client.lastVisit = lastDate;
      client.totalVisits = Math.max(totalVisits, client.totalVisits || 1);
      client.totalSpent = Math.max(totalSpent, client.totalSpent || 0);
      client.favoriteSpecialistName = topMaster;
      client.category = category;

      if (app.phone && !client.phone) {
        client.phone = app.phone;
        client.normalizedPhone = appNorm;
      }
      if (app.clientName && (!client.name || client.name === 'Гость')) {
        client.name = app.clientName;
      }

      clients[clientIdx] = client;
      this.saveClients(clients);
      return client;
    } else {
      const newClient = {
        id: "client-" + Date.now(),
        name: appName || "Новый гость",
        phone: app.phone || "",
        normalizedPhone: appNorm,
        telegram: "",
        gender: "male",
        category: "new",
        notes: app.comment ? ("Заметка из брони: " + app.comment) : "",
        hairNotes: "",
        firstVisit: app.date || new Date().toISOString().split('T')[0],
        lastVisit: app.date || new Date().toISOString().split('T')[0],
        totalVisits: 1,
        totalSpent: app.price || 0,
        favoriteSpecialistId: app.specialistId || "",
        favoriteSpecialistName: app.specialistName || "Любой мастер",
        tags: ["Новый гость"]
      };

      clients.unshift(newClient);
      this.saveClients(clients);
      return newClient;
    }
  }

  // ==========================================
  // КАССА, ЗАРПЛАТА И РАСЧЕТ ВЫПЛАТ (PAYROLL)
  // ==========================================
  calculatePayroll({ startDate, endDate, includeConfirmed = false }) {
    const appointments = this.getAppointments();
    const specialists = this.getSpecialists();

    const periodApps = appointments.filter(a => {
      if (!a.date) return false;
      if (startDate && a.date < startDate) return false;
      if (endDate && a.date > endDate) return false;
      if (a.status === 'cancelled') return false;
      if (a.status === 'completed') return true;
      if (includeConfirmed && a.status === 'confirmed') return true;
      return false;
    });

    let totalPayroll = 0;
    const totalServicesCount = periodApps.length;
    const totalRevenue = periodApps.reduce((acc, a) => acc + (a.price || 0), 0);
    const claimedAppIds = new Set();

    const masterStats = specialists.map(sp => {
      const spApps = periodApps.filter(a => {
        const matches = (a.specialistId && a.specialistId === sp.id) || (!a.specialistId && a.specialistName && a.specialistName === sp.name);
        if (matches) claimedAppIds.add(a.id);
        return matches;
      });

      let masterRevenue = 0;
      let masterEarned = 0;
      const commissionRate = (sp.commissionPercent !== undefined && sp.commissionPercent !== null) ? sp.commissionPercent : 40;

      const detailedServices = spApps.map(a => {
        const price = a.price || 0;
        const masterShare = Math.round(price * commissionRate / 100);
        masterRevenue += price;
        masterEarned += masterShare;
        return {
          id: a.id,
          date: a.date,
          time: a.time,
          clientName: a.clientName || 'Гость',
          phone: a.phone || '',
          serviceName: a.serviceName || 'Услуга',
          price: price,
          commissionPercent: commissionRate,
          masterShare: masterShare,
          status: a.status
        };
      });

      totalPayroll += masterEarned;

      return {
        specialist: sp,
        servicesCount: spApps.length,
        revenue: masterRevenue,
        commissionPercent: commissionRate,
        earned: masterEarned,
        salonShare: masterRevenue - masterEarned,
        services: detailedServices
      };
    });

    const unassignedApps = periodApps.filter(a => !claimedAppIds.has(a.id));
    if (unassignedApps.length > 0) {
      const unassignedRevenue = unassignedApps.reduce((acc, a) => acc + (a.price || 0), 0);
      const defaultRate = 40;
      const unassignedEarned = Math.round(unassignedRevenue * defaultRate / 100);
      totalPayroll += unassignedEarned;

      masterStats.push({
        specialist: {
          id: 'unassigned',
          name: 'Дежурный мастер (Не назначен)',
          role: 'Записи без прямого назначения мастера',
          avatar: 'assets/master-ruslan.jpg',
          commissionPercent: defaultRate
        },
        servicesCount: unassignedApps.length,
        revenue: unassignedRevenue,
        commissionPercent: defaultRate,
        earned: unassignedEarned,
        salonShare: unassignedRevenue - unassignedEarned,
        services: unassignedApps.map(a => ({
          id: a.id,
          date: a.date,
          time: a.time,
          clientName: a.clientName || 'Гость',
          phone: a.phone || '',
          serviceName: a.serviceName || 'Услуга',
          price: a.price || 0,
          commissionPercent: defaultRate,
          masterShare: Math.round((a.price || 0) * defaultRate / 100),
          status: a.status
        }))
      });
    }

    return {
      startDate,
      endDate,
      totalRevenue,
      totalPayroll,
      salonMargin: totalRevenue - totalPayroll,
      totalServicesCount,
      summary: {
        totalRevenue,
        totalPayroll,
        salonMargin: totalRevenue - totalPayroll,
        totalServicesCount
      },
      masters: masterStats,
      specialists: masterStats.map(m => ({
        specialistId: m.specialist.id,
        specialistName: m.specialist.name,
        specialistRole: m.specialist.role,
        specialistAvatar: m.specialist.avatar,
        commissionPercent: m.commissionPercent,
        totalServicesCount: m.servicesCount,
        grossRevenue: m.revenue,
        masterPayroll: m.earned,
        salonMargin: m.salonShare,
        items: m.services.map(s => ({
          appointmentId: s.id,
          date: s.date,
          time: s.time,
          clientName: s.clientName,
          clientPhone: s.phone,
          serviceName: s.serviceName,
          price: s.price,
          status: s.status,
          commissionPercent: s.commissionPercent,
          masterShare: s.masterShare,
          salonShare: s.price - s.masterShare
        }))
      }))
    };
  }

  getPayoutOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PAYOUT_ORDERS)) || [];
    } catch (e) {
      return [];
    }
  }

  savePayoutOrders(orders) {
    localStorage.setItem(this.STORAGE_KEYS.PAYOUT_ORDERS, JSON.stringify(orders));
  }

  generatePayoutOrder(data) {
    const orders = this.getPayoutOrders();
    const nextNum = orders.length > 0 ? (Math.max(...orders.map(o => o.orderNumber || 1000)) + 1) : 1001;
    const now = new Date();

    const newOrder = {
      id: `PAY-${nextNum}`,
      orderNumber: nextNum,
      createdAt: now.toISOString(),
      dateFormatted: now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      timeFormatted: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      specialistId: data.specialistId,
      specialistName: data.specialistName,
      specialistRole: data.specialistRole || "Мастер Dark Place",
      specialistAvatar: data.specialistAvatar || "assets/master-ruslan.jpg",
      commissionPercent: data.commissionPercent,
      startDate: data.startDate,
      endDate: data.endDate,
      periodLabel: data.periodLabel || `${data.startDate} — ${data.endDate}`,
      amount: data.amount,
      grossRevenue: data.grossRevenue,
      salonMargin: data.salonMargin,
      servicesCount: data.servicesCount,
      paymentMethod: data.paymentMethod || "Наличные из кассы",
      notes: data.notes || "Выплата вознаграждения мастера по расчетному периоду",
      issuedBy: data.issuedBy || "Администрация Dark Place",
      status: "paid",
      items: data.items || []
    };

    orders.unshift(newOrder);
    this.savePayoutOrders(orders);
    return newOrder;
  }

  cancelPayoutOrder(orderId, reason) {
    const orders = this.getPayoutOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = "cancelled";
      order.cancelledAt = new Date().toISOString();
      order.cancelReason = reason;
      this.savePayoutOrders(orders);
      return true;
    }
    return false;
  }

  formatMoney(amount) {
    if (!amount || amount === 0) return "0 ₫";
    return Number(amount).toLocaleString('ru-RU') + " ₫";
  }
}

// Экспортируем глобальный экземпляр
window.noirData = new NoirDataService();
window.darkplaceData = window.noirData;
window.code606Data = window.noirData;
window.hdData = window.noirData;
