import { Sanitizer } from '@/core/common/utils/Sanitizer'
import { describe, expect, it } from 'vitest'

describe('Input Sanitization', () => {
  describe('sanitizeInput', () => {
    it('should handle basic string sanitization', () => {
      const result = Sanitizer.sanitizeInput('  Hello World  ', { trimWhitespace: true })
      expect(result.isValid).toBe(true)
      expect(result.sanitizedValue).toBe('Hello World')
      expect(result.errors).toHaveLength(0)
    })

    it('should enforce maximum length', () => {
      const longString = 'a'.repeat(100)
      const result = Sanitizer.sanitizeInput(longString, { maxLength: 50 })
      expect(result.sanitizedValue).toHaveLength(50)
      expect(result.errors).toContain('Input exceeds maximum length of 50 characters')
    })

    it('should remove HTML tags when not allowed', () => {
      const htmlInput = '<script>alert("xss")</script>Hello'
      const result = Sanitizer.sanitizeInput(htmlInput, { allowHtml: false })
      expect(result.sanitizedValue).toBe('alert("xss")Hello')
    })

    it('should convert to lowercase when requested', () => {
      const result = Sanitizer.sanitizeInput('HELLO WORLD', { toLowerCase: true })
      expect(result.sanitizedValue).toBe('hello world')
    })

    it('should handle null and undefined inputs', () => {
      const nullResult = Sanitizer.sanitizeInput(null)
      expect(nullResult.isValid).toBe(false)
      expect(nullResult.errors).toContain('Input cannot be null or undefined')

      const undefinedResult = Sanitizer.sanitizeInput(undefined)
      expect(undefinedResult.isValid).toBe(false)
      expect(undefinedResult.errors).toContain('Input cannot be null or undefined')
    })
  })

  describe('removeHtmlTags', () => {
    it('should remove all HTML tags', () => {
      const html = '<div class="test">Hello <span>World</span></div>'
      const result = Sanitizer.removeHtmlTags(html)
      expect(result).toBe('Hello World')
    })

    it('should handle self-closing tags', () => {
      const html = 'Hello <br/> World <img src="test.jpg"/>'
      const result = Sanitizer.removeHtmlTags(html)
      expect(result).toBe('Hello  World ')
    })
  })

  describe('escapeHtml', () => {
    it('should escape dangerous HTML characters', () => {
      const dangerous = '<script>alert("xss")</script>'
      const result = Sanitizer.escapeHtml(dangerous)
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;')
    })

    it('should escape ampersands', () => {
      const result = Sanitizer.escapeHtml('Tom & Jerry')
      expect(result).toBe('Tom &amp; Jerry')
    })
  })

  describe('sanitizeEmail', () => {
    it('should validate correct email addresses', () => {
      const result = Sanitizer.sanitizeEmail('  TEST@EXAMPLE.COM  ')
      expect(result.isValid).toBe(true)
      expect(result.sanitizedValue).toBe('test@example.com')
      expect(result.errors).toHaveLength(0)
    })

    it('should reject invalid email addresses', () => {
      const result = Sanitizer.sanitizeEmail('invalid-email')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
    })
  })

  describe('sanitizePhoneNumber', () => {
    it('should clean and validate phone numbers', () => {
      const result = Sanitizer.sanitizePhoneNumber('(555) 123-4567')
      expect(result.isValid).toBe(true)
      expect(result.sanitizedValue).toBe('5551234567')
    })

    it('should reject invalid phone numbers', () => {
      const result = Sanitizer.sanitizePhoneNumber('123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid phone number format')
    })
  })

  describe('sanitizeUrl', () => {
    it('should validate HTTPS URLs', () => {
      const result = Sanitizer.sanitizeUrl('https://example.com')
      expect(result.isValid).toBe(true)
      expect(result.sanitizedValue).toBe('https://example.com')
    })

    it('should reject invalid protocols', () => {
      const result = Sanitizer.sanitizeUrl('javascript:alert("xss")')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid URL or unsupported protocol')
    })

    it('should reject malformed URLs', () => {
      const result = Sanitizer.sanitizeUrl('not-a-url')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid URL format')
    })
  })

  describe('sanitizeNumber', () => {
    it('should validate and convert numeric strings', () => {
      const result = Sanitizer.sanitizeNumber('42.5')
      expect(result.isValid).toBe(true)
      expect(result.sanitizedValue).toBe('42.5')
    })

    it('should enforce minimum and maximum values', () => {
      const result = Sanitizer.sanitizeNumber('5', { min: 10, max: 100 })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Number must be at least 10')
    })

    it('should handle integer-only validation', () => {
      const result = Sanitizer.sanitizeNumber('42.5', { allowDecimals: false })
      expect(result.sanitizedValue).toBe('42')
    })

    it('should reject non-numeric input', () => {
      const result = Sanitizer.sanitizeNumber('not-a-number')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Input is not a valid number')
    })
  })

  describe('sanitizeBatch', () => {
    it('should sanitize multiple inputs with different rules', () => {
      const inputs = {
        name: '  John Doe  ',
        email: 'JOHN@EXAMPLE.COM',
        age: '25',
      }

      const rules = {
        name: { trimWhitespace: true, maxLength: 50 },
        email: { toLowerCase: true, trimWhitespace: true },
        age: { maxLength: 3 },
      }

      const results = Sanitizer.sanitizeBatch(inputs, rules)

      expect(results.name.sanitizedValue).toBe('John Doe')
      expect(results.email.sanitizedValue).toBe('john@example.com')
      expect(results.age.sanitizedValue).toBe('25')
      expect(Object.values(results).every((r) => r.isValid)).toBe(true)
    })
  })
})
