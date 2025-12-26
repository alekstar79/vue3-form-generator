import type { FormField, FormValues, FormErrors } from '@/types'

export function useValidation() {

  /**
   * Валидирует одно поле формы
   */
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required) {
      const isEmpty = value === undefined || value === null || value === '' ||
        (field.type === 'checkbox' && value === false) ||
        (Array.isArray(value) && value.length === 0)

      if (isEmpty) {
        return `${field.label} - обязательное поле`
      }
    }

    if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
      return `${field.label} - минимум ${field.minLength} символов`
    }
    if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
      return `${field.label} - максимум ${field.maxLength} символов`
    }
    if (field.pattern && typeof value === 'string' && value) {
      const regex = new RegExp(field.pattern)

      if (!regex.test(value)) {
        return field.errorMessage || `${field.label} - некорректный формат`
      }
    }

    return null
  }

  /**
   * Валидирует всю форму
   */
  const validateForm = <
    K extends FormField,
    V extends FormValues,
    E extends FormErrors
  >(fields: K[], values: V): E => {
    const errors: E = {}

    for (const field of fields) {
      const value = values[field.id]
      const error = validateField(field, value)

      if (error) {
        errors[field.id] = error
      }
    }

    return errors
  }

  /**
   * Очистка формы
   */
  const getInitialFormValues = <
    K extends FormField,
    V extends FormValues
  >(fields: K[]): V => {
    const values: V = {}

    for (const field of fields) {
      if (field.defaultValue !== undefined) {
        values[field.id] = field.defaultValue
      } else if (field.type === 'checkbox') {
        values[field.id] = false
      } else if (field.type === 'select' && field.options?.length) {
        values[field.id] = field.options[0].value
      } else {
        values[field.id] = ''
      }
    }

    return values
  }

  /**
   * Нормализует значение поля перед сохранением
   */
  const normalizeFieldValue = (fieldType: string, value: any): any => {
    if (value === null || value === undefined) {
      return fieldType === 'checkbox' ? false : ''
    }

    switch (fieldType) {
      case 'checkbox':
        return Boolean(value)
      case 'input':
      case 'textarea':
        return String(value).trim()
      case 'select':
        return value || ''
      default:
        return value || ''
    }
  }

  /**
   * Валидирует email
   */
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * Валидирует телефонный номер (базовая проверка)
   */
  const isValidPhone = (phone: string): boolean => {
    return /^[+\d\s\-()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  /**
   * Проверка на ошибки валидации
   */
  const hasErrors = (errors: FormErrors): boolean => {
    return Object.keys(errors).length > 0
  }

  return {
    validateField,
    validateForm,
    getInitialFormValues,
    normalizeFieldValue,
    isValidEmail,
    isValidPhone,
    hasErrors
  }
}
