import { useEffect, useState } from "react";
import "./App.css";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("notes-session-id");
    if (!sessionId) {
      const uuid = window.crypto.randomUUID();
      sessionStorage.setItem("notes-session-id", uuid);
    }
    const loadNotes = async () => {
      try {
        const sessionId = sessionStorage.getItem("notes-session-id");
        const res = await fetch(
          `https://challenge.surfe.com/${sessionId}/notes`
        );
        const data = await res.json();
        setNotes(data.map((note) => ({ ...note, lastModified: Date.now() })));

        if (data.length > 0) {
          setActiveNote(data[data.length - 1]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadNotes();
  }, []);

  const onAddNote = async () => {
    try {
      const sessionId = sessionStorage.getItem("notes-session-id");
      const res = await fetch(
        `https://challenge.surfe.com/${sessionId}/notes`,
        {
          method: "POST",
          body: JSON.stringify({ body: "Hi, this is a new note" }),
          headers: { "Content-Type": "application/json" },
        }
      );
      let newNote = await res.json();
      newNote = { ...newNote, lastModified: Date.now() };
      setNotes([newNote, ...notes]);
      setActiveNote(newNote);
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }

      return note;
    });
    setNotes(updatedNotesArr);
    setActiveNote(updatedNote);
  };

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main activeNote={activeNote} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;
