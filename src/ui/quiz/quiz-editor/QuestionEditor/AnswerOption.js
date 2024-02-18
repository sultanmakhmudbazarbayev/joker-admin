import React from 'react';
import { Input, Checkbox, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './AnswerOption.module.scss';

const AnswerOption = (props) => {
    const { onCorrectChange, isCorrect, index, onDelete, onUpload } = props;

    return (
        <div className={styles.optionContainer}>
            <Checkbox
                className={styles.correctIndicator}
                checked={isCorrect}
                onChange={() => onCorrectChange(index)}
            />
            <Input.TextArea
                rows={2}
                className={styles.textArea}
                placeholder="Enter your answer here"
            />
            <div className={styles.actionIcons}>
                <Button icon={<UploadOutlined />} onClick={() => onUpload(index)} />
                <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(index)} />
            </div>
        </div>
    );
};

export default AnswerOption;
