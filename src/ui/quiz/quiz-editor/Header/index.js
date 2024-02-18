import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import styles from './header.module.scss';

const Header = () => {
  const name = useSelector((state) => state.quiz.data.name);

  return (
    <div className={styles.headerContainer}>
      <h2>{name}</h2>
      <div>
        <Button type="primary" size={'large'} className={styles.buttonMarginRight}>Save</Button>
        <Button size={'large'} danger>Discard</Button>
      </div>
    </div>
  );
};

export default Header;
