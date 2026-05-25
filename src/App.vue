<template>
  <v-app>
    <v-app-bar title="API Key Manager">
      <template #append>
        <template v-if="isOidc">
          <v-btn
            v-if="isAuthenticated"
            variant="text"
            @click="logout"
            icon="mdi-logout"
          />
          <v-btn v-else variant="text" @click="login" icon="mdi-login" />
        </template>
        <v-text-field
          v-else
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
import { useAuth } from "@/composables/useAuth";
import { userId } from "@/composables/useUserId";

const { isOidc, isAuthenticated, login, logout } = useAuth();
</script>
