const axios = require('axios');
const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:3001';
const TABLET_NUMBER = 123;

async function getTeamData(tablet_number) {
    try {
        const tabletResponse = await axios.get(`http://localhost:3001/tablet?number=${tablet_number}`);

        const team_id = tabletResponse.data.data.team_id
        const teamResponse = await axios.get(`http://localhost:3001/teams/${team_id}`);

        return teamResponse.data.data
    } catch (error) {
        console.error('Error fetching team data:', error);
        return null;
    }
}

// Connect to the Socket.IO server
const socket = io(SERVER_URL);

// Handling connection event
socket.on('connect', () => {
    console.log('Connected to the server');
    // Emitting events can be done here if necessary
});

// Listening for custom events from the server
socket.on('connect-tablet', async () => {
    const team = await getTeamData(TABLET_NUMBER);
    if (team) {
        socket.emit("join-team", team); 
    }
});

socket.on('_next-slide', (data) => {
    console.log('_next-slide ' + data);
});

socket.on('_next-round', (data) => {
    console.log('_next-round ' + data);
});

socket.on('_start-round', (data) => {
    console.log('_start-round ' + data);
});

socket.on('_get-all-teams', (data) => {
    const teams = data.teams
    console.log('data', data)
});

socket.on("_get-questions", async ({questions}) => {
    console.log('questions', questions)
  });


// Handling disconnection event
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});
