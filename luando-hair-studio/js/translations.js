/**
 * TRUMP by LUANDO Hair Studio Nha Trang
 * Complete Trilingual Translation Matrix (RU / EN / VI)
 * Culturally tuned for luxury beauty & hair salon standards
 */

const translations = {
  ru: {
    nav: {
      about: "О студии",
      founder: "Мастер Луан",
      services: "Услуги и цены",
      portfolio: "Работы",
      reviews: "Отзывы",
      contacts: "Контакты",
      bookOnline: "Онлайн-запись ✨",
      switchLang: "Язык"
    },
    hero: {
      locationBadge: "Балаяж, аиртач и наращивание волос",
      title: "Экспертная колористика славянских и европейских волос",
      subtitle: "Студия топ-стилиста Луана До. Обладая более чем 10-летним опытом, мы предлагаем полный спектр профессиональных услуг для волос, гарантируем стабильно безупречный результат и пользуемся доверием клиентов со всего мира.",
      btnBook: "Забронировать визит ✨",
      btnWork: "Смотреть работы 📸",
      statYears: "Лет опыта",
      statRating: "Рейтинг Google",
      statClients: "Довольных гостей",
      statBlondes: "Идеальных блондов"
    },
    founder: {
      tag: "Основатель и топ-колорист",
      title: "Красота волос как искусство и точная наука",
      lead: "«Славянские и европейские волосы требуют принципиально иной техники работы, чем азиатские — тонкости полотна, деликатного осветления и ювелирного сохранения структуры».",
      bio1: "Привет! Меня зовут **Луан До (LuanDo)**, я основатель студии **TRUMP by LUANDO** в Нячанге. За более чем 10 лет ежедневной практики я сфокусировался на работе со светлыми, пористыми и тонкими волосами европейских и русскоязычных гостей.",
      bio2: "Мы создаем цвет и форму с учетом природного цветотипа, истории предыдущих окрашиваний и вашего образа жизни. Никаких пережженных концов, полос и неожиданных рыжих оттенков — только естественные переливы, мягкое отрастание и здоровый шелковистый блеск.",
      quote: "TRUMP by LUANDO — это золотой стандарт доверия, экспертного владения колористикой и персональной заботы о каждом клиенте.",
      signatureName: "Луан До",
      signatureRole: "Основатель & Главный стилист"
    },
    services: {
      tag: "Прейскурант услуг",
      title: "Фирменные услуги студии",
      subtitle: "Прозрачные фиксированные цены. В каждую сложную процедуру входит диагностика полотна волос и премиальный уход.",
      filterAll: "Все услуги",
      filterStyling: "Окрашивание и стрижки",
      filterCare: "Уход и восстановление",
      bookBtn: "Выбрать услугу",
      from: "от",
      currency: "₫",
      items: [
        {
          id: "airtouch",
          cat: "styling",
          name: "Balayage & AirTouch",
          desc: "Фирменное окрашивание с выдувом прядей феном. Плавный, едва уловимый переход от корней к светлым концам с эффектом мягкого отрастания до 6–8 месяцев.",
          price: "3 000 000",
          duration: "3.5 – 5 часов"
        },
        {
          id: "blonde-color",
          cat: "styling",
          name: "Blonde & Pure Color",
          desc: "Создание чистого, сияющего блонда (платина, жемчуг, бежевый, скандинавский) без повреждения кортекса с одновременной защитой связей волоса.",
          price: "2 500 000",
          duration: "3 – 4 часа"
        },
        {
          id: "extensions",
          cat: "styling",
          name: "Наращивание волос (Feather / Keratin / Fiberglass)",
          desc: "Невидимое, микрокапсульное и перьевое наращивание. Идеальное слияние с родным волосом, невесомый объем и роскошная естественная длина.",
          price: "1 000 000",
          duration: "2 – 4 часа"
        },
        {
          id: "haircut",
          cat: "styling",
          name: "Дизайнерская стрижка & Стайлинг",
          desc: "Женские и мужские стрижки с учетом текстуры волоса, формы лица и направления естественного роста. Легко укладывается дома без усилий.",
          price: "250 000",
          duration: "45 – 60 мин"
        },
        {
          id: "olaplex-repair",
          cat: "care",
          name: "Глубокое молекулярное восстановление (Olaplex)",
          desc: "Интенсивная реконструкция дисульфидных связей для пористых, осветленных и сухих волос. Возвращает эластичность, плотность и шелковистость.",
          price: "800 000",
          duration: "60 – 90 мин"
        },
        {
          id: "steampod",
          cat: "care",
          name: "Паровое выпрямление & Steam Repair",
          desc: "Премиальный уход с технологией направленного пара высокого давления. Зеркальная гладкость, термозащита и глубокое запечатывание кутикулы.",
          price: "1 000 000",
          duration: "1.5 – 2.5 часа"
        },
        {
          id: "perming",
          cat: "care",
          name: "Биозавивка & Шелковые волны (Hair Perming)",
          desc: "Мягкая щадящая завивка без агрессивных тиогликолятов. Живые, пружинящие локоны с эффектом пляжных или объемных естественных волн.",
          price: "1 200 000",
          duration: "2 – 3 часа"
        },
        {
          id: "treatment",
          cat: "care",
          name: "Спа-уход & Глубокое увлажнение полотна",
          desc: "Питательный коктейль масел и аминокислот для волос, уставших от солнца и морской воды. Максимальный блеск и рассыпчатость.",
          price: "900 000",
          duration: "60 мин"
        }
      ]
    },
    portfolio: {
      tag: "Наши работы",
      title: "Галерея преображений",
      subtitle: "Реальные результаты наших гостей. Оцените чистоту цвета, плавность градиентов и живость волос.",
      filterAll: "Все работы",
      filterBlond: "Блонды и AirTouch",
      filterColor: "Balayage",
      filterExt: "Наращивание"
    },
    whyUs: {
      tag: "Почему мы",
      title: "Стандарты комфорта и безопасности",
      items: [
        {
          icon: "🔬",
          title: "Экспертиза славянских волос",
          text: "Глубокое понимание тонкого европейского волоса — деликатная химия, точный расчет оксидов и бережное время выдержки."
        },
        {
          icon: "☕",
          title: "Европейский сервис и забота",
          text: "Вкусный кофе, свежие соки, угощения, заботливая атмосфера и персонал, который свободно общается на английском и русском."
        },
        {
          icon: "💎",
          title: "Только оригинальная косметика",
          text: "Работаем на проверенных премиальных брендах: Olaplex, L'Oréal Professionnel, Wella, премиальные пигменты без аммиака."
        },
        {
          icon: "🛡️",
          title: "Гарантия на цвет и стойкость",
          text: "Контроль качества лично основателем студии Луаном До на каждом этапе: от теста пряди до финальной укладки."
        }
      ]
    },
    reviews: {
      tag: "Отзывы клиентов",
      title: "Нам доверяют клиенты со всего мира",
      subtitle: "Официальный рейтинг 4.9★ на Google Maps на основе более 136 проверенных отзывов экспатов и путешественников.",
      badge: "Подтверждено Google & Trustindex",
      items: [
        {
          author: "Виктория",
          origin: "Экспат, живет в Нячанге",
          stars: 5,
          text: "Очень довольна окрашиванием! Живу в Нячанге давно, покупала краску сама, цвет уходил в рыжий и тускнел. В салоне показала фото цвета, который хотела — и ребята сотворили чудо! Цвет получился идеальным холодным блондом! Постоянно подходил главный мастер Луан и проверял каждый этап. За повторное окрашивание, стрижку и уход Olaplex отдала 2.160.000 VND. Пока живу в Нячанге — только к ним!",
          reply: "Виктория, спасибо за тёплый отзыв! Нам важно контролировать каждый нюанс осветления. Всегда рады видеть вас! 💛 — LuanDo"
        },
        {
          author: "Влад Клюйков",
          origin: "Путешественник",
          stars: 5,
          text: "Здесь случился мой первый опыт с вьетнамскими мастерами — и это один из лучших походов в салон в жизни. Луан и мастера — абсолютные профессионалы в стрижках и сложном цвете. Великолепный сервис, попадание в запрос 100%, научили делать укладку и подобрали домашний уход. Качество волос после осветления — просто супер!",
          reply: "Влад, благодарим за доверие! Рады создавать стиль, который легко носить каждый день! ✂️ — LuanDo"
        },
        {
          author: "Екатерина Севастьянова",
          origin: "Гостья салона",
          stars: 5,
          text: "Делала сложное окрашивание блонд — безумно понравился сервис и результат! Получился очень красивый, благородный цвет. А еще накормили и напоили вкусным кофе, персонал невероятно заботливый. Спасибо огромное! ☺️",
          reply: "Екатерина, спасибо за улыбку и приятные слова! Ждем вас снова на уходы и обновление цвета!"
        },
        {
          author: "Bella M. Wahyuningrat",
          origin: "International Client",
          stars: 5,
          text: "Sangat cantik! I highly recommend this salon and definitely will be back again soon. The atmosphere, staff friendliness and hair quality are top notch! 💕💕",
          reply: "Thank you so much Bella! It was our pleasure to style your hair!"
        }
      ]
    },
    booking: {
      tag: "Онлайн-запись",
      title: "Забронируйте удобное время визита",
      subtitle: "Выберите желаемую услугу, дату и время. Наш администратор свяжется с вами в течение 10 минут для подтверждения.",
      step1Title: "1. Выберите услугу",
      step2Title: "2. Дата и удобное время",
      step3Title: "3. Данные для записи",
      step4Title: "4. Подтверждение записи",
      stepIndicators: ["Услуга", "Время", "Контакты", "Готово"],
      dateLabel: "Дата визита",
      timeLabel: "Удобное время",
      nameLabel: "Ваше имя",
      namePlaceholder: "Например: Мария / Anna",
      notesLabel: "Комментарий или длина волос (по желанию)",
      notesPlaceholder: "Например: длина до лопаток, ранее было осветление...",
      chooseMessengerLabel: "Выберите мессенджер для подтверждения:",
      btnBookWhatsApp: "Забронировать в WhatsApp",
      btnBookTelegram: "Забронировать в Telegram",
      instantConfirmationNote: "Прямая связь с мастером",
      btnNext: "Продолжить →",
      btnPrev: "← Назад",
      successTitle: "Заявка успешно сформирована!",
      successDesc: "Диалог открыт в мессенджере. Коснитесь кнопки «Отправить» в чате, и мастер Луан ответит вам в течение 10 минут.",
      btnOpenWhatsAppAgain: "Открыть чат в WhatsApp снова ↗",
      btnOpenTelegramAgain: "Открыть чат в Telegram снова ↗",
      btnBackHome: "Вернуться на главную"
    },
    contacts: {
      tag: "Контакты и локация",
      title: "Ждем вас в сердце Нячанга",
      subtitle: "Удобное расположение в центральном районе, комфортная парковка для байков и автомобилей.",
      addressLabel: "Адрес студии",
      addressVal: "213 Nguyễn Thị Minh Khai, Phước Hòa, Nha Trang, Khánh Hòa",
      addressNote: "Рядом с центральными проспектами, 5 минут до набережной Чан Фу.",
      hoursLabel: "Часы работы",
      hoursVal: "Понедельник — Воскресенье: 08:30 – 19:30",
      hoursNote: "Работаем без выходных. Приём по предварительной записи.",
      contactLabel: "Прямая связь",
      whatsappBtn: "WhatsApp: +84 343 800 996",
      instagramBtn: "Instagram: @luando944",
      callBtn: "Позвонить в салон"
    },
    footer: {
      rights: "© 2026 TRUMP by LUANDO | Hair Studio Nha Trang. Все права защищены.",
      badge: "Разработано на технологии PulseCore by SYNAPTIQ Lab"
    }
  },

  en: {
    nav: {
      about: "About",
      founder: "Founder",
      services: "Services & Price",
      portfolio: "Portfolio",
      reviews: "Reviews",
      contacts: "Contacts",
      bookOnline: "Book Online ✨",
      switchLang: "Language"
    },
    hero: {
      locationBadge: "Balayage, AirTouch & Hair Extensions",
      title: "Master Color & Hair Artistry for Slavic & European Hair",
      subtitle: "Studio of founder & master stylist LuanDo. With over 10 years of mastery, we offer a complete range of professional hair services, ensuring consistently flawless results trusted by clients worldwide.",
      btnBook: "Book an Appointment ✨",
      btnWork: "View Hair Transformations 📸",
      statYears: "Years Experience",
      statRating: "Google Rating",
      statClients: "Happy Clients",
      statBlondes: "Blonde Transformations"
    },
    founder: {
      tag: "Founder & Master Colorist",
      title: "Hair Craft as an Art and Exact Science",
      lead: "“Slavic and European hair requires a fundamentally distinct touch — delicate strand thickness, precise lightener formulations, and total respect for hair integrity.”",
      bio1: "Hi, I’m **LuanDo**, founder of **TRUMP by LUANDO** Hair Studio in Nha Trang. Over nearly a decade of dedicated craftsmanship, I developed a strong specialization in fine, porous, and light hair textures favored by expat and international clients.",
      bio2: "Every custom shade and haircut is designed around your natural undertones, personal history, and lifestyle. No burnt cuticles, harsh stripes, or unwanted reddish brass — only seamless blending, natural regrowth, and head-turning shine.",
      quote: "TRUMP by LUANDO represents a gold standard built on trust, deep colorimetry expertise, and personalized care for every guest.",
      signatureName: "LuanDo",
      signatureRole: "Founder & Master Stylist"
    },
    services: {
      tag: "Price Menu",
      title: "Signature Studio Services",
      subtitle: "Transparent fixed pricing. Every premier chemical service includes in-depth consultation and professional restorative care.",
      filterAll: "All Services",
      filterStyling: "Coloring & Styling",
      filterCare: "Care & Treatment",
      bookBtn: "Choose Service",
      from: "from",
      currency: "₫",
      items: [
        {
          id: "airtouch",
          cat: "styling",
          name: "Balayage & AirTouch",
          desc: "Our signature air-blown highlighting technique. Seamless, soft transition from root to ends with soft, graceful regrowth lasting 6–8 months.",
          price: "3,000,000",
          duration: "3.5 – 5 hours"
        },
        {
          id: "blonde-color",
          cat: "styling",
          name: "Blonde & Pure Color",
          desc: "Clean, radiant blondes (platinum, pearl, Nordic, beige) achieved safely with bond protectors that preserve hair strength and bounce.",
          price: "2,500,000",
          duration: "3 – 4 hours"
        },
        {
          id: "extensions",
          cat: "styling",
          name: "Hair Extensions (Feather / Keratin / Fiberglass)",
          desc: "Undetectable micro-capsule and feather extensions. Seamless blend with natural hair, weightless fullness, and luxurious length.",
          price: "1,000,000",
          duration: "2 – 4 hours"
        },
        {
          id: "haircut",
          cat: "styling",
          name: "Designer Haircut & Styling",
          desc: "Tailored cuts for men and women respecting natural hair texture, bone structure, and lifestyle. Effortless to manage at home.",
          price: "250,000",
          duration: "45 – 60 mins"
        },
        {
          id: "olaplex-repair",
          cat: "care",
          name: "Deep Molecular Bond Repair (Olaplex)",
          desc: "Intensive disulfide bond reconstruction for lightened, porous, and sun-stressed strands. Restores elasticity and silkiness.",
          price: "800,000",
          duration: "60 – 90 mins"
        },
        {
          id: "steampod",
          cat: "care",
          name: "Steam Straightening & Intensive Care",
          desc: "High-pressure conditioning steam technology. Creates mirror-like smoothness, shields against humidity, and seals cuticles.",
          price: "1,000,000",
          duration: "1.5 – 2.5 hours"
        },
        {
          id: "perming",
          cat: "care",
          name: "Bio-Perming & Soft Waves",
          desc: "Gentle chemical perming free of aggressive thioglycolates. Creates bouncy, natural movement and effortless beach waves.",
          price: "1,200,000",
          duration: "2 – 3 hours"
        },
        {
          id: "treatment",
          cat: "care",
          name: "Spa Hydration & Scalp Ritual",
          desc: "Rich complex of botanical oils and amino acids specifically formulated for hair exposed to tropical sun and sea salt.",
          price: "900,000",
          duration: "60 mins"
        }
      ]
    },
    portfolio: {
      tag: "Portfolio",
      title: "Real Hair Transformations",
      subtitle: "Browse real results crafted for our international clients in Nha Trang. Pure hues, seamless blends, and radiant hair vitality.",
      filterAll: "All Works",
      filterBlond: "Blonde & AirTouch",
      filterColor: "Balayage",
      filterExt: "Extensions"
    },
    whyUs: {
      tag: "Why Choose Us",
      title: "International Standards of Excellence",
      items: [
        {
          icon: "🔬",
          title: "Slavic & European Hair Mastery",
          text: "Deep expertise in delicate, light-colored hair with calibrated lighteners and low developer formulations."
        },
        {
          icon: "☕",
          title: "Warm Hospitality & Comfort",
          text: "Enjoy artisan coffee, juices, snacks, high-speed Wi-Fi, and fluent English-speaking friendly service."
        },
        {
          icon: "💎",
          title: "Original Authentic Products",
          text: "Exclusively verified brands: Olaplex, L'Oréal Professionnel, Wella, and ammonia-free Italian toners."
        },
        {
          icon: "🛡️",
          title: "Direct Quality Oversight",
          text: "Founder LuanDo personally inspects each transformation from the strand test to the finishing blowout."
        }
      ]
    },
    reviews: {
      tag: "Client Reviews",
      title: "Trusted by Clients Worldwide",
      subtitle: "Official 4.9★ Google Maps rating backed by 136+ verified reviews from expats and travelers.",
      badge: "Verified by Google & Trustindex",
      items: [
        {
          author: "Viktoriia",
          origin: "Nha Trang Expat",
          stars: 5,
          text: "Delighted with my color! Having lived in Nha Trang for years, I struggled with brassy tones from DIY dyes. I showed Luan a reference photo and the team worked pure magic! Clean cold blonde, no warmth at all. Luan personally inspected every single foil. For dye, cut, and Olaplex, I paid 2,160,000 VND. I will never switch salons again!",
          reply: "Thank you Viktoriia! Preserving hair health while achieving a true cool blonde is always our priority! 💛 — LuanDo"
        },
        {
          author: "Vlad Klyuykov",
          origin: "Traveler",
          stars: 5,
          text: "This was my first experience with Vietnamese hairstylists and easily one of the best salon visits of my life. Luan and his stylists are true experts in cuts and complex tones. Super service, 100% precision, and the hair texture after lightening feels extraordinary!",
          reply: "Thank you Vlad! So thrilled you enjoyed the atmosphere and cut! ✂️ — LuanDo"
        },
        {
          author: "Ekaterina Sevastianova",
          origin: "Salon Guest",
          stars: 5,
          text: "Had an AirTouch blonde done — completely in love with the service and color! Elegant soft tone, plus they served delicious snacks and coffee. The staff is genuinely caring. ☺️",
          reply: "Thank you Ekaterina for your kind words! Looking forward to seeing you again!"
        },
        {
          author: "Bella M. Wahyuningrat",
          origin: "International Client",
          stars: 5,
          text: "Sangat cantik! I highly recommend this salon and definitely will be back again soon. The atmosphere, staff friendliness and hair quality are top notch! 💕💕",
          reply: "Thank you so much Bella! It was our pleasure to style your hair!"
        }
      ]
    },
    booking: {
      tag: "Online Booking",
      title: "Reserve Your Private Session",
      subtitle: "Select your service, preferred date, and convenient time slot. Our concierge will confirm your booking within 10 minutes.",
      step1Title: "1. Select Service",
      step2Title: "2. Date & Convenient Time",
      step3Title: "3. Booking Details",
      step4Title: "4. Booking Confirmation",
      stepIndicators: ["Service", "Time", "Contacts", "Done"],
      dateLabel: "Preferred Date",
      timeLabel: "Preferred Time",
      nameLabel: "Your Name",
      namePlaceholder: "e.g. Maria / Anna",
      notesLabel: "Notes or Hair History (optional)",
      notesPlaceholder: "e.g. shoulder length, previously bleached ends...",
      chooseMessengerLabel: "Choose messenger to confirm booking:",
      btnBookWhatsApp: "Book via WhatsApp",
      btnBookTelegram: "Book via Telegram",
      instantConfirmationNote: "Direct salon connect",
      btnNext: "Next Step →",
      btnPrev: "← Back",
      successTitle: "Appointment Request Formed!",
      successDesc: "Chat window opened. Tap 'Send' in the chat, and master Luan will confirm your reservation within 10 minutes.",
      btnOpenWhatsAppAgain: "Open WhatsApp Chat Again ↗",
      btnOpenTelegramAgain: "Open Telegram Chat Again ↗",
      btnBackHome: "Back to Home"
    },
    contacts: {
      tag: "Location & Visit",
      title: "Visit Us in the Heart of Nha Trang",
      subtitle: "Conveniently located in the city center with secure parking for bikes and cars.",
      addressLabel: "Studio Address",
      addressVal: "213 Nguyễn Thị Minh Khai, Phước Hòa, Nha Trang, Khánh Hòa",
      addressNote: "Next to central boulevards, just 5 minutes from Trần Phú beachfront.",
      hoursLabel: "Opening Hours",
      hoursVal: "Monday – Sunday: 08:30 – 19:30",
      hoursNote: "Open 7 days a week. Appointments warmly recommended.",
      contactLabel: "Direct Connect",
      whatsappBtn: "WhatsApp: +84 343 800 996",
      instagramBtn: "Instagram: @luando944",
      callBtn: "Call Reception"
    },
    footer: {
      rights: "© 2026 TRUMP by LUANDO | Hair Studio Nha Trang. All rights reserved.",
      badge: "Crafted with PulseCore Technology by SYNAPTIQ Lab"
    }
  },

  vi: {
    nav: {
      about: "Về Salon",
      founder: "Stylist Luân Đỗ",
      services: "Dịch vụ & Bảng giá",
      portfolio: "Tác phẩm",
      reviews: "Đánh giá",
      contacts: "Liên hệ",
      bookOnline: "Đặt lịch ngay ✨",
      switchLang: "Ngôn ngữ"
    },
    hero: {
      locationBadge: "Balayage, AirTouch & Nối tóc chuyên nghiệp",
      title: "Chuyên Gia Nhuộm Balayage & Airtouch Cao Cấp Tại Nha Trang",
      subtitle: "Studio của nhà sáng lập & chuyên gia tạo mẫu LuanDo. Với hơn 10 năm kinh nghiệm, chúng tôi cung cấp đầy đủ dịch vụ làm tóc chuyên nghiệp, cam kết kết quả hoàn hảo và được khách hàng toàn cầu tin chọn.",
      btnBook: "Đặt lịch trải nghiệm ✨",
      btnWork: "Xem mẫu tóc thực tế 📸",
      statYears: "Năm kinh nghiệm",
      statRating: "Đánh giá Google",
      statClients: "Khách hàng tin chọn",
      statBlondes: "Tác phẩm hoàn hảo"
    },
    founder: {
      tag: "Founder & Master Colorist",
      title: "Nghệ Thuật Tóc Kết Hợp Khoa Học Chuẩn Xác",
      lead: "“Tóc sợi mảnh của khách quốc tế và tóc châu Á cần những phác đồ nhuộm hoàn toàn khác biệt — tỉ mỉ về nồng độ oxy và kiểm soát nhiệt độ nghiêm ngặt.”",
      bio1: "Xin chào, tôi là **Luân Đỗ (LuanDo)**, người sáng lập **TRUMP by LUANDO** tại Nha Trang. Với gần 10 năm theo đuổi đam mê tạo mẫu tóc chuyên nghiệp, tôi đã đào sâu nghiên cứu chất tóc châu Âu và khách hàng quốc tế.",
      bio2: "Mỗi kiểu tóc và màu nhuộm đều được cá nhân hóa dựa trên đường nét khuôn mặt, tone da và phong cách sống của bạn. Không lo đứt gãy, ám vàng hay xỉn màu — chỉ có hiệu ứng chuyển màu mềm mại và độ bóng khỏe tự nhiên.",
      quote: "TRUMP by LUANDO là lời cam kết vững chắc về tay nghề, chất lượng thuốc chính hãng và sự tận tâm dành cho từng mái tóc.",
      signatureName: "Luân Đỗ",
      signatureRole: "Nhà sáng lập & Giám đốc kỹ thuật"
    },
    services: {
      tag: "Bảng giá dịch vụ",
      title: "Dịch Vụ Nổi Bật Tại Studio",
      subtitle: "Bảng giá niêm yết minh bạch. Mọi dịch vụ hóa chất đều bao gồm bước tư vấn chuyên sâu và phục hồi bảo vệ tóc.",
      filterAll: "Tất cả dịch vụ",
      filterStyling: "Nhuộm & Tạo kiểu",
      filterCare: "Chăm sóc & Phục hồi",
      bookBtn: "Chọn dịch vụ",
      from: "từ",
      currency: "₫",
      items: [
        {
          id: "airtouch",
          cat: "styling",
          name: "Balayage & AirTouch Signature",
          desc: "Kỹ thuật nhuộm phân tách hạt tóc bằng máy sấy. Hiệu ứng chuyển màu êm ái từ chân đến ngọn, giữ màu đẹp tự nhiên 6–8 tháng không lộ chân đen.",
          price: "3.000.000",
          duration: "3.5 – 5 tiếng"
        },
        {
          id: "blonde-color",
          cat: "styling",
          name: "Tẩy & Nhuộm Tone Khói / Bạch Kim",
          desc: "Lên chuẩn các gam màu sáng (bạch kim, xám khói, beige) với công nghệ bọc hạt tóc an toàn, không khô xơ hay đứt gãy.",
          price: "2.500.000",
          duration: "3 – 4 tiếng"
        },
        {
          id: "extensions",
          cat: "styling",
          name: "Nối Tóc (Lông Vũ / Keratin / Sợi Thủy Tinh)",
          desc: "Mối nối siêu nhỏ tàng hình, không cộm, không nặng đầu. Hòa quyện tự nhiên 100% với tóc thật, mang lại độ dài và dày bồng bềnh.",
          price: "1.000.000",
          duration: "2 – 4 tiếng"
        },
        {
          id: "haircut",
          cat: "styling",
          name: "Cắt Tóc Thiết Kế & Sấy Tạo Kiểu",
          desc: "Thiết kế phom dáng tỉ mỉ cho cả nam và nữ theo cấu trúc gương mặt. Dễ chăm sóc và sấy vào nếp nhanh chóng tại nhà.",
          price: "250.000",
          duration: "45 – 60 phút"
        },
        {
          id: "olaplex-repair",
          cat: "care",
          name: "Phục Hồi Cấu Trúc Đa Tầng Olaplex",
          desc: "Tái tạo liên kết disulfua bên trong sợi tóc bị tổn thương do hóa chất. Giúp sợi tóc đanh dai, dày dặn và đàn hồi trở lại.",
          price: "800.000",
          duration: "60 – 90 phút"
        },
        {
          id: "steampod",
          cat: "care",
          name: "Duỗi Phục Hồi Hơi Nước Steampod",
          desc: "Công nghệ duỗi dưỡng bằng hơi nước áp suất cao. Tóc suôn mượt óng ả như lụa, khóa ẩm và chống xơ rối dưới độ ẩm miền biển.",
          price: "1.000.000",
          duration: "1.5 – 2.5 tiếng"
        },
        {
          id: "perming",
          cat: "care",
          name: "Uốn Sóng Lơi Tự Nhiên (Hair Perming)",
          desc: "Uốn sóng nước, uốn gợn nhẹ nhàng không gây khô ráp tóc. Tạo độ bồng bềnh sống động như sấy tạo kiểu hàng ngày.",
          price: "1.200.000",
          duration: "2 – 3 tiếng"
        },
        {
          id: "treatment",
          cat: "care",
          name: "Hấp Dầu Chuyên Sâu & Massage Da Đầu",
          desc: "Bổ sung tinh dầu quý và axit amin phục hồi độ ẩm cho mái tóc chịu tác động của nắng gió biển miền nhiệt đới.",
          price: "900.000",
          duration: "60 phút"
        }
      ]
    },
    portfolio: {
      tag: "Bộ sưu tập",
      title: "Tác Phẩm Thực Tế Tại Studio",
      subtitle: "Chiêm ngưỡng những màn 'lột xác' ngoạn mục của khách hàng trong và ngoài nước thực hiện tại TRUMP by LUANDO.",
      filterAll: "Tất cả",
      filterBlond: "Airtouch & Nhuộm sáng",
      filterColor: "Balayage",
      filterExt: "Nối tóc"
    },
    whyUs: {
      tag: "Lý do chọn salon",
      title: "Chất Lượng Vượt Trội Chuẩn Quốc Tế",
      items: [
        {
          icon: "🔬",
          title: "Chuyên môn sâu về tóc quốc tế",
          text: "Hiểu rõ đặc tính sợi tóc mảnh châu Âu và tóc châu Á, căn chỉnh công thức thuốc nhuộm chính xác từng gram."
        },
        {
          icon: "☕",
          title: "Dịch vụ ân cần & không gian tiện nghi",
          text: "Phục vụ nước uống, cà phê miễn phí, nhân viên giao tiếp tiếng Anh lưu loát, không gian máy lạnh sạch sẽ."
        },
        {
          icon: "💎",
          title: "100% Sản phẩm chính hãng cao cấp",
          text: "Chỉ sử dụng các dòng sản phẩm uy tín: Olaplex, L'Oréal Professionnel, Wella đảm bảo sức khỏe mái tóc."
        },
        {
          icon: "🛡️",
          title: "Giám sát kỹ thuật trực tiếp",
          text: "Founder Luân Đỗ trực tiếp tư vấn và kiểm tra kỹ lưỡng từng bước từ test tóc đến sấy hoàn thiện."
        }
      ]
    },
    reviews: {
      tag: "Khách hàng nói về chúng tôi",
      title: "Được Tin Tưởng Bởi Khách Hàng Toàn Cầu",
      subtitle: "Đạt 4.9★ trên Google Maps với hơn 136+ đánh giá thực tế từ người dân bản địa và du khách quốc tế.",
      badge: "Xác thực bởi Google & Trustindex",
      items: [
        {
          author: "Thanh Nguyễn",
          origin: "Khách hàng địa phương",
          stars: 5,
          text: "Sau khi tìm salon làm tóc đẹp ở Nha Trang trên Google, mình quyết định thử salon TRUMP by LuanDo và kết quả vượt mong đợi. Nhân viên rất chuyên nghiệp, tư vấn kỹ trước khi làm nên mình chọn được màu nhuộm phù hợp. Quá trình làm tóc nhẹ nhàng, không bị đau hay khó chịu. Sau khi hoàn thành, tóc mềm, lên màu chuẩn và giữ được độ bóng. Highly recommend!",
          reply: "Cảm ơn bạn Thanh Nguyễn rất nhiều! Salon rất vui vì bạn hài lòng với mái tóc mới ạ! 💛 — Luân Đỗ"
        },
        {
          author: "Minh Ngọc",
          origin: "Khách quen 3 năm",
          stars: 5,
          text: "Best Hair Salon in town! Mỗi lần mình đi Nha Trang muốn đổi màu là lại tìm đến Trump By Luando Salon. Mình biết salon này được 3 năm rồi và lúc nào cũng rất hài lòng với dịch vụ. Nhuộm tóc rất đẹp, làm tỉ mỉ, cắt tóc cũng đẹp, nhân viên chu đáo. 10 điểm không có nhưng nhé!",
          reply: "Cảm ơn bạn Minh Ngọc đã luôn đồng hành và ủng hộ anh em salon suốt 3 năm qua ạ!"
        },
        {
          author: "Viktoriia",
          origin: "Khách hàng Nga tại Nha Trang",
          stars: 5,
          text: "Очень довольна окрашиванием! Живу в Нячанге давно... В салоне показали чудо! Цвет такой, как я хотела! Ребята молодцы, постоянно подходил главный мастер и контролировал процесс.",
          reply: "Cảm ơn Viktoriia vì sự tin tưởng tuyệt đối dành cho salon!"
        },
        {
          author: "Vlad Klyuykov",
          origin: "Khách du lịch quốc tế",
          stars: 5,
          text: "Đây là trải nghiệm làm tóc tuyệt vời nhất của tôi với các thợ tóc Việt Nam. Luân và các bạn thợ cực kỳ chuyên nghiệp trong cắt và nhuộm tone màu khó. Dịch vụ tuyệt vời!",
          reply: "Cảm ơn bạn Vlad! Hẹn gặp lại bạn trong chuyến du lịch Nha Trang tiếp theo!"
        }
      ]
    },
    booking: {
      tag: "Đặt lịch online",
      title: "Đặt Lịch Hẹn Trực Tuyến Tiện Lợi",
      subtitle: "Chọn dịch vụ, chuyên viên và khung giờ bạn mong muốn. Đội ngũ salon sẽ liên hệ xác nhận trong vòng 10 phút.",
      step1Title: "1. Chọn dịch vụ",
      step2Title: "2. Ngày & Giờ thuận tiện",
      step3Title: "3. Thông tin đặt lịch",
      step4Title: "4. Xác nhận lịch hẹn",
      stepIndicators: ["Dịch vụ", "Thời gian", "Liên hệ", "Hoàn tất"],
      dateLabel: "Ngày hẹn",
      timeLabel: "Giờ mong muốn",
      nameLabel: "Họ và tên của bạn",
      namePlaceholder: "Ví dụ: Thu Hà / Anna",
      notesLabel: "Ghi chú thêm về tóc (không bắt buộc)",
      notesPlaceholder: "Ví dụ: tóc ngang vai, từng nhuộm đen, muốn lên màu khói...",
      chooseMessengerLabel: "Chọn ứng dụng để gửi yêu cầu đặt lịch:",
      btnBookWhatsApp: "Đặt lịch qua WhatsApp",
      btnBookTelegram: "Đặt lịch qua Telegram",
      instantConfirmationNote: "Kết nối trực tiếp salon",
      btnNext: "Tiếp tục →",
      btnPrev: "← Quay lại",
      successTitle: "Yêu cầu đặt lịch đã được ghi nhận!",
      successDesc: "Cửa sổ trò chuyện đã mở. Bạn chỉ cần nhấn 'Gửi' trong ứng dụng, salon sẽ xác nhận lịch trong vòng 10 phút.",
      btnOpenWhatsAppAgain: "Mở lại trò chuyện WhatsApp ↗",
      btnOpenTelegramAgain: "Mở lại trò chuyện Telegram ↗",
      btnBackHome: "Trở về trang chủ"
    },
    contacts: {
      tag: "Địa chỉ & Liên hệ",
      title: "Chào Đón Quý Khách Tại Nha Trang",
      subtitle: "Vị trí đắc địa ngay trung tâm thành phố, thuận tiện đi lại và có chỗ đỗ xe rộng rãi an toàn.",
      addressLabel: "Địa chỉ salon",
      addressVal: "213 Nguyễn Thị Minh Khai, Phước Hòa, TP. Nha Trang, Khánh Hòa",
      addressNote: "Gần các trục đường chính, chỉ mất 5 phút di chuyển ra bãi biển Trần Phú.",
      hoursLabel: "Giờ mở cửa",
      hoursVal: "Thứ Hai – Chủ Nhật: 08:30 – 19:30",
      hoursNote: "Mở cửa tất cả các ngày trong tuần. Khuyến khích đặt hẹn trước.",
      contactLabel: "Kênh hỗ trợ nhanh",
      whatsappBtn: "WhatsApp: +84 343 800 996",
      instagramBtn: "Instagram: @luando944",
      callBtn: "Gọi hotline tư vấn"
    },
    footer: {
      rights: "© 2026 TRUMP by LUANDO | Hair Studio Nha Trang. Bảo lưu mọi quyền.",
      badge: "Phát triển trên nền tảng công nghệ PulseCore by SYNAPTIQ Lab"
    }
  }
};
