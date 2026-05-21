<template>
  <v-dialog :model-value="modelValue" max-width="500" persistent @update:model-value="$emit('update:modelValue', $event)">
    <v-card title="API Key Created">
      <v-card-text>
        <v-row>
          <v-col>
            <v-alert type="warning" variant="tonal" text="Copy this key now — it will not be shown again." />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              :model-value="apiKey"
              readonly
              variant="outlined"
              hide-details
              append-inner-icon="mdi-content-copy"
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

const props = defineProps<{ modelValue: boolean; apiKey: string }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.apiKey)
  copied.value = true
}
</script>
