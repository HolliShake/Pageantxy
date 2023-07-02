<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Object, String, null],
    default: null,
  },
  displayOnly: {
    type: String,
    default: null,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const file = ref([])
const hasFile = computed(() => file.value.length > 0)

const imageRep = computed(() => file.value.map(f => URL.createObjectURL(f)))
const imageLink = ref(null)

watch(file, () => {
  if (file.value == null) file.value = []

  emit('update:modelValue', (file.value.length > 0) ? file.value[0] : null)
}, { deep: true })

watch(props, () => { 
  if (props.displayOnly == null) return

  imageLink.value = `${import.meta.env.VITE_APP_APP_URL}/files/${props.displayOnly}`
}, { deep: true })

//
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VFileInput
        v-model="file"
        prepend-icon=""
        accept="image/*"
        label="Select image"
        chips
        :rules="[(imageLink != null) ? () => true : requiredValidator]"
      />
    </VCol>
    <VCol
      v-if="hasFile || imageLink != null"
      cols="12"
    >
      <div class="demo-space-x pa-1">
        <div
          v-if="!hasFile && imageLink != null"
          class="pick-image-input--frame"
        >
          <VImg
            :src="imageLink"
            cover
            alt="image"
            rounded
          />
        </div>
        <div
          v-for="(f, index) in imageRep"
          :key="index"
          class="pick-image-input--frame"
        >
          <VImg
            :src="f"
            cover
            alt="image"
            rounded
          />
        </div>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.pick-image-input--frame {
  display: block !important;
  padding: 0.3em;
  border: 2.2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 0.2em;
  block-size: 120px !important;
  inline-size: 120px !important;

  & img {
    border-radius: inherit !important;
  }
}
</style>

