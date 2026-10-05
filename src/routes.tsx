import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Maps from "./pages/Maps";
import Community from "./pages/Community";
import Safety from "./pages/Safety";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "maps", Component: Maps },
      { path: "community", Component: Community },
      { path: "safety", Component: Safety },
    ],
  },
]);
