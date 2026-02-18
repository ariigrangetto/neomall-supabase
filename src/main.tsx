import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import FilterProvider from "./context/FilterContext.tsx";
import { router } from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <FilterProvider>
    <RouterProvider router={router} />
  </FilterProvider>,
);
