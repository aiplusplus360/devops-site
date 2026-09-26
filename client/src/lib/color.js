/* "#FF9900" -> "255,153,0", so a technology's brand colour can be used to build
   a soft tint with rgba(). Returns null for anything that is not a valid hex
   colour, which is how the renderer decides to skip the accent entirely.
   Ported from `hexToRgb()` in assets/js/main.js (L325). */

export function hexToRgb(hex) {
  let h = String(hex || "").replace("#", "");

  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;

  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ].join(",");
}
