import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'The username must be at least 3 characters long.').max(50),
  password: z.string().min(6, 'The password must be at least 6 characters long.'),
});

export const loginSchema = z.object({
  login: z.string().min(1).optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(6, 'Invalid password'),
}).refine((data) => data.login || data.email || data.username, {
  message: 'Email or username is required.',
});

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const createCommentSchema = z.object({
  comment: z.string().min(1, 'Comment is required'),
  parentId: z.number().optional(),
});

export const createFolderSchema = z.object({
  title: z.string().min(1, 'Folder title is required').max(255),
  description: z.string().max(500).optional(),
  is_private: z.string().optional(),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  name: z.string().min(3).max(150).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: 'At least one field must be provided' },
);

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = { ...req.body, ...req.query, ...req.params };
      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
        return res.status(422).json({ error: 'Invalid data', details: messages });
      }
      return res.status(422).json({ error: 'Validation error' });
    }
  };
};