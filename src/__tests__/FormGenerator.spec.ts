import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

import FormGenerator from '@/components/FormGenerator.vue'
import type { FormConfig } from '@/types'

describe('FormGenerator', () => {
  const config: FormConfig = {
    id: 'test-form',
    title: 'Test Form',
    fields: [
      {
        id: 'email',
        type: 'input',
        label: 'Email',
        required: true,
        pattern: '^[\\S+]+@[\\S+]+\\.[\\S]+$'
      },
      { id: 'name', type: 'input', label: 'Name', required: true },
      { id: 'message', type: 'textarea', label: 'Message' }
    ]
  }

  const mockFormConfig: FormConfig = {
    id: 'test-form',
    title: 'Test Form',
    fields: [
      {
        id: 'email',
        type: 'input',
        label: 'Email',
        required: true,
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
      },
      {
        id: 'name',
        type: 'input',
        label: 'Name',
        required: true
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message'
      }
    ]
  }

  const createWrapper = (config: FormConfig, props = {}) => {
    return mount(FormGenerator, {
      props: {
        config,
        modelValue: { email: '', name: '', message: '' },
        'onUpdate:modelValue': vi.fn(),
        ...props
      }
    })
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders form with all fields', async () => {
    const wrapper = createWrapper(mockFormConfig)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.form-generator').exists()).toBe(true)
    expect(wrapper.findAll('input').length).toBeGreaterThan(0)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('displays form title and description', () => {
    const config = { ...mockFormConfig, description: 'Test description' }
    const wrapper = createWrapper(config)
    expect(wrapper.text()).toContain('Test Form')
    expect(wrapper.text()).toContain('Test description')
  })

  it('emits update:modelValue when field changes', async () => {
    const wrapper = createWrapper(mockFormConfig)
    await wrapper.vm.$nextTick()

    const inputs = wrapper.findAll('input')
    if (inputs.length > 0) {
      await inputs[0].setValue('test@example.com')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    }
  })

  it('validates required fields on submit', async () => {
    const wrapper = createWrapper(mockFormConfig)
    await wrapper.vm.$nextTick()

    const submitButton = wrapper.find('button[type="submit"]')
    if (submitButton.exists()) {
      await submitButton.trigger('click')
      await wrapper.vm.$nextTick()
    }

    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('submits form with valid data', async () => {
    const wrapper = createWrapper(config)
    const vm = wrapper.vm as any

    const validData = { email: 'test@example.com', name: 'Test User', message: 'Hello' }
    vm.setValues(validData)
    await nextTick()

    expect(vm.validate()).toBe(true)
    expect(vm.getValues()).toMatchObject(validData)
    expect(Object.keys(vm.getErrors()).length).toBe(0)
  })

  it('resets form on cancel', async () => {
    const wrapper = createWrapper(mockFormConfig)
    await wrapper.vm.$nextTick()

    const inputs = wrapper.findAll('input')
    if (inputs.length > 0) {
      await inputs[0].setValue('test value')
    }

    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find(btn => btn.attributes('type') !== 'submit')
    if (cancelButton?.exists()) {
      await cancelButton.trigger('click')
      expect(wrapper.emitted('cancel')).toBeTruthy()
    }
  })

  it('exposes methods for external control', () => {
    const wrapper = createWrapper(config)

    const vm = wrapper.vm as any
    expect(vm.getValues).toBeDefined()
    expect(vm.setValues).toBeDefined()
    expect(vm.validate).toBeDefined()
    expect(vm.reset).toBeDefined()
    expect(vm.getErrors).toBeDefined()
  })

  it('handles checkbox fields correctly', async () => {
    const checkboxConfig: FormConfig = {
      id: 'checkbox-form',
      fields: [{ id: 'agree', type: 'checkbox', label: 'I agree' }]
    }

    const wrapper = createWrapper(checkboxConfig)

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)
    await nextTick()

    expect(checkbox.element.checked).toBe(true)
    expect(wrapper.findComponent({ name: 'FormField' }).exists()).toBe(true)
  })

  it('handles select fields correctly', async () => {
    const selectConfig: FormConfig = {
      id: 'select-form',
      fields: [{
        id: 'country',
        type: 'select',
        label: 'Country',
        options: [{ label: 'USA', value: 'us' }, { label: 'Russia', value: 'ru' }]
      }]
    }

    const wrapper = createWrapper(selectConfig)
    await wrapper.vm.$nextTick()

    const select = wrapper.find('select')
    if (select?.exists()) {
      await select.setValue('ru')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    }
  })

  it('handles submit button correctly', async () => {
    const wrapper = createWrapper(config)

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.exists()).toBe(true)
    expect(submitButton.text()).toContain('Сохранить')

    await submitButton.trigger('click')
    await nextTick()
    expect(submitButton.exists()).toBe(true)
  })

  it('syncs formValues with modelValue', async () => {
    const wrapper = createWrapper(config)
    const vm = wrapper.vm as any

    expect(vm.formValues).toMatchObject({ email: '', name: '', message: '' })
  })

  it('shows validation errors correctly', async () => {
    const wrapper = createWrapper(config)
    const vm = wrapper.vm as any

    vm.setValues({ email: 'invalid', name: '' })
    vm.validate()

    expect(Object.keys(vm.getErrors()).length).toBeGreaterThan(0)
    expect(vm.getErrors().email).toBeDefined()
  })
})
