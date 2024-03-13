// Importing required modules
const net = require("net");
const readline = require("readline").createInterface({ input: process.stdin });

// Default host and port, can be overridden via command line arguments
let host = process.argv[2] || "127.0.0.1";
let port = parseInt(process.argv[3]) || 4001;

// Variable to store the connection ID
let connectionId;

// Creating a TCP client connection
const client = net.createConnection(port, host, () => {
  console.log("Connected");
});

// Function to read user input and send messages
function readText(msg, fromServer) {
  // If message is from the server, display it
  if (fromServer) {
    console.log(msg);
  }
  // Prompting user for input
  readline.question("", (text) => {
    // If input is not 'exit', continue reading input recursively
    if (text != "exit") {
      readText(text, false);
      // If message is from the server, send it to the server
      if (fromServer) {
        passServerMessage(connectionId, text);
      } else {
        // If message is from the client, send it to the server with appropriate details
        passClientMessage(connectionId, text, undefined);
      }
    } else {
      // If input is 'exit', close readline interface
      return readline.close();
    }
  });
}

// Event listener for receiving data from the server
client.on("data", (data) => {
  // Parsing received data as JSON
  const jsonData = JSON.parse(data);
  // If message type is 'server', display the message and initiate reading user input
  if (jsonData.type == "server") {
    connectionId = jsonData.toClient;
    readText(jsonData.message, true);
  } else {
    // If message type is 'client', display the message
    console.log(`[${jsonData.fromClient}]: ${jsonData.message}`);
  }
});

// Event listener for handling connection errors
client.on("error", (error) => {
  console.log(`Error: ${error.message}`);
});

// Event listener for connection closure
client.on("close", () => {
  console.log("Connection closed");
});

// Function to pass client message to the server
function passClientMessage(fromClient, message, toClient) {
  const jsonData = { type: "client", fromClient, message, toClient };
  client.write(JSON.stringify(jsonData));
}

// Function to pass server message to the client
function passServerMessage(fromClient, message) {
  const jsonData = { type: "server", fromClient, message, toClient: undefined };
  return client.write(JSON.stringify(jsonData));
}
