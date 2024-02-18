import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Spin } from 'antd'; // Import Spin for loading indicator
import { setChosenRound } from '@/application/store/reducers/chosenRoundSlice';
import styles from './SettingsSelector.module.scss';

const { Option } = Select;

const SettingsSelectors = (props) => {
  const { className } = props;
  const rounds = useSelector((state) => state.quiz.data.rounds);
  const dispatch = useDispatch();

  const [selectedRound, setSelectedRound] = useState();

  const chooseRoundOptions = rounds ? rounds.map((round) => ({
    value: round.id,
    label: `${round.count} ${round.name}`,
  })) : [];

  const updateSelectedRound = (roundId) => {
    const newSelectedRound = rounds.find((round) => round.id === roundId)
    dispatch(setChosenRound(newSelectedRound));
  }

  useEffect(() => {
    if (chooseRoundOptions.length > 0 && !selectedRound) {
      setSelectedRound(chooseRoundOptions[0]);
    }
  }, [chooseRoundOptions, selectedRound]);

  const renderOptions = (options) => options.map(option => (
    <Option key={option.value} value={option.value}>{option.label}</Option>
  ));

  // Check if rounds data is available before rendering the Select component
  if (chooseRoundOptions.length === 0) {
    return (
      <div className={className}>
        <h4 style={{ marginTop: "20px" }}>Round</h4>
        <Spin tip="Loading rounds..." style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
      </div>
    );
  } 

return (
      <div className={className}>
        <h4 style={{ marginTop: "20px" }}>Round</h4>
        <Select defaultValue={chooseRoundOptions[0].value} onChange={updateSelectedRound} style={{ width: '100%', marginBottom: '10px' }}>
          {renderOptions(chooseRoundOptions)}
        </Select>

        <h4 style={{ marginTop: "20px" }}>Question Type</h4>
        <Select defaultValue={chooseRoundOptions[0].value} style={{ width: '100%', marginBottom: '10px' }}>
          {renderOptions(chooseRoundOptions)}
        </Select>

        <h4 style={{ marginTop: "20px" }}>Time</h4>
        <Select defaultValue={chooseRoundOptions[0].value} style={{ width: '100%', marginBottom: '10px' }}>
          {renderOptions(chooseRoundOptions)}
        </Select>
        
      </div>
    );
};

export default SettingsSelectors;
