export interface Note {
  id: string;
  date: string;
  question: string;
  studentAnswer: string;
}

export interface SubjectData {
  notes: Note[];
}

export const subjectContent: Record<string, SubjectData> = {
  "Hjem": {
    notes: [
      {
        id: "hjem-1",
        date: "2023-10-27",
        question: "Velkommen til Tavlo!",
        studentAnswer: "Dette er din digitale notatbok. Bruk menyen til venstre for å velge et fag og se notatene dine. Du kan redigere eksisterende notater, lage nye, eller bruke AI-assistenten for å få hjelp med arbeidet ditt."
      }
    ]
  },
  "Matte": {
    notes: [
       {
        id: "matte-2",
        date: "2023-10-26",
        question: "Tekstoppgave: Pytagoras",
        studentAnswer: "En stige er 5 meter lang og står 3 meter fra en vegg. Hvor høyt opp på veggen når stigen? Jeg brukte pytagoras: a^2 + b^2 = c^2. Så 3*3 + x*x = 5*5. Det blir 9 + x^2 = 25. x^2 er 16. Så x er 4. Stigen når 4 meter opp."
      },
      {
        id: "matte-1",
        date: "2023-10-24",
        question: "Regn ut arealet av et rektangel med lengde 12 cm og bredde 5 cm. Forklar hvordan du tenker.",
        studentAnswer: "Arealet er 12 + 5 = 17. Jeg plusset sidene sammen for å finne arealet. Rektanglet har et areal på 17 cm. Jeg tror formelen er lengde pluss bredde."
      }
    ]
  },
  "Norsk": {
    notes: [
      {
        id: "norsk-1",
        date: "2023-10-22",
        question: "Skriv en kort analyse av diktet 'Vinter' av Tor Jonsson. Hva tror du diktet handler om?",
        studentAnswer: `Min analyse av "Vinter"

Dikte handler om vinter. Det er kalt og mørkt. Han skriver om snø og is. Jeg liker ikke vinteren så godt for det er for kalt. Dikte er litt trist, men også fint. Han bruker ord som "svart" og "kaldt". Det får meg til å tenke på at alt sover. Kanskje handler det om døden.`
      }
    ]
  },
  "English": {
    notes: [
      {
        id: "english-2",
        date: "2023-10-25",
        question: "Describe your favorite season and why you like it.",
        studentAnswer: "My favorite season is summer. I like summer because the weather is warm and I can swim in the sea. I have summer holiday from school and I can play with my friends every day. We eat ice cream. Summer is the best."
      },
      {
        id: "english-1",
        date: "2023-10-21",
        question: "Write a short story about a magical animal you discovered in your backyard. What can it do?",
        studentAnswer: `My Magical Animal

One day I look out my window and see a cat. But it was not a normal cat. It had wings! The cat was blue and had shiny wings. It could fly very fast. I went outside and the cat fly to me. It could talk! It said "hello". We became friends and flyed all over the town. It was the best day. The end.`
      }
    ]
  },
  "Samfunnsfag": {
    notes: [
      {
        id: "samfunnsfag-1",
        date: "2023-10-20",
        question: "Forklar med egne ord hva demokrati betyr og hvorfor det er viktig.",
        studentAnswer: `Hva er demokrati

Demokrati er at folk bestemmer. Vi kan stemme på hvem som skal styre landet. Det er viktig fordi da kan alle si hva de mener. Hvis bare en person bestemte, kunne han være slem. I norge har vi demokrati og det er bra. Vi har valg og alle over 18 kan stemme. Da får vi et rettferdig land.`
      }
    ]
  }
};
