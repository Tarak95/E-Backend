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


app.post("/registration",(req,res) =>{
    const {email,password,confirmPassword,terms} = req.body
    if(!terms){
        res.send({message: 'Please Accept Our Terms and Condition'})
    }
})

let port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`); 
});

