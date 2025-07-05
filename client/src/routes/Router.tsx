
import App from "@/App";
import CreateProject from "@/pages/CreateProject";
import CreateTask from "@/components/CreateTask";
import { AuthPage } from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import DashboardHome from "@/pages/DashboardHome";
import HomePage from "@/pages/HomePage";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import TaskList from "@/pages/TaskList";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardHome />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/project/create" element={<CreateProject />} />
          <Route path="/dashboard/task/create" element={<CreateTask />} />
          <Route path="/dashboard/task/list" element={<TaskList />} />

        </Route>
      </Route>
    </>
  )
);

export { router };
