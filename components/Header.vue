<template>
  <nav
    class="w-full h-12 xs:h-12 sm:h-16 flex items-center justify-between relative z-30 pt-2 sm:pt-0 px-3 sm:px-6"
  >
    <a href="https://internet.game" target="_blank" class="sm:w-60">
      <img class="h-5 xs:h-6 sm:h-7" src="/images/logo-ig.svg" />
    </a>
    <div
      v-if="tournament"
      class="hidden md:flex items-center justify-center space-x-2 text-base2 lg:text-lg"
    >
      <div
        class="border-b border-base-content border-opacity-50 hover:border-opacity-100 leading-tight"
        :class="{
          'text-lg uppercase font-bold border-none tracking-lg':
            !route.params.roundNumber,
        }"
      >
        <NuxtLink :to="'/t/' + tournament.id">{{ tournament.title }}</NuxtLink>
      </div>
      <div v-if="route.params.roundNumber" class="text-success">/</div>
      <div v-if="route.params.roundNumber">
        Game {{ route.params.roundNumber }}
      </div>
      <div v-if="route.params.roundNumber" class="text-success">/</div>
      <div v-if="route.params.roundNumber">{{ round.name }}</div>
    </div>
    <div class="flex items-center justify-end space-x-7 sm:w-60">
      <select
        v-if="false"
        class="select select-sm select-bordered max-w-xs"
        v-model="colorMode.preference"
      >
        <option disabled selected>Theme</option>
        <option v-for="theme of themes" :key="theme">{{ theme }}</option>
      </select>
      <a v-if="tokenId" class="font-medium">#{{ tokenId }}</a>
      <a
        v-else-if="!user && !noLogin"
        @click="showAuth = true"
        class="cursor-pointer font-medium"
        >Login</a
      >
      <div v-else class="profile relative">
        <div
          class="cursor-pointer flex items-center space-x-2 sm:space-x-3"
          @click="showMenu = true"
        >
          <div
            v-if="avatar"
            class="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-gray-400 overflow-hidden"
          >
            <img :src="avatar" class="" />
          </div>
          <div class="text-sm sm:text-base font-medium">{{ username }}</div>
        </div>
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showMenu"
            v-on-click-outside="hideMenu"
            class="dropdown absolute right-0 z-10 mt-2 w-32 sm:w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabindex="-1"
          >
            <a
              @click="showAccountModal"
              class="block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabindex="-1"
            >
              Edit Profile
            </a>
            <a
              @click="signOut"
              class="cursor-pointer block px-4 py-2 text-sm text-gray-700"
              role="menuitem"
              tabindex="-1"
              >Logout</a
            >
          </div>
        </transition>
      </div>
    </div>
  </nav>
  <Auth v-if="!noLogin && !user && (!loading || showAuth) && !tokenId" />
  <Account
    v-else-if="!noLogin && (showAccount || (!loading && user && !username))"
  />
</template>

<script setup>
import { vOnClickOutside } from "@vueuse/components";
const supabase = useSupabaseClient();
let user = useSupabaseUser();
//const user = useState("user", () => null);
const route = useRoute();
const router = useRouter();

const tournament = useState("tournament");
const round = useState("round");
const showAuth = useState("showAuth", () => false);
const showAccount = useState("showAccount", () => false);
const username = useState("username");
const avatar = useState("avatar");
const avatarPath = useState("avatarPath");
const loading = ref(true);
const showMenu = ref(false);
const cookie1 = useCookie("sb-access-token");

const userToken = useState("userToken", () => cookie1.value);
const cookie2 = useCookie("sb-refresh-token");

const tokenId = useState("tokenId", () => null);
const noLogin = useState("noLogin");

const getUserProfile = async () => {
  //console.log("getUserProfile()");
  loading.value = true;
  //user = useSupabaseUser();
  let { data } = await supabase
    .from("profiles")
    .select(`username, avatar_url`)
    .eq("id", user.value.id)
    .single();
  if (data) {
    username.value = data.username;
    avatarPath.value = data.avatar_url;
    downloadAvatar();
  }
  loading.value = false;
};

const downloadAvatar = async () => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(avatarPath.value);
    if (error) throw error;
    avatar.value = URL.createObjectURL(data);
  } catch (error) {
    console.error("Error downloading image: ", error.message);
  }
};

const signOut = async () => {
  try {
    loading.value = true;
    let { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
  } catch (error) {
    alert(error.message);
  } finally {
    cookie1.value = null;
    cookie2.value = null;
    loading.value = false;
  }
};

const hideMenu = () => {
  showMenu.value = false;
};

const showAccountModal = () => {
  showAccount.value = true;
  showMenu.value = false;
};

supabase.auth.onAuthStateChange(async (event, session) => {
  // console.log(event, session);
  if (event == "SIGNED_IN") {
    loading.value = true;
    //user.value = session.user;

    setTimeout(async () => {
      await getUserProfile();
      // If we have a redirect, go there first before loading the profile
      if (route.query.redirect) {
        router.push({ path: route.query.redirect });
      }
    }, 500);
  }
});

// on mounted if no user, set loading to false
onMounted(() => {
  setTimeout(() => {
    if (!user.value) {
      loading.value = false;
    }
  }, 750);
});

const colorMode = useColorMode();
const themes = [
  "mytheme",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];
</script>

<style lang="postcss">
.dropdown {
  a {
    @apply cursor-pointer hover:bg-gray-200 text-sm sm:text-base;
  }
}
</style>
