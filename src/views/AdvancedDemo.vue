<template>
  <div class="demo-container">
    <h1>Продвинутое использование</h1>
    <p class="demo-description">
      Динамические формы, асинхронная валидация и интеграция с хранилищем.
    </p>

    <div class="demo-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="demo-content">
      <div v-if="activeTab === 'Динамическая'" class="tab-pane">
        <FormGenerator
          :config="dynamicFormConfig"
          :model-value="dynamicFormValues"
          @update:model-value="dynamicFormValues = $event"
          @submit="handleDynamicSubmit"
        />

        <div class="dynamic-actions">
          <button class="btn btn--secondary" @click="addField">
            + Добавить поле
          </button>
          <button
            v-if="dynamicFormConfig.fields.length > 2"
            class="btn btn--danger"
            @click="removeLastField"
          >
            - Удалить поле
          </button>
        </div>

        <div v-if="dynamicResult" class="result">
          <h4>Результат:</h4>
          <pre>{{ JSON.stringify(dynamicResult, null, 2) }}</pre>
        </div>
      </div>

      <div v-if="activeTab === 'Условная логика'" class="tab-pane">
        <FormGenerator
          :config="conditionalFormConfig"
          :model-value="conditionalFormValues"
          :conditional-id="conditionalId"
          @update:model-value="conditionalFormValues = $event"
          @submit="handleConditionalSubmit"
        />

        <div v-if="conditionalResult" class="result">
          <h4>Результат:</h4>
          <pre>{{ JSON.stringify(conditionalResult, null, 2) }}</pre>
        </div>
      </div>

      <div v-if="activeTab === 'Хранилище'" class="tab-pane">
        <FormGenerator
          :config="storeFormConfig"
          :model-value="storeFormValues"
          @update:model-value="storeFormValues = $event"
          @submit="handleStoreSubmit"
        />

        <div class="store-info">
          <h4>Информация о хранилище:</h4>
          <dl>
            <dt>Всего форм в хранилище:</dt>
            <dd>{{ formStore.formCount }}</dd>

            <dt>Последняя отправленная форма:</dt>
            <dd>{{ formStore.lastSubmittedFormId || 'нет' }}</dd>

            <dt>История отправок:</dt>
            <dd>{{ formStore.submissionHistory.length }} записей</dd>
          </dl>

          <button class="btn btn--secondary" @click="toggleSubmissionHistory">
            Показать историю
          </button>
        </div>

        <div v-if="showHistory" class="history">
          <h4>История отправок:</h4>
          <div v-if="formStore.submissionHistory.length > 0" class="history-list">
            <div
              v-for="(submission, index) in formStore.submissionHistory"
              :key="index"
              class="history-item"
            >
              <span class="time">{{
                new Date(submission.timestamp).toLocaleString('ru-RU')
              }}</span>
              <pre>{{ JSON.stringify(submission.values, null, 2) }}</pre>
            </div>
          </div>
          <p v-else class="no-history">История отправок пуста</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { FormConfig, FormValues } from '@/types'
import { useFormStore } from '@/store/useFormStore'
import { FormGenerator } from '@/components'


const formStore = useFormStore()

const activeTab = ref('Динамическая')
const tabs = ['Динамическая', 'Условная логика', 'Хранилище']

const dynamicFormConfig = ref<FormConfig>({
  id: 'dynamic-form',
  title: 'Динамическая форма',
  description: 'Форма позволяет добавлять и удалять поля в runtime.',
  fields: [
    {
      id: 'field-0',
      type: 'input',
      label: 'Поле 1',
      required: true
    },
    {
      id: 'field-1',
      type: 'input',
      label: 'Поле 2',
      required: true
    }
  ]
})

const dynamicFormValues = ref<FormValues>({})
const dynamicResult = ref<FormValues | null>(null)

const addField = () => {
  const newId = `field-${dynamicFormConfig.value.fields.length}`

  dynamicFormConfig.value.fields.push({
    id: newId,
    type: 'input',
    label: `Поле ${dynamicFormConfig.value.fields.length + 1}`,
    required: false
  })
}

const removeLastField = (): void => {
  if (dynamicFormConfig.value.fields.length > 2) {
    const removed = dynamicFormConfig.value.fields.pop()

    if (removed) {
      delete dynamicFormValues.value[removed.id]
    }
  }
}

const handleDynamicSubmit = (values: FormValues) => {
  dynamicResult.value = values
}

// Форма с условной логикой
const conditionalFormConfig: FormConfig = {
  id: 'conditional-form',
  title: 'Форма с условной видимостью полей',
  description: 'Форма позволяет добавлять и удалять поля в реальном времени. ',
  fields: [
    {
      id: 'userType',
      type: 'select',
      label: 'Тип пользователя',
      required: true,
      options: [
        { label: 'Выберите тип', value: '' },
        { label: 'Частное лицо', value: 'individual' },
        { label: 'Юридическое лицо', value: 'business' }
      ]
    },
    {
      id: 'firstName',
      type: 'input',
      label: 'Имя',
      required: true,
      condition: ({ userType = '' }) => userType === 'individual'
    },
    {
      id: 'lastName',
      type: 'input',
      label: 'Фамилия',
      required: true,
      condition: ({ userType = '' }) => userType === 'individual'
    },
    {
      id: 'companyName',
      type: 'input',
      label: 'Название компании',
      required: true,
      condition: ({ userType = '' }) => userType === 'business'
    },
    {
      id: 'innNumber',
      type: 'input',
      label: 'ИНН',
      required: true,
      pattern: '^\\d{10,12}$',
      condition: ({ userType = '' }) => userType === 'business'
    },
    {
      id: 'phone',
      type: 'input',
      label: 'Телефон',
      required: true,
      attributes: {
        type: 'tel'
      }
    }
  ]
}

const conditionalId = { id: 'userType' }
const conditionalFormValues = ref<FormValues>({})
const conditionalResult = ref<FormValues | null>(null)

const handleConditionalSubmit = (values: FormValues): void => {
  conditionalResult.value = values
}

// Форма с хранилищем
const storeFormConfig: FormConfig = {
  id: 'store-form',
  title: 'Форма с интеграцией хранилища',
  description: 'Синхронизируется с глобальным стейтом приложения',
  fields: [
    {
      id: 'name',
      type: 'input',
      label: 'Имя',
      required: true
    },
    {
      id: 'email',
      type: 'input',
      label: 'Email',
      required: true,
      attributes: { type: 'email' }
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Сообщение',
      required: true
    }
  ]
}

const storeFormValues = ref<FormValues>({})
const showHistory = ref(false)

const handleStoreSubmit = (values: FormValues) => {
  formStore.submitForm(storeFormConfig.id /*, values */)
  console.log('✅ Сохранено в хранилище:', values)
}

const toggleSubmissionHistory = (): void => {
  showHistory.value = !showHistory.value
}
</script>

<style scoped lang="scss">
@use "sass:color";
@use '@/styles/variables' as *;

.demo-container {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-xl;

  h1 {
    margin-bottom: $spacing-md;
  }

  .demo-description {
    color: $color-text-secondary;
    margin-bottom: $spacing-xl;
  }
}

.demo-tabs {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
  border-bottom: 2px solid $color-border;
  overflow-x: auto;

  .tab-btn {
    padding: $spacing-md $spacing-lg;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: $color-text-secondary;
    border-bottom: 3px solid transparent;
    transition: all $transition-duration ease;
    white-space: nowrap;

    &:hover {
      color: $color-text-primary;
    }
    &.active {
      color: $color-primary;
      border-bottom-color: $color-primary;
    }
  }
}

.demo-content {
  background: white;
  padding: $spacing-lg;
  border-radius: $border-radius;
  box-shadow: $shadow-md;
}

.tab-pane {
  animation: slideIn 0.3s ease;
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

.dynamic-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-lg;

  .btn {
    padding: $spacing-md $spacing-lg;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    font-weight: 600;
    transition: all $transition-duration ease;

    &--secondary {
      background: $color-primary;
      color: white;

      &:hover {
        background: color.adjust($color-primary, $lightness: 10%);
      }
    }
    &--danger {
      background: $color-error;
      color: white;

      &:hover {
        background: color.adjust($color-error, $lightness: 10%);
      }
    }
  }
}

.conditional-fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  .field-wrapper {
    .fade-in {
      animation: slideIn 0.3s ease;
    }
  }
}

.result {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: $color-background-alt;
  border-radius: $border-radius;
  border-left: 4px solid $color-success;

  h4 {
    margin-bottom: $spacing-md;
    color: $color-success;
  }
  pre {
    background: white;
    padding: $spacing-md;
    border-radius: $border-radius-sm;
    overflow-x: auto;
    font-size: $font-size-xs;
  }
}

.store-info {
  margin-top: $spacing-xl;
  padding: $spacing-lg;
  background: $color-primary-light;
  border-radius: $border-radius;

  h4 {
    margin-bottom: $spacing-md;
  }
  dl {
    margin-bottom: $spacing-lg;

    dt {
      font-weight: 600;
      margin-bottom: $spacing-xs;
    }
    dd {
      margin-bottom: $spacing-md;
      color: $color-text-secondary;
    }
  }

  .btn {
    padding: $spacing-md $spacing-lg;
    background: $color-primary;
    color: white;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background: color.adjust($color-primary, $lightness: 10%);
    }
  }
}

.history {
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: $color-background-alt;
  border-radius: $border-radius;

  h4 {
    margin-bottom: $spacing-md;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
  .history-item {
    padding: $spacing-md;
    background: white;
    border-radius: $border-radius-sm;

    .time {
      display: block;
      font-size: $font-size-xs;
      color: $color-text-secondary;
      margin-bottom: $spacing-sm;
    }

    pre {
      background: $color-background-alt;
      padding: $spacing-sm;
      border-radius: $border-radius-sm;
      overflow-x: auto;
      font-size: $font-size-xs;
    }
  }

  .no-history {
    color: $color-text-secondary;
    text-align: center;
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

@media (max-width: 768px) {
  .demo-container {
    padding: $spacing-lg;
  }
  .demo-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .dynamic-actions {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}
</style>
