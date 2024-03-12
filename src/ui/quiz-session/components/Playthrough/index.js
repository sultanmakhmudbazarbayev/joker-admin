import React, { useEffect, useState } from 'react';
import { Button, List, Modal, Select, Collapse, Input } from 'antd';
import { useSelector } from 'react-redux';
import styles from './Playthrough.module.scss';
import { staticScreens, maxNumberOfSLides } from '@/constants';
import useSocket from '@/hooks/useSocket';
import { _fetchQuizById, _fetchRoundById } from '@/pages/api/requests';

const { Option } = Select;
const { Panel } = Collapse;

const Playthrough = (props) => {
  const [currentStage, setCurrentStage] = useState('slides'); // 'slides', 'round', 'results', 'total'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizData, setQuizData] = useState(null);

  const includedTeams = useSelector((state) => state.teams.data);

  const [modalQuestions, setModalQuestions] = useState([])
  const [modalRounds, setRounds] = useState([])
  const [modalSelectedRound, setModalSelectedRound] = useState(null);
  const [modalRoundResultsData, setModalRoundResultsData] = useState([]);


  const [isModalVisible, setIsModalVisible] = useState(false);

  const socket = useSocket();
  const {teams, id: quizId} = props;

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRoundChange = async (value) => {
    console.log('round change', value)
    
    const response = await _fetchRoundById(value);

    setModalSelectedRound(response.data.round);
    setModalQuestions(response.data.round.questions);
    
  };

  const handleTeamInputChange = (round, question, team, e) => {
    
    
    socket.emit("set-team-points", {roundId: round.id, questionId: question.id, teamId: team.id, points: e.target.value});





    console.log(e.target.value)
  }


  const nextSlide = () => {
    socket.emit("next-slide", 'next-slide')
  }

  const prevSlide = () => {
    socket.emit("prev-slide", 'prev-slide')
  }

  const nextRound = () => {
    socket.emit("next-round", 'next-round')
}

const startRound = () => {
  socket.emit("start-round", 'start-round')
}

const resultsAfterRound4 = () => {
  setIsModalVisible(true)
  setRounds([quizData.rounds[0], quizData.rounds[1], quizData.rounds[2], quizData.rounds[3]])

  console.log('teams', teams)
  // socket.emit("get-quiz-session data", 'start-round')

  console.log('set results after round 4')
}

const resultsAfterRound8 = () => {
  setIsModalVisible(true)
  setRounds([quizData.rounds[4], quizData.rounds[5], quizData.rounds[6], quizData.rounds[7]])
  console.log('set results after round 8')
}

const finishGame = () => {
  console.log('game finished')
}

useEffect(() => {
  const handleBeforeUnload = (e) => {
          e.preventDefault();
          e.returnValue = '';
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);

useEffect(() => {

  console.log('includedTeams', includedTeams)
    socket.emit('join-teams-manually', {teams: includedTeams});
})


const editTeamPoints = (round, quesiton, team) => {

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "left", textAlign: "left", width: "100%", position: "relative", }}>
      <h3 style={{ marginRight: '40px', width: "70%" }}>{team.name}</h3>
      <Input 
        type="number" 
        min="0" 
        style={{ width: '25%', position: "absolute", right: "0", top: "0", border: "1px solid black" }} // Adjust width as needed
        onChange={(e) => handleTeamInputChange(round, quesiton, team, e)} // Replace with your handling function
      />
    </div>
  )
}
 

useEffect(() => {
  const fetchQuiz = async (id) => {
    const response = await _fetchQuizById(id);
    setQuizData(response.data.quiz)
  }

  fetchQuiz(quizId);

}, [isModalVisible]);


  return (
    <div className={styles.playthrough}>
      <div className={styles.playthroughLeft}>
        <div className={styles.buttons}>
          <Button
                type="primary"
                block
                size="large"
                className={styles.button}
                style={{
                  width: "100%"
                }}
                onClick={nextSlide}
              >
                Следующий слайд
              </Button>
            <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              onClick={prevSlide}
            >
              Предыдущий слайд
            </Button>
        </div>
      </div>


      <div className={styles.playthroughCenter}>
        <h1></h1>
      </div>

    

      <div className={styles.playthroughRight}>
        <div className={styles.buttons}>
        <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              onClick={resultsAfterRound4}
            >
              Ввести данные после 4 раунда
            </Button>
            <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              style={{
                marginBottom: "40px"
              }}
              onClick={resultsAfterRound8}
            >
              Ввести данные после 8 раунда
            </Button>
            
          <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              onClick={startRound}
            >
              Следующий вопрос
            </Button>
            <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              onClick={nextRound}
            >
              Начать вопрос
            </Button>

            <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              style={{
                marginTop: "40px"
              }}
              onClick={finishGame}
            >
              Завершить игру
            </Button>
        </div>
      
      </div>

      <Modal title="Введите очки команд за каждый кон" width={1200} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Select
          defaultValue="Выберите кон"
          style={{ width: 200, marginBottom: 20, marginTop: 10 }}
          onChange={handleRoundChange}
        >
          {modalRounds.map((round) => (
            <Option key={round.id} value={round.id}>{round.name}</Option>
          ))}
        </Select>
        <Collapse accordion>
          {modalQuestions.map(question => (
            <Panel header={question.question} key={question.id}>
              <List
                dataSource={teams}
                renderItem={team => (
                  <List.Item style={{
                    height: "20px",
                    marginTop: "20px"
                  }}>
                    {editTeamPoints(modalSelectedRound, question, team)}
                  </List.Item>
                )}
              />
            </Panel>
          ))}
        </Collapse>
      </Modal>
    </div>
  );
};

export default Playthrough;