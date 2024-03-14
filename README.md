**Overview**

This repository contains a simple TCP client-server chat application implemented in Node.js. The application allows multiple clients to connect to a server and exchange messages with each other. The server acts as a mediator between clients, relaying messages appropriately.

**Application Architecture**

The application architecture consists of two main components:

1. **Server**: The server component creates a TCP server using Node.js's `net` module. It listens for incoming connections from clients and manages communication between them. Each client is assigned a unique connection ID upon connection. The server stores client sockets and their respective connection IDs in memory. It handles message passing between clients and broadcasts messages to all connected clients except the sender.

2. **Client**: The client component establishes a TCP connection to the server. It allows users to input messages via the command line interface (CLI) and sends them to the server. It also listens for incoming messages from the server and displays them in the CLI.

**Concurrency Handling**

Concurrency is handled through asynchronous event-driven programming in Node.js. Both the server and client applications utilize event listeners to handle incoming connections, data, errors, and connection closures. Asynchronous functions such as `socket.on()` and event listeners ensure that multiple clients can interact with the server simultaneously without blocking the execution flow.

**How to Run the Application**

**Prerequisites:**
- Node.js installed on your system

**Steps:**

1. **Clone the Repository:**
   ```
   git clone https://github.com/tanmyavishvakarma/Backend-Developer-Submission-Tanmya-Vishvakarma.git
   ```

2. **Navigate to the Project Directory:**
   ```
   cd Backend-Developer-Submission-Tanmya-Vishvakarma
   ```

3. **Start the Server:**
   ```
   cd server
   node server.js <host> <port>
   ```
   *Replace `<host>` and `<port>` with the desired host and port for the server. If not provided, defaults to `127.0.0.1` and `4001` respectively.*

Open another terminal and navigate to the Project Directory

4. **Start the Client:**
   ```
   cd client
   node index.js <host> <port>
   ```
   *Replace `<host>` and `<port>` with the host and port of the server awaiting connections. If not provided, defaults to `127.0.0.1` and `4001` respectively.*

5. **Interact with the Client:**
   - Once the client is connected to the server, type in your username and start chatting using the command line interface.
   - Type `exit` to disconnect from the server and close the client application.

**Assumptions and Design Choices**

1. **Random Connection ID Generation**: The server generates a random connection ID for each client. This approach ensures uniqueness and minimizes the chance of collision among IDs.
  
2. **In-Memory Storage**: Client sockets and connection IDs are stored in memory on the server. This design choice was made to keep the implementation simple for the sake of this example. In a production environment, a more robust solution such as using a database or distributed cache might be preferred for scalability and persistence.

3. **JSON Message Format**: Messages exchanged between the server and clients are formatted as JSON objects. JSON provides a lightweight and standardized way to structure data, making it easy to parse and handle messages.

4. **Command Line Interface (CLI)**: Both the server and client applications interact with users via the command line interface. This choice was made for simplicity and ease of demonstration. In a real-world scenario, a graphical user interface (GUI) might be more user-friendly.

5. **Error Handling**: Error handling is implemented to handle socket errors and server errors. Error messages are logged to the console for debugging purposes. In a production environment, more comprehensive error handling and logging mechanisms would be necessary.
