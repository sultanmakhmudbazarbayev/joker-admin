import React, { useEffect } from "react";
import { useRouter } from "next/router";

const TeamTable = (props) => {

  const {teams} = props;

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
    router.push(`/team/${id}`);
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
        {teams.map((item) => (
          <tr key={item.id}>
            <td style={tdStyle}>{item.image}</td>
            <td style={tdStyle}>{item.name}</td>
            <td style={tdStyle}>{item.id}</td>
            <td style={tdStyle}>{item.createdAt}</td>
            <td style={{ ...tdStyle, ...buttonContainerStyle }}>
              <button style={buttonStyle} onClick={() => handleEdit(item.id)}>
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamTable;
