"use client";
import { DataContextProvider } from "@/contexts/Data";
import dynamic from "next/dynamic";

const Banner = dynamic(() => import("@/components/Banner"), {
  ssr: false,
});
const FileHandler = dynamic(() => import("@/components/FileHandler"), {
  ssr: false,
});
const MainArea = dynamic(() => import("@/components/MainArea"), {
  ssr: false,
});

export default function Home() {
  return (
    <DataContextProvider>
      <FileHandler />
      <Banner />
      <div className="bg-gray-50">
        <main>
          <MainArea />
        </main>
      </div>
    </DataContextProvider>
  );
}
