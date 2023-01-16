import OutsideAlerter from "./ClickOutsideDetect";
import { Dispatch, SetStateAction } from "react";

type MentionProps = {
  users: User[];
  handleMention: (user: User) => void;
  setMentionOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
};

const Mention = ({
  users,
  handleMention,
  setMentionOpen,
  isLoading = true,
}: MentionProps): JSX.Element => (
  <OutsideAlerter callback={() => setMentionOpen(false)}>
    {isLoading ? null : (
      <ul className="mention-widget">
        {users.map((user) => (
          <li onClick={() => handleMention(user)}>{user.username}</li>
        ))}
      </ul>
    )}
  </OutsideAlerter>
);

export default Mention;
