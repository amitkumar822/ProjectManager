import { useState } from "react";
import { useGetUserTasksQuery } from "@/redux/features/api/taskApi";
import ProductCard from "@/components/Card/ProductCard";

import { Button } from "@/components/ui/button";
import {
  ListTodo,
  LoaderCircle,
  CheckCheck,
  ClipboardList,
} from "lucide-react";
import LoadingPage from "@/components/LoadingPage";

const statusOptions = [
  { label: "All", value: "", icon: ClipboardList },
  { label: "Todo", value: "todo", icon: ListTodo },
  { label: "In Progress", value: "in-progress", icon: LoaderCircle },
  { label: "Done", value: "done", icon: CheckCheck },
];

function TaskList() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: taskData, isFetching } = useGetUserTasksQuery({
    status: statusFilter,
  });

  return (
    <div className="p-4 relative h-full bg-gradient-to-r from-indigo-200 via-sky-200 to-cyan-300">
      {/* Filter Bar */}
      <div className="sticky top-15 z-10 bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 rounded-xl p-3 shadow-lg mb-6 flex gap-2 overflow-x-auto">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isActive = statusFilter === option.value;
          return (
            <Button
              key={option.value}
              variant="ghost"
              onClick={() => setStatusFilter(option.value)}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full transition text-sm font-semibold tracking-tight shadow-md ${isActive
                ? "bg-white text-indigo-700 border border-indigo-500"
                : "text-white hover:bg-white/20"
                }`}
            >
              <Icon className="w-4 h-4" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Task List or Loader */}
      {isFetching ? (
        <LoadingPage />
      ) : (
        <ProductCard projectData={taskData?.data} role="Task" />
      )}
    </div>
  );
}

export default TaskList;