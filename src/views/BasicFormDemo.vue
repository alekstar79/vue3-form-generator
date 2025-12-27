<template>
  <div class="demo-container">
    <h1>Базовая форма</h1>
    <p class="demo-description">
      Простой пример использования компонента FormGenerator с основными типами полей.
    </p>

    <div class="demo-content">
      <FormGenerator
        :config="basicFormConfig"
        :model-value="formValues"
        @update:model-value="formValues = $event"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>

    <div v-if="lastSubmission" class="submission-result">
      <h3>Последняя отправка:</h3>
      <pre>{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormConfig, FormValues } from '@/types'
import {  FormGenerator } from '@/components'

const formValues = ref<FormValues>({})
const lastSubmission = ref<FormValues | null>(null)

const basicFormConfig: FormConfig = {
  id: 'basic-form',
  title: 'Форма обратной связи',
  description: 'Пожалуйста, заполните все обязательные поля',
  fields: [
    {
      id: 'name',
      type: 'input',
      label: 'Имя',
      placeholder: 'Введите ваше имя',
      required: true,
      minLength: 2,
      maxLength: 50,
      hint: 'От 2 до 50 символов'
    },
    {
      id: 'email',
      type: 'input',
      label: 'Email',
      placeholder: 'example@mail.com',
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      errorMessage: 'Пожалуйста, введите корректный email адрес',
      attributes: {
        type: 'email'
      }
    },
    {
      id: 'phone',
      type: 'input',
      label: 'Телефон',
      placeholder: '+7 (999) 999-99-99',
      hint: 'Необязательное поле',
      attributes: {
        type: 'tel'
      }
    },
    {
      id: 'subject',
      type: 'select',
      label: 'Тема',
      required: true,
      options: [
        { label: 'Общий вопрос', value: 'general' },
        { label: 'Техническая поддержка', value: 'support' },
        { label: 'Предложение', value: 'suggestion' },
        { label: 'Жалоба', value: 'complaint' }
      ]
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Сообщение',
      placeholder: 'Расскажите нам подробнее...',
      required: true,
      minLength: 10,
      maxLength: 1000,
      hint: 'От 10 до 1000 символов'
    },
    {
      id: 'subscribe',
      type: 'checkbox',
      label: 'Подписаться на рассылку',
      defaultValue: false
    },
  ],
  submitLabel: 'Отправить',
  cancelLabel: 'Очистить'
}

const handleSubmit = (values: FormValues) => {
  lastSubmission.value = values
  console.log('Форма отправлена:', values)
}

const handleCancel = () => {
  console.log('Форма очищена')
  formValues.value = {}
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.demo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-xl;

  h1 {
    margin-bottom: $spacing-md;
  }

  .demo-description {
    color: $color-text-secondary;
    margin-bottom: $spacing-xl;
    font-size: $font-size-sm;
  }

  .demo-content {
    background: white;
    padding: $spacing-lg;
    border-radius: $border-radius;
    box-shadow: $shadow-md;
    margin-bottom: $spacing-xl;
  }

  .submission-result {
    background: $color-background-alt;
    padding: $spacing-lg;
    border-radius: $border-radius;
    border-left: 4px solid $color-success;

    h3 {
      margin-bottom: $spacing-md;
      color: $color-success;
    }
    pre {
      background: white;
      padding: $spacing-md;
      border-radius: $border-radius-sm;
      overflow-x: auto;
      font-size: $font-size-xs;
      line-height: 1.4;
      color: $color-text-primary;
    }
  }
}

@media (max-width: 768px) {
  .demo-container {
    padding: $spacing-lg;
  }
}
</style>
