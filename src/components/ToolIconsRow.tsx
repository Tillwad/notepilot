import Image from "next/image";

export default function ToolIconsRow() {
  const images = [
    "/google-meet-logo.svg",
    "/skype-logo.png",
    "/teamviewer-logo.svg",
    "/zoom-logo.svg",
  ];

  return (
    <div className="mt-16 mb-20 md:mb-10 flex flex-col items-center gap-4 opacity-80">
      {/* Titel oben */}
      <span className="text-xs uppercase tracking-widest text-gray-500">
        Perfekt für
      </span>

      {/* Logo-Reihe */}
      <div className="flex flex-wrap justify-center items-center gap-10">
        {/* Google Meet */}
        {images.map((src, index) => (
          <div key={index} className="flex items-center gap-2 font-semibold text-sm">
            <Image
              src={src}
              alt="Logo"
              width={120}
              height={120}
              className="grayscale"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
