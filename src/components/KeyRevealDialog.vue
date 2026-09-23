<template>
  <v-dialog max-width="500" :model-value="modelValue" persistent @update:model-value="$emit('update:modelValue', $event)">
    <v-card title="API Key Created">
      <v-card-text>
        <v-row>
          <v-col>
            <v-alert text="Copy this key now — it will not be shown again." type="warning" variant="tonal" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              append-inner-icon="mdi-content-copy"
              hide-details
              :model-value="apiKey"
              readonly
              variant="outlined"
              @click:append-inner="copy"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="$emit('update:modelValue', false)">Done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="copied" color="success">Copied!</v-snackbar>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const props = defineProps<{ modelValue: boolean, apiKey: string }>()
  defineEmits<{ 'update:modelValue': [value: boolean] }>()

  const copied = ref(false)

  async function copy () {
    await navigator.clipboard.writeText(props.apiKey)
    copied.value = true
  }
</script>
