const express = require("express")
const app = express()

const cors = require("cors")
const dbConfig = require("./config/dbConfig")


// Meddlewere

app.use(express.json())
app.use(cors())

// DATA

dbConfig()


app.get("/",(req,res) =>{
    res.send("Hello Bangladesh")
})

app.listen(8000,() =>{
    console.log("Server is running on port 8000")
})
