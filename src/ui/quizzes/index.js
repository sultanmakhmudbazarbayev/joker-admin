import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { disconnectSocket, initSocket, subscribeToEvent } from "@/socket";

const QuizTable = ({ quizzes }) => {
  const tableStyle = {
    width: "90%",
    borderCollapse: "collapse",
    margin: "auto",
    marginTop: "20px",
    
  };
  const thStyle = {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
  };
  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  };
  const buttonContainerStyle = {
    textAlign: "left",
  };
  const buttonStyle = {
    marginRight: "5px",
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  };

  const router = useRouter();

  const handleEdit = (id) => {
    router.push(`/quiz/${id}`);
  };

  const handleStartSession = (id) => {
    router.push(`/quiz-session/${id}`);
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Image</th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>createdAt</th>
          <th style={thStyle}>updatedAt</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((item) => (
          <tr key={item.id}>
            <td style={tdStyle}>{item.image}</td>
            <td style={tdStyle}>{item.name}</td>
            <td style={tdStyle}>{item.id}</td>
            <td style={tdStyle}>{item.createdAt}</td>
            <td style={{ ...tdStyle, ...buttonContainerStyle }}>
              <button style={buttonStyle} onClick={() => handleEdit(item.id)}>
                Edit
              </button>
              <button style={buttonStyle} onClick={() => handleStartSession(item.id)}>
                Start New Session
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuizTable;
