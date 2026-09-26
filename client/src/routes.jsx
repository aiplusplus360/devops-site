/* =============================================================================
   The route table
   -----------------------------------------------------------------------------
   Shared by both sides of the render:

     browser  -> App.jsx passes this to useRoutes()
     server   -> server/lib/render.mjs passes it to matchRoutes() to decide the
                 HTTP status (the catch-all route means "404")

   Keeping one table means the server can never disagree with the client about
   which URLs exist.
   ========================================================================== */
import Home from "@/routes/Home.jsx";
import Services from "@/routes/Services.jsx";
import ServiceDetail from "@/routes/ServiceDetail.jsx";
import About from "@/routes/About.jsx";
import Contact from "@/routes/Contact.jsx";
import NotFound from "@/routes/NotFound.jsx";

/** The path of the catch-all route, used to detect a 404. */
export const NOT_FOUND_PATH = "*";

export const routes = [
  { path: "/", element: <Home /> },
  { path: "/services", element: <Services /> },
  /* One page per service. This single route is what produces all 40 pages; the
     component reads the id from the URL and the copy from content/services/. */
  { path: "/services/:id", element: <ServiceDetail /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: NOT_FOUND_PATH, element: <NotFound /> },
];
