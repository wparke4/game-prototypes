<template>
  <div class="modal-bg" @click="showAuth = false">
    <div @click.stop>
      <div class="modal-header">
        {{ emailSent ? "Check email for code" : "Login" }}
      </div>
      <div class="modal-content">
        <div class="space-y-5">
          <p v-if="emailSent" class="text-sm">
            Code sent to {{ email }}.
            <a @click="emailSent = false" class="underline">Wrong one?</a>
          </p>
          <input
            v-if="!emailSent"
            ref="input"
            class="input input-lg w-full text-left"
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
            class="input input-lg w-full text-center"
            type="text"
            placeholder="Login Code"
            v-model="otpCode"
            :disabled="loading"
            @keyup.enter="verifyOtp()"
          />
        </div>
      </div>
      <div class="modal-bottom">
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
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const showAuth = useState("showAuth", () => false);
const loading = ref(false);
const emailSent = ref(false);
const email = ref("");
const otpCode = ref("");

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
  }
};

const buttonText = computed(() => {
  if (loading.value) return "Loading...";
  if (emailSent.value) return "Submit Code";
  return "Send Login Code";
});
</script>
