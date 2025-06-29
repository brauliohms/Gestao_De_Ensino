import {
  Sanitizer,
  type SanitizationOptions,
  type ValidationResult,
} from '@/core/common/utils/Sanitizer'
import { computed, ref } from 'vue'

/**
 * Vue composable for input sanitization
 */
export function useSanitizer() {
  const validationResults = ref<Record<string, ValidationResult>>({})

  const sanitize = (
    key: string,
    input: unknown,
    options?: SanitizationOptions,
  ): ValidationResult => {
    const result = Sanitizer.sanitizeInput(input, options)
    validationResults.value[key] = result
    return result
  }

  const sanitizeEmailField = (key: string, email: string): ValidationResult => {
    const result = Sanitizer.sanitizeEmail(email)
    validationResults.value[key] = result
    return result
  }

  const sanitizePhoneField = (key: string, phone: string): ValidationResult => {
    const result = Sanitizer.sanitizePhoneNumber(phone)
    validationResults.value[key] = result
    return result
  }

  const sanitizeUrlField = (key: string, url: string): ValidationResult => {
    const result = Sanitizer.sanitizeUrl(url)
    validationResults.value[key] = result
    return result
  }

  const sanitizeNumberField = (
    key: string,
    input: string | number,
    options?: { min?: number; max?: number; allowDecimals?: boolean },
  ): ValidationResult => {
    const result = Sanitizer.sanitizeNumber(input, options)
    validationResults.value[key] = result
    return result
  }

  const sanitizeForm = (
    inputs: Record<string, unknown>,
    rules: Record<string, SanitizationOptions>,
  ): Record<string, ValidationResult> => {
    const results = Sanitizer.sanitizeBatch(inputs, rules)
    validationResults.value = { ...validationResults.value, ...results }
    return results
  }

  const isFormValid = computed(() => {
    return Object.values(validationResults.value).every((result) => result.isValid)
  })

  const getErrors = (key: string): string[] => {
    return validationResults.value[key]?.errors || []
  }

  const clearValidation = (key?: string) => {
    if (key) {
      delete validationResults.value[key]
    } else {
      validationResults.value = {}
    }
  }

  return {
    validationResults: computed(() => validationResults.value),
    sanitize,
    sanitizeEmailField,
    sanitizePhoneField,
    sanitizeUrlField,
    sanitizeNumberField,
    sanitizeForm,
    isFormValid,
    getErrors,
    clearValidation,
  }
}
