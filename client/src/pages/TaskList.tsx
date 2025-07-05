import { useEffect, useState } from "react";
import { useGetUserTasksQuery } from "@/redux/features/api/taskApi";
import ProductCard from "@/components/Card/ProductCard";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  ListTodo,
  LoaderCircle,
  CheckCheck,
  ClipboardList,
} from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import { useNavigate, useSearchParams } from "react-router";

const statusOptions = [
  { label: "All", value: "", icon: ClipboardList },
  { label: "Todo", value: "todo", icon: ListTodo },
  { label: "In Progress", value: "in-progress", icon: LoaderCircle },
  { label: "Done", value: "done", icon: CheckCheck },
];

function TaskList() {
  const navigate = useNavigate();
  // Import hook to work with URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract initial values from URL query params (fallbacks are provided)
  const initialStatus = searchParams.get("status") || "";
  const initialPage = parseInt(searchParams.get("page") || "10", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // Local state for filters and pagination
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [page, setPage] = useState<number>(initialPage);

  const { data: taskData, isLoading } = useGetUserTasksQuery({
    status: statusFilter,
    page,
    limit,
  });

  // Reset to page 1 whenever status filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // Update the URL query string when status or page changes
  useEffect(() => {
    const params: Record<string, string> = {
      status: statusFilter,
      page: String(page),
      limit: String(limit),
    };
    setSearchParams(params);
  }, [statusFilter, page, limit]);

  // Safely extract total pages from API response
  const totalPages = taskData?.data?.totalPages || 1;

  if (isLoading) return <LoadingPage />;

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

      {/* Task List */}
      {taskData?.data?.results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-gray-600">
          <h2 className="text-2xl font-semibold">No Tasks Found</h2>
          <p className="text-sm max-w-md">
            You haven’t created any tasks yet. Go to your dashboard and start by creating or assigning tasks.
          </p>
          <Button
            variant="default"
            className="mt-4 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      ) : (
        <ProductCard projectData={taskData?.data?.results} role="Task" />
      )}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`${page === 1 ? "opacity-50 pointer-events-none" : ""
                    } cursor-pointer`}
                />
              </PaginationItem>

              {[...Array(totalPages)]
                .map((_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  );
                })
                .reduce((acc: (number | string)[], curr, idx, arr) => {
                  if (idx > 0 && curr - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(curr);
                  return acc;
                }, [])
                .map((p, i) => (
                  <PaginationItem key={i}>
                    {p === "..." ? (
                      <span className="px-2 text-gray-500">...</span>
                    ) : (
                      <Button
                        variant={p === page ? "default" : "outline"}
                        onClick={() => setPage(Number(p))}
                        className={`rounded-full px-4 ${p === page ? "bg-purple-500 text-white" : "bg-white"
                          } cursor-pointer`}
                      >
                        {p}
                      </Button>
                    )}
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`${page === totalPages ? "opacity-50 pointer-events-none" : ""
                    } cursor-pointer`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default TaskList;
