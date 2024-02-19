import React, {useEffect, useState} from 'react';
import { fetchQuizData } from '@/application/actions/quiz';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import QuestionList from './QuestionList';
import QuestionEditor from './QuestionEditor';
import SettingsSelectors from './SettingsSelectors';
import styles from './QuizEditor.module.scss';

const QuizEditor = (props) => {
  const dispatch = useDispatch();
  const { id } = props;
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (id) {
        dispatch(fetchQuizData(id));
        setLoading(false)
    }

}, [id]);

  return loading ? <p>Loading...</p> :
  (
    <>
      <Header />
      <div className={styles.editorContainer}>
        <QuestionList className={styles.questionsList} />
        <QuestionEditor className={styles.questionEditor} />
        <SettingsSelectors className={styles.settingsSelectors} />
      </div>
    </>
  );
};

export default QuizEditor;
