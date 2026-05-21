<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card title="New API Key">
      <v-card-text class="d-flex flex-column gap-3">
        <v-row>
          <v-col>
            <v-text-field v-model="name" label="Name (optional)" hide-details />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="expiresAt"
              label="Expires at (optional)"
              type="datetime-local"
              hide-details
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
import { ref, watch } from "vue";

const props = defineProps<{ modelValue: boolean; userId: string }>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  created: [apiKey: string];
  error: [message: string];
}>();

const name = ref("");
const expiresAt = ref("");
const loading = ref(false);

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      name.value = "";
      expiresAt.value = "";
    }
  },
);

async function submit() {
  loading.value = true;
  try {
    const body: Record<string, string> = {};
    if (name.value) body.name = name.value;
    if (expiresAt.value)
      body.expires_at = new Date(expiresAt.value).toISOString();

    const res = await fetch("/keys", {
      method: "POST",
      headers: {
        "X-User-ID": props.userId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create key");
    const data = await res.json();
    emit("update:modelValue", false);
    emit("created", data.api_key);
  } catch (e: any) {
    emit("error", e.message);
  } finally {
    loading.value = false;
  }
}
</script>
