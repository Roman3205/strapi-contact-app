import * as z from 'zod'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const digits = (value: string) => value.replace(/\D/g, '')

export const LoginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'At least 8 characters')
})

export const SignUpSchema = z.object({
  username: z.string('Username is required').min(2, 'At least 2 characters').max(64, 'At most 64 characters'),
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'At least 8 characters').regex(/\d/, 'At least 1 number').regex(/[a-z]/, 'At least 1 lowercase letter').regex(/[A-Z]/, 'At least 1 uppercase letter')
})

export const ContactActionSchema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
  phone: z.object({
    mask: z.string(),
    phoneNumber: z.string().min(1, 'Phone is required')
  })
    .refine(
      ({ phoneNumber, mask }) =>
        digits(phoneNumber).length === (mask.match(/#/g) ?? []).length,
      {
        message: 'Invalid phone number length'
      }
    ),
  image: z
    .instanceof(File, {
      message: 'Please select an image file.'
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than 2MB.`
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Please upload a valid image file (JPEG, PNG, or WebP).'
    }),
  email: z.email('Invalid email')
})
