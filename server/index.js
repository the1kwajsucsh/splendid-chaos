require('dotenv').config();
const express = require('express')
const { neon } = require('@neondatabase/serverless');
const cors = require('cors');

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use("/data", async (_, res) => {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`select * from playing_with_neon`;
    res.json([...response]);
})

app.use("/", (req, res) => {
    res.send("Server is running.");
})

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));