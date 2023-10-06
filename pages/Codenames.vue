<template>
  <div
    class="flex flex-col items-center justify-center w-full pt-5 space-y-10 h-screen"
  >
    <div class="words grid grid-cols-4 gap-2">
      <div
        v-for="displayedWord in displayedWords"
        class="border border-gray-500 rounded-xl h-32 w-32 flex items-center justify-center hover:bg-indigo-200 cursor-pointer"
        :class="[getWordClass(displayedWord)]"
        @click="handleClick(displayedWord)"
      >
        {{ displayedWord.word }}
      </div>
    </div>
    <button @click="updateBoard">Update Board</button>
    <pre>{{ selectedWords }}</pre>
  </div>
</template>

<script setup>
import seedrandom from "seedrandom";
import { ref } from 'vue';

const displayedWords = ref([]);
let shuffledNouns = [];
const selectedWords = useState("selectedWords");
// Create an array of 100 single word nouns

const nouns = [
  "time",
  "year",
  "wheel",
  "football",
  "map",
  "music",
  "money",
  "method",
  "data",
  "food",
  "love",
  "person",
  "book",
  "language",
  "software",
  "problem",
  "system",
  "number",
  "business",
  "issue",
  "side",
  "kind",
];
const shuffleNouns = () => {
  shuffledNouns = [...nouns]; // Create a shallow copy to avoid modifying the original array
  for (let i = shuffledNouns.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffledNouns[i], shuffledNouns[randomIndex]] = [shuffledNouns[randomIndex], shuffledNouns[i]];
  }
  console.log("shuffled nouns: " + shuffledNouns)
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
  console.log('displayed words array:', displayedWords.value[0].word);
};

const seed = 'mySeed';

// Create a seeded random number generator
const rng = seedrandom(seed);

// Initialize counters for "good" and "bad" designations
let goodCount = 0;
let badCount = 0;

const generateKeys = () => {
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
    console.log('good word toggled: ' + displayedWord.toggled);
    return displayedWord.toggled ? 'bg-green-500' : 'bg-white';
  } else if (displayedWord.attribute === 'bad') {
    console.log('bad word toggled: ' + displayedWord.toggled);
    return displayedWord.toggled ? 'bg-red-500' : 'bg-white';
  }
};

const handleClick = (displayedWord) => {
  toggleColor(displayedWord);
  //selectedWords.value.push(displayedWord.word);
};

//for each word in displayedWords, if toggled is true, replace the word property with the next word in shuffledNouns
const updateBoard = () => {
  for (let i = 0; i < displayedWords.value.length; i++) {
    if (displayedWords.value[i].toggled === true) {
      displayedWords.value[i].word = shuffledNouns[0];
      displayedWords.value[i].toggled = false;
      shuffledNouns.shift();
    }
  }
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
  background-color: rgb(115, 250, 115);
}

.bg-red-500 {
  background-color: rgb(250, 115, 115);
}

</style>
