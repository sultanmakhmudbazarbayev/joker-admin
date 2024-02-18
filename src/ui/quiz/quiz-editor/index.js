import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setQuizData } from '@/application/store/reducers/quizSlice';
import Header from './Header';
import QuestionList from './QuestionList';
import QuestionEditor from './QuestionEditor';
import SettingsSelectors from './SettingsSelectors';
import { _fetchQuizById } from '@/pages/api/requests';
import styles from './QuizEditor.module.scss';
import { setChosenRound } from '@/application/store/reducers/chosenRoundSlice';
import { setChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';

const QuizEditor = (props) => {
  const { id } = props;
  const dispatch = useDispatch();

  const fetchQuizById = async (id) => {
    try {
      const response = await _fetchQuizById(id);
      
      dispatch(setQuizData(response.data.quiz));
      dispatch(setChosenRound(response.data.quiz.rounds[0]));
      dispatch(setChosenQuestion(response.data.quiz.rounds[0].questions[0]));

    } catch (error) {
      console.error('Error fetching quiz');
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuizById(id);
    }
  }, [id, dispatch]);

  return (
    <>
      <Header />
      <div className={styles.editorContainer}>
        <QuestionList className={styles.questionsList}/>
        <QuestionEditor className={styles.questionEditor} />
        <SettingsSelectors className={styles.settingsSelectors} />
      </div>
    </>
  );
};

export default QuizEditor;
