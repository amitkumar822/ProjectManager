import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus, AlignLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { projectSchema, type ProjectFormData } from '@/types/projectSchema';
import { useCreateProjectMutation } from '@/redux/features/api/projectApi';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '@/utils/apiError';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-emerald-400 to-fuchsia-500 p-4">
            <Card className="w-full max-w-lg shadow-2xl rounded-3xl border-none backdrop-blur-lg bg-white/40 border border-white/30">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                        <FolderPlus className="w-7 h-7 text-purple-700" />
                        Create New Project
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        {/* Title */}
                        <div>
                            <Label htmlFor="title" className="text-md flex gap-1 items-center text-gray-700">
                                <FolderPlus className="w-4 h-4" />
                                Project Title
                            </Label>
                            <Input
                                id="title"
                                placeholder="Enter project title"
                                {...register('title')}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description" className="text-md flex gap-1 items-center text-gray-700">
                                <AlignLeft className="w-4 h-4" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your project..."
                                rows={4}
                                {...register('description')}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>


                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full cursor-pointer bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold shadow-md hover:opacity-90 transition rounded-xl"
                        >
                            Create Project
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateProject;
