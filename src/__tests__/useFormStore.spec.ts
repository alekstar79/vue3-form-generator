import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFormStore } from '@/store/useFormStore'

describe('useFormStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('manages form state', () => {
    const store = useFormStore()

    const config = {
      id: 'testForm',
      fields: [{ id: 'email', required: true, label: 'Email' }]
    }
    store.initializeForm(config)

    expect(store.forms.get('testForm')).toBeDefined()

    store.setFieldValue('testForm', 'email', 'test@example.com')
    expect(store.getFieldValue('testForm', 'email')).toBe('test@example.com')

    store.resetForm('testForm')
    expect(store.getFormValues('testForm')).toEqual({ email: '' })
  })

  it('handles form lifecycle', () => {
    const store = useFormStore()
    const config = { id: 'form1', fields: [] }

    store.initializeForm(config)
    expect(store.formCount).toBe(1)

    store.removeForm('form1')
    expect(store.formCount).toBe(0)

    expect(store.allFormIds).toEqual([])
  })

  it('covers store actions', () => {
    const store = useFormStore()

    store.initializeForm({ id: 'testForm', fields: [{ id: 'email' }] })
    store.setFieldValue('testForm', 'email', 'test@example.com')
    store.clearFieldErrors('testForm')
    expect(store.getFormErrors('testForm')).toEqual({})
  })
})
