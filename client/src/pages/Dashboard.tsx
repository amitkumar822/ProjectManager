import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/app/reduxHook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useGetProjectsQuery } from "@/redux/features/api/projectApi";
import { useGetUserTasksQuery } from "@/redux/features/api/taskApi";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: projectData, isLoading: loadingProjects } = useGetProjectsQuery();
  const { data: taskData, isLoading: loadingTasks } = useGetUserTasksQuery({ status: "in-progress" }); // optional filter

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
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {projectData?.data?.map((project: any) => (
            <Card key={project._id} className="bg-white shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {project.title}
                  <Badge
                    className={`${
                      project.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                    } text-white`}
                  >
                    {project.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Task List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskData?.data?.map((task: any) => (
            <Card key={task._id} className="bg-white shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {task.title}
                  <Badge
                    className={`${
                      task.status === "done"
                        ? "bg-green-500"
                        : task.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    } text-white`}
                  >
                    {task.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
