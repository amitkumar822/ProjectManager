import React from "react";
import type { UseFormRegister, FieldErrors, SubmitHandler, UseFormReturn } from "react-hook-form";
import type { ProjectFormData } from "@/types/projectSchema";
import { FolderPlus, AlignLeft, CalendarIcon, ListChecks, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TaskProjectFormProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  handleSubmit: (onValid: SubmitHandler<ProjectFormData>) => (e?: React.BaseSyntheticEvent) => void;
  onSubmit: SubmitHandler<ProjectFormData>;
  role: "project" | "task";
  setValue?: UseFormReturn<ProjectFormData>["setValue"];
  watch?: UseFormReturn<ProjectFormData>["watch"];
  isEdit?: boolean;
  isLoading?: boolean;
}

const taskStatusOptions = ["todo", "in-progress", "done"];
const projectStatusOptions = ["active", "completed"];

const TaskProjectForm: React.FC<TaskProjectFormProps> = ({
  register,
  errors,
  handleSubmit,
  onSubmit,
  role,
  setValue,
  watch,
  isEdit,
  isLoading
}) => {
  const dueDate = role === "task" && watch ? watch("dueDate") : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-emerald-400 to-fuchsia-500 p-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-3xl border-none backdrop-blur-lg bg-white/40 border border-white/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            {/* Dynamic Icon */}
            {role === "task" ? (
              <ListChecks className="w-7 h-7 text-teal-600" />
            ) : (
              <FolderPlus className="w-7 h-7 text-purple-700" />
            )}

            {/* Dynamic Title */}
            {isEdit
              ? `Edit ${role === "task" ? "Task" : "Project"}`
              : `Create New ${role === "task" ? "Task" : "Project"}`}
          </CardTitle>
        </CardHeader>


        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-md flex gap-1 items-center text-gray-700">
                <FolderPlus className="w-4 h-4" />
                Title
              </Label>
              <Input id="title" placeholder="Enter title" {...register("title")} />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-md flex gap-1 items-center text-gray-700">
                <AlignLeft className="w-4 h-4" />
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe here..."
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {role === "task" && (
              <div>
                <Label htmlFor="dueDate" className="text-md flex gap-1 items-center text-gray-700">
                  <CalendarIcon className="w-4 h-4" />
                  Due Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "yyyy-MM-dd") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => setValue?.("dueDate", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
                )}
              </div>
            )}

            {isEdit && (
              <div>
                <Label htmlFor="status" className="text-md flex gap-1 items-center text-gray-700">
                  Status
                </Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full mt-1 p-2 border rounded-md bg-white text-gray-700"
                >
                  {(role === "task" ? taskStatusOptions : projectStatusOptions).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>
            )}


            <Button
              disabled={isLoading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold shadow-md hover:opacity-90 transition rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Please wait...
                </>
              ) : (
                isEdit
                  ? `Update ${role === "task" ? "Task" : "Project"}`
                  : `Create ${role === "task" ? "Task" : "Project"}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskProjectForm;
