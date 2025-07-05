import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, type ProjectFormData } from '@/types/projectSchema';
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/redux/features/api/projectApi';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '@/utils/apiError';
import TaskProjectForm from '@/components/TaskProjectForm';
import { useLocation, useNavigate } from 'react-router';

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
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

    const [createProject, projectRes] = useCreateProjectMutation()
    const [updateProject, updateRes] = useUpdateProjectMutation()

    const onSubmit = async (formData: ProjectFormData) => {
        if (!!editProject) {
            if (!editProject._id) return toast.warn("Your edit task id is missing");

            await updateProject({ projectId: editProject._id, formData })
        } else {
            await createProject(formData)
        }
    };

    useEffect(() => {
        if (projectRes.isSuccess) {
            toast.success("Project created successful");
            reset()
        } else if (projectRes.error) {
            toast.error(extractErrorMessage(projectRes.error) || "Faield to create project");
        } else if (updateRes.isSuccess) {
            toast.success("Project update successfully");
            navigate("/dashboard")
            reset();
        } else if (updateRes.error) {
            toast.error(extractErrorMessage(updateRes.error) || "Failed to update project");
        }
    }, [projectRes.isSuccess, projectRes.error, updateRes.isSuccess, updateRes.error]);

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
                isLoading={projectRes.isLoading || updateRes.isLoading}
            />


        </>
    );
};

export default CreateProject;
