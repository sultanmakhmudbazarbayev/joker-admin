import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Input, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import AnswerOption from './AnswerOption';
import styles from './QuestionEditor.module.scss';
import { _saveImage, _updateQuestionData } from '@/pages/api/requests';
import { fetchQuizData } from '@/application/actions/quiz';


const QuestionEditor = ({ className }) => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [image, setImage] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [shouldRefetchQuiz, setShouldRefetchQuiz] = useState(false);

    const question = useSelector(state => state.chosenQuestion.data);
    const quizId = useSelector(state => state.quiz.data.id);



    useEffect(() => {
        if (shouldRefetchQuiz) {
            dispatch(fetchQuizData(quizId));
            setShouldRefetchQuiz(false);
        }

        // console.log('question', question)

    }, [shouldRefetchQuiz]);

    useEffect(() => {
        setImage(question.image || '');
        setQuestionText(question.question || '');
    }, [question]);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return message.error("No file selected.");

        console.log('file', file)

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await _saveImage(formData);
            if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);

            const data = await response.json();
            const values = { image: data.url };
            const updateResponse = await _updateQuestionData(question.id, values);

            if (updateResponse.data.ok) {
                message.success("Question image updated successfully.");
                setShouldRefetchQuiz(true);
            } else {
                message.error("Failed to update question image.");
            }
        } catch (error) {
            message.error(`Upload error: ${error.message}`);
        }
    };

    return (
        <div className={className}>
            <div className={styles.question}>
                <div onClick={() => inputRef.current?.click()} className={styles.image}>
                    {image ? (
                        <img src={image} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: "10px" }} />
                    ) : (
                        <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                    )}
                    <input type='file' onChange={handleImageChange} ref={inputRef} style={{ display: "none" }} />
                </div>
                <Input.TextArea 
                    rows={10}
                    className={styles.textArea}
                    placeholder="Enter your question here"
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                />
            </div>
            <div className={styles.answers}>
                <List
                    dataSource={['1', '2']}
                    renderItem={item => (
                        <List.Item>
                            <AnswerOption />
                        </List.Item>
                    )}
                    footer={
                        <div className={styles.addOption}>
                            <Button type="primary">Add Option</Button>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default QuestionEditor;
