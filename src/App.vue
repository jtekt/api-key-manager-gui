<template>
  <v-app>
    <v-app-bar title="API Key Manager" flat border="b">
      <template #append>
        <v-text-field
          v-model="userId"
          label="User ID"
          density="compact"
          hide-details
          variant="outlined"
          width="200"
          class="mr-3"
        />
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { userId } from '@/composables/useUserId'
</script>
