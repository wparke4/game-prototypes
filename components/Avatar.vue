<template>
  <div class="flex items-center justify-center space-x-3">
    <div
      class="w-14 h-14 rounded-full overflow-hidden"
      :class="{ 'border-2 border-dashed border-slate-500': !avatar }"
    >
      <img v-if="avatar" :src="avatar" class="" />
    </div>

    <div class="relative">
      <label class="btn btn-sm btn-white-border" for="single">
        {{ uploading ? "Uploading ..." : "Choose Avatar" }}
      </label>
      <input
        style="position: absolute; visibility: hidden"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["upload"]);
const supabase = useSupabaseClient();

const avatar = useState("avatar");
const avatarPath = useState("avatarPath");
const uploading = ref(false);
const files = ref();

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(avatarPath.value);
    if (error) throw error;
    avatar.value = URL.createObjectURL(data);
    emit("upload");
  } catch (error) {
    console.error("Error downloading image: ", error.message);
  }
};

const uploadAvatar = async (evt) => {
  files.value = evt.target.files;
  try {
    uploading.value = true;
    if (!files.value || files.value.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    const file = files.value[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);
    if (uploadError) throw uploadError;
    avatarPath.value = filePath;
    downloadImage();
    //emit("update:path", filePath);
    //emit("upload");
  } catch (error) {
    alert(error.message);
  } finally {
    uploading.value = false;
  }
};

//if (path.value) downloadImage();

/*watch(path, () => {
  if (path.value) {
    downloadImage();
  }
});*/
</script>
