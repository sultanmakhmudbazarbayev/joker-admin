import React, { useEffect, useState } from 'react';
import { Input, Checkbox, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AnswerOption.module.scss';
import { _deleteQuestionAnswer, _fetchQuestionById, _updateQuestionAnswer } from '@/pages/api/requests';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { useDispatch } from 'react-redux';

const AnswerOption = (props) => {
    const dispatch = useDispatch();
    const { answer, question } = props; // Ensure you're passing the correct props
    const [isCorrect, setIsCorrect] = useState(false);
    const [answerText, setAnswerText] = useState(answer?.text || ''); // Assuming there's a text field in your answer object

    useEffect(() => {
        if (answer) {
            setIsCorrect(answer.correct);
        }
    }, [answer]);

    const onDelete = async () => {
        await _deleteQuestionAnswer(answer.id);

        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question));
    };

    const onUpload = () => {
        // Logic for upload
    };

    const onCorrectChange = async (e) => {
        await _updateQuestionAnswer(answer.id, {correct: e.target.checked ? 1 : 0})

        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question));
        
    };

    return (
        <div className={styles.optionContainer}>
            <Checkbox
                className={styles.correctIndicator}
                checked={isCorrect}
                onChange={onCorrectChange} // Changed here
            />
            <Input.TextArea
                rows={2}
                className={styles.textArea}
                placeholder="Enter your answer here"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)} // Control the input
            />
            <div className={styles.actionIcons}>
                <Button icon={<UploadOutlined />} onClick={onUpload} />
                <Button danger icon={<DeleteOutlined />} onClick={onDelete} />
            </div>
        </div>
    );
};

export default AnswerOption;
