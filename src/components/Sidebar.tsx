import { Dispatch, SetStateAction } from "react";

type SidebarProps = {
  notes: Note[];
  onAddNote: () => Promise<void>;
  activeNote: Note | null;
  setActiveNote: Dispatch<SetStateAction<Note | null>>;
};

const Sidebar = ({
  notes,
  onAddNote,
  activeNote,
  setActiveNote,
}: SidebarProps): JSX.Element => {
  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-header">
        <h1>Notes</h1>
        <button onClick={onAddNote}>Add</button>
      </div>
      <div className="app-sidebar-notes">
        {sortedNotes.map((note) => (
          <div
            className={`app-sidebar-note ${
              note.id === activeNote?.id && "active"
            }`}
            onClick={() => setActiveNote(note)}
          >
            <p>{note.body && note.body.substr(0, 100) + "..."}</p>
            <small className="note-meta">
              Last Modified{" "}
              {new Date(note.lastModified).toLocaleDateString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
