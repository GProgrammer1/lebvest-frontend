import { useCallback, useMemo, useState } from 'react';
import { goalsApi, CreateGoalPayload, UpdateGoalPayload } from '@/api/goals.api';
import { Goal } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

export interface UseGoalsResult {
  goals: Goal[];
  isCreating: boolean;
  updatingGoalId: string | null;
  deletingGoalId: string | null;
  error: string | null;
  createGoal: (payload: CreateGoalPayload) => Promise<Goal>;
  updateGoal: (goalId: string, payload: UpdateGoalPayload) => Promise<Goal>;
  deleteGoal: (goalId: string) => Promise<void>;
  replaceGoals: (nextGoals: Goal[]) => void;
}

export const useGoals = (initialGoals: Goal[] = []): UseGoalsResult => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingGoalId, setUpdatingGoalId] = useState<string | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleError = useCallback(
    (action: string, err: unknown) => {
      console.error(action, err);
      
      // Extract error message from axios error response
      let message = 'An unexpected error occurred. Please try again.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { 
          response?: { 
            data?: any; 
            status?: number;
          };
        };
        
        const responseData = axiosError.response?.data;
        
        // Log full error data for debugging
        console.error('Backend error data:', JSON.stringify(responseData, null, 2));
        
        // Spring Boot validation errors can come in various formats
        if (responseData) {
          // Format 1: errors array with field and defaultMessage (Spring Boot @Valid)
          if (Array.isArray(responseData.errors)) {
            const validationMessages = responseData.errors
              .map((e: any) => {
                const field = e.field || e.propertyPath || '';
                const msg = e.defaultMessage || e.message || 'Invalid value';
                return field ? `${field}: ${msg}` : msg;
              })
              .join(', ');
            message = validationMessages || 'Validation failed';
          }
          // Format 2: Single message string
          else if (typeof responseData.message === 'string') {
            message = responseData.message;
          }
          // Format 3: Error object with message
          else if (responseData.error && typeof responseData.error === 'string') {
            message = responseData.error;
          }
          // Format 4: Nested error object
          else if (responseData.error && typeof responseData.error === 'object') {
            message = responseData.error.message || responseData.error.error || 'Validation failed';
          }
          // Format 5: Try to stringify the whole response if it's an object
          else if (typeof responseData === 'object') {
            const errorStr = JSON.stringify(responseData);
            if (errorStr !== '{}') {
              message = `Backend error: ${errorStr}`;
            }
          }
        }
        
        // Fallback to status-based messages
        if (message === 'An unexpected error occurred. Please try again.') {
          if (axiosError.response?.status === 400) {
            message = 'Invalid request. Please check your input and try again.';
          } else if (axiosError.response?.status === 403) {
            message = 'You do not have permission to perform this action.';
          } else if (axiosError.response?.status === 401) {
            message = 'Please sign in to continue.';
          }
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
      toast({
        variant: 'destructive',
        title: action,
        description: message,
      });
    },
    [toast]
  );

  const createGoal = useCallback(
    async (payload: CreateGoalPayload) => {
      setIsCreating(true);
      setError(null);
      try {
        const createdGoal = await goalsApi.createGoal(payload);
        setGoals((prev) => [...prev, createdGoal]);
        toast({
          title: 'Goal created',
          description: `"${createdGoal.title}" has been added to your investment goals.`,
        });
        return createdGoal;
      } catch (err) {
        handleError('Unable to create goal', err);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [handleError, toast]
  );

  const updateGoal = useCallback(
    async (goalId: string, payload: UpdateGoalPayload) => {
      setUpdatingGoalId(goalId);
      setError(null);
      try {
        const updatedGoal = await goalsApi.updateGoal(goalId, payload);
        setGoals((prev) =>
          prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
        );
        toast({
          title: 'Goal updated',
          description: `"${updatedGoal.title}" has been updated successfully.`,
        });
        return updatedGoal;
      } catch (err) {
        handleError('Unable to update goal', err);
        throw err;
      } finally {
        setUpdatingGoalId(null);
      }
    },
    [handleError, toast]
  );

  const deleteGoal = useCallback(
    async (goalId: string) => {
      setDeletingGoalId(goalId);
      setError(null);
      try {
        await goalsApi.deleteGoal(goalId);
        setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
        toast({
          title: 'Goal deleted',
          description: 'The investment goal has been removed.',
        });
      } catch (err) {
        handleError('Unable to delete goal', err);
        throw err;
      } finally {
        setDeletingGoalId(null);
      }
    },
    [handleError, toast]
  );

  const replaceGoals = useCallback((nextGoals: Goal[]) => {
    setGoals(nextGoals);
  }, []);

  return useMemo(
    () => ({
      goals,
      isCreating,
      updatingGoalId,
      deletingGoalId,
      error,
      createGoal,
      updateGoal,
      deleteGoal,
      replaceGoals,
    }),
    [
      goals,
      isCreating,
      updatingGoalId,
      deletingGoalId,
      error,
      createGoal,
      updateGoal,
      deleteGoal,
      replaceGoals,
    ]
  );
};

