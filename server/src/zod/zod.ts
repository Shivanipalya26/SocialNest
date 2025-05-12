import z from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, { message: 'Name must be atleast 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(5, { message: 'Password must be atleast 5 characters long' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'invalid email address' }),
  password: z.string().min(5, { message: 'Password must be atleast 5 characters long' }),
});

export const createPostSchema = z.object({
  images: z
    .array(
      z.object({
        url: z.string().url({ message: 'Invalid URL' }),
        size: z.number().max(5 * 1024 * 1024, { message: 'Image size must be less than 5MB' }),
      })
    )
    .max(5, { message: 'You can upload a maximum of 5 images' }),
  video: z
    .object({
      url: z.string().url({ message: 'Invalid URL' }),
      size: z.number().max(500 * 1024 * 1024, { message: 'Video size must be less than 500MB' }),
    })
    .optional(),
});
