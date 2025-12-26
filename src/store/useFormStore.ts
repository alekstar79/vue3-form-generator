import type { FormConfig, FormValues, FormErrors } from '@/types'
import { useValidation } from '@/composable/useValidation'

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const {
  getInitialFormValues,
  validateField,
  validateForm,
} = useValidation()

/**
 * Хранилище для управления состоянием форм
 */
export const useFormStore = defineStore('forms', () => {
  const forms = ref<Map<string, any>>(new Map())
  const lastSubmittedFormId = ref<string | null>(null)
  const submissionHistory = ref<{
    formId: string;
    values: FormValues;
    timestamp: Date;
  }[]>([])

  const initializeForm = (config: FormConfig, initialValues?: FormValues): void => {
    const formId = config.id
    const values = initialValues || getInitialFormValues(config.fields)
    const errors: FormErrors = {}
    const touched = new Set<string>()
    const dirty = new Set<string>()

    forms.value.set(formId, {
      config,
      values,
      errors,
      touched,
      dirty,
      isValid: true,
      isSubmitting: false
    })
  }

  const getFieldValue = (formId: string, fieldId: string): any => {
    const form = forms.value.get(formId)
    return form?.values[fieldId] ?? ''
  }

  const setFieldValue = (formId: string, fieldId: string, value: any): void => {
    const form = forms.value.get(formId)

    if (form) {
      form.values[fieldId] = value
      form.dirty.add(fieldId)

      const field = form.config.fields.find((f: any) => f.id === fieldId)

      if (field) {
        const error = validateField(field, value)

        if (error) {
          form.errors[fieldId] = error
        } else {
          delete form.errors[fieldId]
        }
      }
    }
  }

  const touchField = (formId: string, fieldId: string): void => {
    const form = forms.value.get(formId)

    if (form) {
      form.touched.add(fieldId)
    }
  }

  const getFormValues = (formId: string): FormValues => {
    const form = forms.value.get(formId)
    return form?.values || {}
  }

  const setFormValues = (formId: string, values: FormValues): void => {
    const form = forms.value.get(formId)

    if (form) {
      form.values = { ...form.values, ...values }

      Object.keys(values).forEach((fieldId) => {
        form.dirty.add(fieldId)
      })
    }
  }

  const validateFormByConfig = (formId: string): boolean => {
    const form = forms.value.get(formId)
    if (!form) return false

    const errors = validateForm(form.config.fields, form.values)

    form.errors = errors
    form.isValid = Object.keys(errors).length === 0

    return form.isValid
  }

  const submitForm = (formId: string): boolean => {
    const form = forms.value.get(formId)
    if (!form) return false

    form.isSubmitting = true

    const isValid = validateFormByConfig(formId)

    if (isValid) {
      submissionHistory.value.push({
        formId,
        values: { ...form.values },
        timestamp: new Date()
      })

      lastSubmittedFormId.value = formId
    }

    form.isSubmitting = false

    return isValid
  }

  const resetForm = (formId: string): void => {
    const form = forms.value.get(formId)

    if (form) {
      form.values = getInitialFormValues(form.config.fields)
      form.errors = {}
      form.touched.clear()
      form.dirty.clear()
      form.isValid = true
      form.isSubmitting = false
    }
  }

  const removeForm = <K extends string>(formId: K): boolean => forms.value.delete(formId)
  const getFormState = <K extends string, T extends any>(formId: K): T => forms.value.get(formId) || null

  const getFormErrors = (formId: string): FormErrors => {
    const form = forms.value.get(formId)
    return form?.errors || {}
  }

  const isFormDirty = (formId: string): boolean => {
    const form = forms.value.get(formId)
    return form?.dirty.size > 0
  }

  const getSubmissionHistory = () => submissionHistory.value
  const clearSubmissionHistory = () => submissionHistory.value = []

  const clearFieldErrors = (formId: string) => {
    if (forms.value.has(formId)) {
      const form = forms.value.get(formId)
      form.errors = {}
    }
  }

  const formCount = computed(() => forms.value.size)
  const allFormIds = computed(() => Array.from(forms.value.keys()))

  return {
    // State
    forms,
    lastSubmittedFormId,
    submissionHistory,

    // Methods
    initializeForm,
    getFieldValue,
    setFieldValue,
    touchField,
    getFormValues,
    setFormValues,
    validateFormByConfig,
    submitForm,
    resetForm,
    removeForm,
    getFormState,
    getFormErrors,
    isFormDirty,
    getSubmissionHistory,
    clearSubmissionHistory,
    clearFieldErrors,

    // Computed
    formCount,
    allFormIds
  }
})
