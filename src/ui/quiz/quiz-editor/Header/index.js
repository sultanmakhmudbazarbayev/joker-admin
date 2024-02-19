import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router'; 
import styles from './header.module.scss';
import { clearQuizData } from '@/application/store/reducers/quizSlice';
import { clearChosenRound } from '@/application/store/reducers/chosenRoundSlice';
import { clearChosenQuestion } from '@/application/store/reducers/chosenQuestionSlice';

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const name = useSelector((state) => state.quiz.data.name);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showDiscardModal = () => {
    Modal.confirm({
      title: 'Are you sure you want to leave?',
      icon: <ExclamationCircleOutlined />,
      content: 'You want be able to play the quiz without saving it.',
      okText: 'Discard',
      okType: 'danger',
      cancelText: 'Cancel',
      style: { top: '30%' }, // Center the modal vertically
      onOk() {
        dispatch(clearQuizData());
        dispatch(clearChosenRound());
        dispatch(clearChosenQuestion());
        router.push('/');
      },
    });
  };

  return (
    <div className={styles.headerContainer}>
      <h2>{name}</h2>
      <div>
        <Button type="primary" size={'large'} className={styles.buttonMarginRight}>Save</Button>
        <Button size={'large'} danger onClick={showDiscardModal}>Discard</Button>
      </div>
    </div>
  );
};

export default Header;
