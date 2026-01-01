import "./App.css";
import { useEffect, useState } from "react";
import socket from "./socket";
import Board from "./components/Board";
import Leaderboard from "./components/Leaderboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
function App() {
const [username, setUsername] = useState("");
const [game, setGame] = useState(null);
const [winner, setWinner] = useState(null);
const [isWaiting, setIsWaiting] = useState(false);
const [countdown, setCountdown] = useState(10);
useEffect(() => {
const onGameStarted = (game) => {

  setGame(game);

  setWinner(null);

  setIsWaiting(false);

};



const onRejoin = (game) => {

  setGame(game);

  setIsWaiting(false);

};



const onBoardUpdate = (game) => {

  setGame({ ...game });

};



const onGameEnd = ({ winner }) => {

  setWinner(winner);

};



socket.on("GAME_STARTED", onGameStarted);

socket.on("REJOIN_SUCCESS", onRejoin);

socket.on("BOARD_UPDATE", onBoardUpdate);

socket.on("GAME_END", onGameEnd);

socket.on("disconnect", () => {

  setGame(null);

  setWinner(null);

});



return () => {

  socket.off("GAME_STARTED", onGameStarted);

  socket.off("REJOIN_SUCCESS", onRejoin);

  socket.off("BOARD_UPDATE", onBoardUpdate);

  socket.off("GAME_END", onGameEnd);

  socket.off("disconnect");

};

}, []);
useEffect(() => {
if (!isWaiting) return;



if (countdown === 0) return;



const timer = setTimeout(() => {

  setCountdown((prev) => prev - 1);

}, 1000);



return () => clearTimeout(timer);

}, [isWaiting, countdown]);
const joinGame = () => {
if (!username) return;



setIsWaiting(true);

setCountdown(10);



socket.emit("JOIN_GAME", username);

};
const playAgain = () => {
setGame(null);

setWinner(null);



setIsWaiting(true); // 👈 restart waiting UI

setCountdown(10); // 👈 restart timer



socket.emit("JOIN_GAME", username);

};
const newGame = () => {
setGame(null);

setWinner(null);

setUsername("");

};
return (
<div className="app-container">

  <div className="game-layout">

    {/* LEFT SIDE */}

    <div>

      {!game ? (

        <div className="join-card">

          <h1>🎮 4 in a Row</h1>



          <input

            className="username-input"

            placeholder="Enter username"

            value={username}

            onChange={(e) => setUsername(e.target.value)}

            disabled={isWaiting}

          />



          <button

            className="primary-btn"

            onClick={joinGame}

            disabled={isWaiting}

          >

            {isWaiting ? "Searching..." : "Join Game"}

          </button>



          {isWaiting && (

            <div className="waiting-box">

              <p>⏳ Waiting for another player…</p>

              <p>

                Bot will join in <strong>{countdown}</strong> seconds

              </p>

            </div>

          )}

        </div>

      ) : (

        <>

          <div className="game-header">

            <h3>Game ID</h3>

            <p>{game.gameId}</p>



            <div className="turn-indicator">

              Current Turn:{" "}

              <strong>

                {typeof game.currentTurn === "string"

                  ? game.currentTurn === "BOT"

                    ? "🤖 BOT"

                    : game.currentTurn

                  : "Waiting..."}

              </strong>

            </div>

          </div>



          <Board game={game} socket={socket} />



          {/* GAME OVER MODAL */}

          {winner && (

            <div className="game-over-overlay">

              <div className="game-over-card">

                <h2>Game Over</h2>



                {winner === "DRAW" ? (

                  <h3>🤝 It's a Draw!</h3>

                ) : winner === "BOT" ? (

                  <h3>🤖 BOT Wins</h3>

                ) : (

                  <h3>🏆 {winner} Wins</h3>

                )}



                <div className="game-over-actions">

                  <button className="primary-btn" onClick={playAgain}>

                    🔁 Play Again

                  </button>



                  <button className="secondary-btn" onClick={newGame}>

                    🆕 New Game

                  </button>

                </div>

              </div>

            </div>

          )}

        </>

      )}

    </div>



    {/* RIGHT SIDE (ALWAYS VISIBLE) */}

    <Leaderboard />

    <AnalyticsDashboard />

  </div>

</div>

);
}
export default App;