import { useEffect } from "react";
import { mountGlobal, mountPage } from "./behaviors.js";

/** The app-lifetime behaviours. Call once, in the root layout. */
export function useGlobalMotion() {
  useEffect(() => mountGlobal(), []);
}

/** Page-scoped behaviours. Re-runs when `key` changes (pass the route pathname). */
export function usePageMotion(key) {
  useEffect(() => mountPage(), [key]);
}
