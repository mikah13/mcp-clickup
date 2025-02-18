import z from 'zod';
import { ClickUpTaskSchema, ClickUpUserSchema } from './schema';
export type ClickUpUser = z.infer<typeof ClickUpUserSchema>;
export type ClickUpTask = z.infer<typeof ClickUpTaskSchema>;
