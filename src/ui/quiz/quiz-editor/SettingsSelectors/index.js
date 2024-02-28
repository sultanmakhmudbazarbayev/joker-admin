import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Spin } from 'antd';
import { setChosenRound } from '@/application/store/reducers/chosenRoundSlice';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { _fetchQuestionById, _fetchQuestionTimeOptions, _fetchQuestionTypes, _saveAudio, _updateQuestionData } from '@/pages/api/requests';
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


  useEffect(() => {
    setSelectedRoundId(currentRound?.id);
  }, [currentRound]);

  useEffect(() => {
    if(question) {
      setSelectedQuestionType(question.question_type_id)
    }
  }, [question]);

  useEffect(() => {
    if(question) {
      setAudio(question.audio)
    }
  }, [question]);

  useEffect(() => {
    if(question) {
      setSelectedTimeOption(question.question_time_id)
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
    fetchTypes();
  }, []);

  useEffect(() => {
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

  const handleVideoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return message.error("No file selected.");

    const formData = new FormData();
    formData.append('video', file);

    try {
        // const response = await _saveImage(formData);
        // if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);

        // const data = await response.json();
        // const values = { image: data.url };
        // const updateResponse = await _updateQuestionData(question.id, values);

        // if (updateResponse.data.ok) {
        //     message.success("Question image updated successfully.");
        //     setShouldRefetchQuiz(true);
        // } else {
        //     message.error("Failed to update question image.");
        // }
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
          message.success("Question image updated successfully.");
          
          const updatedQuestion = await _fetchQuestionById(question.id);
          dispatch(setChosenQuestion(updatedQuestion.data.question))
        } else {
          message.error("Failed to update question image.");
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
      <h4 style={{ marginTop: "20px" }}>Round</h4>
      <Select
        value={selectedRoundId}
        onChange={updateSelectedRound}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {renderOptions()}
      </Select>

      <h4 style={{ marginTop: "20px" }}>Question Type</h4>
      <Select
        value={selectedQuestionType}
        onChange={updateSelectedQuestionType}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {renderQuestionTypeOptions()}
      </Select>

      <h4 style={{ marginTop: "20px" }}>Question Time Limit</h4>
      <Select
        value={selectedTimeOption}
        onChange={updateSelectedTimeOption}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {renderTimeOptions()}
      </Select>

      <h4 style={{ marginTop: "20px" }}>Upload Audio</h4>
      <div onClick={() => inputAudioRef.current && inputAudioRef.current.click()} className={styles.audio}>
          {audio ? (
              <audio src={audio} controls style={{
                width: "100%",
                height: "100%",
                borderRadius: "0px"
              }} />
          ) : (
            <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
          )}
          <input type="file" accept="audio/*" onChange={handleAudioChange} ref={inputAudioRef} style={{ display: "none" }} />
      </div>


      <h4 style={{ marginTop: "20px" }}>Upload Video</h4>
      <div onClick={() => inputVideoRef.current?.click()} className={styles.video}>
          {video ? (
              <video src={video} controls alt="Uploaded"  />
          ) : (
              <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
          )}
          <input type='file' onChange={handleVideoChange} ref={inputVideoRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default SettingsSelectors;
