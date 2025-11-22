import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalFormSchema, GoalFormValues } from './schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export interface GoalFormProps {
  onSubmit: (values: GoalFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const GoalForm = ({ onSubmit, isSubmitting = false }: GoalFormProps) => {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: '',
      description: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
    },
  });

  const handleSubmit = useCallback(
    async (values: GoalFormValues) => {
      const payload: GoalFormValues = {
        ...values,
        description: values.description?.trim() || undefined,
      };
      await onSubmit(payload);
      form.reset({
        title: '',
        description: '',
        targetAmount: 0, // Reset to 0, validation will prevent submission if not changed
        currentAmount: 0,
        deadline: '',
      });
    },
    [form, onSubmit]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new goal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Build a diversified portfolio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you are trying to achieve with this goal."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target amount (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step="any"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Remove leading zeros and convert to number
                          const numValue = value === '' ? 0 : Number(value);
                          field.onChange(isNaN(numValue) ? 0 : numValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current amount (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Remove leading zeros and convert to number
                          const numValue = value === '' ? 0 : Number(value);
                          field.onChange(isNaN(numValue) ? 0 : numValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add goal'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GoalForm;

