import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/types/projectSchema';
import { useCreateProjectMutation } from '@/redux/features/api/projectApi';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '@/utils/apiError';
import TaskProjectForm from '@/components/TaskProjectForm';
import { useLocation } from 'react-router';

const CreateProject: React.FC = () => {
    const location = useLocation();
    const editProject = location?.state?.editProject;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
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

    // ✅ Pre-fill form when editing
    useEffect(() => {
        if (editProject) {
            setValue("title", editProject.title);
            setValue("description", editProject.description);
            setValue("status", editProject.status);
        }
    }, [editProject, setValue]);


    return (
        <>
            <TaskProjectForm
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
                role="project"
                isEdit={!!editProject}
            />


        </>
    );
};

export default CreateProject;
