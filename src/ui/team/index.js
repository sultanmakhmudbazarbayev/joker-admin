import React, { useEffect, useRef, useState } from "react";
import styles from './TeamEditor.module.scss';
import { Button, Checkbox, Form, Input, List, Select, Modal, message } from "antd";
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { CAPITAN_CARDS } from "@/application/constants";
import { _createPlayer, _deletePlayer, _fetchPlayersByTeamId, _fetchTeamById, _saveImage, _updatePlayer, _updateTeam } from "@/pages/api/requests";

const { Option } = Select;

const TeamEditor = ({ id }) => {
  const [form] = Form.useForm();
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [capitan, setCapitan] = useState(null);
  const [isCapitan, setIsCapitan] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [capitanCard, setCapitanCard] = useState(null);


  const inputRefPlayer = useRef(null);
  const [playerImage, setPlayerImage] = useState('');

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

    form.setFieldsValue({
        playerName: player.name,
        isCaptain: player.is_capitan,
    });
    setIsModalOpen(true); 
  };

  const handlePlayerImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return message.error("No file selected.");

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await _saveImage(formData);
        if (!response.ok) throw new Error(`Failed to upload: ${response.statusText}`);

        const data = await response.json();
        const values = { image: data.url, team_id: id };

        const updateResponse = await _updatePlayer(capitan.id, values);

        if (updateResponse.data.status === 'OK') {
            message.success("Team image updated successfully.");
            setPlayerImage(updateResponse.data.data.image)
        } else {
            message.error("Failed to update team image.");
        }
    } catch (error) {
        message.error(`Upload error: ${error.message}`);
    }
  };

  const updateCapitanCard = (value) => {
    setCapitanCard(value)
  }

  const handleOk = async () => {
    try {
        const values = {
            name: playerName,
            is_capitan: isCapitan,
            card: capitanCard,
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
              const captainResponse = playersResponse.data.data.find(player => player.id === teamResponse.data.data.capitan_id);
              setCapitan(captainResponse || null);
              setPlayerImage(capitan?.image ? capitan.image : null)
          }
      };
      fetchTeamAndPlayers();
  }, [id, capitan]); 

  const renderOptions = () => CAPITAN_CARDS.map(card => (
    <Option key={card.id} value={card.technical_name}>{`${card.name}`}</Option>
  ));


  return (
    <div className={styles.editorContainer}>

        <div className={styles.players}>

            <h2 style={{
                textAlign: "center"
            }}>Капитан</h2>

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
            
                
            <div onClick={() => inputRefPlayer.current?.click()}>
                {playerImage ? (
                    <img src={process.env.NEXT_PUBLIC_BASE_URL + playerImage} alt="Uploaded" style={{ width: '100%', maxWidth: "640px", height: '100%', maxHeight: "640px", objectFit: 'contain', borderRadius: "10px" }} />
                ) : (
                    <UploadOutlined style={{ fontSize: '24px', color: 'rgba(0,0,0,.45)' }} />
                )}
                <input type='file' onChange={handlePlayerImageChange} ref={inputRefPlayer} style={{ display: "none" }} />
            </div>
            

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

                    <Select
                        defaultValue={'Карта'}
                        onChange={updateCapitanCard}
                        style={{
                            width: "200px"
                        }}
                    >
                        {renderOptions()}
                    </Select>


                </Form>
            </Modal>
        }
    </div>
  );
};

export default TeamEditor;

