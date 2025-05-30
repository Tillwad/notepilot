"use client";

import { useState } from "react";
import { ContainerTextFlip } from "./ui/container-text-flip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ToolIconsRow from "@/components/ToolIconsRow";
import UploadField from "@/components/UploadSection";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full flex flex-col justify-center items-center text-center px-4 bg-[var(--background)]">
      {/* Top Curve */}

      <svg
        className="absolute hidden md:block top-5 right-5 w-32 sm:w-48 h-auto z-0 opacity-80"
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20,20 
       C80,-10 160,40 100,70 
       C40,100 60,0 220,60"
          stroke="currentColor"
          strokeWidth="10.5"
          className="text-accent dark:text-gray-600"
        />
      </svg>

      <div className="mb-4 mt-4 sm:mt-0 text-xs sm:text-sm text-gray-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-200 dark:bg-gray-800 dark:text-gray-400 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {/* Avatar Group */}
        <div className="flex -space-x-2">
          <Avatar className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white dark:border-gray-800">
            <AvatarImage src="/avatars/user1.jpg" alt="Anna" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white dark:border-gray-800">
            <AvatarImage src="/avatars/user2.jpg" alt="Ben" />
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-white dark:border-gray-800">
            <AvatarImage src="/avatars/user3.jpg" alt="Cara" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        </div>

        {/* Text */}
        <span className="text-center">
          Vertraut von <strong>200+</strong> zufriedenen Nutzer:innen
        </span>
      </div>

      <h1 className="text-5xl sm:text-5xl md:text-8xl font-extrabold max-w-4xl leading-tight text-black dark:text-white">
        Verwandle <br className="hidden md:inline" /> deine{" "}
        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
          <ContainerTextFlip
            words={["Meetings", "Interviews", "Podcasts"]}
            animationDuration={700}
            interval={3500}
            textClassName="text-5xl sm:text-5xl md:text-8xl"
            className="min-w-[14ch] md:min-w-[12ch] text-center"
          />
        </span>{" "}
        in klare
        <span className="text-5xl sm:text-5xl md:text-8xl inline-block font-allura text-accent ml-5">
          Notizen
        </span>
      </h1>

      <p className="text-gray-600 mt-6 max-w-xl">
        Lade einfach deine Audio- oder Videodateien hoch - NotePilot erstellt
        automatisch Zusammenfassungen & To-Dos.
      </p>

      <UploadField />

      <p className="text-xs text-gray-400 mt-2">
        Kostenlos testen. Keine Kreditkarte nötig.
      </p>

      <ToolIconsRow />

      {/* Bottom Curve1 */}
      <svg
        className="absolute hidden md:block bottom-35 left-5 w-32 sm:w-48 h-auto z-0 rotate-39 opacity-80"
        viewBox="0 0 200 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20,20 
       C80,-10 160,40 100,70 
       C40,100 60,0 220,60"
          stroke="currentColor"
          strokeWidth="10.5"
          className="text-accent dark:text-gray-600"
        />
      </svg>

      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
        <svg
          className="relative block w-full h-20 text-accent rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0 C300,100 900,0 1200,100 L1200,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
