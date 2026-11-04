// ============================================================
//  EDIT THE GAME HERE
//  Change the title, teams, images and questions. Save the
//  file and refresh the browser (F5) to see the changes.
//
//  Images: put the image files in the "images" folder and
//  write the file name here, e.g. "images/myimage.jpg".
//  .jpg, .png, .webp, .gif and .svg all work.
// ============================================================

const GAME = {
  title: "Jeopardy!",

  // Default team names on the start screen. The number of teams
  // and the names can be changed there before each game.
  teams: ["Lag 1", "Lag 2", "Lag 3"],

  // Default choices on the start screen. They can also be changed there.
  settings: {
    timer: false,         // show a countdown on every question
    timerSeconds: 30,     // seconds per question
    dailyDouble: true,    // hide Daily Doubles on the board
    dailyDoubleCount: 1,  // how many Daily Doubles
    finalRound: true,     // play the final round when the board is done
  },

  // Image hidden behind the board. Each answered tile reveals its part.
  puzzleImage: "images/puslespill.svg",

  // The final round. Teams see the category, place their wagers,
  // and then the question is shown. "image" is optional.
  finalRound: {
    category: "Norge",
    question: "Hvilken by var Norges hovedstad før Oslo?",
    answer: "Bergen",
    image: "images/finale.svg",
    timerSeconds: 30, // used when the timer is turned on
  },

  // Each category has a name and a list of questions.
  // "points"   = the value shown on the board
  // "question" = the text shown when the tile is opened
  // "answer"   = the answer shown when you press "Vis svar"
  // "image"    = background image while the question is open (optional)
  categories: [
    {
      name: "Geografi",
      questions: [
        { points: 100, question: "Hva er hovedstaden i Norge?", answer: "Oslo", image: "images/geografi-100.svg" },
        { points: 200, question: "Hvilken er verdens lengste elv?", answer: "Nilen", image: "images/geografi-200.svg" },
        { points: 300, question: "Hvor mange fylker har Norge (2024)?", answer: "15", image: "images/geografi-300.svg" },
        { points: 400, question: "Hvilket land har flest innbyggere?", answer: "India", image: "images/geografi-400.svg" },
        { points: 500, question: "Hva heter Norges høyeste fjell?", answer: "Galdhøpiggen", image: "images/geografi-500.svg" },
      ],
    },
    {
      name: "Programmering",
      questions: [
        { points: 100, question: "Hvilket språk kjører i nettleseren?", answer: "JavaScript", image: "images/programmering-100.svg" },
        { points: 200, question: "Hva står HTML for?", answer: "HyperText Markup Language", image: "images/programmering-200.svg" },
        { points: 300, question: "Hvilket nøkkelord lager en funksjon i Python?", answer: "def", image: "images/programmering-300.svg" },
        { points: 400, question: "Hva heter metoden alle Java-programmer starter i?", answer: "main", image: "images/programmering-400.svg" },
        { points: 500, question: "Hva er Git?", answer: "Et versjonskontrollsystem", image: "images/programmering-500.svg" },
      ],
    },
    {
      name: "Historie",
      questions: [
        { points: 100, question: "Hvilket år fikk Norge sin grunnlov?", answer: "1814", image: "images/historie-100.svg" },
        { points: 200, question: "Hvem var det første mennesket på månen?", answer: "Neil Armstrong", image: "images/historie-200.svg" },
        { points: 300, question: "Hvilket år falt Berlinmuren?", answer: "1989", image: "images/historie-300.svg" },
        { points: 400, question: "Hvem oppdaget Amerika i 1492?", answer: "Christoffer Columbus", image: "images/historie-400.svg" },
        { points: 500, question: "Hvilket år ble Norge selvstendig fra Sverige?", answer: "1905", image: "images/historie-500.svg" },
      ],
    },
    {
      name: "Sport",
      questions: [
        { points: 100, question: "Hvor mange spillere har et fotballag på banen?", answer: "11", image: "images/sport-100.svg" },
        { points: 200, question: "Hvor ble vinter-OL arrangert i 1994?", answer: "Lillehammer", image: "images/sport-200.svg" },
        { points: 300, question: "Hvilken sport spiller Magnus Carlsen?", answer: "Sjakk", image: "images/sport-300.svg" },
        { points: 400, question: "Hvor lang er et maraton?", answer: "42,195 km", image: "images/sport-400.svg" },
        { points: 500, question: "Hvilket land har vunnet flest fotball-VM?", answer: "Brasil", image: "images/sport-500.svg" },
      ],
    },
    {
      name: "Blandet",
      questions: [
        { points: 100, question: "Hvor mange dager er det i et skuddår?", answer: "366", image: "images/blandet-100.svg" },
        { points: 200, question: "Hva er H2O?", answer: "Vann", image: "images/blandet-200.svg" },
        { points: 300, question: "Hvilken planet er nærmest sola?", answer: "Merkur", image: "images/blandet-300.svg" },
        { points: 400, question: "Hvor mange bein har en edderkopp?", answer: "8", image: "images/blandet-400.svg" },
        { points: 500, question: "Hva er kvadratroten av 144?", answer: "12", image: "images/blandet-500.svg" },
      ],
    },
  ],
};
