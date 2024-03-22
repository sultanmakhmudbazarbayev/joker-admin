import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Input, Checkbox, Button, message, Modal, Form } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { debounce } from 'lodash'; // Import debounce
import styles from './AnswerOption.module.scss';
import { _deleteQuestionAnswer, _fetchQuestionById, _saveImage, _updateQuestionAnswer } from '@/pages/api/requests';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { useDispatch } from 'react-redux';

const AnswerOption = (props) => {
    const dispatch = useDispatch();
    const { answer, question } = props;
    const inputRef = useRef(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [image, setImage] = useState();
    const [answerText, setAnswerText] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [audio, setAudio] = useState(null);
    const inputAudioRef = useRef(null);
    const form = useRef()

    useEffect(() => {
        if (answer) {
            setIsCorrect(answer.correct);
            setAnswerText(answer.answer);
            setCommentText(answer.comment);
            setImage(answer.image);
        }
    }, [answer]);

    const updateAnswerText = useCallback(debounce(async (newText) => {
        await _updateQuestionAnswer(answer.id, { answer: newText });
        
        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question));
    }, 1000), [answer.id]); // Debounce this function

    const updateCommentText = useCallback(debounce(async (newText) => {
        await _updateQuestionAnswer(answer.id, { comment: newText });
        
        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question));
    }, 1000), [answer.id]); // Debounce this function

    const onDelete = async () => {
        await _deleteQuestionAnswer(answer.id);

        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question));
    };

    const onEdit = () => {
        setIsModalOpen(true)
    }

    const onUpload = async (event) => {
            const file = event.target.files[0];
            if (!file) return message.error("No file selected.");
    
            const formData = new FormData();
            formData.append('image', file);
    
            try {
                const response = await _saveImage(formData);
    
                const data = await response.json();

                setImage(data.url)
                const values = { image: data.url };
                console.log('values', values)   
                const updateResponse = await _updateQuestionAnswer(answer.id, values);
                
                if(updateResponse) {
                    const updatedQuestion = await _fetchQuestionById(question.id);
                    dispatch(setChosenQuestion(updatedQuestion.data.question));
                    message.success("Question image updated successfully.");
                } else {
                    message.error("Failed to update question image.");
                }
            } catch (error) {
                message.error(`Upload error: ${error.message}`);
            }
    };

    const onCorrectChange = async (e) => {
        await _updateQuestionAnswer(answer.id, { correct: e.target.checked ? 1 : 0 });

        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question));
    };

    const onTextChange = (e) => {
        setAnswerText(e.target.value);
        updateAnswerText(e.target.value); // Update text in the backend debounced
    };

    const onCommentChange = (e) => {
        setCommentText(e.target.value);
        updateCommentText(e.target.value);
    };


      const handleOk = async () => {
        try {
            
        } 
        catch(err) {
          if(err) {

        }
        }
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };

      const handleAudioChange = async (event) => {

        console.log('handleAudioChange')
    
        const file = event.target.files[0];
        if (!file) return message.error("No file selected.");
    
        const formData = new FormData();
        formData.append('audio', file);
    
        try {
    
        } catch (error) {
            message.error(`Upload error: ${error.message}`);
        }
      };

    return (
        <div className={styles.optionContainer}>
            <Checkbox
                className={styles.correctIndicator}
                checked={isCorrect}
                onChange={onCorrectChange}
            />
            <Input.TextArea
                rows={2}
                className={styles.textArea}
                placeholder="Enter your answer here"
                value={answerText}
                onChange={onTextChange} // Updated to use onTextChange
            />
            <div className={styles.actionIcons}>

                <div onClick={() => inputRef.current?.click()} style={{width: "50px", height: "60px", textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", cursor: "pointer"}}>
                    {image ? (
                        <img src={process.env.NEXT_PUBLIC_BASE_URL + image} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: "10px" }} />
                    ) : (
                        <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                    )}
                    <input type='file' onChange={onUpload} ref={inputRef} style={{ display: "none" }} />
                </div>
                
                <Button icon={<EditOutlined />} onClick={onEdit} />

                <Button danger icon={<DeleteOutlined />} onClick={onDelete} />
            </div>

            {isModalOpen && <Modal title="Comment" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Save" cancelText='Cancel'>
                <Form layout="vertical" ref={form} autoComplete="off">
                    <Form.Item
                        name="comment"
                    >
                    <Input.TextArea
                        placeholder="Enter your comment here"
                        value={commentText}
                        onChange={onCommentChange} // Updated to use onTextChange
                    />
                    </Form.Item>
                </Form>
            </Modal>}


        </div>
    );
};

export default AnswerOption;
