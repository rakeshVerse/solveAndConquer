let selectedCategory;
let lowerLimit, upperLimit;
let correctAnswers = 0,
  totalQuestions = 0;
let currentQuestion, currentAnswer;

// validate inputs
function validateInputs(modal) {
  const inputs = modal.querySelectorAll("input");
  console.log(inputs);

  for (let i = 0; i < inputs.length; i++) {
    console.log("hi");
    const input = inputs[i];
    const value = input.value.trim();

    if (value === "" || isNaN(value)) {
      return false; // Stop checking further inputs
    }
  }

  return true; // All inputs are valid
}

// show and hide modals based on ids
function showModal(id) {
  const modal = document.getElementById(id);
  new bootstrap.Modal(modal).show();
  // focusFirstInput(modal);
}
function hideModal(id) {
  bootstrap.Modal.getInstance(document.getElementById(id)).hide();
}

function backToMainMenu(event) {
  const modal = event.target.closest(".modal"); // Find the closest modal element
  if (modal) {
    hideModal(modal.id);
    showModal("mainMenuModal");
  } else {
    alert("Error! Please REFRESH and try again.");
  }
}

// Set the category and display range modal
function selectCategory(cat) {
  selectedCategory = cat;
  hideModal("mainMenuModal");
  showModal("rangeModal");
}

function startQuiz() {
  // get the range input
  lowerLimit = parseInt(document.getElementById("lowerLimit").value);
  upperLimit = parseInt(document.getElementById("upperLimit").value);
  const modal = document.getElementById("rangeModal");

  // validate inputs
  if (validateInputs(modal)) {
    bootstrap.Modal.getInstance(modal).hide();
    nextQuestion();
  } else {
    alert("Error: All inputs must be non-empty numbers.");
  }
}

function generateQuestion() {
  let num = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
  if (selectedCategory === 1) {
    currentQuestion = `What is the square of ${num}?`;
    currentAnswer = num * num;
  } else if (selectedCategory === 2) {
    currentQuestion = `What is the cube of ${num}?`;
    currentAnswer = num * num * num;
  } else {
    let num2 = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
    currentQuestion = `What is ${num} x ${num2}?`;
    currentAnswer = num * num2;
  }
}

function nextQuestion() {
  generateQuestion();
  document.getElementById("questionText").innerText = currentQuestion;
  document.getElementById("userAnswer").value = "";
  new bootstrap.Modal(document.getElementById("questionModal")).show();
}

document.addEventListener("DOMContentLoaded", () => {
  const mainMenuModal = new bootstrap.Modal(document.getElementById("mainMenuModal"));
  mainMenuModal.show();
});

// reset input fields
document.getElementById("rangeModal").addEventListener("show.bs.modal", () => {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
});

// on enter click the first button of currently shown modal
document.addEventListener("show.bs.modal", function (event) {
  const modal = event.target; // Get the currently shown modal

  console.log(modal);
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or page refresh
      const firstButton = modal.querySelector("button");
      console.log(firstButton);
      if (firstButton) {
        console.log("first button clicked");
        firstButton.click();
      }
    }
  }

  // Prevent form submission on Enter
  const form = modal.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }

  // Add the event listener
  modal.addEventListener("keydown", handleKeyDown);

  // Remove the listener when the modal is hidden
  modal.addEventListener("hidden.bs.modal", function () {
    console.log("removing listener");
    modal.removeEventListener("keydown", handleKeyDown);
  });
});
