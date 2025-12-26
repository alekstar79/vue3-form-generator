<template>
  <div class="form-field" :class="[fieldClass, { 'has-error': hasError }]">
    <slot v-if="field.label && field.type !== 'checkbox'" name="label" :field="field" :label="field.label">
      <label v-if="field.label" :for="`field-${field.id}`" class="form-field__label">
        {{ field.label }}
        <span v-if="field.required" class="form-field__required">*</span>
      </label>
    </slot>

    <!-- Input Field -->
    <input
      v-if="field.type === 'input'"
      :id="`field-${field.id}`"
      :type="field.attributes?.type || 'text'"
      :value="modelValue"
      :input-rules="inputRules"
      :placeholder="field.placeholder"
      :required="field.required"
      :maxlength="field.maxLength"
      :minlength="field.minLength"
      :disabled="field.disabled"
      :pattern="field.pattern"
      v-bind="field.attributes"
      class="form-field__input"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- Select Field -->
    <select
      v-else-if="field.type === 'select'"
      :id="`field-${field.id}`"
      :value="modelValue"
      :input-rules="inputRules"
      :required="field.required"
      :disabled="field.disabled"
      class="form-field__select"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <option v-if="!field.required" value="">-- Выбрать --</option>
      <option
        v-for="option in field.options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Textarea Field -->
    <textarea
      v-else-if="field.type === 'textarea'"
      :id="`field-${field.id}`"
      :value="modelValue"
      :placeholder="field.placeholder"
      :required="field.required"
      :maxlength="field.maxLength"
      :minlength="field.minLength"
      :disabled="field.disabled"
      class="form-field__textarea"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    ></textarea>

    <!-- Checkbox Field -->
    <div v-else-if="field.type === 'checkbox'" class="form-field__checkbox-wrapper">
      <input
        :id="`field-${field.id}`"
        type="checkbox"
        :checked="Boolean(modelValue)"
        :required="field.required"
        :disabled="field.disabled"
        :value="field.checkboxValue"
        class="form-field__checkbox"
        @change="handleCheckboxChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Слот кастомного чекбокса -->
      <slot name="checkbox" :field="field">
        <label :for="`field-${field.id}`" class="form-field__checkbox-label">
          {{ field.label }}
          <span v-if="field.required" class="form-field__required">*</span>
        </label>
      </slot>
    </div>

    <!-- Подсказка (hint) -->
    <slot name="hint" :field="field" :hint="field.hint">
      <p v-if="field.hint && !hasError" class="form-field__hint">
        {{ field.hint }}
      </p>
    </slot>

    <!-- Сообщение об ошибке -->
    <slot name="error" :field="field" :error="error">
      <p v-if="hasError" class="form-field__error">
        {{ error }}
      </p>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormField } from '@/types'
import { isValidEmail, isValidPhone } from '@/utils/formValidation'

interface Props {
  field: FormField;
  modelValue: string | number | boolean | string[] | null;
  error?: string;
  touched?: boolean;
}

interface Emits {
  'update:modelValue': [value: string | number | boolean | string[]];
  blur: [fieldId: string];
  focus: [fieldId: string];
}

const props = withDefaults(defineProps<Props>(), {
  touched: false,
  error: '',
  modelValue: ''
})

const emit = defineEmits<Emits>()

const hasError = computed(() => props.touched && !!props.error)

const inputRules = computed(() => {
  const rules: string[] = []

  if (props.field.pattern === 'email') {
    rules.push('email')
  }
  if (props.field.pattern === 'tel') {
    rules.push('[0-9+\\-\\s()]{10,}')
  }

  return rules
})

const fieldClass = computed(() => [
  `form-field--${props.field.type}`,
  props.field.className
])

// Обработчики событий
const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const handleCheckboxChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Boolean(target.checked))
}

const handleBlur = (): void => {
  emit('blur', props.field.id)
}

const handleFocus = (): void => {
  emit('focus', props.field.id)
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: $spacing-lg;
  transition: all $transition-duration ease;

  &.has-error {
    .form-field__label {
      color: $color-error;
    }

    .form-field__input,
    .form-field__select,
    .form-field__textarea {
      border-color: $color-error;
      background-color: rgba($color-error, 0.02);

      &:focus {
        box-shadow: 0 0 0 3px rgba($color-error, 0.1);
      }
    }
  }
  &__label {
    display: block;
    margin-bottom: $spacing-sm;
    font-weight: 500;
    font-size: $font-size-sm;
    color: $color-text-primary;
    user-select: none;
  }
  &__required {
    color: $color-error;
    margin-left: $spacing-xs;
  }

  &__input,
  &__select,
  &__textarea {
    padding: $spacing-md;
    font-family: inherit;
    font-size: $font-size-base;
    color: $color-text-primary;
    background-color: $color-background;
    border: 2px solid $color-border;
    border-radius: $border-radius;
    transition: all $transition-duration ease;
    appearance: none;

    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }

    &:disabled {
      background-color: $color-disabled;
      color: $color-text-secondary;
      cursor: not-allowed;
    }
  }

  &__textarea {
    min-height: 120px;
    resize: vertical;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: $font-size-sm;
  }
  &__select {
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path fill="%23333" d="M1 1l5 5 5-5"/></svg>');
    background-repeat: no-repeat;
    background-position: right $spacing-md center;
    padding-right: calc($spacing-md * 2.5);
  }
  &__checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }
  &__checkbox {
    width: 18px;
    height: 18px;
    margin: 0;
    cursor: pointer;
    accent-color: $color-primary;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  &__checkbox-label {
    cursor: pointer;
    user-select: none;
    font-weight: normal;
    margin: 0;
  }
  &__hint {
    margin: $spacing-sm 0 0 0;
    font-size: $font-size-xs;
    color: $color-text-secondary;
    font-style: italic;
  }
  &__error {
    margin: $spacing-sm 0 0 0;
    font-size: $font-size-xs;
    color: $color-error;
    font-weight: 500;
  }
}

.form-field {
  &__input,
  &__select,
  &__textarea {
    background: linear-gradient(145deg, #ffffff, #f5f5f5);
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.05),
    inset -2px -2px 4px rgba(255, 255, 255, 0.8);

    &:focus {
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1),
      inset 2px 2px 4px rgba(0, 0, 0, 0.05);
    }
  }

  &__checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    position: relative;

    &:checked::before {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
    }
  }
}

@media (max-width: 768px) {
  .form-field {
    margin-bottom: $spacing-md;

    &__input,
    &__select,
    &__textarea {
      font-size: 16px;
    }
  }
}
</style>
