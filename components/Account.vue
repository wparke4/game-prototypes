<template>
  <div>
    hi from account
  </div>
  <div class="modal-bg" @click="showAccount = false">
    <div @click.stop>
      <div class="modal-header">
        {{ username ? "Edit Profile" : "Create Profile" }}
      </div>
      <div class="modal-content">
        <form class="space-y-5" @submit.prevent="updateProfile(false)">
          <div class="row">
            <label v-if="username" for="username">Username</label>
            <input
              ref="input"
              placeholder="Username"
              autocomplete="off"
              data-lpignore="true"
              data-form-type="other"
              class="input input-lg"
              id="username"
              type="text"
              maxlength="20"
              @keydown.space.prevent
              @paste="removeEventSpaces"
              @drop="removeEventSpaces"
              v-model="usernameTemp"
            />
          </div>

          <Avatar @upload="updateProfile(true)" />
        </form>
      </div>
      <div class="modal-bottom">
        <button
          @click="updateProfile(false)"
          class="btn btn-lg btn-success btn-outline w-full"
          :disabled="loading"
        >
          {{ loading ? "Loading ..." : "Update" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let user = useSupabaseUser();

const showAccount = useState("showAccount");
const loading = ref(false);
const username = useState("username");
const usernameTemp = ref(username.value);

const avatar = useState("avatar");
const avatarPath = useState("avatarPath");
// Focus the input element on load
const input = ref();
const { focused } = useFocus(input, { initialValue: true });

async function updateProfile(silent) {
  console.log("updateProfile", user.value.id);
  try {
    loading.value = true;
    const user = useSupabaseUser();
    const updates = {
      id: user.value.id,
      username: usernameTemp.value,
      //avatar_url: avatarPath.value,
      updated_at: new Date(),
    };
    let { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    });
    if (error) throw error;
    else {
      username.value = usernameTemp.value;
      if (!silent) showAccount.value = false;
    }
  } catch (error) {
    let msg = error.message.includes("duplicate")
      ? "That username is already taken!"
      : error.message;
    alert(msg);
  } finally {
    loading.value = false;
  }
}

const removeEventSpaces = (e) => {
  e.preventDefault();
  const left = e.target.value.substring(0, e.target.selectionStart);
  const right = e.target.value.substring(
    e.target.selectionEnd,
    e.target.value.length
  );
  const pasted = (e.dataTransfer || e.clipboardData)
    .getData("text")
    .replace(/ /g, "");
  e.target.value = left + pasted + right;
};
</script>

<style scoped lang="postcss">
form {
  .row {
    @apply flex flex-col items-start justify-between;
  }

  label {
    @apply uppercase font-bold mb-2 tracking-wider;
  }

  input {
    @apply w-96 max-w-full;
  }
}
</style>
