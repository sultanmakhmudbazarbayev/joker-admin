import React, { useEffect, useState } from "react";
import styles from './TeamEditor.module.scss';
import { Button, Checkbox, Form, Input, List, Modal } from "antd";
import { DeleteOutlined } from '@ant-design/icons';

import { _createPlayer, _deletePlayer, _fetchPlayersByTeamId, _fetchTeamById, _updatePlayer } from "@/pages/api/requests";

const TeamEditor = ({ id }) => {
  const [form] = Form.useForm();
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const [capitan, setCapitan] = useState(null);
  const [isCapitan, setIsCapitan] = useState(null);
  const [playerName, setPlayerName] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onDelete = async (player, event) => {
    event.stopPropagation();
    const response = await _deletePlayer(player.id);
    if(response && response.data && response.data.status) {
        setPlayers(prevPlayers => prevPlayers.filter((prevPlayer) => prevPlayer.id !== player.id));
    }

    if(player.is_capitan) {
        setCapitan(null);
    }
  }

  const onPlayerClick = (player) => {
    setSelectedPlayer(player);
    setPlayerName(player.name);
    setIsCapitan(player.is_capitan);

    console.log('player', player)

    form.setFieldsValue({
        playerName: player.name,
        isCaptain: player.is_capitan,
    });
    setIsModalOpen(true); 
  };

  const handleOk = async () => {
    try {
        const values = {
            name: playerName,
            is_capitan: isCapitan,
            team_id: id,
        };

        const response = await _updatePlayer(selectedPlayer.id, values);

        if(response && response.data && response.data.status) {
            setPlayers(prevPlayers => prevPlayers.map(prevPlayer => {
                if (prevPlayer.id === selectedPlayer.id) {
                    return {...prevPlayer, ...response.data.data};
                }
                return prevPlayer;
            }));
            if(values.is_capitan) {
                setCapitan({...capitan, ...response.data.data});
            }
        }
    } 
    catch(err) {
        console.log(err);
    }
    setIsCapitan(false)
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onAddPlayer = async () => {
      const response = await _createPlayer({
        name: "New Player",
        team_id: id,
      });
      if(response && response.data && response.data.data) {
          setPlayers([...players, response.data.data]);
      }
  };

  useEffect(() => {
      const fetchTeamAndPlayers = async () => {
          const playersResponse = await _fetchPlayersByTeamId(id);
          if (playersResponse && playersResponse.data) {
              setPlayers(playersResponse.data.data);
          }
          const teamResponse = await _fetchTeamById(id);
          if (teamResponse && teamResponse.data) {
              setTeam(teamResponse.data.data);
              const captainResponse = playersResponse.data.data.find(player => player.id === teamResponse.data.data.capitan_id);
              setCapitan(captainResponse || null);
          }
      };
      fetchTeamAndPlayers();
  }, [id, capitan]); 

  return (
    <div className={styles.editorContainer}>
        <div className={styles.team}>
            <h1>Team</h1>
            <img src="http://localhost:3001/images/default/no-image.jpg"></img>
            <h2>{team?.name}</h2>
        </div>
        <div className={styles.players}>

            <h2>Players count: {players.length}</h2>

            <List
                className={styles.playersList}
                grid={{ gutter: 16, column: 1 }}
                dataSource={players}
                renderItem={(item) => (
                    <List.Item className={styles.playerListItem} >
                        <div className={styles.playerCardWrapper}>
                            <div onClick={() => onPlayerClick(item)} className={styles.playerName}>
                                <h4>{item.name}</h4>
                            </div>
                            <Button danger icon={<DeleteOutlined />} onClick={async (e) => onDelete(item, e)} />
                        </div>
                    </List.Item>
                )}
                footer={
                    <div className={styles.addPlayer}>
                        <Button type="primary" onClick={onAddPlayer}>Create Player</Button>
                    </div>
                }
            />
        </div>
        <div className={styles.capitan}>
            <h1>Capitan</h1>
            <img src={capitan?.image || "http://localhost:3001/images/default/no-image.jpg"} alt="Capitan"/>
            <h2>{capitan?.name || "No Capitan Assigned"}</h2>
        </div>

        {isModalOpen 
            && <Modal title="Player" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Ok" cancelText='Cancel'>
                <Form layout="vertical" autoComplete="off" form={form}>
                    <Form.Item
                        name="playerName"
                        rules={[
                        {
                            required: true,
                            message: "This field is required",
                        },
                        ]}
                    >
                        <Input
                        placeholder="Player name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item name="isCaptain" valuePropName="checked">
                        <Checkbox onChange={(e) => setIsCapitan(e.target.checked)}>Is Captain?</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        }
    </div>
  );
};

export default TeamEditor;

