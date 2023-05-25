let newGameButton = document.querySelector(".newGame");
newGameButton.addEventListener("click", launchNewGame);

let infoButton = document.querySelector(".info");
infoButton.addEventListener("click", information);
let informationPanel = document.getElementById("rules");
informationPanel.style.display = "none";

let gameScreen = document.querySelector(".gameScreen");

const colors = ["yellow", "blue", "red", "green", "white", "black"];
let combinationToGuess = [null, null, null, null];
let userCombination = [null, null, null, null];
let turnNumber;
let pegHole;
let placedGuess = false;
let simpleGuess = false;

function information() {
  if (informationPanel.style.display === "none") {
    informationPanel.style.display = "block";
  } else {
    informationPanel.style.display = "none";
  }
}

function alertModal(alert) {
    let modalBg = document.createElement("div");
    modalBg.setAttribute("class", "modalBg");
    modalBg.setAttribute("id", "alertModalBg");
    document.body.main.appendChild(showModal);

    let modal = document.createElement("div");
    modal.setAttribute("class", "modal");
    modal.setAttribute("id", "alertModal");
    modalBg.appendChild(modal);

    let modalText = document.createElement("p");
    modalText.setAttribute("class", "modalText");
    modalText.innerText = alert;
    modal.appendChild(modalText);

    let modalButton = document.createElement("button");
    modalButton.setAttribute("class", "modalButton");
    modalButton.innerText = "Got it!";
    modalButton.addEventListener("click", removeModal);
    modal.appendChild(modalButton);

    function removeModal() {
      modalBg.remove();
    }
}

//this function reboots the game screen, and gives a new random combination to guess.
function launchNewGame() {
  while (gameScreen.firstChild) {
    gameScreen.removeChild(gameScreen.firstChild);
  }
  infoPanelCreated = false;
  turnNumber = 0;
  combinationToGuess = [];
  random4Combination();
  createGuessingLine();
}

// this function gives a random integer between min and max for the random4Combination() function. and the randomPegPlacing() function.
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this function gives a random color (from the "colors" array) for each of the 4 index of the combinationToGuess array.
function random4Combination() {
  for (let i = 0; i < 4; i++) {
    let randomNumber = random(0, colors.length - 1);
    let randomColor = colors[randomNumber];
    combinationToGuess[i] = randomColor;
  }
}

// this function creates a new line in which the user can propose their guess.
function createGuessingLine() {
  turnNumber++;

  while (userCombination.length > 0) {
    userCombination.pop();
  }

  let newLine = document.createElement("div");
  newLine.setAttribute("class", "guessingLine");
  newLine.setAttribute("id", "line" + turnNumber);
  gameScreen.appendChild(newLine);

  let submitButton = document.createElement("button");
  submitButton.setAttribute("class", "submitButton");
  submitButton.setAttribute("id", "submitButton" + turnNumber);
  submitButton.textContent = "OK";
  newLine.appendChild(submitButton);
  submitButton.addEventListener("click", submitGuess);
  function submitGuess() {
    if (
      userCombination.includes(null) ||
      userCombination.length !== combinationToGuess.length ||
      userCombination.includes(undefined)
    ) {
      confirm(
        "You must enter a combination of " +
          combinationToGuess.length +
          " pegs."
      );
    } else {
      submitButton.removeEventListener("click", submitGuess);
      let guessingButtonToDeactivate;
      for (let k = 1; k <= 4; k++) {
        guessingButtonToDeactivate = document.getElementById(
          turnNumber + "guessingButton" + k
        );
        guessingButtonToDeactivate.setAttribute("class", "guessingButton");
      }
      submitButton.textContent = "Tour " + Number(turnNumber);
      checkGuess();
    }
  }

  for (let i = 1; i <= 4; i++) {
    let newGuessingButton = document.createElement("div");
    newGuessingButton.setAttribute("class", "guessingButton active");
    newGuessingButton.setAttribute("id", turnNumber + "guessingButton" + i);
    newLine.appendChild(newGuessingButton);
    newGuessingButton.addEventListener("click", changeColor);
    let j = -1;
    let guessedColor;

    function changeColor() {
      j++;
      if (j === colors.length) {
        j = 0;
      }
      if (newGuessingButton.getAttribute("class") === "guessingButton active") {
        guessedColor = colors[j];
        newGuessingButton.style.backgroundColor = guessedColor;
        userCombination[i - 1] = guessedColor;
      }
    }
  }

  // This function creates a new square in which hints will be given after the users's guess.
  function createHintSquare() {
    let newHintSquare = document.createElement("div");
    newHintSquare.setAttribute("class", "hintSquare");
    newHintSquare.setAttribute("id", turnNumber + "hintSquare");
    newLine.appendChild(newHintSquare);
    for (let i = 1; i <= 4; i++) {
      let newHintButton = document.createElement("div");
      newHintButton.setAttribute("class", "hintButton");
      newHintButton.setAttribute("id", turnNumber + "hintButton" + i);
      newHintSquare.appendChild(newHintButton);
    }
  }
  createHintSquare();
}

// This function, used in the function checkGuess() gives a color to a random hintButton of the hintSquare.
function randomPegPlacing() {
  function selectPegHole() {
    pegHoleName = turnNumber + "hintButton" + random(1, 4);
    pegHole = document.getElementById(pegHoleName);
  }

  let pegHoleName = turnNumber + "hintButton" + random(1, 4);
  pegHole = document.getElementById(pegHoleName);
  do {
    selectPegHole();
  } while (pegHole.classList.contains("colored") === true);

  if (placedGuess === true) {
    pegHole.style.backgroundColor = "red";
    placedGuess = false;
    pegHole.classList.add("colored");
  } else if (simpleGuess === true) {
    pegHole.style.backgroundColor = "white";
    simpleGuess = false;
    pegHole.classList.add("colored");
  }
}

// This function checks the userCombination and places randomly white pegs for a good color guess and red pegs for a good place guess in the hintSquare.
// It also ends the game and launches a new game if the userCombination is the exact same as the combinationToGuess.
function checkGuess() {
  let score = 0;
  let cloneCombinationToGuess = combinationToGuess.slice();
  for (let k = 0; k < userCombination.length; k++) {
    for (let l = 0; l < combinationToGuess.length; l++) {
      simpleGuess = false;
      placedGuess = false;
      if (
        combinationToGuess[l] === userCombination[k] &&
        k === l &&
        cloneCombinationToGuess[l] !== "else"
      ) {
        placedGuess = true;
        score++;
        userCombination[k] = "else";
        cloneCombinationToGuess[l] = "else";
      }
      if (placedGuess === true) {
        randomPegPlacing();
      }
    }
  }

  for (let k = 0; k < userCombination.length; k++) {
    for (let l = 0; l < combinationToGuess.length; l++) {
      simpleGuess = false;
      placedGuess = false;
      if (
        combinationToGuess[l] === userCombination[k] &&
        cloneCombinationToGuess[l] !== "else"
      ) {
        simpleGuess = true;
        cloneCombinationToGuess[l] = "else";
        userCombination[k] = "else";
      }
      if (simpleGuess === true) {
        randomPegPlacing();
      }
    }
  }

  // This function checks the conditions for the end of the game and creates a new guessing line if necessary.
  // If the score = 4 => the game is won. If not and it's the 10th turn => the game is lost.
  function scoreCheck() {
    if (score === 4) {
      confirm("You win!!!");
      launchNewGame();
    } else {
      if (turnNumber === 10) {
        confirm("You lose.");
        launchNewGame();
      } else {
        createGuessingLine();
      }
    }
  }
  scoreCheck();
}
