<template>
  <v-card title="My API keys">
    <template #append>
      <v-row>
        <v-col>
          <v-checkbox
            v-model="showRevoked"
            density="compact"
            hide-details
            label="Revoked"
            @update:model-value="onShowRevokedChange"
          />
        </v-col>

        <v-col>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            text="New key"
            @click="createDialog = true"
          />
        </v-col>
      </v-row>
    </template>

    <v-data-table-server
      :headers="headers"
      item-value="id"
      :items="keys"
      :items-length="total"
      :loading="loading"
      @update:options="onOptions"
    >
      <template #item.name="{ item }">{{ item.name ?? "—" }}</template>

      <template #item.status="{ item }">
        <v-chip :color="chipColor(item)" label size="small">
          {{ chipLabel(item) }}
        </v-chip>
      </template>

      <template #item.createdAt="{ item }">{{ fmt(item.createdAt) }}</template>

      <template #item.lastUsedAt="{ item }">
        {{ item.lastUsedAt ? fmt(item.lastUsedAt) : "—" }}
      </template>

      <template #item.expiresAt="{ item }">
        {{ item.expiresAt ? fmt(item.expiresAt) : "Never" }}
      </template>

      <template #item.actions="{ item }">
        <DeleteKeyButton
          :disabled="item.revoked"
          :key-id="item.id"
          @deleted="onDeleted"
          @error="notify"
        />
      </template>
    </v-data-table-server>
  </v-card>

  <CreateKeyDialog
    v-model="createDialog"
    @created="onCreated"
    @error="notify"
  />

  <KeyRevealDialog v-model="revealDialog" :api-key="newKey" />

  <v-snackbar v-model="snack.show" :color="snack.color">
    {{ snack.text }}
  </v-snackbar>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { apiBase } from '@/api'
  import { useAuth } from '@/composables/useAuth'

  const { getAuthHeaders } = useAuth()

  interface ApiKey {
    id: string
    name: string | null
    createdAt: string
    lastUsedAt: string | null
    expiresAt: string | null
    revoked: boolean
  }

  const keys = ref<ApiKey[]>([])
  const total = ref(0)
  const loading = ref(false)
  const createDialog = ref(false)
  const revealDialog = ref(false)
  const showRevoked = ref(false)
  const newKey = ref('')
  const snack = reactive({ show: false, text: '', color: '' })

  let currentPage = 1
  let currentItemsPerPage = 20

  const headers = [
    { title: 'Name', key: 'name' },
    { title: 'Status', key: 'status', sortable: false },
    { title: 'Created', key: 'createdAt', sortable: false },
    { title: 'Last used', key: 'lastUsedAt', sortable: false },
    { title: 'Expires', key: 'expiresAt', sortable: false },
    { title: '', key: 'actions', sortable: false, align: 'end' as const },
  ]

  const fmt = (date: string) => new Date(date).toLocaleString()

  function chipColor (key: ApiKey) {
    if (key.revoked) return 'error'
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return 'warning'
    return 'success'
  }

  function chipLabel (key: ApiKey) {
    if (key.revoked) return 'Revoked'
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return 'Expired'
    return 'Active'
  }

  function notify (text: string, color = 'error') {
    Object.assign(snack, { show: true, text, color })
  }

  async function fetchKeys () {
    loading.value = true
    const offset = (currentPage - 1) * currentItemsPerPage
    try {
      const params = new URLSearchParams({
        limit: String(currentItemsPerPage),
        offset: String(offset),
      })
      if (!showRevoked.value) params.set('revoked', 'false')
      const res = await fetch(`${apiBase}/keys?${params}`, {
        headers: getAuthHeaders(),
      })
      if (!res.ok) throw new Error('Failed to load keys')
      const data = await res.json()
      keys.value = data.items
      total.value = data.total
    } catch (error: any) {
      notify(error.message)
    } finally {
      loading.value = false
    }
  }

  function onShowRevokedChange () {
    currentPage = 1
    fetchKeys()
  }

  function onOptions ({
    page,
    itemsPerPage,
  }: {
    page: number
    itemsPerPage: number
  }) {
    currentPage = page
    currentItemsPerPage = itemsPerPage
    fetchKeys()
  }

  async function onDeleted () {
    notify('Key revoked', 'success')
    await fetchKeys()
  }

  async function onCreated (apiKey: string) {
    newKey.value = apiKey
    revealDialog.value = true
    await fetchKeys()
  }
</script>
