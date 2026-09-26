/* Process steps — ported from `renderProcess()` in assets/js/main.js (L438).
   These are the `<li>`s only: the original wrote them into the existing
   `<ol class="process" data-process>`, so the page keeps that element and this
   component supplies its children. `--i` staggers the scroll reveal.

   Defaults to the site-wide four steps. The service pages pass their own
   `steps`, which carry a title and text but no number, so one is derived from
   the position. */
import { PROCESS } from "@/data/services.js";

export default function Process({ steps }) {
  const items = steps || PROCESS;
  if (!items.length) return null;

  return (
    <>
      {items.map((step, i) => (
        <li className="step reveal" style={{ "--i": i }} key={step.title || step.step}>
          <span className="step__num">{step.step || String(i + 1).padStart(2, "0")}</span>
          <h3 className="step__title">{step.title}</h3>
          <p className="step__text">{step.text}</p>
        </li>
      ))}
    </>
  );
}
