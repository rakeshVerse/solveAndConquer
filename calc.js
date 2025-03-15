////// Modify these values to set the Steps for Tables/Multiplication ///////
let stepMin = 2;
let stepMax = 9;
///////////////////////////////////////////////////////////////////

// A class to manage a quiz session with score tracking and question history.
class QuizSession {
  constructor() {
    this.correct = 0;
    this.total = 0;
    this.history = []; // each entry: { question, userAnswer, correctAnswer, isCorrect }
  }

  recordQuestion(question, userAnswer, correctAnswer, isCorrect) {
    this.total++;
    if (isCorrect) this.correct++;
    this.history.push({ question, userAnswer, correctAnswer, isCorrect });
  }

  showSummary() {
    if (this.total === 0) return;
    alert(
      `Session Summary:\n\n` +
        `Total Questions: ${this.total}\n` +
        `Correct Answers: ${this.correct}\n` +
        `Accuracy: ${((this.correct / this.total) * 100).toFixed(2)}%`
    );
  }

  showHistory() {
    if (this.total === 0) return;

    let historyStr = "Question History:\n\n";
    this.history.forEach((entry, index) => {
      historyStr +=
        `${index + 1}. ${entry.question}\n` +
        `Your Answer: ${entry.userAnswer} | Correct Answer: ${entry.correctAnswer}  ${
          entry.isCorrect ? "✅ Correct" : "❌ Wrong"
        }\n\n`;
    });
    alert(historyStr);
  }
}

// A helper function to get number ranges from the user.
function getRange(promptText) {
  let input = prompt(promptText);
  if (!input) return null; // Handle cancel or empty input

  let [lower, upper] = input.split("-").map(Number);

  if (isNaN(lower) || isNaN(upper)) {
    alert("Invalid input! Please enter two numbers separated by a hyphen (e.g., 2-30).");
    return getRange(promptText); // Ask again
  }

  return { lower, upper };
}

// A function to generate a question based on category and user-specified ranges.
function generateQuestion(cat, ranges) {
  let question = "";
  let correctAnswer = 0;
  let correctAnswerResp = "";
  let num, a, b;

  function generateRandomNumber(min, max) {
    if (min > max) {
      [min, max] = [max, min]; // Swap values if min > max
    }

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  switch (cat) {
    case 1:
      // Squares
      num = generateRandomNumber(ranges.sqLow, ranges.sqHigh);
      question = `${num}\u00B2 = ?`;
      correctAnswer = num * num;
      correctAnswerResp = `${num}\u00B2 = ${correctAnswer}`;
      break;
    case 2:
      // Cubes
      num = generateRandomNumber(ranges.cubeLow, ranges.cubeHigh);
      question = `${num}\u00B3 = ?`;
      correctAnswer = num * num * num;
      correctAnswerResp = `${num}\u00B3 = ${correctAnswer}`;
      break;
    case 3:
      // Tables
      a = generateRandomNumber(ranges.factLow, ranges.factHigh);

      ///// e.g. Random number between 1 and 10 (inclusive) /////
      b = generateRandomNumber(stepMin, stepMax);

      question = `${a} x ${b} = ?`;
      correctAnswer = a * b;
      correctAnswerResp = `${a} x ${b} = ${correctAnswer}`;
      break;

    default:
      break;
  }

  return { question, correctAnswer, correctAnswerResp };
}

// Question -> Answer → See feedback + Next question → Answer again
function askOneQuestion(cat, ranges, quizSession, feedback = "") {
  let { question, correctAnswer, correctAnswerResp } = generateQuestion(cat, ranges);

  // Show feedback along with the next question
  let userInput = feedback === "" ? prompt(question) : prompt(`${feedback}\n\n${question}`);

  if (userInput === null || userInput.trim() === "" || isNaN(userInput) || userInput.toLowerCase() === "back")
    return "back"; // treat cancel as 'back'

  let userAnswer = parseInt(userInput);
  let isCorrect = userAnswer === correctAnswer;
  quizSession.recordQuestion(question, userAnswer, correctAnswer, isCorrect);

  // Prepare feedback for the next question
  return isCorrect ? "✅ Correct!" : `❌ Wrong! Correct answer: ${correctAnswerResp}`;
}

// For category 4 (Mix), it randomly selects a subcategory (1-3) each time.
function categoryLoop(category, ranges) {
  const quizSession = new QuizSession();
  let feedback = ""; // Hold feedback for the next prompt
  let currentCategory = category;

  while (true) {
    // Randomize category if it's "Mix"
    if (category === 4) {
      currentCategory = Math.floor(Math.random() * 3) + 1;
    }

    // Ask a question and include previous feedback
    let result = askOneQuestion(currentCategory, ranges, quizSession, feedback);
    if (result === "back") break;
    feedback = result; // Update feedback for the next question
  }

  // At the end of the session, show score and optionally question history.
  quizSession.showSummary();
  quizSession.showHistory();
}

// Main menu to select category and input range limits.
function mainMenu() {
  function catSquare(ranges) {
    let range = getRange("Enter the range of numbers for practicing Squares (e.g., 2-30 for 2² to 30²):");
    if (range !== null) {
      ranges.sqLow = range.lower;
      ranges.sqHigh = range.upper;
    } else return null;
  }

  function catCube(ranges) {
    let range = getRange("Enter the range of numbers for practicing Cubes (e.g., 2-20 for 2³ to 20³):");
    if (range !== null) {
      ranges.cubeLow = range.lower;
      ranges.cubeHigh = range.upper;
    } else return null;
  }

  function catMultiply(ranges) {
    let range = getRange("Enter the range of numbers for practicing Tables (e.g., 3-18 for tables of 3 to 18):");
    if (range !== null) {
      ranges.factLow = range.lower;
      ranges.factHigh = range.upper;
    } else return null;
  }

  while (true) {
    let menu = "Choose a category to practice:\n";
    menu += "1. Squares\n";
    menu += "2. Cubes\n";
    menu += "3. Tables\n";
    menu += "4. Mix\n\n";
    let choice = prompt(menu + "Enter your choice: ");
    if (choice === null) break;
    choice = parseInt(choice);
    if (isNaN(choice) || choice < 1 || choice > 4) {
      alert("Invalid choice! Please enter a number between 1 and 4.");
      continue;
    }

    let ranges = {};
    let res = "hi";

    switch (choice) {
      case 1:
        res = catSquare(ranges);
        break;
      case 2:
        res = catCube(ranges);
        break;
      case 3:
        res = catMultiply(ranges);
        break;
      case 4:
        res = catSquare(ranges);
        if (res === null) continue;
        res = catCube(ranges);
        if (res === null) continue;
        res = catMultiply(ranges);
        break;
      default:
        break;
    }

    if (res === null) continue;
    categoryLoop(choice, ranges);
  }
}

// Start the quiz program.
mainMenu();
