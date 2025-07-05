import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/types/projectSchema';
import TaskProjectForm from '@/components/TaskProjectForm';
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/redux/features/api/taskApi';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import type { TaskPayload } from '@/types/taskType';
import { useEffect } from 'react';
import { extractErrorMessage } from '@/utils/apiError';

function CreateTask() {
  const navigate = useNavigate();
  const location = useLocation();
  const editTask = location?.state?.editTask;

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const [createTask, taskRes] = useCreateTaskMutation();
  const [updateTask, updateRes] = useUpdateTaskMutation();

  const onSubmit = async (formData: ProjectFormData) => {
    if (!!editTask) {
      if (!editTask._id) return toast.warn("Your edit task id is missing");

      await updateTask({
        taskId: editTask._id,
        formData: formData as TaskPayload,
      });
    } else {
      if (!projectId) {
        toast.info("Your ProjectId is missing, please refresh the page.");
        return;
      }

      if (!formData.dueDate) {
        toast.error("Due date is required.");
        return;
      }

      await createTask({
        projectId,
        formData: formData as TaskPayload,
      });
    }
  };

  // Autofill form when editing
  useEffect(() => {
    if (editTask) {
      setValue("title", editTask.title);
      setValue("description", editTask.description);
      setValue("status", editTask.status);
      setValue("dueDate", new Date(editTask.dueDate));
    }
  }, [editTask, setValue]);

  // Toast notification
  useEffect(() => {
    if (taskRes.isSuccess) {
    } else if (taskRes.error) {
      toast.error(extractErrorMessage(taskRes.error) || "Failed to create task");
    } else if (updateRes.isSuccess) {
      toast.success("Task update successfully");
      navigate("/dashboard/task/list")
      reset();
    } else if (updateRes.error) {
      toast.error(extractErrorMessage(updateRes.error) || "Failed to update task");
    }
  }, [taskRes.isSuccess, taskRes.error, reset, updateRes.isSuccess, updateRes.error]);

  return (
    <TaskProjectForm
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      errors={errors}
      role="task"
      setValue={setValue}
      watch={watch}
      isEdit={!!editTask}
      isLoading={taskRes.isLoading || updateRes.isLoading}
    />
  );
}

export default CreateTask;
