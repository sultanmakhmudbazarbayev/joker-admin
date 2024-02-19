import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Spin } from 'antd'; // Import Spin for loading indicator
import { setChosenRound } from '@/application/store/reducers/chosenRoundSlice';
import styles from './SettingsSelector.module.scss';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';

const { Option } = Select;

const SettingsSelectors = ({ className }) => {
  const dispatch = useDispatch();
  const rounds = useSelector(state => state.quiz.data.rounds || []);
  const currentRound = useSelector(state => state.chosenRound.data);
  const [selectedRoundId, setSelectedRoundId] = useState(currentRound?.id);

  useEffect(() => {
    setSelectedRoundId(currentRound?.id);
  }, [currentRound]);

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

  // Assuming rounds have 'id' and 'name' properties for 'value' and 'label'
  const renderOptions = () => rounds.map(round => (
    <Option key={round.id} value={round.id}>{`${round.count}. ${round.name}`}</Option>
  ));

  if (rounds.length === 0) {
    return (
      <div className={className}>
        <h4 style={{ marginTop: "20px" }}>Round</h4>
        <Spin tip="Loading rounds..." />
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
    </div>
  );
};

export default SettingsSelectors;
