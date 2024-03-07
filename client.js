const axios = require('axios');
const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:3001'; // Change to your server's URL and port
const TABLET_NUMBER = 123;

// Use an async function to handle asynchronous operations
async function getTeamData(tablet_number) {
    try {
        const tabletResponse = await axios.get(`http://localhost:3001/tablet?number=${tablet_number}`);

        const team_id = tabletResponse.data.data.team_id
        const teamResponse = await axios.get(`http://localhost:3001/teams/${team_id}`);

        return teamResponse.data.data
    } catch (error) {
        console.error('Error fetching team data:', error);
        return null; // Return null or an appropriate error indicator
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
    console.log('Tablet connection started');
    const team = await getTeamData(TABLET_NUMBER);
    if (team) {
        console.log('teamData:', team);
        socket.emit("join-team", team); 
    }
});


// Handling disconnection event
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});
