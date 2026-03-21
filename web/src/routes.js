import { createBrowserRouter, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Users from "./pages/Users";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/users" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/users" replace />,
  },
]);

export default router;
