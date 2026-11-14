// One place for every skill's details. The keys are the ids used in the URL:
//   /skills/acoustic-guitar, /skills/conversational-korean, ...
// The cards on the Home and Explore pages must navigate to these exact ids.
//
// NOTE: only "acoustic-guitar" uses your real copy. The other four use
// PLACEHOLDER text (descriptions, session counts, what to bring, meeting
// spots). Replace them with your real content.

export const SKILLS = {
  "acoustic-guitar": {
    id: "acoustic-guitar",
    title: "Acoustic guitar",
    category: "Music",
    level: "Beginner friendly",
    description:
      "Learn chords, strumming patterns, and your first full song. No previous guitar experience required.",
    teacher: "Alex Morgan",
    rating: 4.9,
    reviews: 32,
    taught: 18,
    bring:
      "Bring a guitar if you have one. Let Alex know if you need to borrow one before your session.",
    points: 15,
    minutes: 60,
    format: "In person",
    locations: [
      {
        name: "Community centre lobby",
        note: "Meet by the reception desk in the lobby.",
      },
      { name: "Public library · second floor", note: "Meet by the elevators." },
    ],
  },

  // ---------- PLACEHOLDER CONTENT BELOW ----------
  "conversational-korean": {
    id: "conversational-korean",
    title: "Conversational Korean",
    category: "Languages",
    level: "Beginner friendly",
    description:
      "Practise everyday phrases and build the confidence to hold a simple conversation in Korean.",
    teacher: "Taylor Reed",
    rating: 4.9,
    reviews: 24,
    taught: 15,
    bring:
      "A quiet spot, a stable internet connection, and a notebook for new vocabulary.",
    points: 15,
    minutes: 60,
    format: "Online",
    locations: [],
  },

  "excel-basics": {
    id: "excel-basics",
    title: "Excel basics",
    category: "Tech",
    level: "Beginner friendly",
    description:
      "Learn formulas, formatting, and simple charts so you can build spreadsheets with confidence.",
    teacher: "Jordan Blake",
    rating: 4.9,
    reviews: 28,
    taught: 20,
    bring:
      "A laptop with Excel or Google Sheets, plus any spreadsheet you'd like to work on.",
    points: 15,
    minutes: 60,
    format: "Online",
    locations: [],
  },

  "python-fundamentals": {
    id: "python-fundamentals",
    title: "Python fundamentals",
    category: "Tech",
    level: "Beginner friendly",
    description:
      "Write your first programs and learn the building blocks of Python: variables, loops, and functions.",
    teacher: "Jordan Blake",
    rating: 4.9,
    reviews: 21,
    taught: 14,
    bring:
      "A laptop with Python installed. Jordan can help you set it up in the first session.",
    points: 15,
    minutes: 60,
    format: "Online",
    locations: [],
  },

  "photography-basics": {
    id: "photography-basics",
    title: "Photography basics",
    category: "Art",
    level: "Beginner friendly",
    description:
      "Get comfortable with exposure, composition, and light, whether you shoot on a camera or a phone.",
    teacher: "Emma Chen",
    rating: 4.9,
    reviews: 19,
    taught: 12,
    bring: "Bring a camera or phone. Let Emma know if you need to borrow one.",
    points: 15,
    minutes: 60,
    format: "In person",
    locations: [
      {
        name: "Community centre lobby",
        note: "Meet by the reception desk in the lobby.",
      },
      { name: "Public library · second floor", note: "Meet by the elevators." },
    ],
  },
};
