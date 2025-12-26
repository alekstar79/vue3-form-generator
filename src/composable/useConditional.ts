import type { FormConfig, FormField, FormValues } from '@/types'
import { Ref, ref, computed } from 'vue'

export function useConditional(
  config: FormConfig,
  condition?: { id: string }
): {
  formValues: Ref<FormValues>
  fields: Ref<FormField[]>
} {
  const allFields = config.fields
  const formValues = ref<FormValues>({})
  const fields = computed(() => {
    if (!condition?.id) return allFields

    const conditionalValue = formValues.value[condition.id]
    return allFields.filter(field => {
      return !field.condition || field.condition({ [condition.id]: conditionalValue })
    })
  })

  return {
    formValues,
    fields
  }
}
