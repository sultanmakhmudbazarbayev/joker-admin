import React, { useState, useRef, useEffect } from 'react'; // Import useEffect
import { List, Upload, Input, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import AnswerOption from './AnswerOption';
import styles from './QuestionEditor.module.scss';
import { useSelector } from 'react-redux';

const QuestionEditor = (props) => {
    const { className } = props;
    const inputRef = useRef(null);
    const [image, setImage] = useState('');
    const [questionText, setQuestionText] = useState(''); // State to hold the text of the question

    const question = useSelector((state) => state.chosenQuestion.data);

    console.log('question', question)

    const options = ['1', '2']

    // useEffect to set image and question text when question changes
    useEffect(() => {
            if (question.image) {
                setImage(question.image);
            } else {
                setImage('');
            }

            if (question.question) {
                setQuestionText(question.question); // Set the question text if available
            } else {
                setQuestionText('');
            }
    }, [question]); // This effect depends on the question object

    const handleImageClick = () => {
        inputRef.current.click();
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            message.error("No file selected.");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setImage(data.url);
                message.success("Image uploaded successfully.");
            } else {
                throw new Error(`Failed to upload: ${response.statusText}`);
            }
        } catch (error) {
            message.error(`Upload error: ${error.message}`);
        }
    };

    return (
        <div className={className}>
            <div className={styles.question}>
                <div onClick={handleImageClick} className={styles.image}>
                    {image ? (
                        <img src={image} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: "10px" }} />
                    ) : (
                        <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                    )}
                    <input type='file' onChange={handleImageChange} ref={inputRef} style={{ display: "none" }} />
                </div>
                <Input.TextArea 
                    rows={10} 
                    className={styles.textArea} 
                    placeholder="Enter your question here"
                    value={questionText} // Use the questionText state for the value
                    onChange={(e) => setQuestionText(e.target.value)} // Update the state when the text changes
                />
            </div>
            <div className={styles.answers}>
                <List
                    dataSource={options}
                    renderItem={(item) => (
                        <List.Item>
                            <AnswerOption />    
                        </List.Item>
                    )}
                    footer={
                        <div className={styles.addOption}>
                            <Button type="primary" >Add Option</Button>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default QuestionEditor;




// import React, { useState, useRef } from 'react';
// import { List, Upload, Input, Button, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import AnswerOption from './AnswerOption';
// import styles from './QuestionEditor.module.scss';
// import { useSelector } from 'react-redux';

// const QuestionEditor = (props) => {
//     const { className } = props;
//     const inputRef = useRef(null);
//     const [image, setImage] = useState('');

//     const question = useSelector((state) => state.chosenQuestion.data)

//     // I want to set image if it is present in question.image
//     // and I want to fill Input.TextArea if there is a value in question.question


//     const options = ['1', '2']

//     const handleImageClick = () => {
//         inputRef.current.click();
//     };

    // const handleImageChange = async (event) => {
    //     const file = event.target.files[0];
    //     if (!file) {
    //         message.error("No file selected.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('image', file);

    //     try {
    //         const response = await fetch('http://localhost:3001/upload', {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             setImage(data.url);
    //             message.success("Image uploaded successfully.");
    //         } else {
    //             throw new Error(`Failed to upload: ${response.statusText}`);
    //         }
    //     } catch (error) {
    //         message.error(`Upload error: ${error.message}`);
    //     }
    // };

//     return (
//         <div className={className}>
//             <div className={styles.question}>
//                 <div onClick={handleImageClick} className={styles.image}>
//                     {image ? (
//                         <img src={image} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: "10px" }} />
//                     ) : (
//                         <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
//                     )}
//                     <input type='file' onChange={handleImageChange} ref={inputRef} style={{ display: "none" }} />
//                 </div>
//                 <Input.TextArea rows={10} className={styles.textArea} placeholder="Enter your question here" />
//             </div>
            // <div className={styles.answers}>
            //     <List
            //         dataSource={options}
            //         renderItem={(item) => (
            //             <List.Item>
            //                 <AnswerOption />    
            //             </List.Item>
            //         )}
            //         footer={
            //             <div className={styles.addOption}>
            //                 <Button type="primary" >Add Option</Button>
            //             </div>
            //         }
            //     />
            // </div>
//         </div>
//     );
// };

// export default QuestionEditor;
