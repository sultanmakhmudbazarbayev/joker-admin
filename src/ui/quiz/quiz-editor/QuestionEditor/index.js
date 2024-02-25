import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Input, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import AnswerOption from './AnswerOption';
import OpenAnswer from './OpenAnswer';
import styles from './QuestionEditor.module.scss';
import { _createQuestionAnswer, _fetchQuestionById, _fetchQuestionTypeById, _saveImage, _updateQuestionData } from '@/pages/api/requests';
import { fetchQuizData } from '@/application/actions/quiz';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';


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
    

    useEffect(() => {
        if (shouldRefetchQuiz) {
            dispatch(fetchQuizData(quizId));
            setShouldRefetchQuiz(false);
        }

    }, [shouldRefetchQuiz]);

    useEffect(() => {
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
            { isWithOptions ? 
                <List
                    dataSource={answers}
                    renderItem={item => (
                        <List.Item>
                            <AnswerOption answer={item} question={question}/>
                        </List.Item>
                    )}
                    footer={
                        <div className={styles.addOption}>
                            <Button type="primary" onClick={onAddAnswerOption}>Add Option</Button>
                        </div>
                    }
                /> : 

                <OpenAnswer />
                }
            </div> 
        </div>
    );
};

export default QuestionEditor;
