<template>
  <v-container>
    <v-row justify="end" class="mb-2">
      <v-col cols="auto">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="createDialog = true">New Key</v-btn>
      </v-col>
    </v-row>

    <v-data-table :headers="headers" :items="keys" :loading="loading" item-value="id">
      <template #item.name="{ item }">{{ item.name ?? '—' }}</template>
      <template #item.status="{ item }">
        <v-chip :color="chipColor(item)" size="small" label>{{ chipLabel(item) }}</v-chip>
      </template>
      <template #item.createdAt="{ item }">{{ fmt(item.createdAt) }}</template>
      <template #item.lastUsedAt="{ item }">{{ item.lastUsedAt ? fmt(item.lastUsedAt) : '—' }}</template>
      <template #item.expiresAt="{ item }">{{ item.expiresAt ? fmt(item.expiresAt) : 'Never' }}</template>
      <template #item.actions="{ item }">
        <DeleteKeyButton
          :key-id="item.id"
          :user-id="userId"
          :disabled="item.revoked"
          @deleted="onDeleted"
          @error="notify"
        />
      </template>
    </v-data-table>
  </v-container>

  <CreateKeyDialog
    v-model="createDialog"
    :user-id="userId"
    @created="onCreated"
    @error="notify"
  />

  <KeyRevealDialog v-model="revealDialog" :api-key="newKey" />

  <v-snackbar v-model="snack.show" :color="snack.color">{{ snack.text }}</v-snackbar>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { userId } from '@/composables/useUserId'
import { apiBase } from '@/api'

interface ApiKey {
  id: string
  name: string | null
  createdAt: string
  lastUsedAt: string | null
  expiresAt: string | null
  revoked: boolean
}

const keys = ref<ApiKey[]>([])
const loading = ref(false)
const createDialog = ref(false)
const revealDialog = ref(false)
const newKey = ref('')
const snack = reactive({ show: false, text: '', color: '' })

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Created', key: 'createdAt' },
  { title: 'Last used', key: 'lastUsedAt' },
  { title: 'Expires', key: 'expiresAt' },
  { title: '', key: 'actions', sortable: false, align: 'end' as const },
]

const fmt = (date: string) => new Date(date).toLocaleString()

function chipColor(key: ApiKey) {
  if (key.revoked) return 'error'
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) return 'warning'
  return 'success'
}

function chipLabel(key: ApiKey) {
  if (key.revoked) return 'Revoked'
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) return 'Expired'
  return 'Active'
}

function notify(text: string, color = 'error') {
  Object.assign(snack, { show: true, text, color })
}

async function fetchKeys() {
  loading.value = true
  try {
    const res = await fetch(`${apiBase}/keys`, { headers: { 'X-User-ID': userId.value } })
    if (!res.ok) throw new Error('Failed to load keys')
    keys.value = await res.json()
  } catch (e: any) {
    notify(e.message)
  } finally {
    loading.value = false
  }
}

async function onDeleted() {
  notify('Key revoked', 'success')
  await fetchKeys()
}

async function onCreated(apiKey: string) {
  newKey.value = apiKey
  revealDialog.value = true
  await fetchKeys()
}

onMounted(fetchKeys)
</script>
