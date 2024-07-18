const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
    console.log("New user connected");

    socket.on("send-location", function(data) {
        console.log(`Location received from ${socket.id}:`, data);
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function() {
        console.log("User disconnected");
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
