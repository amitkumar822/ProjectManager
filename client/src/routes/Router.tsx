
import App from "@/App";
import { AuthPage } from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/pages/HomePage";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </>
  )
);

export { router };
