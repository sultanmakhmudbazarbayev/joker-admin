import React, { useEffect, useState } from 'react';
import { emitEvent, subscribeToEvent, unsubscribeFromEvent } from '@/socket'; // Adjust paths as necessary
import { Button } from 'antd';
import { useSelector } from 'react-redux';

const SessionTeams= (props) => {
  const {teams, handleStartGame} = props;

  return (
    <div className="session-teams">

    </div>
  );
};

export default SessionTeams;
