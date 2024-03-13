// Importing required modules
const net = require("net");

// Retrieve host and port from command line arguments, default to localhost and port 4001 respectively
let host = process.argv[2] || "127.0.0.1";
let port = parseInt(process.argv[3]) || 4001;

// Object to store client sockets
let clients = {};

// Object to store client names based on connection ID
let clientNames = {};

// Create a TCP server
const server = net.createServer((socket) => {
  // Generate a random connection ID
  let connectionID = Math.floor(Math.random() * 1000);

  // Ensure the generated ID is unique
  while (clients.hasOwnProperty(connectionID)) {
    connectionID = Math.floor(Math.random() * 1000);
  }

  console.log("New Connection: ", connectionID);

  // Store the client socket in the clients object
  clients[connectionID] = socket;

  // Prompt the client to enter a username
  socket.write(passServerMessage("Type in User Name?", connectionID));

  // Event listener for when data is received from a client
  socket.on("data", (data) => {
    // Parse the received data
    const jsonData = JSON.parse(data);
    const strData = jsonData.message;
    const connID = parseInt(jsonData.fromClient);
    console.log(`[${connectionID}]: ${strData}`);

    // Handle different message types
    if (jsonData.type == "server") {
      // If the message type is server, it contains the username
      clientNames[connectionID] = jsonData.message;
    } else {
      // Broadcast the message to all clients except the sender
      for (const [connectionID, connection] of Object.entries(clients)) {
        if (connectionID != connID) {
          connection.write(
            passClientMessage(clientNames[connID], strData, connectionID)
          );
        }
      }
    }
  });

  // Event listener for when a client disconnects
  socket.on("end", () => {
    console.log("Client disconnected");
  });

  // Event listener for socket errors
  socket.on("error", (error) => {
    console.log(`Socket Error: ${error.message}`);
  });
});

// Event listener for server errors
server.on("error", (error) => {
  console.log(`Server Error: ${error.message}`);
});

// Start listening for connections
server.listen(port, host, () => {
  console.log(`Socket is listening for connections on ${host}:${port}`);
});

// Function to format client messages
function passClientMessage(fromClient, message, toClient) {
  const jsonData = { type: "client", fromClient, message, toClient };
  return JSON.stringify(jsonData);
}

// Function to format server messages
function passServerMessage(message, toClient) {
  const jsonData = { type: "server", fromClient: undefined, message, toClient };
  return JSON.stringify(jsonData);
}
