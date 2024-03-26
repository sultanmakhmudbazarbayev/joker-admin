import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Input, Button, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import AnswerOption from './AnswerOption';
import OpenAnswer from './OpenAnswer';
import styles from './QuestionEditor.module.scss';
import { _createQuestionAnswer, _fetchQuestionById, _fetchQuestionTypeById, _saveImage, _updateQuestionAnswer, _updateQuestionData } from '@/pages/api/requests';
import { fetchQuizData } from '@/application/actions/quiz';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { debounce } from 'lodash';


const QuestionEditor = ({ className }) => {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const [image, setImage] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [shouldRefetchQuiz, setShouldRefetchQuiz] = useState(false);
    const [isWithOptions, setIsWithOptions] = useState(true);

    const question = useSelector(state => state.chosenQuestion.data);
    const quizId = useSelector(state => state.quiz.data.id);
    const [answers, setAnswers] = useState([]);

    const updateQuestionText = useCallback(debounce(async (newText) => {
        await _updateQuestionData(question.id, { question: newText });
        
        const updatedQuestion = await _fetchQuestionById(question.id);

        console.log('updatedQuestion', updatedQuestion)

        dispatch(setChosenQuestion(updatedQuestion.data.question));
    }, 1000), [question]); // Debounce this function
    

    useEffect(() => {
        if (shouldRefetchQuiz) {
            dispatch(fetchQuizData(quizId));
            setShouldRefetchQuiz(false);
        }

    }, [shouldRefetchQuiz]);

    useEffect(() => {
        if(question) {
            setImage(question.image || '');
            setQuestionText(question.question || '');
            setAnswers(question.answers)
    
            const fetchTypeById = async (id) => {
                try {
                  const type = await _fetchQuestionTypeById(id);
                    
                  if(type.data.type.technical_name === 'with_answers') {
                    setIsWithOptions(true)
                  } else {
                    setIsWithOptions(false)
                  }
          
                } catch (error) {
                  console.error('Error fetching question type:', error);
                }
              };
              fetchTypeById(question.question_type_id);
        }
    }, [question]);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return message.error("No file selected.");

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

    const onAddAnswerOption = async (event) => {

        await _createQuestionAnswer(question.id, {})

        const updatedQuestion = await _fetchQuestionById(question.id);

        dispatch(setChosenQuestion(updatedQuestion.data.question))

    }

    const onTextChange = (e) => {
        console.log("e.target.value", e.target.value)
        setQuestionText(e.target.value);
        updateQuestionText(e.target.value); // Update text in the backend debounced
    };

    const onDelete = async () => {
        try {

            const updateResponse = await _updateQuestionData(question.id, {image: null});

            if (updateResponse.data.ok) {
                message.success("Question image deleted successfully.");
                setShouldRefetchQuiz(true);
            } else {
                message.error("Failed to delete question image.");
            }
        } catch (error) {
            message.error(`Upload error: ${error.message}`);
        }
    }

    return (
        <div className={className}>
            <div className={styles.question}>
                <p style={{
                    position: "absolute",
                    marginTop: "10px",
                    marginLeft: "10px",
                    top: "0",
                    left: "0"
                }}>Вопрос {question ? question.order : ""}</p>
                <div onClick={() => inputRef.current?.click()} className={styles.image}>
                    {image ? (
                        <img src={process.env.NEXT_PUBLIC_BASE_URL + image} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: "10px" }} />
                    ) : (
                        <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                    )}
                    <input type='file' onChange={handleImageChange} ref={inputRef} style={{ display: "none" }} />
                    <Button danger style={{
                        position: "absolute",
                        top: "0",
                        right: "0"
                    }} icon={<DeleteOutlined />} onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        onDelete();
                    }} />
                </div>
                <Input.TextArea 
                    rows={10}
                    className={styles.textArea}
                    placeholder="Enter your question here"
                    value={questionText}
                    onChange={onTextChange}
                />
            </div>
                
            <div className={styles.answers}>
            { isWithOptions ? 
                <List
                    dataSource={answers}
                    renderItem={item => (
                        <List.Item>
                            <AnswerOption key={item.id} answer={item} question={question}/>
                        </List.Item>
                    )}
                    footer={
                        <div className={styles.addOption}>
                            <Button type="primary" onClick={onAddAnswerOption}>Добавить вариант ответа</Button>
                        </div>
                    }
                /> : 

                <OpenAnswer question={question} />
                }
            </div> 
        </div>
    );
};

export default QuestionEditor;
