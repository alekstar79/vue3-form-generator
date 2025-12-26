<template>
  <div class="demo-container">
    <h1>Сложная форма</h1>
    <p class="demo-description">
      Многошаговая форма с условной логикой и зависимыми полями.
    </p>

    <div class="demo-content">
      <div class="steps-indicator">
        <div
          v-for="(_, index) in steps"
          :key="index"
          :class="['step', { active: currentStep === index, completed: currentStep > index }]"
        >
          {{ index + 1 }}
        </div>
      </div>

      <FormGenerator
        v-if="currentStep === 0"
        key="step-1"
        :config="step1Config"
        :model-value="formValues"
        @update:model-value="formValues = $event"
        @submit="nextStep"
        cancel-label="Отмена"
        submit-label="Далее"
      />

      <FormGenerator
        v-else-if="currentStep === 1"
        key="step-2"
        :config="step2Config"
        :model-value="formValues"
        @update:model-value="formValues = $event"
        @submit="nextStep"
        @cancel="previousStep"
        cancel-label="Назад"
        submit-label="Далее"
      />

      <FormGenerator
        v-else-if="currentStep === 2"
        key="step-3"
        :config="step3Config"
        :model-value="formValues"
        @update:model-value="formValues = $event"
        @submit="submitForm"
        @cancel="previousStep"
        cancel-label="Назад"
        submit-label="Завершить"
      />

      <!-- Итоговая страница -->
      <div v-else class="summary">
        <div class="summary-header">
          <span class="success-icon">✓</span>
          <h2>Спасибо за регистрацию!</h2>
          <p>Ваши данные успешно сохранены</p>
        </div>

        <div class="summary-content">
          <h3>Ваши данные:</h3>
          <dl class="summary-list">
            <dt>Компания:</dt>
            <dd>{{ formValues.companyName }}</dd>

            <dt>Контактное лицо:</dt>
            <dd>{{ formValues.contactPerson }}</dd>

            <dt>Email:</dt>
            <dd>{{ formValues.companyEmail }}</dd>

            <dt>Телефон:</dt>
            <dd>{{ formValues.companyPhone }}</dd>

            <dt>Вид деятельности:</dt>
            <dd>{{ formValues.industry }}</dd>

            <dt>Сайт:</dt>
            <dd>{{ formValues.website || 'не указан' }}</dd>

            <dt>Количество сотрудников:</dt>
            <dd>{{ formValues.employees }}</dd>

            <dt>Бюджет:</dt>
            <dd>{{ formValues.budget }}</dd>
          </dl>

          <div class="action-buttons">
            <button class="btn btn--primary" @click="resetForm">
              Заполнить заново
            </button>

            <router-link to="/" class="btn btn--secondary">
              На главную
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormConfig, FormValues } from '@/types'
import { FormGenerator } from '@/components'

const currentStep = ref(0)
const formValues = ref<FormValues>({})

const steps = ['Информация о компании', 'Контактные данные', 'Подтверждение']

const step1Config: FormConfig = {
  id: 'step-1-form',
  title: 'Шаг 1: Информация о компании',
  fields: [
    {
      id: 'companyName',
      type: 'input',
      label: 'Название компании',
      required: true,
      minLength: 3
    },
    {
      id: 'industry',
      type: 'select',
      label: 'Вид деятельности',
      required: true,
      options: [
        { label: 'Выберите вид деятельности', value: '' },
        { label: 'ИТ и Программное обеспечение', value: 'it' },
        { label: 'Финансы и Банкинг', value: 'finance' },
        { label: 'Здравоохранение', value: 'healthcare' },
        { label: 'Торговля', value: 'retail' },
        { label: 'Прочее', value: 'other' }
      ],
    },
    {
      id: 'employees',
      type: 'select',
      label: 'Количество сотрудников',
      required: true,
      options: [
        { label: 'Выберите диапазон', value: '' },
        { label: '1-10', value: '1-10' },
        { label: '11-50', value: '11-50' },
        { label: '51-200', value: '51-200' },
        { label: '200+', value: '200+' }
      ]
    }
  ]
}

const step2Config: FormConfig = {
  id: 'step-2-form',
  title: 'Шаг 2: Контактные данные',
  fields: [
    {
      id: 'contactPerson',
      type: 'input',
      label: 'Контактное лицо',
      required: true,
      minLength: 2
    },
    {
      id: 'companyEmail',
      type: 'input',
      label: 'Email компании',
      required: true,
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      attributes: {
        type: 'email'
      }
    },
    {
      id: 'companyPhone',
      type: 'input',
      label: 'Телефон компании',
      required: true,
      placeholder: '+7 (999) 999-99-99',
      attributes: {
        type: 'tel'
      },
    },
    {
      id: 'website',
      type: 'input',
      label: 'Веб-сайт (опционально)',
      placeholder: 'https://example.com'
    }
  ]
}

const step3Config: FormConfig = {
  id: 'step-3-form',
  title: 'Шаг 3: Подтверждение',
  fields: [
    {
      id: 'budget',
      type: 'select',
      label: 'Примерный бюджет проекта',
      required: true,
      options: [
        { label: 'Выберите бюджет', value: '' },
        { label: 'До 50 000 руб.', value: '50k' },
        { label: '50 000 - 150 000 руб.', value: '50-150k' },
        { label: '150 000 - 500 000 руб.', value: '150-500k' },
        { label: 'Свыше 500 000 руб.', value: '500k+' }
      ]
    },
    {
      id: 'agree',
      type: 'checkbox',
      label: 'Я согласен с условиями обслуживания',
      required: true
    }
  ]
}

const nextStep = () => {
  currentStep.value++
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const submitForm = () => {
  currentStep.value = 3
  console.log('Форма отправлена:', formValues.value)
}

const resetForm = () => {
  currentStep.value = 0
  formValues.value = {}
}
</script>

<style scoped lang="scss">
@use "sass:color";
@use '@/styles/variables' as *;

.demo-container {
  max-width: 700px;
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

.steps-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-xl;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: $color-border;
    z-index: 0;
  }

  .step {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $color-background;
    border: 2px solid $color-border;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: $color-text-secondary;
    position: relative;
    z-index: 1;
    transition: all $transition-duration ease;

    &.active {
      background: $color-primary;
      border-color: $color-primary;
      color: white;
      box-shadow: 0 0 0 4px rgba($color-primary, 0.2);
    }
    &.completed {
      background: $color-success;
      border-color: $color-success;
      color: white;
    }
  }
}

.summary {
  padding: $spacing-lg 0;

  .summary-header {
    text-align: center;
    margin-bottom: $spacing-xl;

    .success-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba($color-success, 0.1);
      color: $color-success;
      font-size: 2rem;
      margin-bottom: $spacing-md;
    }

    h2 {
      margin-bottom: $spacing-sm;
      color: $color-success;
    }
    p {
      color: $color-text-secondary;
    }
  }

  .summary-content {
    h3 {
      margin-bottom: $spacing-md;
    }
  }

  .summary-list {
    margin-bottom: $spacing-xl;
    padding: $spacing-lg;
    background: $color-background-alt;
    border-radius: $border-radius;

    dt {
      font-weight: 600;
      color: $color-text-primary;
      margin-bottom: $spacing-xs;
    }
    dd {
      margin-bottom: $spacing-md;
      color: $color-text-secondary;
      padding-bottom: $spacing-md;
      border-bottom: 1px solid $color-border;

      &:last-child {
        margin-bottom: 0;
        border-bottom: none;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: $spacing-md;

    .btn {
      flex: 1;
      padding: $spacing-md;
      border: none;
      border-radius: $border-radius;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all $transition-duration ease;
      text-align: center;

      &--primary {
        background: $color-primary;
        color: white;

        &:hover {
          background: color.adjust($color-primary, $lightness: 10%);
          transform: translateY(-2px);
        }
      }
      &--secondary {
        background: $color-background-alt;
        color: $color-text-primary;
        border: 2px solid $color-border;

        &:hover {
          border-color: $color-primary;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .demo-container {
    padding: $spacing-lg;
  }
  .summary-list {
    padding: $spacing-md !important;
  }
  .action-buttons {
    flex-direction: column;
  }
}
</style>
