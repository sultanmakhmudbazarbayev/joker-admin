import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Button, message } from 'antd';
import styles from './QuestionList.module.scss';
import { _createQuestion, _fetchQuestionById, _fetchQuizById, _deleteQuestionById } from '@/pages/api/requests';
import { setQuizData } from '@/application/store/reducers/quizSlice';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { UploadOutlined, DeleteOutlined, FileImageOutlined } from '@ant-design/icons';

const QuestionList = (props) => {
    const dispatch = useDispatch();
    const { className } = props;
    const chosenRound = useSelector((state) => state.chosenRound.data);
    const quizData = useSelector((state) => state.quiz.data);
    
    // Added local state for questions
    const [localQuestions, setLocalQuestions] = useState([]);

    // Effect to update local questions based on redux state
    useEffect(() => {
        const currentRound = quizData.rounds && chosenRound ? quizData.rounds.find((round) => round.count === chosenRound.count) : null;
        setLocalQuestions(currentRound ? currentRound.questions : []);
    }, [quizData, chosenRound]);

    const onQuestionClick = async (questionId) => {
        try {
            const question = await _fetchQuestionById(questionId);
            dispatch(setChosenQuestion(question.data.question))
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const onAddQuestion = async () => {
        const quizId = quizData.id;
        const roundId = chosenRound.id;
        await _createQuestion({
            quiz_id: quizId,
            round_id: roundId,
        });
        const roundData = await _fetchQuizById(quizId);
        dispatch(setQuizData(roundData.data.quiz));
    };

    const onDeleteQuestion = async (id) => {
        try {
            await _deleteQuestionById(id);
            // Update local questions state to reflect the deletion
            setLocalQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
        } catch (error) {
            message.error('Failed to delete question');
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className={className}>
            <List
                className={styles.questionList}
                grid={{ gutter: 16, column: 1 }}
                dataSource={localQuestions}
                renderItem={(item, index) => (
                    <List.Item className={styles.questionListItem}>
                        <div className={styles.questionCardWrapper}>
                            <h4>Вопрос {index+1}</h4>
                            <div className={styles.questionCard} onClick={() => onQuestionClick(item.id)}>
                                {item.image 
                                    ? <img src={process.env.NEXT_PUBLIC_BASE_URL + item.image} alt={`Question ${item.order}`}></img>
                                    : <p>No Image</p>
                                }
                                <Button danger style={{
                                    position: "absolute",
                                    right: "0px",
                                    top: "0"
                                }} icon={<DeleteOutlined />} onClick={(e) => {
                                    e.stopPropagation(); // Prevent clicking the card from triggering
                                    onDeleteQuestion(item.id);
                                }} />
                            </div>
                        </div>
                    </List.Item>
                )}
                footer={
                    <div className={styles.addQuestion}>
                        <Button type="primary" onClick={onAddQuestion}>Добавить вопрос</Button>
                    </div>
                }
            />
        </div>
    );
};

export default QuestionList;
