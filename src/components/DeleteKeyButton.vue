<template>
  <v-btn
    icon="mdi-delete-outline"
    variant="text"
    color="error"
    size="small"
    :disabled="disabled"
    @click="dialog = true"
  />

  <v-dialog v-model="dialog" max-width="360">
    <v-card title="Revoke key">
      <v-card-text>This key will be permanently revoked and cannot be used again.</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-btn color="error" :loading="loading" @click="confirm">Revoke</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { apiBase } from '@/api'
import { useAuth } from '@/composables/useAuth'

const props = defineProps<{ keyId: string; disabled?: boolean }>()
const emit = defineEmits<{ deleted: []; error: [message: string] }>()

const { getAuthHeaders } = useAuth()
const dialog = ref(false)
const loading = ref(false)

async function confirm() {
  loading.value = true
  try {
    const res = await fetch(`${apiBase}/keys/${props.keyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to revoke key')
    dialog.value = false
    emit('deleted')
  } catch (e: any) {
    emit('error', e.message)
  } finally {
    loading.value = false
  }
}
</script>
