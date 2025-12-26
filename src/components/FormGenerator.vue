<template>
  <div class="form-generator" :class="formContainerClass">
    <div v-if="config.title || config.description" class="form-generator__header">
      <slot name="header" :config="config">
        <h2 v-if="config.title" class="form-generator__title">
          {{ config.title }}
        </h2>

        <p v-if="config.description" class="form-generator__description">
          {{ config.description }}
        </p>
      </slot>
    </div>

    <form @submit.prevent="handleSubmit" novalidate class="form-generator__form">
      <div class="form-generator__fields">
        <slot name="fields-wrapper" :fields="fields" :values="formValues">
          <FormField
            v-for="field in fields"
            :key="field.id"
            :field="field"
            :model-value="modelValue[field.id]"
            :error="formErrors[field.id]"
            :touched="touchedFields.has(field.id)"
            @update:model-value="updateFieldValue(field.id, $event)"
            @blur="markFieldTouched(field.id)"
            @focus="markFieldFocused(field.id)"
          >
            <template #label="slotProps">
              <slot :name="`field-${field.id}-label`" v-bind="slotProps">
                <label v-if="field.label" :for="`field-${field.id}`" class="form-field__label">
                  {{ field.label }}
                  <span v-if="field.required" class="form-field__required">*</span>
                </label>
              </slot>
            </template>

            <template #error="slotProps">
              <slot :name="`field-${field.id}-error`" v-bind="slotProps">
                <p v-if="slotProps.error" class="form-field__error">
                  {{ slotProps.error }}
                </p>
              </slot>
            </template>

            <template #hint="slotProps">
              <slot :name="`field-${field.id}-hint`" v-bind="slotProps">
                <p v-if="slotProps.hint && !slotProps.error" class="form-field__hint">
                  {{ slotProps.hint }}
                </p>
              </slot>
            </template>

            <template #checkbox="slotProps">
              <slot :name="`field-${field.id}-checkbox`" v-bind="slotProps">
                <label :for="`field-${field.id}`" class="form-field__checkbox-label">
                  {{ field.label }}
                  <span v-if="field.required" class="form-field__required">*</span>
                </label>
              </slot>
            </template>
          </FormField>
        </slot>
      </div>

      <div class="form-generator__actions">
        <slot name="actions" :submit="handleSubmit" :cancel="handleCancel">
          <button
            type="submit"
            class="form-generator__button form-generator__button--submit"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">{{ submitLabel }}</span>
            <span v-else class="spinner">{{ submitLabel }}...</span>
          </button>

          <button
            type="button"
            class="form-generator__button form-generator__button--cancel"
            @click="handleCancel"
            :disabled="isSubmitting"
          >
            {{ cancelLabel }}
          </button>
        </slot>
      </div>

      <transition name="fade">
        <div v-if="showSuccessMessage" class="form-generator__success-message">
          <slot name="success-message">
            ✓ Форма успешно отправлена
          </slot>
        </div>
      </transition>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { FormConfig, FormValues, FormErrors } from '@/types'

import { useConditional } from '@/composable/useConditional'
import { useValidation } from '@/composable/useValidation'
import { useFormStore } from '@/store/useFormStore'

import FormField from './FormField.vue'

interface Props {
  config: FormConfig;
  modelValue?: FormValues;
  submitLabel?: string;
  cancelLabel?: string;
  showSuccessMessageDuration?: number;
  conditionalId?: {
    id: string
  }
}

interface Emits {
  'update:modelValue': [values: FormValues];
  submit: [values: FormValues];
  change: [fieldId: string, value: any];
  cancel: [];
}

const props = withDefaults(defineProps<Props>(), {
  showSuccessMessageDuration: 3000,
  modelValue: () => ({}),
  submitLabel: 'Сохранить',
  cancelLabel: 'Отмена'
})

const emit = defineEmits<Emits>()

const { getInitialFormValues, normalizeFieldValue, validateForm } = useValidation()
const { formValues, fields } = useConditional(props.config, props.conditionalId)
const formStore = useFormStore()

const formErrors = ref<FormErrors>({})
const touchedFields = ref(new Set<string>())
const showSuccessMessage = ref(false)
const isSubmitting = ref(false)

const submitLabel = computed(() => props.submitLabel)
const cancelLabel = computed(() => props.cancelLabel)
const formContainerClass = computed(() => [
  props.config.containerClass
])

onMounted(() => {
  const currentValues = props.modelValue || {}
  const completeInitialValues = props.config.fields.reduce((acc: FormValues, field) => {
    return { ...acc, [field.id]: currentValues[field.id] ?? (field.type === 'checkbox' ? false : '') }
  }, { ...currentValues } as FormValues)

  formValues.value = { ...completeInitialValues }
  formStore.initializeForm(props.config, completeInitialValues)
})

onUnmounted(() => {
  formStore.removeForm(props.config.id)
})

watch(
  () => props.modelValue,
  (values) => {
    if (Object.keys(values).length > 0) {
      formValues.value = { ...values }
    }
  },
  {
    deep: true
  }
)

const updateFieldValue = (fieldId: string, value: any) => {
  const field = props.config.fields.find(f => f.id === fieldId)!
  const normalized = normalizeFieldValue(field.type, value)

  formValues.value[fieldId] = normalized
  formStore.setFieldValue(props.config.id, fieldId, normalized)

  emit('update:modelValue', formValues.value)
  emit('change', fieldId, normalized)

  delete formErrors.value[fieldId]
}

const markFieldTouched = (fieldId: string) => {
  touchedFields.value.add(fieldId)
  formStore.touchField(props.config.id, fieldId)
}

const markFieldFocused = (_fieldId: string) => {
  // Можно добавить дополнительную логику для фокуса
}

const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const errors = validateForm(fields.value, formValues.value)
    formErrors.value = errors

    // Отмечаем все поля как touched
    fields.value.forEach(field => {
      touchedFields.value.add(field.id)
    })

    if (Object.keys(errors).length === 0) {
      emit('submit', formValues.value)

      // Сообщение об успехе
      showSuccessMessage.value = true

      setTimeout(() => {
        showSuccessMessage.value = false
      }, props.showSuccessMessageDuration)
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  formValues.value = getInitialFormValues(props.config.fields)
  formErrors.value = {}
  touchedFields.value.clear()

  emit('cancel')
  emit('update:modelValue', formValues.value)
}

defineExpose({
  getValues: () => formValues.value,
  setValues: (values: FormValues) => {
    formValues.value = { ...values }
  },
  validate: () => {
    const errors = validateForm(props.config.fields, formValues.value)
    formErrors.value = errors
    return Object.keys(errors).length === 0
  },
  reset: handleCancel,
  getErrors: () => formErrors.value
})
</script>

<style scoped lang="scss">
@use "sass:color";
@use '@/styles/variables' as *;

.form-generator {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideIn 0.3s ease;

  &__header {
    margin-bottom: $spacing-md;
  }
  &__title {
    margin: 0 0 $spacing-sm 0;
    font-size: $font-size-xl;
    font-weight: 700;
    color: $color-text-primary;
  }
  &__description {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: 1.5;
  }
  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }
  &__fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
  &__actions {
    display: flex;
    gap: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $color-border;
  }
  &__button {
    flex: 1;
    padding: $spacing-md $spacing-lg;
    font-weight: 600;
    font-size: $font-size-base;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: all $transition-duration ease;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--submit {
      background-color: $color-primary;
      color: white;

      &:hover:not(:disabled) {
        background-color: color.adjust($color-primary, $lightness: 10%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($color-primary, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }
    &--cancel {
      background-color: $color-background;
      color: $color-text-primary;
      border: 2px solid $color-border;

      &:hover:not(:disabled) {
        background-color: color.adjust($color-background, $lightness: 3%);
        border-color: $color-primary;
      }
    }
  }

  &__success-message {
    padding: $spacing-md;
    background-color: rgba(40, 167, 69, 0.1);
    border-left: 4px solid #28a745;
    border-radius: $border-radius;
    color: #155724;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  }
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;

  &::after {
    content: '⟳';
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .form-generator {
    gap: $spacing-md;

    &__actions {
      flex-direction: column;
      gap: $spacing-sm;
    }
    &__button {
      width: 100%;
    }
  }
}
</style>
