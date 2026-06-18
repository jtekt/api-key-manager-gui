<template>
  <v-card title="My API keys">
    <template #append>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="createDialog = true"
        text="New key"
      />
    </template>

    <v-data-table-server
      :headers="headers"
      :items="keys"
      :items-length="total"
      :loading="loading"
      item-value="id"
      @update:options="onOptions"
    >
      <template #item.name="{ item }">{{ item.name ?? "—" }}</template>
      <template #item.status="{ item }">
        <v-chip :color="chipColor(item)" size="small" label>
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
          :key-id="item.id"
          :disabled="item.revoked"
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
import { ref, reactive } from "vue";
import { apiBase } from "@/api";
import { useAuth } from "@/composables/useAuth";

const { getAuthHeaders } = useAuth();

interface ApiKey {
  id: string;
  name: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revoked: boolean;
}

const keys = ref<ApiKey[]>([]);
const total = ref(0);
const loading = ref(false);
const createDialog = ref(false);
const revealDialog = ref(false);
const newKey = ref("");
const snack = reactive({ show: false, text: "", color: "" });

let currentPage = 1;
let currentItemsPerPage = 20;

const headers = [
  { title: "Name", key: "name" },
  { title: "Status", key: "status", sortable: false },
  { title: "Created", key: "createdAt", sortable: false },
  { title: "Last used", key: "lastUsedAt", sortable: false },
  { title: "Expires", key: "expiresAt", sortable: false },
  { title: "", key: "actions", sortable: false, align: "end" as const },
];

const fmt = (date: string) => new Date(date).toLocaleString();

function chipColor(key: ApiKey) {
  if (key.revoked) return "error";
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) return "warning";
  return "success";
}

function chipLabel(key: ApiKey) {
  if (key.revoked) return "Revoked";
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) return "Expired";
  return "Active";
}

function notify(text: string, color = "error") {
  Object.assign(snack, { show: true, text, color });
}

async function fetchKeys() {
  loading.value = true;
  const offset = (currentPage - 1) * currentItemsPerPage;
  try {
    const res = await fetch(
      `${apiBase}/keys?limit=${currentItemsPerPage}&offset=${offset}`,
      { headers: getAuthHeaders() },
    );
    if (!res.ok) throw new Error("Failed to load keys");
    const data = await res.json();
    keys.value = data.items;
    total.value = data.total;
  } catch (e: any) {
    notify(e.message);
  } finally {
    loading.value = false;
  }
}

function onOptions({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
  currentPage = page;
  currentItemsPerPage = itemsPerPage;
  fetchKeys();
}

async function onDeleted() {
  notify("Key revoked", "success");
  await fetchKeys();
}

async function onCreated(apiKey: string) {
  newKey.value = apiKey;
  revealDialog.value = true;
  await fetchKeys();
}
</script>
