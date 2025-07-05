import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/types/projectSchema';
import { useCreateProjectMutation } from '@/redux/features/api/projectApi';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '@/utils/apiError';
import TaskProjectForm from '@/components/TaskProjectForm';

const CreateProject: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
    });

    const [createProject, projectData] = useCreateProjectMutation()

    const onSubmit = async (formData: ProjectFormData) => {
        await createProject(formData)
    };

    useEffect(() => {
        if (projectData.isSuccess) {
            toast.success("Project created successful");
            reset()
        } else if (projectData.error) {
            toast.error(extractErrorMessage(projectData.error) || "Faield to create project");
        }
    }, [projectData.isSuccess, projectData.data, projectData.error]);



    return (
        <>
            <TaskProjectForm
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
                role="project"
            />

        </>
    );
};

export default CreateProject;
