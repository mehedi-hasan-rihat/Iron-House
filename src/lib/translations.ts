export type Lang = "en" | "bn";

const t = {
  en: {
    // shared
    bookFree: "Book Free Trial",
    explore: "Explore",
    scroll: "scroll",

    // navbar
    nav: ["Experience", "Programs", "Trainers", "Membership", "Contact"],

    // hero act 1
    heroEyebrow: "Gulshan, Dhaka · Est. 2016",
    heroSub: "Not a gym. A standard.",
    heroSubNote: "International equipment · Certified coaches · Premium experience.",
    heroStats: [
      { value: "3,240+", label: "Active Members" },
      { value: "12",     label: "Elite Trainers" },
      { value: "8",      label: "Years Running"  },
      { value: "15+",    label: "Programs"       },
    ],
    // hero act 2
    hero2LeftLabel: "Women's Program",
    hero2LeftTitle: "Built for\nHer Strength",
    hero2LeftPerks: ["Female-only floors", "Certified women coaches", "Zero judgment"],
    hero2RightLabel: "Combat Program",
    hero2RightTitle: "Train Like\nYou Mean It",
    hero2RightPerks: ["Heavy bags & ring work", "Private coaching", "Real intensity"],
    // hero act 3
    hero3Eyebrow: "Strength Floor · Since 2016",
    hero3Lines: ["No", "Limits.", "No", "Excuses."],
    hero3Sub: "Rogue racks. Calibrated plates. Mirror walls.",
    hero3SubNote: "Everything you need. Nothing you don't.",
    viewPrograms: "View All Programs",

    // marquee
    marquee: ["DISCIPLINE", "STRENGTH", "COMMUNITY", "PERFORMANCE", "CONFIDENCE", "TRANSFORMATION"],

    // about
    aboutLabel: "(01) — The House",
    aboutHeading1: "Not a gym.",
    aboutHeading2: "A standard.",
    aboutP1: "We built FIT GYM CENTER for the people who show up when nobody's watching. For the ones who understand that transformation isn't loud — it's consistent. Every square meter of our floor is engineered around one idea: give you no excuse.",
    aboutP2: "International equipment. Certified coaches. A community that lifts each other — literally. From Gulshan to the rest of Dhaka, we are raising the standard of what a fitness experience should feel like in Bangladesh.",
    aboutPillars: ["Discipline", "Coaching", "Equipment", "Community"],

    // experience
    expLabel: "(02) — Step Inside",
    expHeading: "The Experience",
    expPanels: [
      { title: "Reception",      copy: "A quiet arrival. Concrete, warm light, black marble." },
      { title: "Strength Floor", copy: "Rogue racks, calibrated plates, full-mirror walls."  },
      { title: "Cardio Deck",    copy: "Technogym line, panoramic city view."                },
      { title: "Combat Room",    copy: "Heavy bags, ring, private coaching."                 },
      { title: "Women's Studio", copy: "Female-only training hours & coaches."               },
    ],

    // why us
    whyLabel: "(03) — Why FIT GYM Center",
    whyHeading: "Everything you\nexpect. And more\nyou don't.",
    whySub: "Seven reasons Dhaka's most committed athletes call this home.",
    whyItems: [
      { t: "International Equipment",  d: "Rogue · Technogym · Hammer Strength." },
      { t: "Certified Trainers",       d: "ACE, NASM & ISSA certified coaches."  },
      { t: "Women's Fitness",          d: "Female-only hours, female trainers."  },
      { t: "Functional Training",      d: "TRX, rigs, plyo, mobility zone."      },
      { t: "Nutrition Planning",       d: "Custom diet plans by dietitians."     },
      { t: "Locker · Steam · Parking", d: "Full amenities, secured parking."     },
      { t: "24/7 Security",            d: "CCTV, keycard access, on-site staff." },
    ],

    // programs
    programsLabel: "(04) — Programs",
    programsHeading: "Trained for\nwhatever you're\nafter.",
    programsSub: "Eight signature tracks — every one built and adjusted by our head coaches around your goal, your body, and your schedule.",
    programs: [
      { t: "Weight Loss",       d: "12-week body recomposition program."      },
      { t: "Muscle Building",   d: "Hypertrophy split, progressive overload." },
      { t: "Strength",          d: "Powerlifting: squat, bench, deadlift."    },
      { t: "Functional",        d: "Movement patterns, mobility, athleticism."},
      { t: "HIIT & Cardio",     d: "Fat burn, endurance, VO₂ max."           },
      { t: "Women's Fitness",   d: "Female-only coaching & studio."           },
      { t: "Personal Training", d: "1-on-1 with certified coach."             },
      { t: "Senior Fitness",    d: "Low-impact, joint-safe programming."      },
    ],

    // trainers
    trainersLabel: "(05) — The Coaches",
    trainersHeading: "The people\nbehind the reps.",
    trainersShown: "03 / 12 shown",
    trainers: [
      { name: "Rakib Hasan",   role: "Head Strength Coach"  },
      { name: "Ayesha Rahman", role: "Women's Fitness Lead" },
      { name: "Tanveer Ahmed", role: "Performance Coach"    },
    ],

    // transformation
    transLabel: "(06) — Transformation",
    transQuote: "I walked in tired of my body. I walked out with something I built. FIT GYM CENTER didn't just change my weight — it changed my discipline.",
    transMember: "Member · 2 years",

    // stats
    stats: [
      { label: "Happy Members"       },
      { label: "Certified Trainers"  },
      { label: "Years in Dhaka"      },
      { label: "Member Satisfaction" },
    ],

    // membership
    memberLabel: "(07) — Membership",
    memberHeading: "Pick your pace.",
    memberSub: "Prices in BDT. No hidden fees. Cancel anytime with 30 days notice.",
    memberPlans: [
      { name: "Monthly",   per: "/ month",    perks: ["Full floor access", "Locker & steam", "Group classes"],                                   badge: "" },
      { name: "Quarterly", per: "/ 3 months", perks: ["Everything in Monthly", "1 free PT session", "Nutrition consult"],                       badge: "" },
      { name: "Half-Year", per: "/ 6 months", perks: ["Everything in Quarterly", "3 PT sessions", "Body composition scan"], badge: "Most chosen"          },
      { name: "Annual",    per: "/ year",     perks: ["Everything in Half-Year", "12 PT sessions", "Priority booking"],                         badge: "" },
    ],
    memberCta: "The best way to decide is to feel it. Come tour the floor before you commit.",
    visitGym: "Visit Our Gym",

    // faq
    faqLabel: "(08) — FAQ",
    faqHeading: "Answers,\nno fluff.",
    faqs: [
      { q: "What is the monthly membership fee?",  a: "Monthly membership starts at BDT 3,500. Quarterly and annual plans reduce the effective monthly cost significantly." },
      { q: "Do you have separate ladies' timing?", a: "Yes. Our women-only studio operates daily between 10 AM – 4 PM, with dedicated female trainers." },
      { q: "Are there female personal trainers?",  a: "Absolutely. Our female coaches are ACE / NASM certified, including pre & post-natal specialisations." },
      { q: "What are your opening hours?",         a: "Saturday to Thursday, 6 AM – 11 PM. Friday, 3 PM – 10 PM." },
      { q: "Do you provide diet plans?",           a: "Yes. Every member gets a baseline nutrition plan. Personalised plans are included in Half-Year and Annual memberships." },
      { q: "Is parking available?",               a: "Yes — secure, camera-monitored parking for cars and bikes on-site." },
    ],

    // contact
    contactLabel: "(09) — Come In",
    contactHeading: "Discipline\nbegins here.",
    contactChannels: [
      { l: "Call",      v: "+880 1700 000 000" },
      { l: "WhatsApp",  v: "+880 1700 000 000" },
      { l: "Instagram", v: "@fitgymcenter.dhk"    },
      { l: "Facebook",  v: "/fitgymcenterbd"      },
    ],
    getDirections: "Get Directions",
    contactAddrLabel: "Address",
    contactAddr: "House 42, Road 11\nGulshan 2, Dhaka 1212\nBangladesh",
    contactHoursLabel: "Hours",
    contactHours: [
      { day: "Sat – Thu", time: "06:00 — 23:00" },
      { day: "Friday",    time: "15:00 — 22:00" },
    ],

    // footer
    footerCopy: "FIT GYM Center · Dhaka, Bangladesh",
    footerTag: "Built with discipline.",

    // mobile cta
    call: "Call",
    whatsapp: "WhatsApp",
    directions: "Directions",
  },

  bn: {
    // shared
    bookFree: "ফ্রি ট্রায়াল বুক করুন",
    explore: "আরও দেখুন",
    scroll: "স্ক্রোল",

    // navbar
    nav: ["অভিজ্ঞতা", "প্রোগ্রাম", "প্রশিক্ষক", "সদস্যপদ", "যোগাযোগ"],

    // hero act 1
    heroEyebrow: "গুলশান, ঢাকা · প্রতিষ্ঠিত ২০১৬",
    heroSub: "শুধু জিম নয়। একটি মান।",
    heroSubNote: "আন্তর্জাতিক সরঞ্জাম · সার্টিফাইড কোচ · প্রিমিয়াম অভিজ্ঞতা।",
    heroStats: [
      { value: "৩,২৪০+", label: "সক্রিয় সদস্য" },
      { value: "১২",      label: "এলিট প্রশিক্ষক" },
      { value: "৮",       label: "বছর চলমান"    },
      { value: "১৫+",     label: "প্রোগ্রাম"    },
    ],
    // hero act 2
    hero2LeftLabel: "মহিলা প্রোগ্রাম",
    hero2LeftTitle: "তার শক্তির\nজন্য তৈরি",
    hero2LeftPerks: ["শুধু মহিলাদের ফ্লোর", "সার্টিফাইড মহিলা কোচ", "বিচারমুক্ত পরিবেশ"],
    hero2RightLabel: "কমব্যাট প্রোগ্রাম",
    hero2RightTitle: "সত্যিকারের\nট্রেনিং করুন",
    hero2RightPerks: ["হেভি ব্যাগ ও রিং ওয়ার্ক", "ব্যক্তিগত কোচিং", "প্রকৃত তীব্রতা"],
    // hero act 3
    hero3Eyebrow: "স্ট্রেংথ ফ্লোর · ২০১৬ থেকে",
    hero3Lines: ["কোনো", "সীমা নেই।", "কোনো", "অজুহাত নেই।"],
    hero3Sub: "রোগ র‌্যাক। ক্যালিব্রেটেড প্লেট। মিরর ওয়াল।",
    hero3SubNote: "যা দরকার সব আছে। যা দরকার নেই তা নেই।",
    viewPrograms: "সব প্রোগ্রাম দেখুন",

    // marquee
    marquee: ["শৃঙ্খলা", "শক্তি", "সম্প্রদায়", "পারফরম্যান্স", "আত্মবিশ্বাস", "রূপান্তর"],

    // about
    aboutLabel: "(০১) — দ্য হাউস",
    aboutHeading1: "শুধু জিম নয়।",
    aboutHeading2: "একটি মান।",
    aboutP1: "যারা কেউ না দেখলেও হাজির হন, আমরা তাদের জন্যই ফিট জিন সেন্টার তৈরি করেছি। যারা বোঝেন যে রূপান্তর শোরগোলে নয় — ধারাবাহিকতায়। আমাদের প্রতিটি বর্গমিটার একটি ধারণার চারপাশে গড়া: আপনাকে কোনো অজুহাত না দেওয়া।",
    aboutP2: "আন্তর্জাতিক সরঞ্জাম। সার্টিফাইড কোচ। একে অপরকে সত্যিকার অর্থে তুলে ধরার একটি সম্প্রদায়। গুলশান থেকে পুরো ঢাকায়, আমরা বাংলাদেশে ফিটনেস অভিজ্ঞতার মান উঁচুতে নিয়ে যাচ্ছি।",
    aboutPillars: ["শৃঙ্খলা", "কোচিং", "সরঞ্জাম", "সম্প্রদায়"],

    // experience
    expLabel: "(০২) — ভেতরে আসুন",
    expHeading: "অভিজ্ঞতা",
    expPanels: [
      { title: "রিসেপশন",       copy: "শান্ত আগমন। কংক্রিট, উষ্ণ আলো, কালো মার্বেল।" },
      { title: "স্ট্রেংথ ফ্লোর", copy: "রোগ র‌্যাক, ক্যালিব্রেটেড প্লেট, ফুল-মিরর দেয়াল।" },
      { title: "কার্ডিও ডেক",    copy: "টেকনোজিম লাইন, প্যানোরামিক শহর দৃশ্য।"          },
      { title: "কমব্যাট রুম",   copy: "হেভি ব্যাগ, রিং, ব্যক্তিগত কোচিং।"             },
      { title: "মহিলা স্টুডিও",  copy: "শুধু মহিলাদের ট্রেনিং সময় ও কোচ।"             },
    ],

    // why us
    whyLabel: "(০৩) — কেন ফিট জিন সেন্টার",
    whyHeading: "আপনি যা\nআশা করেন। তার\nচেয়েও বেশি।",
    whySub: "ঢাকার সবচেয়ে প্রতিশ্রুতিবদ্ধ অ্যাথলেটরা এখানে আসেন — সাত কারণে।",
    whyItems: [
      { t: "আন্তর্জাতিক সরঞ্জাম",   d: "Rogue · Technogym · Hammer Strength।"       },
      { t: "সার্টিফাইড প্রশিক্ষক",    d: "ACE, NASM ও ISSA সার্টিফাইড কোচ।"          },
      { t: "মহিলা ফিটনেস",          d: "শুধু মহিলাদের সময় ও প্রশিক্ষক।"             },
      { t: "ফাংশনাল ট্রেনিং",       d: "TRX, রিগস, প্লায়ো, মোবিলিটি জোন।"          },
      { t: "নিউট্রিশন পরিকল্পনা",   d: "ডায়েটিশিয়ানদের কাস্টম ডায়েট প্ল্যান।"       },
      { t: "লকার · স্টিম · পার্কিং", d: "সম্পূর্ণ সুযোগ-সুবিধা, নিরাপদ পার্কিং।"     },
      { t: "২৪/৭ নিরাপত্তা",        d: "CCTV, কীকার্ড অ্যাক্সেস, অনসাইট স্টাফ।"     },
    ],

    // programs
    programsLabel: "(০৪) — প্রোগ্রাম",
    programsHeading: "আপনার লক্ষ্যের\nজন্য ট্রেনিং।",
    programsSub: "আটটি সিগনেচার ট্র্যাক — প্রতিটি আপনার লক্ষ্য, শরীর এবং সময়সূচি অনুযায়ী তৈরি।",
    programs: [
      { t: "ওজন কমানো",       d: "১২ সপ্তাহের বডি রিকম্পোজিশন প্রোগ্রাম।"  },
      { t: "মাসল বিল্ডিং",   d: "হাইপারট্রফি স্প্লিট, প্রগ্রেসিভ ওভারলোড।" },
      { t: "স্ট্রেংথ",        d: "পাওয়ারলিফটিং: স্কোয়াট, বেঞ্চ, ডেডলিফট।" },
      { t: "ফাংশনাল",         d: "মুভমেন্ট প্যাটার্ন, মোবিলিটি, অ্যাথলেটিজম।"},
      { t: "HIIT ও কার্ডিও",  d: "ফ্যাট বার্ন, এন্ডুরেন্স, VO₂ ম্যাক্স।"   },
      { t: "মহিলা ফিটনেস",   d: "শুধু মহিলাদের কোচিং ও স্টুডিও।"           },
      { t: "পার্সোনাল ট্রেনিং",d: "সার্টিফাইড কোচের সাথে ১-অন-১।"           },
      { t: "সিনিয়র ফিটনেস",  d: "লো-ইম্প্যাক্ট, জয়েন্ট-সেফ প্রোগ্রামিং।"  },
    ],

    // trainers
    trainersLabel: "(০৫) — প্রশিক্ষকরা",
    trainersHeading: "রেপের পেছনের\nমানুষেরা।",
    trainersShown: "১২ জনের মধ্যে ০৩ জন",
    trainers: [
      { name: "রাকিব হাসান",   role: "হেড স্ট্রেংথ কোচ"    },
      { name: "আয়েশা রহমান",  role: "মহিলা ফিটনেস লিড"    },
      { name: "তানভীর আহমেদ", role: "পারফরম্যান্স কোচ"     },
    ],

    // transformation
    transLabel: "(০৬) — রূপান্তর",
    transQuote: "আমি ক্লান্ত শরীর নিয়ে এসেছিলাম। বেরিয়েছি নিজের তৈরি কিছু নিয়ে। ফিট জিন সেন্টার শুধু আমার ওজন নয় — আমার শৃঙ্খলা বদলে দিয়েছে।",
    transMember: "সদস্য · ২ বছর",

    // stats
    stats: [
      { label: "সন্তুষ্ট সদস্য"      },
      { label: "সার্টিফাইড প্রশিক্ষক" },
      { label: "ঢাকায় বছর"          },
      { label: "সদস্য সন্তুষ্টি"      },
    ],

    // membership
    memberLabel: "(০৭) — সদস্যপদ",
    memberHeading: "আপনার গতিতে বেছে নিন।",
    memberSub: "মূল্য BDT-তে। কোনো লুকানো ফি নেই। ৩০ দিনের নোটিশে যেকোনো সময় বাতিল।",
    memberPlans: [
      { name: "মাসিক",     per: "/ মাস",       perks: ["সম্পূর্ণ ফ্লোর অ্যাক্সেস", "লকার ও স্টিম", "গ্রুপ ক্লাস"],                                       badge: "" },
      { name: "ত্রৈমাসিক", per: "/ ৩ মাস",    perks: ["মাসিকের সবকিছু", "১ ফ্রি PT সেশন", "নিউট্রিশন পরামর্শ"],                                         badge: "" },
      { name: "ছয় মাস",   per: "/ ৬ মাস",    perks: ["ত্রৈমাসিকের সবকিছু", "৩টি PT সেশন", "বডি কম্পোজিশন স্ক্যান"], badge: "সবচেয়ে জনপ্রিয়"              },
      { name: "বার্ষিক",   per: "/ বছর",      perks: ["ছয় মাসের সবকিছু", "১২টি PT সেশন", "প্রায়রিটি বুকিং"],                                            badge: "" },
    ],
    memberCta: "সিদ্ধান্ত নেওয়ার সেরা উপায় হলো অনুভব করা। প্রতিশ্রুতি দেওয়ার আগে ফ্লোর ঘুরে দেখুন।",
    visitGym: "আমাদের জিম দেখুন",

    // faq
    faqLabel: "(০৮) — সাধারণ প্রশ্ন",
    faqHeading: "উত্তর,\nসরাসরি।",
    faqs: [
      { q: "মাসিক সদস্যপদ ফি কত?",               a: "মাসিক সদস্যপদ BDT ৩,৫০০ থেকে শুরু। ত্রৈমাসিক ও বার্ষিক পরিকল্পনায় মাসিক খরচ উল্লেখযোগ্যভাবে কমে।" },
      { q: "মহিলাদের জন্য আলাদা সময় আছে?",       a: "হ্যাঁ। আমাদের শুধু মহিলাদের স্টুডিও প্রতিদিন সকাল ১০টা – বিকাল ৪টা পর্যন্ত চলে, নিবেদিত মহিলা প্রশিক্ষকসহ।" },
      { q: "মহিলা পার্সোনাল ট্রেইনার আছেন?",      a: "অবশ্যই। আমাদের মহিলা কোচরা ACE / NASM সার্টিফাইড, প্রি ও পোস্ট-ন্যাটাল বিশেষজ্ঞতাসহ।" },
      { q: "খোলার সময় কী?",                      a: "শনিবার থেকে বৃহস্পতিবার, সকাল ৬টা – রাত ১১টা। শুক্রবার, বিকাল ৩টা – রাত ১০টা।" },
      { q: "ডায়েট প্ল্যান দেওয়া হয়?",            a: "হ্যাঁ। প্রতিটি সদস্য একটি বেসিক নিউট্রিশন প্ল্যান পান। ছয় মাস ও বার্ষিক সদস্যপদে ব্যক্তিগতকৃত প্ল্যান অন্তর্ভুক্ত।" },
      { q: "পার্কিং সুবিধা আছে?",                 a: "হ্যাঁ — গাড়ি ও বাইকের জন্য নিরাপদ, ক্যামেরা-পর্যবেক্ষিত পার্কিং অনসাইটে।" },
    ],

    // contact
    contactLabel: "(০৯) — আসুন",
    contactHeading: "শৃঙ্খলা\nএখান থেকেই শুরু।",
    contactChannels: [
      { l: "কল",         v: "+৮৮০ ১৭০০ ০০০ ০০০" },
      { l: "হোয়াটসঅ্যাপ", v: "+৮৮০ ১৭০০ ০০০ ০০০" },
      { l: "ইনস্টাগ্রাম",  v: "@fitgymcenter.dhk"    },
      { l: "ফেসবুক",      v: "/fitgymcenterbd"      },
    ],
    getDirections: "দিকনির্দেশনা পান",
    contactAddrLabel: "ঠিকানা",
    contactAddr: "বাড়ি ৪২, রাস্তা ১১\nগুলশান ২, ঢাকা ১২১২\nবাংলাদেশ",
    contactHoursLabel: "সময়",
    contactHours: [
      { day: "শনি – বৃহস্পতি", time: "০৬:০০ — ২৩:০০" },
      { day: "শুক্রবার",       time: "১৫:০০ — ২২:০০" },
    ],

    // footer
    footerCopy: "ফিট জিন সেন্টার · ঢাকা, বাংলাদেশ",
    footerTag: "শৃঙ্খলায় নির্মিত।",

    // mobile cta
    call: "কল",
    whatsapp: "হোয়াটসঅ্যাপ",
    directions: "দিকনির্দেশ",
  },
} as const;

export default t;
