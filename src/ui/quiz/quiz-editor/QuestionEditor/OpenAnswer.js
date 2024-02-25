import React from 'react';
import { Input, Checkbox, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AnswerOption.module.scss';

const OpenAnswer = (props) => {
    const { onCorrectChange, isCorrect, index, onDelete, onUpload } = props;

    return (
        <div className={styles.optionContainer}>
            <Input.TextArea
                rows={4}
                className={styles.textAreaOpenAnswer}
                placeholder="Enter your answer here"
            />
        </div>
    );
};

export default OpenAnswer;
