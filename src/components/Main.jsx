import { useEffect, useRef, useState } from "react";
import Mention from "./Mention";
import MentionList from "./MentionList";

const Main = ({ activeNote, onUpdateNote }) => {
  const [mentionOpen, setMentionOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const ref = useRef(null);
  const activeNoteRef = useRef(null);

  const saveNote = async () => {
    try {
      const sessionId = sessionStorage.getItem("notes-session-id");
      const res = await fetch(
        `https://challenge.surfe.com/${sessionId}/notes/${activeNoteRef.current.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ body: activeNoteRef.current.body }),
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    setMentionOpen(true);
    fetch("https://challenge.surfe.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.slice(0, 5));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    activeNoteRef.current = activeNote;
  }, [activeNote]);

  useEffect(() => {
    const textArea = ref.current;
    let timeoutId;

    if (textArea) {
      textArea.addEventListener("keyup", function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(saveNote, 1000);
      });
      textArea.addEventListener("keydown", function (event) {
        if (event.key === "@") {
          getUsers();
        }
        if (event.key === "Backspace") {
          setMentionOpen(false);
        }
      });
    }

    return () => clearTimeout(timeoutId);
  }, [ref.current]);

  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };

  const handleMention = (user) => {
    const cursorStart = ref.current.selectionStart;
    const cursorEnd = ref.current.selectionEnd;
    let textBefore = activeNote.body.slice(0, cursorStart);
    let textAfter = activeNote.body.slice(cursorEnd);

    onUpdateNote({
      ...activeNote,
      ["body"]: `${textBefore}${user.username}${textAfter}`,
      lastModified: Date.now(),
    });

    ref.current.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
      })
    );
    setMentionOpen(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const mention = event.dataTransfer.getData("text");
    const index = event.target.selectionStart;
    const before = activeNote.body.slice(0, index);
    const after = activeNote.body.slice(index);

    onUpdateNote({
      ...activeNote,
      ["body"]: `${before}@${mention}${after}`,
      lastModified: Date.now(),
    });

    ref.current.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Enter",
      })
    );
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <MentionList />
        <textarea
          ref={ref}
          placeholder="Write your note here..."
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
        {mentionOpen && (
          <Mention
            users={users}
            handleMention={handleMention}
            setMentionOpen={setMentionOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
