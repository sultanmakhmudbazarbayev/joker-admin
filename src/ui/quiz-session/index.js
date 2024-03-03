import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { initSocket, subscribeToEvent, disconnectSocket, emitEvent } from "@/socket";
import Lobby from "@/ui/quiz-session/components/Lobby";
import { useSelector } from "react-redux";
import Playthrough from "./components/Playthrough";
import SessionTeams from "./components/SessionTeams";

const QuizSession = (props) => {
    const { id } = props;
    const socketClient = useSelector((state) => state.socket.data);
    const [teams, setTeams] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [teamsCreated, setTeamCreated] = useState(false);

    const handleStartGame = () => {
        console.log('Start game button clicked');
        setQuizStarted(true)
      };

    useEffect(() => {
        const handleTeamJoined = (team) => {
            if (team) {
                setTeams(prevTeams => [...prevTeams, team]);
            }
        };
    
        const handleTeamLeft = (team) => {
            if (team) {
                setTeams(prevTeams => prevTeams.filter(prevTeam => team.id && prevTeam.id !== team.id));
            }
        };
    
        subscribeToEvent(socketClient, 'team-joined', handleTeamJoined);
        subscribeToEvent(socketClient, 'team-left', handleTeamLeft);

    }, [id, socketClient]);

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
