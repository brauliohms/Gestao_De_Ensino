/**
 * @license
 * Copyright 2024 Braulio Henrique Marques Souto <braulio@disroot.org>
 *
 * BSD-3-Clause License
 *
 * Copyright (c) 2024, Braulio Henrique Marques Souto <braulio@disroot.org>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Input Sanitization Utilities
 * Provides comprehensive input validation and sanitization functions
 */

export interface SanitizationOptions {
  maxLength?: number
  allowHtml?: boolean
  allowSpecialChars?: boolean
  trimWhitespace?: boolean
  toLowerCase?: boolean
  removeEmojis?: boolean
}

export interface ValidationResult {
  isValid: boolean
  sanitizedValue: string
  errors: string[]
}

export class Sanitizer {
  /**
   * Main sanitization function that applies multiple cleaning strategies
   */
  static sanitizeInput(input: unknown, options: SanitizationOptions = {}): ValidationResult {
    const {
      maxLength = 1000,
      allowHtml = false,
      allowSpecialChars = true,
      trimWhitespace = true,
      toLowerCase = false,
      removeEmojis = false,
    } = options

    const errors: string[] = []
    let sanitizedValue = String(input || '')

    // Basic type validation
    if (input === null || input === undefined) {
      return {
        isValid: false,
        sanitizedValue: '',
        errors: ['Input cannot be null or undefined'],
      }
    }

    // Trim whitespace if requested
    if (trimWhitespace) {
      sanitizedValue = sanitizedValue.trim()
    }

    // Check length constraints
    if (sanitizedValue.length > maxLength) {
      errors.push(`Input exceeds maximum length of ${maxLength} characters`)
      sanitizedValue = sanitizedValue.substring(0, maxLength)
    }

    // Convert to lowercase if requested
    if (toLowerCase) {
      sanitizedValue = sanitizedValue.toLowerCase()
    }

    // Remove HTML tags if not allowed
    if (!allowHtml) {
      sanitizedValue = Sanitizer.removeHtmlTags(sanitizedValue)
    }

    // Remove special characters if not allowed
    if (!allowSpecialChars) {
      sanitizedValue = Sanitizer.removeSpecialCharacters(sanitizedValue)
    }

    // Remove emojis if requested
    if (removeEmojis) {
      sanitizedValue = Sanitizer.removeEmojiCharacters(sanitizedValue)
    }

    // Final validation
    const isValid = errors.length === 0

    return {
      isValid,
      sanitizedValue,
      errors,
    }
  }

  /**
   * Removes HTML tags from input string
   */
  static removeHtmlTags(input: string): string {
    return input.replace(/<[^>]*>/g, '')
  }

  /**
   * Removes potentially dangerous special characters
   */
  static removeSpecialCharacters(input: string): string {
    // Keep alphanumeric, spaces, and common punctuation
    return input.replace(/[^a-zA-Z0-9\s\-_.,!?@#$%&*()+=]/g, '')
  }

  /**
   * Removes emoji characters
   */
  static removeEmojiCharacters(input: string): string {
    return input.replace(
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
      '',
    )
  }

  /**
   * Escapes HTML entities to prevent XSS attacks
   */
  static escapeHtml(input: string): string {
    const htmlEntities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
    }

    return input.replace(/[&<>"'/]/g, (match) => htmlEntities[match] || match)
  }

  /**
   * Validates and sanitizes email addresses
   */
  static sanitizeEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const sanitized = email.trim().toLowerCase()

    const isValid = emailRegex.test(sanitized)
    const errors = isValid ? [] : ['Invalid email format']

    return {
      isValid,
      sanitizedValue: sanitized,
      errors,
    }
  }

  /**
   * Validates and sanitizes phone numbers
   */
  static sanitizePhoneNumber(phone: string): ValidationResult {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '')

    // Check if it's a valid length (10-15 digits)
    const isValid = digitsOnly.length >= 10 && digitsOnly.length <= 15
    const errors = isValid ? [] : ['Invalid phone number format']

    return {
      isValid,
      sanitizedValue: digitsOnly,
      errors,
    }
  }

  /**
   * Validates and sanitizes URLs
   */
  static sanitizeUrl(url: string): ValidationResult {
    try {
      const sanitized = url.trim()
      const urlObj = new URL(sanitized)

      // Only allow http and https protocols
      const allowedProtocols = ['http:', 'https:']
      const isValid = allowedProtocols.includes(urlObj.protocol)

      const errors = isValid ? [] : ['Invalid URL or unsupported protocol']

      return {
        isValid,
        sanitizedValue: sanitized,
        errors,
      }
    } catch {
      return {
        isValid: false,
        sanitizedValue: url,
        errors: ['Invalid URL format'],
      }
    }
  }

  /**
   * Sanitizes numeric input
   */
  static sanitizeNumber(
    input: string | number,
    options: { min?: number; max?: number; allowDecimals?: boolean } = {},
  ): ValidationResult {
    const { min, max, allowDecimals = true } = options

    let numericValue: number

    if (typeof input === 'string') {
      numericValue = allowDecimals ? parseFloat(input) : parseInt(input, 10)
    } else {
      numericValue = input
    }

    const errors: string[] = []

    if (isNaN(numericValue)) {
      errors.push('Input is not a valid number')
      return {
        isValid: false,
        sanitizedValue: '0',
        errors,
      }
    }

    if (min !== undefined && numericValue < min) {
      errors.push(`Number must be at least ${min}`)
    }

    if (max !== undefined && numericValue > max) {
      errors.push(`Number must not exceed ${max}`)
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue: numericValue.toString(),
      errors,
    }
  }

  /**
   * Batch sanitization for multiple inputs
   */
  static sanitizeBatch(
    inputs: Record<string, unknown>,
    rules: Record<string, SanitizationOptions>,
  ): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {}

    for (const [key, value] of Object.entries(inputs)) {
      const options = rules[key] || {}
      results[key] = Sanitizer.sanitizeInput(value, options)
    }

    return results
  }
}
