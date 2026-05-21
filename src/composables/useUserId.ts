import { ref, watch } from 'vue'

export const userId = ref(localStorage.getItem('userId') ?? 'dev-user')
watch(userId, v => localStorage.setItem('userId', v))
