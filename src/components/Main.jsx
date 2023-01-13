import { useEffect, useRef, useState } from "react";
import Mention from "./Mention";
import MentionList from "./MentionList";
import { getCaretCoordinates } from "../utils/utils";

const Main = ({ activeNote, onUpdateNote }) => {
  const [mentionOpen, setMentionOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const ref = useRef(null);

  const saveNote = async () => {
    try {
      const sessionId = sessionStorage.getItem("notes-session-id");
      const res = await fetch(
        `https://challenge.surfe.com/${sessionId}/notes/${activeNote.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ body: activeNote.body }),
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let getData;
    if (activeNote) {
      getData = setTimeout(() => {
        saveNote();
      }, 2000);
    }

    return () => clearTimeout(getData);
  }, [activeNote]);

  const getUsers = async () => {
    setLoading(true);
    fetch("https://challenge.surfe.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.slice(0, 5));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

    setMentionOpen(false);
  };

  const displayUsers = (event) => {
    if (event.key === "@") {
      setMentionOpen(true);
      getUsers();
    }
    if (event.key === "Backspace") {
      setMentionOpen(false);
    }
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
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <MentionList />
      <div className="app-main-note-edit">
        <div className="backdrop">
          <div className="highlights" />
        </div>
        <textarea
          ref={ref}
          placeholder="Write your note here..."
          value={activeNote.body}
          onKeyDown={displayUsers}
          onChange={(e) => onEditField("body", e.target.value)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
        {mentionOpen && (
          <div
            style={{
              position: "absolute",
              top:
                getCaretCoordinates(ref.current, ref.current.selectionStart)
                  .top + 10,
              left: getCaretCoordinates(ref.current, ref.current.selectionStart)
                .left,
            }}
          >
            <Mention
              users={users}
              isLoading={isLoading}
              handleMention={handleMention}
              setMentionOpen={setMentionOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
