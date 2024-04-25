




// Get the route name from the URL


///////////////

let pokemonName = '';
let pokemonImage = '';
let correctAnswer = false;

let previousPokemon = ''; 
//let score =  0;
//let guessedPokemon =  [];
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let guessedPokemon = localStorage.getItem('guessedPokemon') ? JSON.parse(localStorage.getItem('guessedPokemon')) : [];

let currentGeneration = 1; // Default to Generation 1
let pokemonNumber = 0;
let digimonSwitch = false

async function fetchPokemon() {
if(digimonSwitch){

    fetchDigimon()
   
}
    else{
    do {
        switch (currentGeneration) {
            case 1:
                pokemonNumber = Math.floor(Math.random() * 151) + 1; // Generation 1: Pokémon ID between 1 and 151
                break;
            case 2:
                pokemonNumber = Math.floor(Math.random() * 100) + 152; // Generation 2: Pokémon ID between 152 and 251
                break;
            case 3:
                pokemonNumber = Math.floor(Math.random() * 135) + 252; // Generation 3: Pokémon ID between 252 and 386
                break;
            case 4:
                pokemonNumber = Math.floor(Math.random() * 107) + 387; // Generation 4: Pokémon ID between 387 and 493
                break;
            case 5:
                pokemonNumber = Math.floor(Math.random() * 156) + 494; // Generation 5: Pokémon ID between 494 and 649
                break;
            case 6:
                pokemonNumber = Math.floor(Math.random() * 72) + 650; // Generation 6: Pokémon ID between 650 and 721
                break;
            case 7:
                pokemonNumber = Math.floor(Math.random() * 88) + 722; // Generation 7: Pokémon ID between 722 and 809
                break;
            case 8:
                pokemonNumber = Math.floor(Math.random() * 89) + 810; // Generation 8: Pokémon ID between 810 and 898
                break;
            case 9:
                pokemonNumber = Math.floor(Math.random() * 82) + 899; // Generation 9: Pokémon ID between 899 and 981
                break;
            default:
                pokemonNumber = Math.floor(Math.random() * 151) + 1; // Default to Generation 1 if currentGeneration is invalid
        }
    } while ( pokemonNumber.toString() === previousPokemon); // Check if the Pokémon has been guessed correctly or is the same as the previous one

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;
    const response = await fetch(apiUrl);
    const pokemonData = await response.json();

    pokemonName = pokemonData.name;
    pokemonImage = pokemonData.sprites.front_default;
    if (!guessedPokemon.includes(pokemonName.toString())) {
        document.getElementById('poke-image').style.filter = 'grayscale(100%) brightness(0%)';
    }else {
        document.getElementById('poke-image').style.filter = 'none';
    }
    previousPokemon = pokemonNumber.toString(); // Store the current Pokémon number as the previous one
    const guessInput = document.getElementById('guess-input');
  

}
}
const guessInput = document.getElementById('guess-input');
guessInput.addEventListener('input', function() {
    const userInput = guessInput.value.toLowerCase(); // Get the user's input and convert it to lowercase for case-insensitive matching

    // Filter the list of Pokémon or Digimon names based on the user's input


 
});

async function fetchDigimon() {
    console.log('Fetching new Pokémon...');
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 1471) + 1; // Generate a random Digimon ID between 1 and 3
    } while (randomNumber.toString() === previousPokemon); // Ensure the new Digimon is different from the previous one

    const apiUrl = `https://digimon-api.com/api/v1/digimon/${randomNumber}`;
    const response = await fetch(apiUrl);
    const digimonData = await response.json();

    console.log('Digimon data:', digimonData);

    pokemonName = digimonData.name;
    console.log('Fetched Pokémon name:', pokemonName); // Log the fetched Pokémon name

    pokemonImage = digimonData.images[0] ? digimonData.images[0].href : 'default_image_url';

    previousPokemon = pokemonName; 
    document.getElementById('poke-image').style.filter = 'grayscale(100%) brightness(50%)';
    displayPokemon();
}

function checkGuess() {

  console.log('Fetched Pokémon name:', pokemonName);
    const resultMessage = document.getElementById('result');
    const pokeImage = document.getElementById('poke-image');
    const guess = guessInput.value.toLowerCase(); // Retrieve the user's guess

    if (guessedPokemon.includes(pokemonName.toString())) {
        resultMessage.textContent = 'Pokémon already guessed!';
        return; // If the answer is already guessed, do nothing
    }
    if (guess === pokemonName.toLowerCase()) {
        guessedPokemon.push(pokemonName.toString());
        resultMessage.textContent = 'Correct! You guessed the Pokémon!';
        correctAnswer = true;
        score++;
        updateScore();

        pokeImage.style.filter = 'none';
     
    } else {
        resultMessage.textContent = 'Incorrect. Try again!';
    }

    guessInput.disabled = false;
    document.getElementById('submit-button').disabled = false;
}

function switchGeneration() {
    currentGeneration = (currentGeneration % 9) + 1; // Switch between generations 1, 2, and 3
}
function switchGenerationB() {
    currentGeneration = currentGeneration === 1 ? 9 : currentGeneration - 1; // Switch between generations 1, 2, and 3
}

async function switchMode() {
    digimonSwitch = !digimonSwitch;
    getNewPokemon();
}
const button = document.getElementById('dig-button');
button.addEventListener('click', function handleButtonClick() {
    switchMode();
});

document.getElementById('gen-button2').addEventListener('click', function () {
    if(digimonSwitch===true){return}
    switchGenerationB(); // Call the function to switch to the next generation
    getNewPokemon(); // Fetch and display a new Pokémon from the new generation
});


document.getElementById('gen-button').addEventListener('click', function () {
    if(digimonSwitch===true){return}
    switchGeneration(); // Call the function to switch to the next generation
    getNewPokemon(); // Fetch and display a new Pokémon from the new generation
});

function displayPokemon() {
    const pokeImage = document.getElementById('poke-image');
    pokeImage.src = pokemonImage;
}




async function getNewPokemon() {
    const resultMessage = document.getElementById('result');
    resultMessage.textContent = '';

  


    const guessInput = document.getElementById('guess-input');
    guessInput.disabled = false;
    document.getElementById('submit-button').disabled = false;

    correctAnswer = false; // Reset correctAnswer flag

    // Fetch new Pokémon data
    fetchPokemon()
        .then(() => {
            // Display new Pokémon data
            displayPokemon();
            // Clear input field
            guessInput.value = '';
        })
        .catch(error => {
            console.error('Error fetching new Pokémon:', error);
            // Handle error (e.g., display an error message)
            resultMessage.textContent = 'Failed to fetch new Pokémon. Please try again later.';
        });
}
document.getElementById('submit-button').addEventListener('click', checkGuess);
document.getElementById('newPokemon-button').addEventListener('click', getNewPokemon); 


function updateScore() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.textContent = `Score: ${score}`;
    updateLocalStorage(); // Call updateLocalStorage() whenever the score changes
}


document.getElementById('guess-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        checkGuess();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (document.activeElement !== this) {
            e.preventDefault();
            getNewPokemon();
        }
    } else if (e.key === 'Escape' || e.keyCode === 27) { // Check if the pressed key is the Escape key
        getNewPokemon(); // Call the function to get a new Pokémon
    }
});



function updateScores(newScore) {
    score = newScore;
    updateLocalStorage();
  }
  
  // Initial setup - get the first Pokémon and display score

  
  // Remove this function as it's not needed
  function updateLocalStorage() {
   localStorage.setItem('score', score.toString());
     localStorage.setItem('guessedPokemon', JSON.stringify(guessedPokemon));
 }
  
  // Function to update the guessedPokemon array
  function updateGuessedPokemon(newGuessedPokemon) {
    guessedPokemon = newGuessedPokemon;
    updateLocalStorage();
  }
  
  // Function to clear the stored score and guessedPokemon array
  function clearLocalStorage() {
    localStorage.removeItem('score');
    localStorage.removeItem('guessedPokemon');
  }
  fetchPokemon().then(() => {
    displayPokemon();
   
    updateScore();
});


export { fetchPokemon, fetchDigimon, switchGeneration, switchGenerationB, switchMode, checkGuess, getNewPokemon, updateScore };


window.addEventListener("load", () => {
    const currentRoute = getRouteNameFromUrl();
    if (currentRoute === "pokemon-game") {
      getNewPokemon();
    }
  });
