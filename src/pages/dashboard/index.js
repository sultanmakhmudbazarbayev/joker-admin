// Page.js
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizTable from "@/ui/quizzes";
import { Modal, Form, Input } from 'antd';
import { _createQuiz, _fetchQuizzes } from "../api/requests";

const Page = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizName, setQuizName] = useState("");
  const form = useRef();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      await _createQuiz({
        name: quizName
      })
      await fetchQuizzes();
      toast.success('Quiz created Successfully! Now edit it to use further!',);
    } 
    catch(err) {
      if(err) {
        toast.error(`Error when creating a new quiz`);
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchQuizzes = async () => {
    try {
      const response = await _fetchQuizzes();
      setQuizzes(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching quizzes");
      setError("An error occurred while fetching quizzes.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);
  
  return (
    <>
      <div style={{
          display: "flex",
          // justifyContent: "space-between",
          width: "90%",
          margin: "auto",
          marginTop: "40px"
      }}>
        {/* <input
          type="text"
          placeholder="Search by quiz name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "30%", height: "30px" }}
        /> */}
        <button
          style={{
            width: "16%",
            marginLeft: "auto",
            padding: "10px", 
            backgroundColor: "purple", 
            color: "white", 
            border: "none",
            borderRadius: "5px", 
            cursor: "pointer",
          }}
          onClick={showModal}
        >
          Create Quiz
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <QuizTable quizzes={quizzes} />
      )}

      {isModalOpen && <Modal title="Quiz" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Create" cancelText='Cancel'>
      <Form layout="vertical" ref={form} autoComplete="off">
              <Form.Item
                name="Quiz name"
                rules={[
                  {
                    required: true,
                    message: "Данное поле обязательно для заполнения",
                  },
                ]}
              >
                <Input
                  disabled={loading}
                  placeholder="Quiz name"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                />
              </Form.Item>
            </Form>
        </Modal>}
        <ToastContainer />
    </>
  );
};

export default Page;
