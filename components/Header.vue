<template>
    <nav
      class="w-full h-12 xs:h-12 sm:h-16 flex items-center justify-between relative z-30 pt-2 sm:pt-0 px-3 sm:px-6"
    >
        <a
            @click="signOut"
            class="cursor-pointer block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabindex="-1"
            >Logout</a
        >
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

  const showAuth = useState("showAuth", () => false);
  const showAccount = useState("showAccount", () => false);
  const username = useState("username");
  const loading = ref(true);
  const showMenu = ref(false);
  const cookie1 = useCookie("sb-access-token");

  const userToken = useState("userToken", () => cookie1.value);
  const cookie2 = useCookie("sb-refresh-token");

  const tokenId = useState("tokenId", () => null);
  const noLogin = useState("noLogin");



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

/*
  supabase.auth.onAuthStateChange(async (event, session) => {
    // console.log(event, session);
    if (event == "SIGNED_IN") {
      loading.value = true;
      //user.value = session.user;

      setTimeout(async () => {
        //await getUserProfile();
        // If we have a redirect, go there first before loading the profile
        if (route.query.redirect) {
          router.push({ path: route.query.redirect });
        } else {
            router.push({ path: "/" });
        }
      }, 2000);
    }
  });
  */

  // on mounted if no user, set loading to false
  onMounted(() => {
    setTimeout(() => {
      if (!user.value) {
        loading.value = false;
      }
    }, 750);
  });
  </script>

  <style lang="postcss">
  .dropdown {
    a {
      @apply cursor-pointer hover:bg-gray-200 text-sm sm:text-base;
    }
  }
  </style>
