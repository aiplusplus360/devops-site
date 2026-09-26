/* Not-found page, ported from 404.html. Renders only the page content — the
   header, footer and fixed chrome come from the layout. Excluded from search
   indexes with `noindex`. */
import { toRoute } from "@/lib/routes.js";
import Seo from "@/lib/Seo.jsx";
import AppLink from "@/components/AppLink.jsx";

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="The page you asked for isn't here. It may have moved, or the link that brought you here is out of date."
        path="/404"
        noindex
        /* Two routes land here: the catch-all, which the server already
           answers with 404, and /services/:id where the id names no service.
           The second is a structurally valid route, so without this the server
           would serve a "not found" page as a 200 and let it into search
           results. Stating it here covers both. */
        status={404}
      />

      <section
        className="hero"
        style={{
          minHeight: "62vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p className="eyebrow" style={{ justifyContent: "center" }}>Error 404</p>
          <h1 className="display">
            This route doesn't <span className="gradient-text">resolve</span>
          </h1>
          <p className="lead" style={{ margin: "1.25rem auto 0" }}>
            The page you asked for isn't here. It may have moved, or the link that
            brought you here is out of date.
          </p>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: "2rem" }}>
            <AppLink className="btn btn--primary btn--lg" to={toRoute("index.html")}>Back to home</AppLink>
            <AppLink className="btn btn--ghost btn--lg" to={toRoute("services.html")}>Browse services</AppLink>
          </div>
        </div>
      </section>
    </>
  );
}
