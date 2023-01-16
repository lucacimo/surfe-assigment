import React, {
  DragEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Mention from "./Mention";
import MentionList from "./MentionList";
import { getCaretCoordinates } from "../utils/utils";

type MainProps = {
  activeNote: Note | null;
  onUpdateNote: (updatedNote: Note) => void;
};

const Main = ({ activeNote, onUpdateNote }: MainProps): JSX.Element => {
  const [mentionOpen, setMentionOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const refHighlight = useRef<HTMLDivElement>(null);
  const refBackdrop = useRef<HTMLDivElement>(null);

  const saveNote = async () => {
    try {
      const sessionId = sessionStorage.getItem("notes-session-id");
      if (activeNote !== null) {
        const res = await fetch(
          `https://challenge.surfe.com/${sessionId}/notes/${activeNote.id}`,
          {
            method: "PUT",
            body: JSON.stringify({ body: activeNote.body }),
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  useEffect(() => {
    let getData: ReturnType<typeof setTimeout>;
    if (activeNote) {
      const highlightedText = applyHighlights(activeNote.body);

      if (refHighlight.current !== null) {
        refHighlight.current.innerHTML = highlightedText;
      }

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

  const onEditField = (field: string, value: string) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };

  const handleMention = (user: User) => {
    const cursorStart = ref.current.selectionStart;
    const cursorEnd = ref.current.selectionEnd;
    let textBefore = activeNote.body.slice(0, cursorStart);
    let textAfter = activeNote.body.slice(cursorEnd);

    onUpdateNote({
      ...activeNote,
      ["body"]: `${textBefore}${user.username}${textAfter} `,
      lastModified: Date.now(),
    });

    setMentionOpen(false);
    ref.current.focus();
  };

  const displayUsers = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "@") {
      setMentionOpen(true);
      getUsers();
    }
    if (event.key === "Backspace") {
      setMentionOpen(false);
    }
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const mention = event.dataTransfer.getData("text");
    const index = ref.current.selectionStart;
    const before = activeNote.body.slice(0, index);
    const after = activeNote.body.slice(index);

    onUpdateNote({
      ...activeNote,
      ["body"]: `${before}@${mention}${after} `,
      lastModified: Date.now(),
    });
    ref.current.focus();
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const applyHighlights = (text: string) => {
    return text
      .replace(/\n$/g, "\n\n")
      .replace(/(^|[^\S\n])@(\S+)/g, "$1<mark>@$2</mark>");
  };

  const handleScroll = () => {
    const scrollTop = ref.current.scrollTop;
    refBackdrop.current.scrollTop = scrollTop;
  };

  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <MentionList />
      <div className="app-main-note-edit">
        <div ref={refBackdrop} className="backdrop">
          <div ref={refHighlight} className="highlights" />
        </div>
        <textarea
          ref={ref}
          rows={10}
          onScroll={handleScroll}
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
