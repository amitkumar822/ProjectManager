import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/types/projectSchema';
import TaskProjectForm from '@/components/TaskProjectForm';


function CreateTask() {
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

  const onSubmit = async (formData: ProjectFormData) => {
    console.log("FormData: ", formData)
  };

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