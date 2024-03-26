import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Input, Checkbox, Button, message, Modal, Form } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { debounce } from 'lodash'; // Import debounce
import styles from './AnswerOption.module.scss';
import { _deleteQuestionAnswer, _fetchQuestionById, _saveAudio, _saveImage, _saveVideo, _updateQuestionAnswer } from '@/pages/api/requests';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { useDispatch } from 'react-redux';

const AnswerOption = (props) => {
    const dispatch = useDispatch();
    const { answer, question } = props;
    const inputRef = useRef(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [answerText, setAnswerText] = useState('');
    const [commentText, setCommentText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState();
    const [audio, setAudio] = useState(null);
    const [video, setVideo] = useState(null);
    const form = useRef()

    useEffect(() => {
        if (answer) {
            setIsCorrect(answer.correct);
            setAnswerText(answer.answer);
            setCommentText(answer.comment);
            setImage(answer.image);
            setAudio(answer.audio);
            setVideo(answer.video);
        }
    }, [answer]);

    const updateAnswerText = useCallback(debounce(async (newText) => {
        await _updateQuestionAnswer(answer.id, { answer: newText });
        
        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question));
    }, 1000), [answer.id]); // Debounce this function

    const onDelete = async (data) => {
        if(!data.key) {
            await _deleteQuestionAnswer(answer.id);
    
            const updatedQuestion = await _fetchQuestionById(question.id);
            dispatch(setChosenQuestion(updatedQuestion.data.question));
        } else {
            if(data.key === 'image') {
                setImage(null);
            }
            if(data.key === 'audio') {
                setAudio(null);
            }
            if(data.key === 'video') {
                setVideo(null);
            }
        }
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

    const handleAudioChange = async (event) => {
    
        const file = event.target.files[0];
        if (!file) return message.error("No file selected.");
    
        const formData = new FormData();
        formData.append('audio', file);
    
        try {
    
            console.log('handleAudioChange2')
            const response = await _saveAudio(formData);
    
            console.log('response', response)
            // if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);
            
            // console.log('response3')
            
            const data = await response.json();
            setAudio(data.url)
            // const values = { audio: data.url };
    
            // console.log('values audio', values.audio)
            // const updatedQuestion = await _updateQuestionData(question.id, values);
    
            // console.log('updatedQuestion-audio', updatedQuestion)
            
            // if (updatedQuestion.data.ok) {
            //   message.success("Question audio updated successfully.");
              
            //   const updatedQuestion = await _fetchQuestionById(question.id);
            //   dispatch(setChosenQuestion(updatedQuestion.data.question))
            // } else {
            //   message.error("Failed to update question audio.");
            // }
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
    };

    const handleVideoChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return message.error("No file selected.");
    
        const formData = new FormData();
        formData.append('video', file);
    
        try {
    
          const response = await _saveVideo(formData);
    
          console.log('response', response)
          
          // if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);
          
          const data = await response.json();
          
          setVideo(data.url)
          
          // const values = { video: data.url };
    
          // const updatedQuestion = await _updateQuestionData(question.id, values);
    
          
          // if (updatedQuestion.data.ok) {
          //   message.success("Question video updated successfully.");
            
          //   const updatedQuestion = await _fetchQuestionById(question.id);
          //   dispatch(setChosenQuestion(updatedQuestion.data.question))
          // } else {
          //   message.error("Failed to update question video.");
          // }
      } catch (error) {
          message.error(`Upload error: ${error.message}`);
      }
      };


      const handleOk = async () => {
        try {
            const answerValues = {
                id: answer.id,
                comment: commentText,
                image: image,
                audio: audio,
                video: video,
              }
          
              const response = await _updateQuestionAnswer(answer.id, answerValues)
          
              console.log('correctAnswerValues response', response)
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

                <Button icon={<EditOutlined />} onClick={onEdit} />

                <Button danger icon={<DeleteOutlined />} onClick={onDelete} />
            </div>

            {isModalOpen && <Modal title="Настройки для правильного ответа" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Save" cancelText='Cancel'>
                <Input.TextArea style={{
                marginTop: "10px",
                marginBottom: "10px"
                }} value={commentText} onChange={onCommentChange} placeholder="Добавить комментарий к ответу" />

                <h4 style={{position: "relative"}}>Добавить изображение</h4>
                <div onClick={() => inputRef.current?.click()} style={{width: "100%", height: "100px", textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", cursor: "pointer", marginBottom: "10px", position: "relative"}}>
                    {image ? (
                        <div style={{width: "100%", height: "100px", textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", cursor: "pointer", marginBottom: "10px", position: "relative"}}>
                        <img src={process.env.NEXT_PUBLIC_BASE_URL + image} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: "10px" }} />
                        <Button danger style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0"
                                }} icon={<DeleteOutlined />} onClick={(e) => {
                                    e.stopPropagation(); // Stop event propagation
                                    onDelete({image: null, key: 'image', for: 'answer'});
                        }} />
                        </div>
                    ) : (
                        <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                    )}
                    <input type='file' onChange={onUpload} ref={inputRef} style={{ display: "none" }} />
                </div>

                <h4 style={{marginTop: "15px",position: "relative"}}>Добавить аудио</h4>
                <div style={{width: "100%", height: "32px", position: "relative", textAlign: "center", cursor: "pointer", border: "1px solid lightgray", borderRadius: "5px"}} onClick={() => audioRef.current && audioRef.current.click()} className={styles.audio}>
                    {audio ? (
                    <div style={{width: "90%"}} className={styles.audio}>
                        <audio src={process.env.NEXT_PUBLIC_BASE_URL + audio} controls style={{
                        width: "93%",
                        left: "0",
                        height: "100%",
                        borderRadius: "0px",
                        position: "absolute"
                        }} />
                        <Button danger style={{
                        position: "absolute",
                        width: "7%",
                        top: "0",
                        right: "0"
                        }} 
                        icon={<DeleteOutlined />} onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        onDelete({audio: null, key: 'audio', for: 'answer'});
                        }} />
                    </div>
                    ) : (
                    <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                    )}
                    <input type="file" accept="audio/*" onChange={handleAudioChange} ref={audioRef} style={{ display: "none" }} />
                </div>


                <h4 style={{
                    marginTop: "15px",
                    position: "relative"
                }}>Добавить видео</h4>
                <div style={{width: "100%", height: "220px", display: "flex", position: "relative", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", border: "1px solid lightgray", borderRadius: "5px"}} onClick={() => videoRef.current?.click()} className={styles.video}>
                    {video ? (
                    <div style={{
                        marginTop: "15px",
                        width: "100%",
                        height: "100%"
                    }}>
                        <video src={process.env.NEXT_PUBLIC_BASE_URL + video} controls alt="Uploaded" style={{
                        width: "100%",
                        height: "100%"
                        }}  />
                        <Button danger style={{
                        position: "absolute",
                        top: "0",
                        right: "0"
                        }} 
                        icon={<DeleteOutlined />} onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        onDelete({video: null, key: 'video', for: 'answer'});
                        }} />
                    </div>
                    ) : (
                        <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                    )}
                    <input type='file' accept="video/*" onChange={handleVideoChange} ref={videoRef} style={{ display: "none" }} />
                </div>


            </Modal>}


        </div>
    );
};

export default AnswerOption;
