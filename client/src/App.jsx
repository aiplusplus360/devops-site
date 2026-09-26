/* The application root.
   Renders the shared layout once and lets the route table decide the page
   inside it. The same component tree is used by the server (inside a
   StaticRouter) and by the browser (inside a BrowserRouter), which is what makes
   hydration a clean match. */
import { useRoutes } from "react-router-dom";
import Layout from "@/layouts/Layout.jsx";
import { routes } from "@/routes.jsx";

export default function App() {
  const page = useRoutes(routes);
  return <Layout>{page}</Layout>;
}
