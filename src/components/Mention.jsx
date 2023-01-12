import ClickOutsideDetect from "./ClickOutsideDetect";
import OutsideAlerter from "./ClickOutsideDetect";

const Mention = ({ users, handleMention, setMentionOpen }) => (
  <OutsideAlerter callback={setMentionOpen}>
    <ul className="mention-widget">
      {users.map((user) => (
        <li onClick={() => handleMention(user)}>{user.username}</li>
      ))}
    </ul>
  </OutsideAlerter>
);

export default Mention;
