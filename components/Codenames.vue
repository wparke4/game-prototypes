<template>
  <div
    class="flex flex-col w-full justify-center items-center pt-5 space-y-3 h-screen"
  >
    <TeamScore @updateActiveTeam="updateActiveTeam"/>
    <div>
      <input
          class="h-16 w-96 border border-gray-300 rounded-md text-center text-3xl"
      />
    </div>
    <div>
        <div class="words grid grid-cols-4 gap-2">
            <div
              v-for="displayedWord in displayedWords"
              class="border border-gray-500 rounded-xl h-32 w-32 flex items-center justify-center hover:bg-indigo-200 cursor-pointer text-xl"
              :class="[getWordClass(displayedWord)]"
              @click="handleClick(displayedWord)"
            >
              {{ displayedWord.word }}
            </div>
        </div>



    </div>
    <pre>{{ selectedWords }}</pre>
    <div
        class="flex flex-row justify-between w-full space-x-10"
    >
        <IntegerInput @submit="updateSeed" />
        <button
            @click="updateBoard"
            class="border border-gray-500 rounded-md h-16 w-32 hover:bg-indigo-200 cursor-pointer"
        >
            Update Board
        </button>
        <button
            class="border border-gray-500 rounded-md h-16 w-32 hover:bg-indigo-200 cursor-pointer"
            @click="displayKey"
        >
            {{ displayButtonText }}
        </button>
        <button
            class="border border-gray-500 rounded-md h-16 w-32 hover:bg-indigo-200 cursor-pointer"
            @click="deactivateWords"
        >
            Deactivate Words
        </button>
    </div>
  </div>
</template>

<script setup>
import IntegerInput from "@/components/IntegerInput.vue";
import TeamScore from "@/components/TeamScore.vue";
import seedrandom from "seedrandom";
import { ref } from 'vue';
import { nouns } from "@/assets/nouns.js";

const displayedWords = ref([]);
let shuffledNouns = [];
const selectedWords = useState("selectedWords");

let activeTeam = "A";
function updateActiveTeam(team) {
  activeTeam = team;
  invertKeys();
}

const deactivateWords = () => {
  for (let i = 0; i < displayedWords.value.length; i++) {
    if (displayedWords.value[i].toggled) {
      displayedWords.value[i].attribute = 'inactive'
    }
  }
}

// Function to invert key so all words with attribute of good become bad and vice versa
const invertKeys = () => {
  for (let i = 0; i < displayedWords.value.length; i++) {
    if (displayedWords.value[i].attribute === "good") {
      displayedWords.value[i].attribute = "bad";
    } else if (displayedWords.value[i].attribute === "bad") {
      displayedWords.value[i].attribute = "good";
    }
  }
}

const shuffleNouns = () => {
  shuffledNouns = [...nouns]; // Create a shallow copy to avoid modifying the original array
  for (let i = shuffledNouns.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledNouns[i], shuffledNouns[randomIndex]] = [shuffledNouns[randomIndex], shuffledNouns[i]];
  }
  return shuffledNouns;
};

for (let i = 0; i < 16; i++) {
  displayedWords.value.push({ word: '', attribute: '', toggled: false, index: ''}); // Push an object with empty properties
}


//select first 16 words from nouns array and assign to words
const chooseWords = () => {
  for (let i = 0; i < 16; i++) {
    displayedWords.value[i].word = shuffledNouns[0];
    displayedWords.value[i].index = i;
    shuffledNouns.shift();
  }
};

let seed = 2;


const generateKeys = () => {
    // Create a seeded random number generator
  const rng = seedrandom(seed);

  let goodCount = 0;
  let badCount = 0;

  // Assign designations randomly but consistently based on the seed
  for (let i = 0; i < displayedWords.value.length; i++) {
    const randomNumber = rng();
    const word = displayedWords.value[i];

    // Check if there are already 8 "good" or 8 "bad" designations
    if (goodCount === 8) {
      word.attribute = "bad";
      badCount++;
    } else if (badCount === 8) {
      word.attribute = 'good';
      goodCount++;
    } else {
      // Assign as "good" if randomNumber is less than 0.5, otherwise "bad"
      if (randomNumber < 0.5) {
        word.attribute = 'good';
        goodCount++;
      } else {
        word.attribute = 'bad';
        badCount++;
      }
    }
  }
};

// Function to toggle the color based on the attribute
const toggleColor = (word) => {
    word.toggled = !word.toggled;
};

// Function to get the class based on displayedWord
const getWordClass = (displayedWord) => {
  if (displayedWord.attribute === 'good') {
    return displayedWord.toggled ? 'bg-green-500' : 'bg-white';
  } else if (displayedWord.attribute === 'bad') {
    return displayedWord.toggled ? 'bg-red-500' : 'bg-white';
  } else if (displayedWord.attribute === 'inactive') {
    return 'bg-gray-500';
  }
};

const handleClick = (displayedWord) => {
  toggleColor(displayedWord);
};

//for each word in displayedWords, if toggled is true, replace the word property with the next word in shuffledNouns
const updateBoard = () => {
  generateKeys()
  for (let i = 0; i < displayedWords.value.length; i++) {
    if (displayedWords.value[i].toggled === true) {
      displayedWords.value[i].word = shuffledNouns[0];
      displayedWords.value[i].toggled = false;
      shuffledNouns.shift();
    }
  }
};

let wordsDisplayed = false;
let displayButtonText = "Display Key";

const displayKey = () => {
  //for each function that sets toggled attribute of all displayed words to true
  if (!wordsDisplayed) {
    displayedWords.value.forEach((word) => {
      word.toggled = true;
    });
    wordsDisplayed = true;
    displayButtonText = "Hide Key";
  } else {
    displayedWords.value.forEach((word) => {
      word.toggled = false;
    });
    wordsDisplayed = false;
    displayButtonText = "Display Key";
  }
}

const updateSeed = (integer) => {
  seed = integer;
  generateKeys();
};


onMounted(() => {
  shuffleNouns();
  chooseWords();
  generateKeys();

  // Force a reactivity trigger
  displayedWords.value = [...displayedWords.value];
});

</script>
<style lang="postcss" scoped>
.bg-green-500 {
  background-color: rgb(185, 252, 185);
}

.bg-red-500 {
  background-color: rgb(252, 185, 185);
}

.bg-gray-500 {
  background-color: rgb(215, 215, 215);
}

</style>
