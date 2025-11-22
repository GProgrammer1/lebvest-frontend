import { z } from 'zod';

export const goalFormSchema = z.object({
  title: z.string().min(3, 'Title should be at least 3 characters long'),
  description: z
    .string()
    .max(300, 'Description cannot exceed 300 characters')
    .optional()
    .or(z.literal('')),
  targetAmount: z.coerce
    .number()
    .positive('Target amount must be greater than zero'),
  currentAmount: z.coerce
    .number()
    .min(0, 'Current amount cannot be negative')
    .default(0),
  deadline: z
    .string()
    .min(1, 'Deadline is required')
    .refine(
      (date) => {
        const deadlineDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return deadlineDate >= today;
      },
      {
        message: 'Deadline must be today or in the future',
      }
    ),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

