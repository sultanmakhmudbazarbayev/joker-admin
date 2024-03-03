import React, { useEffect, useState } from 'react';
import { emitEvent, subscribeToEvent, unsubscribeFromEvent } from '@/socket'; // Adjust paths as necessary
import { Button } from 'antd';
import { useSelector } from 'react-redux';

const Lobby = (props) => {
  const {teams, handleStartGame} = props;
  const socketClient = useSelector((state) => state.socket.data);

  return (
    <div className="lobby">
      <h2>Lobby</h2>
      <div className="teams">
        {teams.map((team) => (
          <div key={team.id} className="team"> {/* Use team.id instead of index for keys */}
            {team.name}
          </div>
        ))}
      </div>
      <style jsx>{`
        .lobby {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          height: 95vh;
        }
        .teams {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          width: 1200px;
          height: 650px;
          margin-top: 20px;
          border: 1px solid black;
          padding: 20px;
        }
        .team {
          background-color: #f4f4f4;
          border-radius: 8px;
          border: 1px solid black;
          padding: 10px 20px;
          margin: 5px;
          height: 40px;
          font-size: 18px;
        }
      `}</style>

            <Button
              type="primary"
              block
              size="large"
              style={{
                width: "10%",
                marginTop: "30px"
              }}
              onClick={handleStartGame}
            >
              Start Game
            </Button>
    </div>
  );
};

export default Lobby;
