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

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive - location",{id:socket.id,...data})
    });
    console.log("New user connected")
})
app.get("/", function (req, res) {
    res.render("index");
});


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

