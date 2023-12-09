<template>
    <a @click.prevent="signOut">Sign Out</a>
    <a
        v-if="user && username"
        @click.prevent="showAccount = true"
    >
        {{ username }}
    </a>
    <Auth v-if="!user" />
    <Account v-else-if="showAccount"/>
  </template>

  <script setup>
  //<Auth v-if="!noLogin && !user && (!loading || showAuth) && !tokenId" />
  //<Account v-else-if="!noLogin && (showAccount || (!loading && user && !username))"/>
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

  const logIn = () => {
    showAuth.value = true;
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
      //router.push({ path: "/login" })
      noLogin.value = true;
      showAuth.value = true;
      tokenId.value = null;

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
