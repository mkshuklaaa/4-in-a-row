import "../App.css";
import { useEffect, useState } from "react";
const AnalyticsDashboard = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("https://four-in-a-row-xlwv.onrender.com/api/analytics")
      .then((res) => res.json())

      .then(setData);
  }, []);
  return (
    <div className="analytics-wrapper">
      <h2>📊 Game Analytics</h2>

      {data.map((d) => (
        <div
          key={d._id}
          style={{
            marginBottom: 20,

            padding: 15,

            border: "1px solid #ccc",

            borderRadius: 10,
          }}
        >
          <h3>Date: {d.date}</h3>

          <p>
            <strong>Total Games:</strong> {d.totalGames}
          </p>

          <p>
            <strong>Avg Duration:</strong>{" "}
            {(d.totalDuration / d.totalGames).toFixed(1)} sec
          </p>

         </div>
      ))}
    </div>
  );
};
export default AnalyticsDashboard;
