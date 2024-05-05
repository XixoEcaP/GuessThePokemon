
let pokemonName = '';
let pokemonImage = '';
let correctAnswer = false;
let previousPokemon = '';
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let guessedPokemon = localStorage.getItem('guessedPokemon') ? JSON.parse(localStorage.getItem('guessedPokemon')) : [];
let currentGeneration = 1; // Default to Generation 1
let pokemonNumber = 0;
let digimonSwitch = false;

// Functions
async function fetchPokemon() {
    if (digimonSwitch) {
        fetchDigimon();
    } else {
        generatePokemonNumber();
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;
        const response = await fetch(apiUrl);
        const pokemonData = await response.json();
        pokemonName = pokemonData.name;
        pokemonImage = pokemonData.sprites.front_default;
        updateGrayscale();
        previousPokemon = pokemonNumber.toString();
    }
}

async function fetchDigimon() {
    console.log('Fetching new Pokémon...');
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 1471) + 1;
    } while (randomNumber.toString() === previousPokemon);

    const apiUrl = `https://digimon-api.com/api/v1/digimon/${randomNumber}`;
    const response = await fetch(apiUrl);
    const digimonData = await response.json();
    pokemonName = digimonData.name;
    pokemonImage = digimonData.images[0] ? digimonData.images[0].href : 'default_image_url';
    previousPokemon = pokemonName;
    document.getElementById('poke-image').style.filter = 'grayscale(100%) brightness(50%)';
    displayPokemon();
}

function generatePokemonNumber() {
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
    } while (pokemonNumber.toString() === previousPokemon);
}

function updateGrayscale() {
    const pokeImage = document.getElementById('poke-image');
    if (!guessedPokemon.includes(pokemonName.toString())) {
        pokeImage.style.filter = 'grayscale(100%) brightness(0%)';
    } else {
        pokeImage.style.filter = 'none';
    }
}

function checkGuess() {
    const resultMessage = document.getElementById('result');
    const pokeImage = document.getElementById('poke-image');
    const guessInput = document.getElementById('guess-input'); // Fixed: Define guessInput
    const guess = guessInput.value.toLowerCase();

    if (guessedPokemon.includes(pokemonName.toString())) {
        resultMessage.textContent = 'Pokémon already guessed!';
        return;
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
    currentGeneration = (currentGeneration % 9) + 1;
}

function switchGenerationB() {
    currentGeneration = currentGeneration === 1 ? 9 : currentGeneration - 1;
}

async function switchMode() {
    digimonSwitch = !digimonSwitch;
    getNewPokemon();
}

function displayPokemon() {
    const pokeImage = document.getElementById('poke-image');
    pokeImage.src = pokemonImage;
}

function getNewPokemon() {
    const resultMessage = document.getElementById('result');
    resultMessage.textContent = '';
    const guessInput = document.getElementById('guess-input');
    guessInput.disabled = false;
    document.getElementById('submit-button').disabled = false;
    correctAnswer = false;
    fetchPokemon()
        .then(() => {
            displayPokemon();
            guessInput.value = '';
        })
        .catch(error => {
            console.error('Error fetching new Pokémon:', error);
            resultMessage.textContent = 'Failed to fetch new Pokémon. Please try again later.';
        });
}

function updateScore() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.textContent = `Score: ${score}`;
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('score', score.toString());
    localStorage.setItem('guessedPokemon', JSON.stringify(guessedPokemon));
}

function updateGuessedPokemon(newGuessedPokemon) {
    guessedPokemon = newGuessedPokemon;
    updateLocalStorage();
}

function clearLocalStorage() {
    localStorage.removeItem('score');
    localStorage.removeItem('guessedPokemon');
}

// Event Listeners
document.getElementById('submit-button').addEventListener('click', checkGuess);
document.getElementById('newPokemon-button').addEventListener('click', getNewPokemon);
document.getElementById('gen-button2').addEventListener('click', function () {
    if (digimonSwitch === true) return;
    switchGenerationB();
    getNewPokemon();
});
document.getElementById('gen-button').addEventListener('click', function () {
    if (digimonSwitch === true) return;
    switchGeneration();
    getNewPokemon();
});
document.getElementById('dig-button').addEventListener('click', function handleButtonClick() {
    switchMode();
});
document.getElementById('guess-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        checkGuess();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (document.activeElement !== this) {
            e.preventDefault();
            getNewPokemon();
        }
    } else if (e.key === 'Escape' || e.keyCode === 27) {
        getNewPokemon();
    }
});

export { fetchPokemon, fetchDigimon, switchGeneration, switchGenerationB, switchMode, checkGuess, getNewPokemon, updateScore };

// Initial setup
fetchPokemon().then(() => {
    displayPokemon();
    updateScore();
});

export function init() {
    // Add logic to load the home page here
    console.log('Initializing home page...');
    // Example: Load HTML content, fetch data, etc.
}