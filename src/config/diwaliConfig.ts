export interface DiwaliConfig {
  friendName: string;
  senderName: string;
  greetingTitle: string;
  tagline: string;
  diyaCount: number;
  letter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
  };
  finalGreeting: {
    hero: string;
    subHero: string;
    wishes: string[];
    signature: string;
  };
  rangoliColors: string[];
  fireworkColors: string[];
}

export const diwaliConfig: DiwaliConfig = {
  friendName: "Pranika",
  senderName: "Visnu Mitran",
  greetingTitle: "HAPPY DIWALI!",
  tagline: "Tonight, the magic is in your hands.",
  diyaCount: 7,
  letter: {
    salutation: "To my favourite human, Pranika,",
    paragraphs: [
      "Life is so much more vibrant and beautiful with a friend like you.",
      "May your days be filled with endless happiness, your dreams find their way into reality, and your life always shine brighter than these thousand lights.",
      "Here's to more heartfelt laughter, unforgettable memories, and countless crazy moments together.",
      "You deserve all the joy and wonders in the universe."
    ],
    closing: "Always grateful for you ✨"
  },
  finalGreeting: {
    hero: "HAPPY DIWALI!",
    subHero: "To my dearest friend Pranika ❤️",
    wishes: [
      "May your life always shine brighter than a thousand stars.",
      "May happiness follow you everywhere, success find you at every turn, and may we create countless more memories together.",
      "Wishing you a spectacular, joyous, and luminous Diwali!"
    ],
    signature: "With lots of love,\n"
  },
  rangoliColors: [
    "#FFD700", // Gold
    "#FF3366", // Deep Festive Pink/Ruby
    "#00E5FF", // Electric Cyan
    "#FF9100", // Saffron / Orange
    "#B388FF", // Mystical Purple
    "#00E676"  // Emerald Green
  ],
  fireworkColors: [
    "#FFD700",
    "#FF3366",
    "#00F0FF",
    "#FF9900",
    "#D946EF",
    "#22C55E",
    "#FFFFFF"
  ]
};

