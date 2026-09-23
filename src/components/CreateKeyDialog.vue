<template>
  <v-dialog
    max-width="420"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card title="New API Key">
      <v-card-text class="d-flex flex-column gap-3">
        <v-row>
          <v-col>
            <v-text-field v-model="name" hide-details label="Name (optional)" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="expiresAt"
              hide-details
              label="Expires at (optional)"
              type="datetime-local"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" :loading="loading" @click="submit">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { apiBase } from '@/api'
  import { useAuth } from '@/composables/useAuth'

  const props = defineProps<{ modelValue: boolean }>()
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'created': [apiKey: string]
    'error': [message: string]
  }>()

  const { getAuthHeaders } = useAuth()

  const name = ref('')
  const expiresAt = ref('')
  const loading = ref(false)

  watch(
    () => props.modelValue,
    open => {
      if (open) {
        name.value = ''
        expiresAt.value = ''
      }
    },
  )

  async function submit () {
    loading.value = true
    try {
      const body: Record<string, string> = {}
      if (name.value) body.name = name.value
      if (expiresAt.value)
        body.expires_at = new Date(expiresAt.value).toISOString()

      const res = await fetch(`${apiBase}/keys`, {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to create key')
      const data = await res.json()
      emit('update:modelValue', false)
      emit('created', data.api_key)
    } catch (error: any) {
      emit('error', error.message)
    } finally {
      loading.value = false
    }
  }
</script>
