import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/app/reduxHook";
import { Loader2 } from "lucide-react";
import { useGetProjectsQuery } from "@/redux/features/api/projectApi";
import { useGetUserTasksQuery } from "@/redux/features/api/taskApi";
import ProductCard from "@/components/Card/ProductCard";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: projectData, isLoading: loadingProjects } = useGetProjectsQuery();
  const { data: taskData } = useGetUserTasksQuery({ status: "in-progress" }); // optional filter

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (loadingProjects) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
      </div>
    );
  }



  return (
    <div className="p-4 max-w-7xl mx-auto space-y-10">
      {/* Project List */}
      <ProductCard
        projectData={projectData?.data}
        role="Project"
      />

      {/* Task List */}
      <ProductCard
        projectData={taskData?.data}
        role="Task"
      />
    </div>
  );
};

export default Dashboard;
