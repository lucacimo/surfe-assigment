import { useState, useEffect } from "react";

const MentionList = () => {
  const [mostMentionedUsers, setMostMentionedUsers] = useState([]);

  useEffect(() => {
    // Fetch the most mentioned users from the API
    fetch("https://challenge.surfe.com/users/mostMentioned")
      .then((res) => res.json())
      .then((data) => {
        setMostMentionedUsers(data);
      });
  }, []);

  const handleDragStart = (event) => {
    event.dataTransfer.setData("text", event.target.innerText);
  };

  return (
    <div>
      <h3>Most Mentioned Users</h3>
      <ul className="most-mentioned">
        {mostMentionedUsers.map((user) => (
          <li key={user.id} draggable={true} onDragStart={handleDragStart}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentionList;
