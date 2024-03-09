import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { initSocket, subscribeToEvent, disconnectSocket, emitEvent } from "@/socket";
import Lobby from "@/ui/quiz-session/components/Lobby";
import { useSelector } from "react-redux";
import Playthrough from "./components/Playthrough";
import SessionTeams from "./components/SessionTeams";
import useSocket from "@/hooks/useSocket";

const QuizSession = (props) => {
    const { id } = props;
    const socket = useSocket()
    const [teams, setTeams] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [teamsCreated, setTeamCreated] = useState(false);

    const handleStartGame = () => {
        console.log('Start game button clicked');
        setQuizStarted(true)
      };

      useEffect(() => {
        if (socket) {
            const handleTeamJoined = (team) => {
                if (team && !teams.some(teamInRoom => teamInRoom.id === team.id)) {
                    setTeams(prevTeams => [...prevTeams, team]);
                }
            };
    
            const handleTeamLeft = (team) => {
                if (team) {
                    setTeams(prevTeams => prevTeams.filter(prevTeam => team.id && prevTeam.id !== team.id));
                }
            };
    
            // Subscribe to socket events
            socket.on('team-joined', handleTeamJoined);
            socket.on('team-left', handleTeamLeft);
    
            // Cleanup function to unsubscribe from events
            return () => {
                socket.off('team-joined', handleTeamJoined);
                socket.off('team-left', handleTeamLeft);
            };
        }
    }, [socket, teams]); // Note: Added 'teams' as a dependency if its state is used outside the useEffect
    

    return (
        <>  
            {!teamsCreated && <SessionTeams />}
            {!quizStarted
            ? <Lobby teams={teams} handleStartGame={handleStartGame} />
            : <Playthrough teams={teams} handleStartGame={handleStartGame} />}
        </>
    );
};

export default QuizSession;
