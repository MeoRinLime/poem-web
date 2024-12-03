import Component from '@/components/Hanjian.vue'
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

test('HelloWorld', async () => {
  expect(Component).toBeTruthy()

  const wrapper = mount(Component, {
    props: {
      msg: 'Hello World',
    },
  })
  expect(wrapper.text()).toContain('Hello World')
})
