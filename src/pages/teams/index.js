// Page.js
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TeamTable from "@/ui/teams";
import { Modal, Form, Input } from 'antd';
import { _createTeam, _fetchTeams } from "../api/requests";

const Page = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const form = useRef();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const newTeam = await _createTeam({
        name: teamName
      })

      setTeams([newTeam.data.data, ...teams]);

      toast.success('Team created Successfully! Now edit it to use further!',);
    } 
    catch(err) {
      if(err) {
        toast.error(`Error when creating a new team`);
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchTeams = async () => {
    try {
      const response = await _fetchTeams();
      setTeams(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching teams");
      setError("An error occurred while fetching teams.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
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
          placeholder="Search by team name"
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
          Create Team
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TeamTable teams={teams} />
      )}

      {isModalOpen && <Modal title="Team" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Create" cancelText='Cancel'>
      <Form layout="vertical" ref={form} autoComplete="off">
              <Form.Item
                name="Team name"
                rules={[
                  {
                    required: true,
                    message: "Данное поле обязательно для заполнения",
                  },
                ]}
              >
                <Input
                  disabled={loading}
                  placeholder="Team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </Form.Item>
            </Form>
        </Modal>}
        <ToastContainer />
    </>
  );
};

export default Page;
