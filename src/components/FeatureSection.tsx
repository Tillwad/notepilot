"use client";

import {
  Paperclip,
  Plus,
  CheckCircle,
  Pencil,
  Clock,
  Sparkles,
  Sliders,
  FileText,
} from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="relative min-h-[100vh] w-full flex flex-col justify-center items-center text-center px-4 py-16 bg-gray-50 text-gray-800">
      {/* Top Curve */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
        <svg
          className="relative block w-full h-20 text-accent"
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

      <div className="z-10 max-w-5xl w-full space-y-20">
        {/* HOW IT WORKS */}
        <div>
          <h2 className="text-5xl font-bold mb-12">Wie es funktioniert</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Step
              icon={<Paperclip className="w-8 h-8 text-white" />}
              title="1. Upload Audio"
              description="Lade deine Audioaufnahme des Meetings hoch."
            />
            <Step
              icon={<Plus className="w-8 h-8 text-white" />}
              title="2. Analyse & Zusammenfassung"
              description="AI erstellt automatisch Zusammenfassung, To-Dos & Entscheidungen."
            />
            <Step
              icon={<CheckCircle className="w-8 h-8 text-white" />}
              title="3. Speichern als Notiz"
              description="Die Meeting-Notiz wird in deinem Dashboard gespeichert."
            />
            <Step
              icon={<Pencil className="w-8 h-8 text-white" />}
              title="4. Sofort editieren"
              description="Bearbeite oder teile die Notiz direkt im Editor."
            />
          </div>
        </div>

        {/* WHY CHOOSE */}
        <div>
          <h2 className="text-5xl font-bold mb-12">
            Warum <span className="font-allura">Note</span>
            <span className="text-accent">Pilot</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <Feature
              icon={<Clock className="w-6 h-6 text-accent" />}
              title="Save Time, Every Meeting"
              description="Sofortige Notizen und Aufgaben - spare dir stundenlanges Mitschreiben."
            />
            <Feature
              icon={<Sparkles className="w-6 h-6 text-accent" />}
              title="Smart Summarization"
              description="GPT analysiert dein Meeting, erkennt wichtige Inhalte und filtert Relevantes heraus."
            />
            <Feature
              icon={<Sliders className="w-6 h-6 text-accent" />}
              title="Customizable Results"
              description="Passe Ton, Detailgrad oder Format nach deinem Bedarf an."
            />
            <Feature
              icon={<FileText className="w-6 h-6 text-accent" />}
              title="Use Any Audio"
              description="Egal ob Zoom-Aufzeichnung, Sprachnotiz oder Podcast - einfach hochladen."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="bg-accent p-3 rounded-full">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
