import "./Board.css";
import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="leaderboard">
      <h3>🏆 Leaderboard</h3>
      <ul>
        {data.map((u) => (
          <li key={u._id}>
            <span>{u.username}</span>
            <span>{u.wins}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;