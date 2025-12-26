import { useValidation } from '@/composable/useValidation'
import { describe, it, expect } from 'vitest'

const { validateField, normalizeFieldValue } = useValidation()

describe('formValidation', () => {
  it('validates required fields', () => {
    const field = { id: 'name', required: true }
    expect(validateField(field, '')).toBe('undefined - обязательное поле')
    expect(validateField(field, 'test')).toBeNull()
  })

  it('validates email pattern', () => {
    const emailField = {
      id: 'email',
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
    }
    expect(validateField(emailField, 'test@example.com')).toBeNull()
    expect(validateField(emailField, 'invalid')).toBe('undefined - некорректный формат')
  })

  it('validates custom patterns', () => {
    const field = { pattern: '^\\d+$' }
    expect(validateField(field, '123')).toBeNull()
    expect(validateField(field, 'abc')).toBe('undefined - некорректный формат')
  })

  it('handles edge cases', () => {
    expect(validateField({} as any, null)).toBeNull()
    expect(validateField({ required: true, label: 'Test' } as any, null)).toContain('обязательное')
    expect(validateField({ label: 'Test', pattern: '^\\d+$' } as any, '123')).toBeNull()
  })

  it('covers normalizeFieldValue edge cases', () => {
    expect(normalizeFieldValue('checkbox', false)).toBe(false)
    expect(normalizeFieldValue('input', '  test  ')).toBe('test')
    expect(normalizeFieldValue('select', null)).toBe('')
  })

  it('checkbox normalizes correctly in FormGenerator', () => {
    const field = {
      type: 'checkbox',
      required: true,
      label: 'Test Checkbox'
    } as any

    expect(normalizeFieldValue('checkbox', undefined)).toBe(false)
    expect(validateField(field, false)).toBe('Test Checkbox - обязательное поле')
  })
})
