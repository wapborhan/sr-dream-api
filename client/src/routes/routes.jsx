import { createBrowserRouter, Link } from "react-router-dom";
import Root from "../layout/Root";
import HomePage from "../pages/home/HomePage";
import About from "../pages/about/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <div className="flex flex-col gap-6 items-center justify-center h-screen text-white bg-slate-950 transition-all">
        <h4 className="text-5xl">404 Not Found</h4>
        <Link
          to="/"
          className="text-blue-500 hover:underline bg-amber-50 hover:text-black px-2 py-1 rounded"
        >
          Home Page
        </Link>
      </div>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sr-dream-api",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);
export default router;
