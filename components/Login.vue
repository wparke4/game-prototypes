<template>
    <div
        v-if="loggedIn"
        class="flex flex-col w-full items-center justify-center gap-9 h-screen space-y-"
    >
        <div v-if="promptUserToCreateProfile">
            Create your username motherfucker
        </div>
        <div v-else >
            welcome {{ username }}
        </div>
    </div>
    <div
        v-else
        class="flex flex-col w-full items-center justify-center gap-9 h-screen space-y-"
    >
        <div>
            <div
                class="text-3xl text-center text-black pb-7"
            >
                {{ emailSent ? "Check email for code" : "Login" }}
            </div>
            <div>
                <p v-if="emailSent" class="text-sm pb-7 text-gray-600">
                    Code sent to {{  email }}.
                    <a @click="emailSent = false" class="underline">Wrong one?</a>
                </p>
            </div>
            <input
                v-if="!emailSent"
                ref="input"
                class="input input-lg w-full text-left text-black border-warmgray-400"
                type="email"
                placeholder="Your email"
                v-model="email"
                @keyup.enter="handleLogin()"
                @input="emailSent = false"
                :disabled="loading"
            />
            <input
              v-else
              ref="input"
              class="input input-lg w-full text-center text-black"
              type="text"
              placeholder="Login Code"
              v-model="otpCode"
              :disabled="loading"
              @keyup.enter="verifyOtp()"
            />
        </div>
        <div>
            <button
                v-if="!emailSent"
                @click="handleLogin()"
                type="submit"
                class="btn btn-lg btn-success btn-outline w-full"
                :disabled="loading"
            >
                {{ buttonText }}
            </button>
            <button
                v-else
                @click="verifyOtp()"
                type="submit"
                class="btn btn-lg btn-success w-full"
                :disabled="loading"
            >
                {{ buttonText }}
            </button>
        </div>
    </div>
  </template>

  <script setup>
  const supabase = useSupabaseClient();
  let user = useSupabaseUser();

  const showAuth = useState("showAuth", () => false);
  const loading = ref(false);
  const emailSent = ref(false);
  const email = ref("");
  const otpCode = ref("");
  const tempUsername = ref("");
  const username = useState("username");
  const promptUserToCreateProfile = ref(false)
  const loggedIn = ref(false)

  // Focus the input element on load
  const input = ref();
  const { focused } = useFocus(input, { initialValue: true });

  const handleLogin = async () => {
    try {
      loading.value = true;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.value,
      });
      if (error) throw error;
      emailSent.value = true;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      loading.value = false;
    }
  };

  const verifyOtp = async (event) => {
    try {
      loading.value = true;

      const { data, error } = await supabase.auth.verifyOtp({
        type: "email",
        email: email.value,
        token: otpCode.value,
      });

      if (error) throw error;
      // TODO: Login
      console.log("Logged in successfully", data);
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      showAuth.value = false;
      loading.value = false;
      checkForProfile()
    }
  };

  const checkForProfile = async () => {
    //check if user has a row in the profile table
    let { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

    /*
    if (fetchError) {
        console.log(fetchError)
        return
    }
    */
    console.log("data is ", data)
    if(!data) {
        console.log("no profile found")
        //create a profile for the user
        promptUserToCreateProfile.value = true
        loggedIn.value = true
    } else {
        console.log("profile found")
        loggedIn.value = true
    }
    //if not, prompt them to create one
    //check if user has a username
    //if not, prompt them to create one
    //if so, continue
  }

  const createProfile = async () => {
    const { error: insertError } = await supabase
            .from('profiles')
            .insert([
                { id: user.value.id, username: tempUsername.value }
            ])

        if (insertError) {
            console.log(insertError.message)
            return
        } else {
            console.log("profile created")
            username.value = tempUsername.value
        }
  }


  supabase.auth.onAuthStateChange(async (event, session) => {
    // console.log(event, session);
    if (event == "SIGNED_IN") {
      loading.value = true;
      //user.value = session.user;

      /*
      setTimeout(async () => {
        //await getUserProfile();
        // If we have a redirect, go there first before loading the profile
        if (route.query.redirect) {
          router.push({ path: route.query.redirect });
        }
      }, 2000);
      */
    }
  });


  const buttonText = computed(() => {
    if (loading.value) return "Loading...";
    if (emailSent.value) return "Submit Code";
    return "Send Login Code";
  });
  </script>
