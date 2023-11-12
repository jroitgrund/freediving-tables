import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./routes/Home";
import Relaxation from "./routes/Relaxation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/relaxation",
    element: <Relaxation />,
  },
]);

function App() {
  return (
    <div className="flex h-screen w-full flex-col bg-black text-white">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
