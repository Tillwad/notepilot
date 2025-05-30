import { Check, X } from "lucide-react";

export default function VergleichSection() {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-12">Vergleiche der <span className="text-accent">Abos</span></h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 font-semibold">Funktion</th>
                <th className="p-3 font-semibold">Free</th>
                <th className="p-3 font-semibold">Bronze</th>
                <th className="p-3 font-semibold">Silber</th>
                <th className="p-3 font-semibold">Gold</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {[
                ["Unbegrenzte Transkriptionen", false, true, true, true],
                ["Themenliste", true, true, true, true],
                ["ToDo-Liste", true, true, true, true],
                ["Events-Liste", true, true, true, true],
                ["Audio-Upload", true, true, true, true],
                ["Video-Upload", true, false, true, true],
                ["Export & Teilen", false, false, true, true],
                ["Video speichern", false, false, false, true],
                ["Vorschau mit Zeitstempel", false, false, false, true],
                ["PDF/Image Upload", false, false, false, true],
                ["GPT-Version", "GPT-3.5", "GPT-3.5", "GPT-4o", "GPT-4.1"],
              ].map(([feature, free, bronze, silber, gold], i) => (
                <tr key={i} className="border-b">
                  <td className="text-left p-3">{feature}</td>
                  {[free, bronze, silber, gold].map((val, idx) => (
                    <td key={idx} className="p-3">
                      <div className="flex justify-center items-center">
                        {val === true ? (
                          <Check className="text-green-600" />
                        ) : val === false ? (
                          <X className="text-destructive" />
                        ) : (
                          <span className="font-medium">{val}</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
