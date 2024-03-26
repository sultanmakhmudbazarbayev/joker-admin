import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Spin } from 'antd';
import { setChosenRound } from '@/application/store/reducers/chosenRoundSlice';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { Modal, Upload, Button, Input, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { _createOrUpdateCorrectQuestionAnswer, _fetchQuestionById, _fetchQuestionTimeOptions, _fetchQuestionTypes, _saveAudio, _saveImage, _saveVideo, _updateQuestionData } from '@/pages/api/requests';
import styles from './SettingsSelector.module.scss';

const { Option } = Select;

const SettingsSelectors = ({ className }) => {
  const dispatch = useDispatch();
  const rounds = useSelector(state => state.quiz.data.rounds || []);
  const inputAudioRef = useRef(null);
  const inputVideoRef = useRef(null);
  const currentRound = useSelector(state => state.chosenRound.data);
  const question = useSelector(state => state.chosenQuestion.data);
  const [selectedRoundId, setSelectedRoundId] = useState(currentRound?.id);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);
  const [selectedTimeOption, setSelectedTimeOption] = useState('');
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);

  const inputCorrectAnswerRefImage = useRef(null);
  const inputCorrectAnswerAudioRef = useRef(null);
  const inputCorrectAnswerVideoRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [correctAnswerText, setCorrectAnswerText] = useState('');
  const [correctAnswerUploadedImage, setCorrectAnswerUploadedImage] = useState(null);
  const [correctAnswerUploadedAudio, setCorrectAnswerUploadedAudio] = useState(null);
  const [correctAnswerUploadedVideo, setCorrectAnswerUploadedVideo] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {

    const correctAnswerValues = {
      question_id: question.id,
      answer: correctAnswerText,
      comment: comment,
      image: correctAnswerUploadedImage,
      audio: correctAnswerUploadedAudio,
      video: correctAnswerUploadedVideo,
    }

    const response = await _createOrUpdateCorrectQuestionAnswer(question.id, correctAnswerValues)

    console.log('correctAnswerValues response', response)
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCorrectAnswerTextChange = (e) => {
    setCorrectAnswerText(e.target.value);
  };

  const handleCorrectAnswerCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCorrectAnswerImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return message.error("No file selected.");

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await _saveImage(formData);

        const data = await response.json();

        setCorrectAnswerUploadedImage(data.url)
        const values = { image: data.url };
        console.log('values', values)   
        // const updateResponse = await _updateQuestionAnswer(answer.id, values);
        
        // if(updateResponse) {
        //     const updatedQuestion = await _fetchQuestionById(question.id);
        //     dispatch(setChosenQuestion(updatedQuestion.data.question));
        //     message.success("Question image updated successfully.");
        // } else {
        //     message.error("Failed to update question image.");
        // }
    } catch (error) {
        message.error(`Upload error: ${error.message}`);
    }
  };

  const handleCorrectAnswerAudioChange = async (event) => {

    console.log('handleAudioChange')

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
        setCorrectAnswerUploadedAudio(data.url)
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

  const handleCorrectAnswerVideoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return message.error("No file selected.");

    const formData = new FormData();
    formData.append('video', file);

    try {

      const response = await _saveVideo(formData);

      console.log('response', response)
      
      // if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);
      
      const data = await response.json();
      
      setCorrectAnswerUploadedVideo(data.url)
      
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

  const handleVideoUpload = (file) => {
    const url = URL.createObjectURL(file);
    setUploadedVideo(url);
    return false; // Prevent default upload behavior
  };
  
  const handleAudioUpload = (file) => {
    const url = URL.createObjectURL(file);
    setUploadedAudio(url);
    return false; // Prevent default upload behavior
  };
  


  useEffect(() => {
    setSelectedRoundId(currentRound?.id);
  }, [currentRound]);

  useEffect(() => {
    if(question) {
      setAudio(question.audio)
      setVideo(question.video)
      setSelectedQuestionType(question.question_type_id)
      setSelectedTimeOption(question.question_time_id)

      if(question.correct_answer) {
        setComment(question.correct_answer.comment);
        setCorrectAnswerText(question.correct_answer.answer)
        setCorrectAnswerUploadedImage(question.correct_answer.image)
        setCorrectAnswerUploadedAudio(question.correct_answer.audio)
        setCorrectAnswerUploadedVideo(question.correct_answer.video)
      }
    }
  }, [question]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await _fetchQuestionTypes();
        if (data && Array.isArray(data.data.types)) {
          setQuestionTypes(data.data.types);
        } else {
          console.error('Invalid data structure:', data);
          setQuestionTypes([]);
        }

      } catch (error) {
        console.error('Error fetching question types:', error);
        setQuestionTypes([]);
      }
    };

    const fetchTimeOptions = async () => {
      try {
        const data = await _fetchQuestionTimeOptions();
        if (data && Array.isArray(data.data.time_options)) {
          setTimeOptions(data.data.time_options);
        } else {
          console.error('Invalid data structure:', data);
          setTimeOptions([]);
        }

      } catch (error) {
        console.error('Error fetching question types:', error);
        setTimeOptions([]);
      }
    };

    fetchTimeOptions();
    fetchTypes();
  }, []);


  const updateSelectedRound = (roundId) => {
    const newSelectedRound = rounds.find(round => round.id === roundId);
    if (newSelectedRound) {
      setSelectedRoundId(newSelectedRound.id);
      dispatch(setChosenRound(newSelectedRound));
      if (newSelectedRound.questions && newSelectedRound.questions.length > 0) {
        dispatch(setChosenQuestion(newSelectedRound.questions[0]));
      }
    }
  };

  const updateSelectedQuestionType = async (id) => {
    
    await _updateQuestionData(question.id, {question_type_id: id});
    const updatedQuestion = await _fetchQuestionById(question.id);
    setSelectedQuestionType(id);
    dispatch(setChosenQuestion(updatedQuestion.data.question))
  };

  const updateSelectedTimeOption = async (id) => {

    await _updateQuestionData(question.id, {question_time_id: id});
    const updatedQuestion = await _fetchQuestionById(question.id);
    setSelectedTimeOption(id);
    dispatch(setChosenQuestion(updatedQuestion.data.question))

  };

  const onDelete = async (entryToDelete) => {
    const values = {};
    values[entryToDelete.key]=null;
    if(entryToDelete.for === 'correct-answer') {
      // const response = await _createOrUpdateCorrectQuestionAnswer(question.id, values)
  
      if(entryToDelete.key === 'image') {
        setCorrectAnswerUploadedImage(null);
      }
      if(entryToDelete.key === 'audio') {
        setCorrectAnswerUploadedAudio(null);
      }
      if(entryToDelete.key === 'video') {
        setCorrectAnswerUploadedVideo(null);
      }
    }

    if(entryToDelete.for === 'question') {

      if(entryToDelete.key === 'audio') {
        const response = await _updateQuestionData(question.id, {audio: null})
        if(response.status == 200) {
          setAudio(null);
        }
      }
      if(entryToDelete.key === 'video') {
        const response = await _updateQuestionData(question.id, {video: null})
        if(response.status == 200) {
          setVideo(null);
        }
      }
    }
  }

  const handleVideoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return message.error("No file selected.");

    const formData = new FormData();
    formData.append('video', file);

    try {

      const response = await _saveVideo(formData);

      console.log('response', response)
      
      if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);

      const data = await response.json();
      const values = { video: data.url };

      const updatedQuestion = await _updateQuestionData(question.id, values);

      
      if (updatedQuestion.data.ok) {
        message.success("Question video updated successfully.");
        
        const updatedQuestion = await _fetchQuestionById(question.id);
        dispatch(setChosenQuestion(updatedQuestion.data.question))
      } else {
        message.error("Failed to update question video.");
      }
  } catch (error) {
      message.error(`Upload error: ${error.message}`);
  }
  };

  const handleAudioChange = async (event) => {

    console.log('handleAudioChange')

    const file = event.target.files[0];
    if (!file) return message.error("No file selected.");

    const formData = new FormData();
    formData.append('audio', file);

    try {

        console.log('handleAudioChange2')
        const response = await _saveAudio(formData);

        console.log('response', response)
        
        if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);

        console.log('response3')

        const data = await response.json();
        const values = { audio: data.url };

        console.log('values audio', values.audio)
        const updatedQuestion = await _updateQuestionData(question.id, values);

        console.log('updatedQuestion-audio', updatedQuestion)
        
        if (updatedQuestion.data.ok) {
          message.success("Question audio updated successfully.");
          
          const updatedQuestion = await _fetchQuestionById(question.id);
          dispatch(setChosenQuestion(updatedQuestion.data.question))
        } else {
          message.error("Failed to update question audio.");
        }
    } catch (error) {
        message.error(`Upload error: ${error.message}`);
    }
  };

  const renderOptions = () => rounds.map(round => (
    <Option key={round.id} value={round.id}>{`${round.count}. ${round.name}`}</Option>
  ));

  const renderQuestionTypeOptions = () => questionTypes.map(type => (
    <Option key={type.id} value={type.id}>{type.name}</Option>
  ));

  const renderTimeOptions = () => timeOptions.map(option => (
    <Option key={option.id} value={option.id}>{option.time}</Option>
  ));

  if (rounds.length === 0 || questionTypes.length === 0 || timeOptions.length === 0) {
    return (
      <div className={className}>
        <h4 style={{ marginTop: "20px" }}>Round</h4>
        <Spin tip="Loading rounds..." />
        <h4 style={{ marginTop: "20px" }}>Question Types</h4>
        <Spin tip="Loading question types..." />
        <h4 style={{ marginTop: "20px" }}>Time Options</h4>
        <Spin tip="Loading time options..." />
      </div>
    );
  }

  return (
    <div className={className}>
      <h4 style={{ marginTop: "20px" }}>Название кона</h4>
      <Select
        value={selectedRoundId}
        onChange={updateSelectedRound}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {renderOptions()}
      </Select>

      <h4 style={{ marginTop: "20px" }}>Тип вопроса</h4>
      <Select
        value={selectedQuestionType}
        onChange={updateSelectedQuestionType}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {renderQuestionTypeOptions()}
      </Select>

      <h4 style={{ marginTop: "20px" }}>Время для ответа на вопрос</h4>
      <Select
        value={selectedTimeOption}
        onChange={updateSelectedTimeOption}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {renderTimeOptions()}
      </Select>

      <div style={{
        width: "100%",
        marginTop: "15px",
        marginBottom: "15px"
      }}>
        <Button style={{
          width: "100%"
        }} type="primary" onClick={showModal}>Добавить правильный ответ</Button>
      </div>

      <h4 style={{ marginTop: "30px" }}>Добавить аудио к вопросу</h4>
      <div style={{width: "100%", position: "relative"}} onClick={() => inputAudioRef.current && inputAudioRef.current.click()} className={styles.audio}>
            {audio ? (
              <div style={{width: "90%"}} className={styles.audio}>
                <audio src={process.env.NEXT_PUBLIC_BASE_URL + audio} controls style={{
                  width: "90%",
                  left: "0",
                  height: "100%",
                  borderRadius: "0px",
                  position: "absolute"
                }} />
                <Button danger style={{
                  position: "absolute",
                  width: "10%",
                  top: "0",
                  right: "0"
                  }} 
                  icon={<DeleteOutlined />} onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  onDelete({audio: null, key: 'audio', for: 'question'});
                }} />
              </div>
                
            ) : (
              <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
            )}
            <input type="file" accept="audio/*" onChange={handleAudioChange} ref={inputAudioRef} style={{ display: "none" }} />
            
          </div>

      {/* <h4 style={{ marginTop: "30px" }}>Добавить аудио к вопросу</h4>
      <div onClick={() => inputAudioRef.current && inputAudioRef.current.click()} className={styles.audio}>
          {audio ? (
              <audio src={process.env.NEXT_PUBLIC_BASE_URL + audio} controls style={{
                width: "100%",
                height: "100%",
                borderRadius: "0px"
              }} />
          ) : (
            <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
          )}
          <input type="file" accept="audio/*" onChange={handleAudioChange} ref={inputAudioRef} style={{ display: "none" }} />
      </div> */}







      <h4 style={{ marginTop: "20px" }}>Добавить видео к вопросу</h4>
      <div style={{position: "relative"}} onClick={() => inputVideoRef.current?.click()} className={styles.video}>
          {video ? (
            <div style={{
              height: "100%",

            }}>
              <video src={process.env.NEXT_PUBLIC_BASE_URL + video} controls alt="Uploaded" style={{
                width: "100%",
              }}  />
                <Button danger style={{
                  position: "absolute",
                  top: "0",
                  right: "0"
                  }} 
                  icon={<DeleteOutlined />} onClick={(e) => {
                  e.stopPropagation(); // Stop event propagation
                  onDelete({video: null, key: 'video', for: 'question'});
                }} />
            </div>
          ) : (
              <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
          )}
          <input type='file' accept="video/*" onChange={handleVideoChange} ref={inputVideoRef} style={{ display: "none" }} />
      </div>

      <Modal title="Добавьте правильный ответ" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input.TextArea value={correctAnswerText} onChange={handleCorrectAnswerTextChange} placeholder="Добавить правильный ответ" />
        <Input.TextArea style={{
          marginTop: "10px",
          marginBottom: "10px"
        }} value={comment} onChange={handleCorrectAnswerCommentChange} placeholder="Добавить комментарий к правильному ответу" />
        <div style={{
          display: "flex",
          flexDirection: "column"
        }}>


          <h4 style={{position: "relative"}}>Добавить изображение</h4>
          <div onClick={() => inputCorrectAnswerRefImage.current?.click()} style={{width: "100%", height: "100px", textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", cursor: "pointer", marginBottom: "10px", position: "relative"}}>
              {correctAnswerUploadedImage ? (
                <div style={{width: "100%", height: "100px", textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", cursor: "pointer", marginBottom: "10px", position: "relative"}}>
                  <img src={process.env.NEXT_PUBLIC_BASE_URL + correctAnswerUploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: "10px" }} />
                  <Button danger style={{
                            position: "absolute",
                            top: "0",
                            right: "0"
                        }} icon={<DeleteOutlined />} onClick={(e) => {
                            e.stopPropagation(); // Stop event propagation
                            onDelete({image: null, key: 'image', for: 'correct-answer'});
                  }} />
                </div>
              ) : (
                  <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
              )}
              <input type='file' onChange={handleCorrectAnswerImageUpload} ref={inputCorrectAnswerRefImage} style={{ display: "none" }} />
          </div>

          <h4 style={{
            marginTop: "15px",
            position: "relative"
          }}>Добавить аудио</h4>
          <div style={{width: "100%", position: "relative"}} onClick={() => inputCorrectAnswerAudioRef.current && inputCorrectAnswerAudioRef.current.click()} className={styles.audio}>
            {correctAnswerUploadedAudio ? (
              <div style={{width: "90%"}} className={styles.audio}>
                <audio src={process.env.NEXT_PUBLIC_BASE_URL + correctAnswerUploadedAudio} controls style={{
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
                  onDelete({audio: null, key: 'audio', for: 'correct-answer'});
                }} />
              </div>
                
            ) : (
              <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
            )}
            <input type="file" accept="audio/*" onChange={handleCorrectAnswerAudioChange} ref={inputCorrectAnswerAudioRef} style={{ display: "none" }} />
            
          </div>

          <h4 style={{
            marginTop: "15px",
            position: "relative"
          }}>Добавить видео</h4>
          <div style={{width: "100%", height: "220px", position: "relative"}} onClick={() => inputCorrectAnswerVideoRef.current?.click()} className={styles.video}>
            {correctAnswerUploadedVideo ? (
              <div style={{
                marginTop: "15px",
                width: "100%",
                height: "100%"
              }}>
                <video src={process.env.NEXT_PUBLIC_BASE_URL + correctAnswerUploadedVideo} controls alt="Uploaded" style={{
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
                  onDelete({video: null, key: 'video', for: 'correct-answer'});
                }} />
              </div>
            ) : (
                <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
            )}
            <input type='file' accept="video/*" onChange={handleCorrectAnswerVideoChange} ref={inputCorrectAnswerVideoRef} style={{ display: "none" }} />
        </div>

        </div>
      </Modal>
    </div>
  );
};

export default SettingsSelectors;
