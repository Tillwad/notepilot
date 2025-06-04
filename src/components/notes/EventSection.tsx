"use client";

import { useState } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type EventItem = {
  id: string;
  title: string;
  location?: string;
  date?: string;
  time?: string;
};

export default function EventChecklist({ events }: { events: EventItem[] }) {
  const [stateEvents, setStateEvents] = useState<EventItem[]>(events);
  const [editId, setEditId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<EventItem>>({});

  const handleDelete = (id: string) => {
    if (!confirm("Bist du sicher, dass du dieses Ereignis löschen möchtest?"))
      return;

    const deleteEvent = async () => {
      try {
        await fetch("/api/data/events", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId: id }),
        });
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
      }
    };

    deleteEvent();
    setStateEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (event: EventItem) => {
    setEditId(event.id);
    setFormState({ ...event });
  };

  const handleSaveEdit = async (id: string) => {
    const updated = stateEvents.map((e) =>
      e.id === id ? { ...e, ...formState } : e,
    );
    setStateEvents(updated);
    setEditId(null);
    setFormState({});

    try {
      await fetch("/api/data/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id, ...formState }),
      });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
    }
  };

  return (
    <ul className="space-y-2">
      {stateEvents.map((event) => (
        <li key={event.id} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 w-full">
              {editId === event.id ? (
                <div className="space-y-2">
                  <Input
                    value={formState.title || ""}
                    placeholder="Titel"
                    onChange={(e) =>
                      setFormState({ ...formState, title: e.target.value })
                    }
                  />
                  <Input
                    value={formState.location || ""}
                    placeholder="Ort"
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      className="w-full"
                      value={formState.date || ""}
                      onChange={(e) =>
                        setFormState({ ...formState, date: e.target.value })
                      }
                    />
                    <Input
                      type="time"
                      className="w-full"
                      value={formState.time || ""}
                      onChange={(e) =>
                        setFormState({ ...formState, time: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <h3 className="text-gray-800 font-semibold text-base">
                      {event.title}
                    </h3>
                    {(event.date || event.time) && (
                      <span className="text-sm text-gray-500">
                        {event.date &&
                          new Date(event.date).toLocaleDateString("de-DE")}
                        {event.date && event.time && " "}
                        {event.time && event.time}
                      </span>
                    )}
                  </div>
                  {event.location && (
                    <p className="text-gray-600 text-sm mt-1">
                      {event.location}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-1 items-end ml-4">
              {editId === event.id ? (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleSaveEdit(event.id)}
                >
                  <Save className="w-4 h-4 text-green-500" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEdit(event)}
                >
                  <Pencil className="w-4 h-4 text-blue-500" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
