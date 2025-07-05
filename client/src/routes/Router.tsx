import App from "@/App";
import CreateProject from "@/pages/CreateProject";
import CreateTask from "@/components/CreateTask";
import { AuthPage } from "@/pages/auth/AuthPage";
import Dashboard from "@/pages/Dashboard";
import DashboardHome from "@/pages/DashboardHome";
import HomePage from "@/pages/HomePage";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import TaskList from "@/pages/TaskList";
import SearchPage from "@/pages/SearchPage";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<HomePage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>

        {/* 
            ✅ ProtectedRoute: Currently only allows users with role "user" to access this route.
            
            🔒 Future Enhancement:
              To restrict dashboard access to only admins, change allowedRoles to ["admin"].
              You can also support multiple roles like ["admin", "manager"] if needed.
            
            Example:
              <ProtectedRoute allowedRoles={["admin"]} />   // Only admin can access
              <ProtectedRoute allowedRoles={["admin", "user"]} />  // Both can access
            */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<DashboardHome />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/project/create"
              element={<CreateProject />}
            />
            <Route path="/dashboard/task/create" element={<CreateTask />} />
            <Route path="/dashboard/task/list" element={<TaskList />} />
            <Route path="/dashboard/search" element={<SearchPage />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);

export { router };
