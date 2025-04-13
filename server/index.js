const express = require('express')
const app = express()

app.use("/data", (req, res) => {
    res.json({"data": ["song1", "song2", "song3", "song4"]});
})

app.use("/", (req, res) => {
    res.header('Access-Control-Allow-Origin: https://splendid-chaos-client.vercel.app');
    res.send("Server is running.");
})

app.listen(5000, console.log("Server started on PORT 5000"));