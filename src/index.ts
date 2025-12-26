import FormGenerator from '@/components/FormGenerator.vue'
import FormField from '@/components/FormField.vue'
import type {
  FormConfig,
  FormField as FormFieldType,
  FormValues,
  FormErrors,
  FieldType,
  SelectOption,
  FormState,
  FormEvents
} from '@/types'

export {
  FormGenerator,
  FormField,
  type FormConfig,
  type FormFieldType,
  type FormValues,
  type FormErrors,
  type FieldType,
  type SelectOption,
  type FormState,
  type FormEvents
}

export default {
  install: (app: any) => {
    app.component('FormGenerator', FormGenerator)
    app.component('FormField', FormField)
  }
}
