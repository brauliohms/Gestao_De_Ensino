import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, test } from 'vitest'

import LoginView from '../../src/views/LoginView.vue'

let wrapper: VueWrapper
beforeEach(function () {
  wrapper = mount(LoginView)
})

test('meu primeiro teste', function () {
  // 1- Dado que .....
  function somar(a, b) {
    const total = a + b
    return total
  }
  // 2 - Quando ......
  const resultado = somar(2, 3)
  // 3- Então ......
  expect(resultado).toBe(5)
})

test('Deve verificar todos os campos do formulário', function () {
  const email = wrapper.find('#email')
  expect(email.exists()).toBeTruthy()
  expect(email.element.textContent).toBe('')
  expect(email.attributes('type')).toBe('email')
  expect(email.attributes('placeholder')).toBe('Digite seu e-mail')
  expect(wrapper.get('#password').isVisible()).toBeTruthy()
  expect(wrapper.get('#password').text()).toBe('')
  expect(wrapper.get('#password').attributes('placeholder')).toBe('Digite sua senha')
  const buttonSubmit = wrapper.find('#btn-submit')
  expect(buttonSubmit.exists()).toBeTruthy()
  expect(buttonSubmit.text()).toBe('Entrar')
  expect(buttonSubmit.attributes('type')).toBe('submit')
  // expect(wrapper.get('.span-teste').text()).toBe('false')
})

test('Deve verificar se o botão de visualizar senha esta correto', async function () {
  const buttonEye = wrapper.find('#btn-toggle-is-visible-password')
  expect(buttonEye.exists()).toBeTruthy()
  expect(buttonEye.attributes('type')).toBe('button')
  expect(wrapper.find('#icon-eye').exists()).toBeFalsy()
  expect(wrapper.find('#icon-eye-off').exists()).toBeTruthy()
  expect(wrapper.find('#password').attributes('type')).toBe('password')
  await buttonEye.trigger('click')
  expect(buttonEye.exists()).toBeTruthy()
  expect(buttonEye.attributes('type')).toBe('button')
  expect(wrapper.find('#icon-eye').exists()).toBeTruthy()
  expect(wrapper.find('#icon-eye-off').exists()).toBeFalsy()
  expect(wrapper.find('#password').attributes('type')).toBe('text')
})
