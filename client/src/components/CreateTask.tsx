import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/types/projectSchema';
import TaskProjectForm from '@/components/TaskProjectForm';
import { useCreateTaskMutation } from '@/redux/features/api/taskApi';
import { useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import type { TaskPayload } from '@/types/taskType';
import { useEffect } from 'react';
import { extractErrorMessage } from '@/utils/apiError';

function CreateTask() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const [createTask, taskData] = useCreateTaskMutation();

  const onSubmit = async (formData: ProjectFormData) => {
    if (!projectId) {
      toast.info("Your ProjectId Missing, please refresh the page");
      return;
    }

    if (!formData.dueDate) {
      toast.error("Due date is required for creating a task.");
      return;
    }

    await createTask({
      projectId,
      formData: formData as TaskPayload,
    });
  };


  useEffect(() => {
    if (taskData.isSuccess) {
      toast.success("Task created successful");
      reset();
    } else if (taskData.error) {
      toast.error(extractErrorMessage(taskData.error) || "Faield to create task");
    }
  }, [taskData.isSuccess, taskData.data, taskData.error]);


  return (
    <>
      <TaskProjectForm
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        role="task"
        setValue={setValue}
        watch={watch}
      />
    </>
  )
}

export default CreateTask