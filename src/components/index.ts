import { defineAsyncComponent } from 'vue'

export const FormField = defineAsyncComponent(() =>
  import('./FormField.vue')
)

export const FormGenerator = defineAsyncComponent(() =>
  import('./FormGenerator.vue')
)
