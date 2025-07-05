import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/app/reduxHook";
import { useGetProjectsQuery } from "@/redux/features/api/projectApi";
import ProductCard from "@/components/Card/ProductCard";
import { Button } from "@/components/ui/button";

import {
  CheckCheck,
  ClipboardList,
  Hammer,
} from "lucide-react";
import LoadingPage from "@/components/LoadingPage";

const projectStatusOptions = [
  { label: "All", value: "", icon: ClipboardList },
  { label: "Active", value: "active", icon: Hammer },
  { label: "Completed", value: "completed", icon: CheckCheck },
];

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: projectData, isLoading } = useGetProjectsQuery({
    status: statusFilter,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

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
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full transition text-sm font-medium tracking-tight shadow-md ${
                isActive
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
      <ProductCard projectData={projectData?.data} role="Project" />
    </div>
  );
};

export default Dashboard;