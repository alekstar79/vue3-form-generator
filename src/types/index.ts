/**
 * Типы полей, поддерживаемые генератором форм
 */
export type FieldType = 'input' | 'select' | 'checkbox' | 'textarea';

/**
 * Опции для поля типа select
 */
export interface SelectOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

/**
 * Конфигурация отдельного поля формы
 */
export interface FormField {
  /** Уникальный идентификатор поля */
  id: string;
  /** Тип поля */
  type: FieldType;
  /** Отображаемый label */
  label: string;
  /** Плейсхолдер (для input/textarea) */
  placeholder?: string;
  /** Требуется ли заполнение поля */
  required?: boolean;
  /** Валидация (regex паттерн) */
  pattern?: string;
  /** Сообщение об ошибке валидации */
  errorMessage?: string;
  /** Опции для select */
  options?: SelectOption[];
  /** Дополнительные HTML атрибуты */
  attributes?: Record<string, string | number | boolean>;
  /** Классы CSS для поля */
  className?: string;
  /** Значение по умолчанию */
  defaultValue?: string | number | boolean | string[];
  /** Отключено ли поле */
  disabled?: boolean;
  /** Подсказка (hint) */
  hint?: string;
  /** Максимальная длина (для input/textarea) */
  maxLength?: number;
  /** Минимальная длина (для input/textarea) */
  minLength?: number;
  /** Для checkbox - значение при выборе */
  checkboxValue?: string | number;
  /** Условие */
  condition?: (formValues: Record<string, any>) => boolean
}

/**
 * Конфигурация всей формы
 */
export interface FormConfig {
  /** Уникальный ID формы */
  id: string;
  /** Название формы */
  title?: string;
  /** Описание формы */
  description?: string;
  /** Массив полей формы */
  fields: FormField[];
  /** Текст кнопки сохранения */
  submitLabel?: string;
  /** Текст кнопки отмены */
  cancelLabel?: string;
  /** Классы контейнера формы */
  containerClass?: string;
}

/**
 * Значения полей формы
 */
export interface FormValues {
  [fieldId: string]: string | number | boolean | string[];
}

/**
 * Ошибки валидации
 */
export interface FormErrors {
  [fieldId: string]: string;
}

/**
 * Состояние отдельного поля
 */
export interface FieldState {
  value: string | number | boolean | string[];
  error?: string;
  touched?: boolean;
  dirty?: boolean;
}

/**
 * Состояние всей формы
 */
export interface FormState {
  values: FormValues;
  errors: FormErrors;
  touched: Set<string>;
  dirty: Set<string>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * События формы
 */
export interface FormEvents {
  submit: (values: FormValues) => void;
  cancel: () => void;
  change: (fieldId: string, value: any) => void;
  blur: (fieldId: string) => void;
  focus: (fieldId: string) => void;
}
