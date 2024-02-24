import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Spin } from 'antd';
import { setChosenRound } from '@/application/store/reducers/chosenRoundSlice';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';
import { _fetchQuestionTimeOptions, _fetchQuestionTypes } from '@/pages/api/requests';
import styles from './SettingsSelector.module.scss';

const { Option } = Select;

const SettingsSelectors = ({ className }) => {
  const dispatch = useDispatch();
  const rounds = useSelector(state => state.quiz.data.rounds || []);
  const currentRound = useSelector(state => state.chosenRound.data);
  const [selectedRoundId, setSelectedRoundId] = useState(currentRound?.id);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [timeOptions, setTimeOptions] = useState([]);
  const [selectedTimeOption, setSelectedTimeOption] = useState('');


  useEffect(() => {
    setSelectedRoundId(currentRound?.id);
  }, [currentRound]);

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

  useEffect(() => {
    if (questionTypes.length > 0) {
      setSelectedQuestionType(questionTypes[0].id);
    }
  }, [questionTypes]); // This effect ensures that selectedQuestionType is updated after questionTypes

  useEffect(() => {
    if (timeOptions.length > 0) {
      setSelectedTimeOption(timeOptions[0].id);
    }
  }, [questionTypes]); 

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

  const updateSelectedQuestionType = (id) => {
    setSelectedQuestionType(id);
  };

  const updateSelectedTimeOption = (id) => {
    setSelectedTimeOption(id);
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

      <h4 style={{ marginTop: "20px" }}>Question Type</h4>
      <Select
        value={selectedTimeOption}
        onChange={updateSelectedTimeOption}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {renderTimeOptions()}
      </Select>
    </div>
  );
};

export default SettingsSelectors;
