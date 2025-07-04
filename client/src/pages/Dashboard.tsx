// // src/pages/Dashboard.tsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/redux/app/reduxHook";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import { useGetUserProjectsQuery } from "@/redux/features/api/projectApi";

// const Dashboard = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const { data, isLoading, isError, refetch } = useGetUserProjectsQuery(undefined);

//   console.log("Data: ", data);
  

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   const handleEdit = (projectId: string) => {
//     // navigate(`/project/edit/${projectId}`);
//   };

//   const handleDelete = (projectId: string) => {
//     // Implement delete mutation
//     toast.info("Delete functionality coming soon");
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh]">
//         <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
//       </div>
//     );
//   }

//   if (isError) {
//     return <p className="text-red-500 text-center mt-10">Failed to load projects.</p>;
//   }

//   return (
//     <div className="p-4 max-w-5xl mx-auto space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold">Your Projects</h2>
//         <Button onClick={() => 
//             // navigate("/project/create")
//             console.log("Add Project")
//             } className="flex gap-2">
//           <Plus size={16} />
//           Add Project
//         </Button>
//       </div>

//       {data?.data?.length === 0 ? (
//         <p className="text-muted-foreground text-center">No projects yet. Create one!</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {data?.data.map((project: any) => (
//             <Card key={project._id} className="bg-white/80 shadow-md">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg">{project.title}</CardTitle>
//                 <Badge
//                   className={`${
//                     project.status === "completed"
//                       ? "bg-green-500"
//                       : "bg-yellow-500"
//                   } text-white`}
//                 >
//                   {project.status}
//                 </Badge>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
//                 <div className="flex justify-between gap-2">
//                   <Button
//                     onClick={() => handleEdit(project._id)}
//                     variant="outline"
//                     className="w-full text-sm"
//                   >
//                     <Pencil size={16} className="mr-1" />
//                     Edit
//                   </Button>
//                   <Button
//                     onClick={() => handleDelete(project._id)}
//                     variant="destructive"
//                     className="w-full text-sm"
//                   >
//                     <Trash2 size={16} className="mr-1" />
//                     Delete
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/app/reduxHook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useGetUserProjectsQuery } from "@/redux/features/api/projectApi";

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: projectData, isLoading: loadingProjects } = useGetUserProjectsQuery();
  // const { data: taskData, isLoading: loadingTasks } = useGetUserTasksQuery({ status: "todo" }); // optional filter

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
      {/* <section>
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
      </section> */}
    </div>
  );
};

export default Dashboard;
