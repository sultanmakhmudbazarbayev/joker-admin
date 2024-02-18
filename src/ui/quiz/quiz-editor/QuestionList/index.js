import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Button } from 'antd';
import styles from './QuestionList.module.scss';
import { _createQuestion, _fetchQuestionById, _fetchQuizById } from '@/pages/api/requests';
import { setQuizData } from '@/application/store/reducers/quizSlice';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';

const QuestionList = (props) => {
    const { className } = props;
    const chosenRound = useSelector((state) => state.chosenRound.data);
    const quizData = useSelector((state) => state.quiz.data);
    
    const dispatch = useDispatch();
    const currentRound = quizData.rounds.find((round) => round.count === chosenRound.count);
    const questions = currentRound ? currentRound.questions : [];

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

    return (
        <div className={className}>
            <List
                className={styles.questionList}
                grid={{ gutter: 16, column: 1 }}
                dataSource={questions}
                renderItem={(item) => (
                    <List.Item className={styles.questionListItem}>
                        <div className={styles.questionCardWrapper}>
                            <h4>Question {item.order}</h4>
                            <div className={styles.questionCard} onClick={() => onQuestionClick(item.id)}>
                                <img src={item.image} alt={`Question ${item.order}`}></img>
                            </div>
                        </div>
                    </List.Item>
                )}
                footer={
                    <div className={styles.addQuestion}>
                        <Button type="primary" onClick={onAddQuestion}>Add Question</Button>
                    </div>
                }
            />
        </div>
    );
};

export default QuestionList;
