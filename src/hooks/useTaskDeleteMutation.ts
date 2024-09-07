import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';

import { taskKeys, TASK } from '@/hooks/queryKey';

const deleteTask = async (id: string) => {
  // console.log('id', id);
  const { error } = await supabase.from(TASK).delete().eq('id', id);
  // console.log('error', error);
  // console.log('data', data);

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: '데이터를 성공적으로 삭제하였습니다.',
  };

  // const { data, error } = await supabase.rpc('delete_task', { task_id: id });

  // if (error) {
  //   throw new Error(error.message);
  // }
};

export const useTaskDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success(message);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
