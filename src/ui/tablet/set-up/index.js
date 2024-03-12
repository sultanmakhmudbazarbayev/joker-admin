import React, { useEffect, useState } from 'react';
import { Button, Input, Select, List, Space, message } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import styles from './TabletSetUp.module.scss';
import { _fetchTeams, _setUpTabletsTeams } from '@/pages/api/requests';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { emitEvent } from '@/socket';
import useSocket from '@/hooks/useSocket';
import { setTeams } from '@/application/store/reducers/teamsSlice';

const { Option } = Select;

const TabletsSetUp = () => {
    const router = useRouter();
    const sessionQuizId = useSelector((state) => state.sessionQuizId.data.id);
    const socket = useSocket()

    const dispatch = useDispatch();

    const [includedTeams, setIncludedTeams] = useState([]);
    const [allTeams, setAllTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
          try {
            const response = await _fetchTeams();

            if(response.data.status) {
                setAllTeams(response.data.data)
            }
          } catch (error) {
            console.error('Error fetching teams:', error);
          }
        };
    
        fetchTeams();
      }, []);

    const isTeamSelected = (teamId) => {
        return includedTeams.some(team => team.id === teamId);
    };

    const handleAddTeam = () => {
        const newIncludedTeam = { id: '', number: '' };
        setIncludedTeams([...includedTeams, newIncludedTeam]);
    };

    const handleSaveTeams = async () => {
        let valid = true;
        for(const team of includedTeams) {
            if(team.id === '' || team.number === '') {
                valid = false;
                break;
            }
        }
        if(!valid) {
            message.error("All teams must be configured (both team name and number)");
        } else {
            const response = await _setUpTabletsTeams({tablets: includedTeams})

            dispatch(setTeams({teams: includedTeams}));
            
            if(response.data.status) {
                router.push(`/quiz-session/${sessionQuizId}`);
            }
            if(socket) {
                socket.emit("start-session", "admin started new session")
            }

        }


    }

    const handleDeleteTeam = index => {
        const updatedIncludedTeams = [...includedTeams];
        updatedIncludedTeams.splice(index, 1);
        setIncludedTeams(updatedIncludedTeams);
    };

    const handleTeamChange = (value, index, field) => {
        const updatedIncludedTeams = includedTeams.map((team, i) =>
            i === index ? { ...team, [field]: value, ...(field === 'id' && {number: ''}) } : team
        );
        setIncludedTeams(updatedIncludedTeams);
    };

    return (
        <div className={styles.editorContainer}>
            <div className={styles.tabletsContainer}>
                <List
                    size="large"
                    style={{
                        width: "90%",
                        maxHeight: "100%"
                    }}
                    header={<h2 style={{
                        textAlign: 'center'
                    }}>Teams Setup</h2>}
                    footer={
                        <footer className={styles.footerContainer}>
                            <div className={styles.leftButton}>
                                <Button type="primary" onClick={handleAddTeam}>
                                    + Add Team
                                </Button>
                            </div>
                            <div className={styles.rightButton}>
                                <Button type="primary" onClick={handleSaveTeams}>
                                    Save and Start Session
                                </Button>
                            </div>
                        </footer>
                    }
                    dataSource={includedTeams}
                    renderItem={(item, index) => (
                        <List.Item style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Space align="center">
                            <Select
                                value={item.id}
                                style={{ width: "20vw" }}
                                onChange={value => handleTeamChange(value, index, 'id')}
                            >
                                {allTeams.map(team => (
                                    <Option key={team.id} value={team.id} disabled={isTeamSelected(team.id)}>
                                        {team.name}
                                    </Option>
                                ))}
                            </Select>
                                <Input
                                    type="number"
                                    placeholder="Tablet number"
                                    value={item.number}
                                    onChange={e => handleTeamChange(e.target.value, index, 'number')}
                                />
                                <MinusCircleOutlined
                                    onClick={() => handleDeleteTeam(index)}
                                />
                            </Space>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default TabletsSetUp;
