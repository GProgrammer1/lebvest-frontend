import { useMemo, useState } from 'react';
import { Goal } from '@/lib/types';
import { GoalFormValues } from './schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GoalEditDialog from './GoalEditDialog';
import GoalDeleteDialog from './GoalDeleteDialog';

export interface GoalListProps {
  goals: Goal[];
  onEdit: (goalId: string, values: GoalFormValues) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  updatingGoalId?: string | null;
  deletingGoalId?: string | null;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const GoalList = ({
  goals,
  onEdit,
  onDelete,
  updatingGoalId = null,
  deletingGoalId = null,
}: GoalListProps) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const sortedGoals = useMemo(
    () =>
      [...goals].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      ),
    [goals]
  );

  const handleEdit = async (goalId: string, values: GoalFormValues) => {
    await onEdit(goalId, values);
  };

  const handleDelete = async () => {
    if (!goalToDelete) return;
    await onDelete(goalToDelete.id);
    setIsDeleteOpen(false);
  };

  if (!goals.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">You have not created any investment goals yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedGoals.map((goal, index) => {
          const rawProgress =
            goal.targetAmount > 0
              ? (goal.currentAmount / goal.targetAmount) * 100
              : 0;
          const progress = Math.min(Math.max(rawProgress, 0), 100);
          const isUpdating = updatingGoalId === goal.id;
          const isDeleting = deletingGoalId === goal.id;

          return (
            <Card key={goal.id || index} className="flex flex-col">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center justify-between">
                  <span>{goal.title}</span>
                  {goal.description && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {goal.description.slice(0, 30)}
                      {goal.description.length > 30 ? '…' : ''}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-500">{formatDate(goal.deadline)}</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm mt-1">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setIsEditOpen(true);
                    }}
                    disabled={isDeleting}
                  >
                    {isUpdating ? 'Saving...' : 'Edit'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setGoalToDelete(goal);
                      setIsDeleteOpen(true);
                    }}
                    disabled={isUpdating}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <GoalEditDialog
        goal={selectedGoal}
        open={isEditOpen}
        isSubmitting={!!(selectedGoal && updatingGoalId === selectedGoal.id)}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setSelectedGoal(null);
          }
        }}
        onSubmit={handleEdit}
      />

      <GoalDeleteDialog
        open={isDeleteOpen}
        goalTitle={goalToDelete?.title}
        isDeleting={!!(goalToDelete && deletingGoalId === goalToDelete.id)}
        onOpenChange={(open) => {
          setIsDeleteOpen(open);
          if (!open) {
            setGoalToDelete(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default GoalList;

