import OutsideAlerter from "./ClickOutsideDetect";

const Mention = ({
  users,
  handleMention,
  setMentionOpen,
  isLoading = true,
}) => (
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
