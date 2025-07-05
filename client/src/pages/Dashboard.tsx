import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/redux/app/reduxHook";
import { useGetProjectsQuery } from "@/redux/features/api/projectApi";
import ProductCard from "@/components/Card/ProductCard";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CheckCheck, ClipboardList, Hammer } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";

const projectStatusOptions = [
  { label: "All", value: "", icon: ClipboardList },
  { label: "Active", value: "active", icon: Hammer },
  { label: "Completed", value: "completed", icon: CheckCheck },
];

const Dashboard = () => {
  // Import hook to work with URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract initial values from URL query params (fallbacks are provided)
  const initialStatus = searchParams.get("status") || "";
  const initialPage = parseInt(searchParams.get("page") || "10", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // Local state for filters and pagination
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [page, setPage] = useState<number>(initialPage);

  // Auth & navigation hook
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch projects based on filter, page, and limit
  const { data: projectData, isLoading } = useGetProjectsQuery({
    status: statusFilter,
    page,
    limit,
  });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

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
  const totalPages = projectData?.data?.totalPages || 1;

  if (isLoading) return <LoadingPage />

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-10 bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 min-h-screen">
      {/* Filter Bar */}
      <div className="sticky top-15 z-10 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 rounded-xl p-3 shadow-md mb-4 flex gap-2 overflow-x-auto">
        {projectStatusOptions.map((option) => {
          const Icon = option.icon;
          const isActive = statusFilter === option.value;
          return (
            <Button
              key={option.value}
              variant="ghost"
              onClick={() => setStatusFilter(option.value)}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full transition text-sm font-medium tracking-tight shadow-md ${isActive
                ? "bg-white text-purple-700 border border-purple-500"
                : "text-white hover:bg-white/20"
                }`}
            >
              <Icon className="w-4 h-4" />
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Project List */}
      {projectData?.data?.results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center text-gray-600">
          <h2 className="text-2xl font-semibold">No Projects Found</h2>
          <p className="text-sm max-w-md">
            It looks like you haven’t created any projects yet. Start your first project to manage tasks efficiently and stay organized!
          </p>
          <Button
            variant="default"
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow"
            onClick={() => navigate("/dashboard/project/create")}
          >
            Create New Project
          </Button>
        </div>
      ) : (
        <ProductCard projectData={projectData?.data?.results} role="Project" />
      )}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`${page === 1 ? "opacity-50 pointer-events-none" : ""} cursor-pointer`}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => i + 1)
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
                }, []).map((p, i) => (
                  <PaginationItem key={i}>
                    {p === "..." ? (
                      <span className="px-2 text-gray-500">...</span>
                    ) : (
                      <Button
                        variant={p === page ? "default" : "outline"}
                        onClick={() => setPage(Number(p))}
                        className={`rounded-full px-4 ${p === page ? "bg-purple-500 text-white" : "bg-white"} cursor-pointer`}
                      >
                        {p}
                      </Button>
                    )}
                  </PaginationItem>
                ))}


              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`${page === totalPages ? "opacity-50 pointer-events-none" : ""} cursor-pointer`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
