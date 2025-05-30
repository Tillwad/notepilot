"use client";

import { useState } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";

type Todo = {
  id: string;
  text: string;
  checked: boolean;
};

export default function TodoChecklist({ todos }: { todos: Todo[] }) {
  const [stateTodos, setStateTodos] = useState<Todo[]>(todos);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const handleToggle = async (index: number) => {
    const updated = [...stateTodos];
    const todoItem = updated[index];
    todoItem.checked = !todoItem.checked;

    setStateTodos(updated);
    try {
      await fetch("/api/data/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todoId: todoItem.id,
          checked: todoItem.checked,
        }),
      });
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      updated[index].checked = !todoItem.checked;
      setStateTodos([...updated]);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bist du sicher, dass du dieses Todo löschen möchtest?")) {
      return;
    }

    const deleteTodo = async (todoId: string) => {
      try {
        await fetch("/api/data/todos", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todoId }),
        });
      } catch (err) {
        console.error("Fehler beim Löschen:", err);
      }
    };

    deleteTodo(id);
    setStateTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleEdit = (id: string, text: string) => {
    setEditId(id);
    setEditText(text);
  };

  const handleSaveEdit = async (id: string) => {
    const updatedTodos = stateTodos.map((todo) =>
      todo.id === id ? { ...todo, text: editText } : todo
    );
    setStateTodos(updatedTodos);
    setEditId(null);
    setEditText("");

    try {
      await fetch("/api/data/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todoId: id, text: editText }),
      });
    } catch (err) {
      console.error("Fehler beim Aktualisieren:", err);
    }
  };

  return (
    <ul className="space-y-2">
      {stateTodos.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border"
        >
          <Checkbox
            id={`todo-${item.id}`}
            name={`todo-${item.id}`}
            checked={item.checked} 
            onClick={() => handleToggle(stateTodos.indexOf(item))} // Verhindert das Schließen des Eingabefelds beim Klicken auf die Checkbox
            className="h-5 w-5"
          />
          {editId === item.id ? (
            <input
              className="flex-1 border-b border-gray-300 text-gray-800 bg-transparent focus:outline-none"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <span
              className={`flex-1 ${
                item.checked ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {item.text}
            </span>
          )}
          <div className="flex gap-1">
            {editId === item.id ? (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleSaveEdit(item.id)}
              >
                <Save className="w-4 h-4 text-green-500" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleEdit(item.id, item.text)}
              >
                <Pencil className="w-4 h-4 text-blue-500" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
