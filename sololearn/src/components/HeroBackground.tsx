"use client";

import dynamic from "next/dynamic";
import "@designcodeio/threeui/style.css";

// The animated background draws with WebGL, so it only runs in the browser.
const FluidFieldBackground = dynamic(
  () => import("@designcodeio/threeui").then((mod) => mod.FluidFieldBackground),
  { ssr: false },
);

export default function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <FluidFieldBackground mode="light" />
    </div>
  );
}
