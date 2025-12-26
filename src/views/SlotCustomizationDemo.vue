<template>
  <div class="demo-container">
    <h1>Кастомизация через слоты</h1>
    <p class="demo-description">
      Использование именованных слотов для кастомизации полей формы.
    </p>

    <div class="demo-content">
      <FormGenerator
        :config="slotFormConfig"
        :model-value="formValues"
        @update:model-value="formValues = $event"
        @submit="handleSubmit"
        @cancel="handleCancel"
      >
        <template #header="{ config }">
          <div class="custom-header">
            <div>
              <h2>{{ config.title }}</h2>
              <p>{{ config.description }}</p>
            </div>
          </div>
        </template>

        <template #field-email-error="{ error }">
          <div v-if="error" class="custom-error">
            <span class="error-icon">⚠️</span>
            <span>{{ error }}</span>
          </div>
        </template>

        <template #field-password-hint="{ hint }">
          <div v-if="hint" class="custom-hint">
            <span class="hint-icon">💡</span>
            <span>{{ hint }}</span>
          </div>
        </template>

        <template #field-agree-checkbox="{ field }">
          <div class="custom-checkbox">
            <span class="checkbox-icon">✓</span>
            <label :for="`field-${field.id}`">
              Я согласен с
              <a href="#">условиями использования</a>
            </label>
          </div>
        </template>

        <template #actions="{ submit, cancel }">
          <button class="btn btn--primary" @click="submit">
            <span class="btn-icon">✓</span>
            Создать аккаунт
          </button>

          <button class="btn btn--secondary" @click="cancel">
            Отмена
          </button>
        </template>

        <template #success-message>
          <span>Профиль успешно создан</span>
        </template>
      </FormGenerator>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormConfig, FormValues } from '@/types'
import { FormGenerator } from '@/components'

const formValues = ref<FormValues>({})

const slotFormConfig: FormConfig = {
  id: 'slot-form',
  title: 'Регистрация',
  description: 'Создайте новый аккаунт',
  fields: [
    {
      id: 'username',
      type: 'input',
      label: 'Имя пользователя',
      placeholder: 'john_doe',
      required: true,
      minLength: 3,
      maxLength: 30
    },
    {
      id: 'email',
      type: 'input',
      label: 'Email адрес',
      placeholder: 'your.email@example.com',
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      errorMessage: 'Пожалуйста, используйте валидный email',
      attributes: {
        type: 'email'
      }
    },
    {
      id: 'password',
      type: 'input',
      label: 'Пароль',
      required: true,
      minLength: 8,
      hint: 'Минимум 8 символов. Используйте большие и маленькие буквы, цифры и спецсимволы.',
      attributes: {
        type: 'password'
      }
    },
    {
      id: 'country',
      type: 'select',
      label: 'Страна',
      required: true,
      options: [
        { label: 'Россия', value: 'ru' },
        { label: 'Казахстан', value: 'kz' },
        { label: 'Беларусь', value: 'by' },
        { label: 'Украина', value: 'ua' },
        { label: 'Другая', value: 'other' }
      ]
    },
    {
      id: 'agree',
      type: 'checkbox',
      label: 'Я согласен с условиями',
      required: true
    }
  ]
}

const handleSubmit = (values: FormValues) => {
  console.log('Регистрация:', values)
}

const handleCancel = () => {
  formValues.value = {}
}
</script>

<style scoped lang="scss">
@use "sass:color";
@use '@/styles/variables' as *;

.demo-container {
  max-width: 600px;
  margin: 0 auto;
  padding: $spacing-xl;

  h1 {
    margin-bottom: $spacing-md;
  }

  .demo-description {
    color: $color-text-secondary;
    margin-bottom: $spacing-xl;
  }
  .demo-content {
    background: white;
    padding: $spacing-lg;
    border-radius: $border-radius;
    box-shadow: $shadow-md;
  }
}

.custom-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  padding-bottom: $spacing-lg;
  border-bottom: 2px solid $color-primary;

  .header-icon {
    font-size: 2rem;
  }

  h2 {
    margin: 0 0 $spacing-xs 0;
  }
  p {
    margin: 0;
    color: $color-text-secondary;
  }
}

.custom-error {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: rgba($color-error, 0.1);
  border-left: 4px solid $color-error;
  border-radius: $border-radius-sm;
  color: $color-error;
  font-size: $font-size-sm;

  .error-icon {
    flex-shrink: 0;
  }
}

.custom-hint {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: rgba($color-info, 0.1);
  border-left: 3px solid $color-info;
  border-radius: $border-radius-sm;
  color: $color-info;
  font-size: $font-size-xs;
  margin-top: $spacing-sm;

  .hint-icon {
    flex-shrink: 0;
  }
}

.custom-checkbox {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $color-primary-light;
  border-radius: $border-radius-sm;

  .checkbox-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: $color-primary;
    color: white;
    border-radius: 50%;
    font-size: $font-size-xs;
    flex-shrink: 0;
  }

  label {
    margin: 0;
    cursor: pointer;
    font-size: $font-size-sm;

    a {
      color: $color-primary;
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }
}

.custom-actions {
  display: flex;
  gap: $spacing-md;
  padding-top: $spacing-lg;
  border-top: 1px solid $color-border;
}

.btn {
  flex: 1;
  padding: $spacing-md $spacing-lg;
  font-weight: 600;
  font-size: $font-size-base;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  transition: all $transition-duration ease;

  &--primary {
    background: linear-gradient(135deg, $color-primary, color.adjust($color-primary, $lightness: 10%));
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }
    &:active {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: $color-background-alt;
    color: $color-text-primary;
    border: 2px solid $color-border;

    &:hover {
      border-color: $color-primary;
      background: white;
    }
  }

  .btn-icon {
    font-size: $font-size-lg;
  }
}

.custom-success {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: rgba($color-success, 0.1);
  border-left: 4px solid $color-success;
  border-radius: $border-radius-sm;
  color: $color-success;
  font-weight: 500;

  .success-icon {
    font-size: $font-size-lg;
  }
}

@media (max-width: 768px) {
  .demo-container {
    padding: $spacing-lg;
  }
  .custom-actions {
    flex-direction: column;
  }
}
</style>
