require('dotenv').config()

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

let port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});

