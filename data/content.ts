
export interface Note {
  id: string;
  date: string;
  title: string;
  studentAnswer: string;
  submissions: number;
  totalStudents: number;
  drawingData?: string;
  isTeacherNote?: boolean;
  objectiveId?: string;
  isSubmitted?: boolean;
}

export interface Objective {
  id: string;
  text: string;
  theme: string;
}

export interface SubjectData {
  notes: Note[];
  objectives?: Objective[];
  groupGames?: GroupGame[];
}

export type KnowledgeLevel = 'low' | 'medium' | 'high';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star';
}

export interface Class {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  progress: number; // A percentage from 0 to 100
  subjectProgress: { [subjectName: string]: number };
  strugglingTopics: { subject: string, topic: string }[];
  knowledgeLevel: KnowledgeLevel;
  achievements: string[];
}

export interface ClassStruggle {
  id: string;
  subject: string;
  topic: string;
  description: string;
  strugglingPercentage: number;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  subject: string;
  type: 'class' | 'break';
}

export interface QuestionSet {
  id: string;
  subject: string;
  title: string;
  questions: {
    id: string;
    text: string;
    commonStruggle?: {
      description: string;
      example: string;
    }
  }[];
}

export interface GroupGame {
  id: string;
  title: string;
  subject: string;
  steps: {
    id: string;
    clue: string;
    answer: string;
  }[];
  isAiGenerated?: boolean;
}

export const allAchievements: Achievement[] = [
    { id: 'achieve1', title: 'Første Notat', description: 'Du skrev ditt aller første notat!', icon: 'trophy' },
    { id: 'achieve2', title: 'Fag-Utforsker', description: 'Du har åpnet notater i 3 forskjellige fag.', icon: 'star' },
    { id: 'achieve3', title: 'Orjeger', description: 'Du fullførte din første "Scavenger Hunt".', icon: 'trophy' },
    { id: 'achieve4', title: 'AI-Samtale', description: 'Du fikk hjelp fra KAI for første gang.', icon: 'star' },
    { id: 'achieve5', title: 'Matte-Mester', description: 'Du har 100% fremgang i Matte.', icon: 'trophy' },
    { id: 'achieve6', title: 'Norsk-Nerd', description: 'Du har 100% fremgang i Norsk.', icon: 'star' },
];

export const classes: Class[] = [
  { id: 'c1', name: 'Klasse 6A' },
  { id: 'c2', name: 'Klasse 6B' },
  { id: 'c3', name: 'Klasse 6C' },
  { id: 'c4', name: 'Klasse 6D' },
];

export const groupGames: GroupGame[] = [
  {
    id: 'gg-norsk',
    title: 'Orjakten',
    subject: 'Norsk',
    steps: [
      {
        id: 'step1',
        clue: 'Jeg har byer, men ingen hus. Jeg har fjell, men ingen trær. Jeg har vann, men ingen fisk. Hva er jeg?',
        answer: 'kart',
      },
      {
        id: 'step2',
        clue: 'Hva går opp, men kommer aldri ned?',
        answer: 'alder',
      },
      {
        id: 'step3',
        clue: 'Jeg har nøkler, men åpner ingen dører. Jeg har rom, men du kan ikke gå inn. Hva er jeg?',
        answer: 'piano',
      },
    ],
  },
  {
    id: 'gg-matte',
    title: 'Kodeknekkeren',
    subject: 'Matte',
    steps: [
       {
        id: 'm-step1',
        clue: 'Jeg er et tall mellom 20 og 30. Jeg er delelig på både 3 og 9. Hvilket tall er jeg?',
        answer: '27',
      },
      {
        id: 'm-step2',
        clue: 'Hvor mange kanter har en terning?',
        answer: '12',
      },
    ],
  },
  {
    id: 'gg-english',
    title: 'Grammar Gauntlet',
    subject: 'English',
    steps: [
       {
        id: 'e-step1',
        clue: 'They ___ playing football right now. (is/are/am)',
        answer: 'are',
      },
      {
        id: 'e-step2',
        clue: 'She ___ to the store yesterday. (go/goes/went)',
        answer: 'went',
      },
      {
        id: 'e-step3',
        clue: 'There are ___ apples on the table. (much/many)',
        answer: 'many',
      },
    ],
  },
  {
    id: 'gg-naturfag',
    title: 'Konsept-Kobling',
    subject: 'Naturfag',
    steps: [
       {
        id: 's-step1',
        clue: 'Prosessen der planter lager mat ved hjelp av sollys.',
        answer: 'Fotosyntese',
      },
      {
        id: 's-step2',
        clue: 'Kraften som trekker gjenstander mot jorden.',
        answer: 'Gravitasjon',
      },
      {
        id: 's-step3',
        clue: 'Når vann blir til damp, kalles det...',
        answer: 'Fordamping',
      },
    ],
  },
  {
    id: 'gg-krle',
    title: 'Hvem sa det?',
    subject: 'KRLE',
    steps: [
       {
        id: 'k-step1',
        clue: '"Vær mot andre slik du vil at de skal være mot deg." (Hint: Den gylne...)',
        answer: 'regel',
      },
      {
        id: 'k-step2',
        clue: 'Hvem er den viktigste profeten i Islam?',
        answer: 'Muhammed',
      },
      {
        id: 'k-step3',
        clue: 'Hvilken høytid feirer kristne for å minnes Jesu fødsel?',
        answer: 'Jul',
      },
    ],
  }
];


export const questionSets: QuestionSet[] = [
  {
    id: 'qs1',
    subject: 'Matte',
    title: 'Introduksjon til Brøk',
    questions: [
      { id: 'q1a', text: 'Hvor stor del av pizzaen er spist opp?' },
      { id: 'q1b', text: 'Hvor mange epler er det igjen i treet?' },
      { id: 'q1c', text: 'Hvor stor del av klassen er jenter?' },
    ],
  },
  {
    id: 'qs2',
    subject: 'Matte',
    title: 'Grunnleggende Eksponenter',
    questions: [
        { 
          id: 'q2a', 
          text: 'Hva er 3²?',
          commonStruggle: {
            description: "Noen elever ganger grunntallet med eksponenten.",
            example: "Vanlig feil: 3 * 2 = 6. Riktig svar: 3 * 3 = 9."
          }
        },
        { 
          id: 'q2b', 
          text: 'Regn ut 2³ * 2⁴',
          commonStruggle: {
            description: "Elever multipliserer eksponentene i stedet for å addere dem.",
            example: "Vanlig feil: 2³ * 2⁴ = 2¹². Riktig svar: 2³ * 2⁴ = 2⁽³⁺⁴⁾ = 2⁷."
          }
        },
        { 
          id: 'q2c', 
          text: 'Forenkle (5²)³',
          commonStruggle: {
            description: "Elever adderer eksponentene i stedet for å multiplisere dem.",
            example: "Vanlig feil: (5²)³ = 5⁵. Riktig svar: (5²)³ = 5⁽²*³⁾ = 5⁶."
          }
        },
    ]
  },
  {
    id: 'qs3',
    subject: 'Norsk',
    title: 'Analyse av "Vinter"',
    questions: [
        { id: 'q3a', text: 'Hva er hovedtemaet i diktet?' },
        { id: 'q3b', text: 'Finn et eksempel på et metafor.' },
        { id: 'q3c', text: 'Hvilken stemning skaper diktet?' },
    ]
  }
];

export const scheduleData: ScheduleEvent[] = [
  { id: 't1', time: '08:30 - 09:15', subject: 'Matte', type: 'class' },
  { id: 't2', time: '09:15 - 10:00', subject: 'Norsk', type: 'class' },
  { id: 't3', time: '10:00 - 10:20', subject: 'Friminutt', type: 'break' },
  { id: 't4', time: '10:20 - 11:05', subject: 'English', type: 'class' },
  { id: 't5', time: '11:05 - 11:50', subject: 'Samfunnsfag', type: 'class' },
  { id: 't6', time: '11:50 - 12:20', subject: 'Lunsj', type: 'break' },
  { id: 't7', time: '12:20 - 13:05', subject: 'Naturfag', type: 'class' },
];

const generateStudents = (classId: string, count: number, startId: number): Student[] => {
    const students: Student[] = [];
    const firstNames = ["Liam", "Noah", "Emil", "Isak", "Jakob", "Filip", "Henrik", "Oskar", "Aksel", "Johannes", "Mathias", "Theodor", "William", "Magnus", "Elias", "Nora", "Emma", "Olivia", "Ella", "Sofie", "Leah", "Frida", "Ingrid", "Maja", "Hedda", "Selma", "Tiril", "Astrid", "Ada", "Sara"];
    const lastNames = ["Hansen", "Johansen", "Olsen", "Larsen", "Andersen", "Pedersen", "Nilsen", "Kristiansen", "Jensen", "Karlsen", "Johnsen", "Pettersen", "Eriksen", "Berg", "Haugen"];

    for (let i = 0; i < count; i++) {
        const id = startId + i;
        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const progress = Math.floor(Math.random() * 50) + 50;
        const knowledgeLevels: KnowledgeLevel[] = ['low', 'medium', 'high'];
        const knowledgeLevel = knowledgeLevels[Math.floor(Math.random() * 3)];
        
        students.push({
            id: `s${id}`,
            name,
            classId,
            progress,
            subjectProgress: { 
                "Matte": Math.floor(Math.random() * 70) + 30, 
                "Norsk": Math.floor(Math.random() * 70) + 30, 
                "English": Math.floor(Math.random() * 70) + 30, 
                "Samfunnsfag": Math.floor(Math.random() * 70) + 30,
                "Naturfag": Math.floor(Math.random() * 70) + 30,
                "KRLE": Math.floor(Math.random() * 70) + 30,
            },
            strugglingTopics: knowledgeLevel === 'low' ? [{ subject: 'Matte', topic: 'Eksponenter' }] : [],
            knowledgeLevel,
            achievements: progress > 95 ? ['achieve1', 'achieve2'] : ['achieve1'],
        });
    }
    return students;
}

export const students: Student[] = [
    ...generateStudents('c1', 15, 1),
    ...generateStudents('c2', 15, 16),
    ...generateStudents('c3', 15, 31),
    ...generateStudents('c4', 15, 46),
];


export const classStruggles: ClassStruggle[] = [
    {
        id: 'cs1',
        subject: 'Matte',
        topic: 'Eksponenter',
        description: 'Elevene forveksler grunnleggende regler for multiplikasjon og divisjon av potenser.',
        strugglingPercentage: 64,
    },
    {
        id: 'cs2',
        subject: 'Norsk',
        topic: 'Kommaregler',
        description: 'Mange elever sliter med å sette komma riktig før "men" og i leddsetninger.',
        strugglingPercentage: 48,
    },
    {
        id: 'cs3',
        subject: 'Naturfag',
        topic: 'Fotosyntese',
        description: 'Flere elever har problemer med å forklare hva klorofyll gjør i prosessen.',
        strugglingPercentage: 35,
    },
    {
        id: 'cs4',
        subject: 'English',
        topic: 'Past Tense',
        description: 'Common errors with irregular verbs (e.g., "flyed" instead of "flew").',
        strugglingPercentage: 55,
    }
];

export const subjectContent: Record<string, SubjectData> = {
  "Hjem": {
    notes: [
      {
        id: "hjem-1",
        date: "2023-10-27",
        title: "Velkommen til Tavlo!",
        studentAnswer: "Dette er din digitale notatbok. Bruk menyen til venstre for å velge et fag og se notatene dine. Du kan redigere eksisterende notater, lage nye, eller bruke AI-assistenten for å få hjelp med arbeidet ditt.",
        submissions: 0,
        totalStudents: 60,
        drawingData: "",
      }
    ],
    groupGames: [],
  },
  "Timeplan": {
    notes: [],
    groupGames: [],
  },
  "Matte": {
    objectives: [
      { id: 'm-obj1', text: 'Forstå og bruke Pytagoras’ læresetning i praktiske situasjoner.', theme: 'Geometri' },
      { id: 'm-obj2', text: 'Kunne regne ut arealet av rektangler og trekanter.', theme: 'Areal' },
      { id: 'm-obj3', text: 'Lære grunnleggende regler for eksponenter.', theme: 'Eksponenter' },
    ],
    notes: [
       {
        id: "matte-2",
        date: "2023-10-26",
        title: "Tekstoppgave: Pytagoras",
        studentAnswer: "En stige er 5 meter lang og står 3 meter fra en vegg. Hvor høyt opp på veggen når stigen? Jeg brukte pytagoras: a^2 + b^2 = c^2. Så 3*3 + x*x = 5*5. Det blir 9 + x^2 = 25. x^2 er 16. Så x er 4. Stigen når 4 meter opp.",
        submissions: 52,
        totalStudents: 60,
        drawingData: "",
      },
      {
        id: "matte-1",
        date: "2023-10-24",
        title: "Areal av rektangel",
        studentAnswer: "Arealet er 12 + 5 = 17. Jeg plusset sidene sammen for å finne arealet. Rektanglet har et areal på 17 cm. Jeg tror formelen er lengde pluss bredde.",
        submissions: 58,
        totalStudents: 60,
        drawingData: "",
      }
    ],
    groupGames: groupGames.filter(g => g.subject === 'Matte'),
  },
  "Norsk": {
    objectives: [
        { id: 'n-obj1', text: 'Kunne analysere et dikt og identifisere virkemidler som metaforer.', theme: 'Dikt analyse' },
        { id: 'n-obj2', text: 'Forstå hovedtemaet og stemningen i en tekst.', theme: 'Dikt analyse' },
        { id: 'n-obj3', text: 'Skrive en sammenhengende og reflekterende tekst.', theme: 'Tekstproduksjon' },
    ],
    notes: [
      {
        id: "norsk-1",
        date: "2023-10-22",
        title: "Analyse av diktet 'Vinter' av Tor Jonsson",
        studentAnswer: `Min analyse av "Vinter"\n\nDikte handler om vinter. Det er kalt og mørkt. Han skriver om snø og is. Jeg liker ikke vinteren så godt for det er for kalt. Dikte er litt trist, men også fint. Han bruker ord som "svart" og "kaldt". Det får meg til å tenke på at alt sover. Kanskje handler det om døden.`,
        submissions: 49,
        totalStudents: 60,
        drawingData: "",
      }
    ],
    groupGames: groupGames.filter(g => g.subject === 'Norsk'),
  },
  "English": {
    objectives: [
        { id: 'e-obj1', text: 'Describe a topic using relevant vocabulary.', theme: 'Vocabulary' },
        { id: 'e-obj2', text: 'Write a short, creative story in English.', theme: 'Creative Writing' },
        { id: 'e-obj3', text: 'Use correct past tense verb forms.', theme: 'Grammar' },
    ],
    notes: [
      {
        id: "english-2",
        date: "2023-10-25",
        title: "My favorite season",
        studentAnswer: "My favorite season is summer. I like summer because the weather is warm and I can swim in the sea. I have summer holiday from school and I can play with my friends every day. We eat ice cream. Summer is the best.",
        submissions: 59,
        totalStudents: 60,
        drawingData: "",
      },
      {
        id: "english-1",
        date: "2023-10-21",
        title: "My magical animal",
        studentAnswer: `My Magical Animal\n\nOne day I look out my window and see a cat. But it was not a normal cat. It had wings! The cat was blue and had shiny wings. It could fly very fast. I went outside and the cat fly to me. It could talk! It said "hello". We became friends and flyed all over the town. It was the best day. The end.`,
        submissions: 55,
        totalStudents: 60,
        drawingData: "",
      }
    ],
    groupGames: groupGames.filter(g => g.subject === 'English'),
  },
  "Samfunnsfag": {
    objectives: [
        { id: 's-obj1', text: 'Forklare hva demokrati er og hvorfor det er en viktig styringsform.', theme: 'Demokrati' },
        { id: 's-obj2', text: 'Kjenne til sentrale begreper som storting, valg og grunnlov.', theme: 'Demokrati' },
    ],
    notes: [
      {
        id: "samfunnsfag-1",
        date: "2023-10-20",
        title: "Hva betyr demokrati?",
        studentAnswer: `Hva er demokrati\n\nDemokrati er at folk bestemmer. Vi kan stemme på hvem som skal styre landet. Det er viktig fordi da kan alle si hva de mener. Hvis bare en person bestemte, kunne han være slem. I norge har vi demokrati og det er bra. Vi har valg og alle over 18 kan stemme. Da får vi et rettferdig land.`,
        submissions: 45,
        totalStudents: 60,
        drawingData: "",
      }
    ],
    groupGames: groupGames.filter(g => g.subject === 'Samfunnsfag'),
  },
  "Naturfag": {
    objectives: [
        { id: 'nat-obj1', text: 'Beskrive livssyklusen til en plante.', theme: 'Biologi' },
        { id: 'nat-obj2', text: 'Forstå de ulike aggregattilstandene (fast, flytende, gass).', theme: 'Kjemi' },
        { id: 'nat-obj3', text: 'Gjenkjenne de indre planetene i solsystemet vårt.', theme: 'Astronomi' },
    ],
    notes: [
      {
        id: "naturfag-1",
        date: "2023-10-19",
        title: "Fotosyntesen",
        studentAnswer: "Fotosyntesen er prosessen planter bruker for å lage sin egen mat. De bruker sollys, vann og karbondioksid. Klorofyll er det grønne stoffet i bladene som fanger sollyset. Resultatet er glukose (sukker) og oksygen. Derfor er planter viktige for oss, fordi de lager oksygenet vi puster.",
        submissions: 48,
        totalStudents: 60,
        drawingData: "",
      }
    ],
    groupGames: groupGames.filter(g => g.subject === 'Naturfag'),
  },
  "KRLE": {
    objectives: [
        { id: 'krle-obj1', text: 'Gjenfortelle en sentral fortelling fra kristendommen.', theme: 'Kristendom' },
        { id: 'krle-obj2', text: 'Forklare hva de fem søylene i islam er.', theme: 'Islam' },
        { id: 'krle-obj3', text: 'Diskutere etiske dilemmaer knyttet til vennskap og ærlighet.', theme: 'Etikk' },
    ],
    notes: [
      {
        id: "krle-1",
        date: "2023-10-18",
        title: "Den barmhjertige samaritan",
        studentAnswer: "Fortellingen handler om en mann som ble ranet og etterlatt. En prest og en levitt gikk forbi uten å hjelpe. Men en samaritan, som var en fiende, stoppet og hjalp mannen. Jesus fortalte dette for å vise at vi skal hjelpe alle som trenger det, uansett hvem de er. Det betyr å være en god nabo.",
        submissions: 51,
        totalStudents: 60,
        drawingData: "",
      }
    ],
    groupGames: groupGames.filter(g => g.subject === 'KRLE'),
  }
};