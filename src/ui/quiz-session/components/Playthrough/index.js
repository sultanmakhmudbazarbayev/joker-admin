import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import styles from './Playthrough.module.scss';
import { staticScreens, maxNumberOfSLides } from '@/constants';
import useSocket from '@/hooks/useSocket';

const Playthrough = (props) => {
  const [currentStage, setCurrentStage] = useState('slides'); // 'slides', 'round', 'results', 'total'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const socket = useSocket();

  const nextSlide = () => {
    socket.emit("next-slide", 'next-slide')
  }

  const nextRound = () => {
    socket.emit("next-round", 'next-round')
}

const startRound = () => {
  socket.emit("start-round", 'start-round')
}

  // for slides
  useEffect(() => {
      socket.emit("trigger-slide-change", {page: currentSlide})
  }, [currentSlide]);

  // for rounds
  useEffect(() => {
    socket.emit("trigger-slide-change", {page: currentSlide})
}, [currentSlide]);

useEffect(() => {
  socket.emit("trigger-slide-change", {page: currentSlide})
}, [currentSlide]);

  return (
    <div className={styles.playthrough}>
      <div className={styles.playthroughLeft}>
        <Button
          type="primary"
          block
          size="large"
          className={styles.buttonBack}
          // onClick={handlePrevPage}
        >
          Back
        </Button>
      </div>


      <div className={styles.playthroughCenter}>
        <h1>Page: {}</h1>
      </div>

    

      <div className={styles.playthroughRight}>
        <div className={styles.buttons}>
          <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              onClick={startRound}
            >
              next round
            </Button>
            <Button
              type="primary"
              block
              size="large"
              className={styles.button}
              onClick={nextRound}
            >
              start round
            </Button>
            <Button
            type="primary"
            block
            size="large"
            className={styles.button}
            onClick={nextSlide}
          >
            next slide
          </Button>
        </div>
      
      </div>
    </div>
  );
};

export default Playthrough;
