"use client";
import PEPU from "./components/PEPU";
import WPEPU from "./components/WPEPU";

export default function Home() {
  return (
    <div className="items-center justify-items-center md:px-20">
      <PEPU />
      <WPEPU />
    </div>
  );
}
