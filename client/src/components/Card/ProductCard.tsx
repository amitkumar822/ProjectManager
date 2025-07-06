import { useEffect, useState, type FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Pencil,
    Trash2,
    PlusCircle,
    FileText,
    FolderPlus,
    View,
    ArchiveRestore,
} from "lucide-react";
import type { Project } from "@/types/projectTypes";
import type { Task } from "@/types/taskType";
import { useNavigate } from "react-router";
import { useSoftDeleteTaskMutation } from "@/redux/features/api/taskApi";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/apiError";
import {
    usePermanentlyDeleteTaskOrProjectMutation,
    useRecoverTaskOrProjectMutation,
    useSoftDeleteProjectMutation,
} from "@/redux/features/api/projectApi";
import { format } from "date-fns";

interface ProductCardProps {
    projectData?: Project[] | Task[];
    role: string;
}

const ProductCard: FC<ProductCardProps> = ({ projectData, role }) => {

    const navigate = useNavigate();
    const [expandedCards, setExpandedCards] = useState<{
        [key: string]: boolean;
    }>({});

    const toggleCard = (id: string) => {
        setExpandedCards((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // 🟠 Soft Delete Task (Move to Trash)
    const [softDeleteTask, taskRes] = useSoftDeleteTaskMutation();

    // 🟢 Soft Delete Project (Move to Trash)
    const [softDeleteProject, projectRes] = useSoftDeleteProjectMutation();

    // 🔴 Permanently Delete (Task or Project)
    const [permanentlyDeleteTaskOrProject, pernDeleteRes] =
        usePermanentlyDeleteTaskOrProjectMutation();

    const handleDelete = async (id: string) => {
        if (role === "Recyle Bin") {
            const confirm = window.confirm(
                ` ⚠ Are you sure you want to permanently delete this ${role.toLowerCase()}?\nThis action cannot be undone.`
            );
            if (confirm) {
                await permanentlyDeleteTaskOrProject(id);
            }
        } else {
            const confirm = window.confirm(
                `🗑️ Are you sure you want to move this ${role.toLowerCase()} to Trash?\n\n` +
                `This item will remain in Trash for 30 days and will be **automatically deleted permanently** after that.\n\n` +
                `You can restore it anytime before deletion from the Trash section.`
            );

            if (confirm) {
                if (role === "Task") {
                    await softDeleteTask(id);
                } else if (role === "Project") {
                    await softDeleteProject(id);
                }
            }
        }
    };

    // 🟩 Recover (Task or Project)
    const [recoverTaskOrProject, recoverRes] = useRecoverTaskOrProjectMutation();

    const handleRecover = async (id: string) => {
        const confirm = window.confirm(
            "♻️ Are you sure you want to recover this item?\n\n" +
            "It will be restored to its original section and removed from the Trash."
        );

        if (confirm) {
            await recoverTaskOrProject(id);
        }
    };

    // task effect
    useEffect(() => {
        // 🟠 Task moved to Trash
        if (taskRes.isSuccess) {
            toast.success("Task moved to Trash successfully.");
        } else if (taskRes.error) {
            toast.error(
                extractErrorMessage(taskRes.error) || "Failed to move Task to Trash."
            );
        }

        // 🟢 Project moved to Trash
        if (projectRes.isSuccess) {
            toast.success("Project moved to Trash successfully.");
        } else if (projectRes.error) {
            toast.error(
                extractErrorMessage(projectRes.error) ||
                "Failed to move Project to Trash."
            );
        }

        // 🔴 Permanently Deleted
        if (pernDeleteRes.isSuccess) {
            toast.success("Item permanently deleted.");
        } else if (pernDeleteRes.error) {
            toast.error(
                extractErrorMessage(pernDeleteRes.error) ||
                "Failed to permanently delete item."
            );
        }

        // 🟩 Recovered from Trash
        if (recoverRes.isSuccess) {
            toast.success("Item successfully recovered from Trash.");
        } else if (recoverRes.error) {
            toast.error(
                extractErrorMessage(recoverRes.error) || "Failed to recover item."
            );
        }
    }, [
        taskRes.isSuccess,
        taskRes.error,
        projectRes.isSuccess,
        projectRes.error,
        pernDeleteRes.isSuccess,
        pernDeleteRes.error,
        recoverRes.isSuccess,
        recoverRes.error,
    ]);

    return (
        <>
            <section>
                <div className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 rounded-xl px-6 py-4 mb-6 shadow-md border border-indigo-300 flex items-center gap-3">
                    {role === "Task" ? (
                        <FileText className="w-6 h-6 text-white" />
                    ) : (
                        <FolderPlus className="w-6 h-6 text-white" />
                    )}
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        Your {role === "Task" && "All"} {role}
                    </h2>
                </div>

                <div className="grid md:grid-cols-1 gap-6">
                    {projectData?.map((project) => {
                        const isExpanded = expandedCards[project._id] || false;
                        return (
                            <Card
                                key={project._id}
                                className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 shadow-xl rounded-2xl border border-purple-200"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle
                                            onClick={() => toggleCard(project._id)}
                                            className={`cursor-pointer text-lg font-bold text-gray-800 ${isExpanded ? "" : "line-clamp-1"
                                                }`}
                                        >
                                            <FileText className="inline-block w-5 h-5 text-purple-600 mr-2" />
                                            {project.title}
                                        </CardTitle>

                                        <div className="flex items-center gap-2">
                                            <Badge
                                                className={`text-white py-1 px-3 rounded-full capitalize text-xs font-semibold
                                                    ${project.status ===
                                                    "todo" && "bg-blue-500"
                                                    }
                                                    ${project.status ===
                                                    "in-progress" &&
                                                    "bg-purple-500"
                                                    }
                                                    ${project.status ===
                                                    "done" && "bg-green-600"
                                                    }
                                                    ${project.status ===
                                                    "completed" &&
                                                    "bg-green-700"
                                                    }
                                                    ${project.status ===
                                                    "active" &&
                                                    "bg-yellow-500"
                                                    }
                                                `}
                                            >
                                                {project.status.replace(/-/g, " ")}
                                            </Badge>

                                            {role !== "Task" && role !== "Recyle Bin" && (
                                                <>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-purple-600 hover:bg-purple-100 cursor-pointer bg-purple-400/10"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/dashboard/task/create?project_id=${project._id}`
                                                                        )
                                                                    }
                                                                >
                                                                    <PlusCircle className="w-5 h-5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Add Task</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-orange-600 hover:bg-orange-100 cursor-pointer bg-orange-400/10"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/dashboard/task/list?project_id=${project._id}`
                                                                        )
                                                                    }
                                                                >
                                                                    <View className="w-5 h-5" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>View All Task</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </>
                                            )}

                                            {role !== "Recyle Bin" && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-blue-600 hover:bg-blue-100 cursor-pointer bg-blue-400/10"
                                                                onClick={() =>
                                                                    role === "Task"
                                                                        ? navigate(
                                                                            `/dashboard/task/create?project_id=${project._id}`,
                                                                            {
                                                                                state: { editTask: project },
                                                                            }
                                                                        )
                                                                        : navigate(
                                                                            `/dashboard/project/create?project_id=${project._id}`,
                                                                            {
                                                                                state: { editProject: project },
                                                                            }
                                                                        )
                                                                }
                                                            >
                                                                <Pencil className="w-5 h-5" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-orange-600 hover:bg-orange-100 cursor-pointer bg-orange-400/10"
                                                            onClick={() => handleDelete(project._id)}
                                                        >
                                                            {role === "Recyle Bin" ? (
                                                                <Trash2 className="w-5 h-5" />
                                                            ) : (
                                                                <ArchiveRestore className="w-5 h-5" />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {role === "Recyle Bin" ? (
                                                            <p>Permanently Delete</p>
                                                        ) : (
                                                            <p>Move to Recycle Bin</p>
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            {role === "Recyle Bin" && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleRecover(project._id)}
                                                                className="text-green-600 hover:bg-green-100 bg-green-400/10 cursor-pointer"
                                                            >
                                                                <ArchiveRestore className="w-5 h-5" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Recover</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent
                                    onClick={() => toggleCard(project._id)}
                                    className="cursor-pointer"
                                >
                                    <p
                                        className={`text-sm text-gray-700 ${isExpanded ? "" : "line-clamp-2"
                                            }`}
                                    >
                                        {project.description}
                                    </p>
                                </CardContent>

                                <hr className="border-t border-gray-300 mx-6" />

                                {
                                    <div className="px-6 pb-4 text-sm text-gray-700 space-y-1">
                                        <p>
                                            <span className="font-medium text-gray-600">
                                                📩 Created By:
                                            </span>{" "}
                                            {typeof project.user === "object" &&
                                                "email" in project.user
                                                ? project.user.email
                                                : "Unknown"}
                                        </p>
                                        {role !== "Project" && (
                                            <p>
                                                <>
                                                    <span className="font-medium text-gray-600">
                                                        📁 Associated Project:
                                                    </span>{" "}
                                                    {project?.project?.title || "N/A"}
                                                </>
                                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
                                                    <span className="font-medium text-gray-600">
                                                        📅 Due Date:
                                                    </span>
                                                    <span className="text-indigo-600 font-semibold">
                                                        {format(new Date(project.dueDate), "dd MMM yyyy")}
                                                    </span>
                                                </div>
                                            </p>
                                        )}
                                    </div>
                                }
                            </Card>
                        );
                    })}
                </div>
            </section>
        </>
    );
};

export default ProductCard;
