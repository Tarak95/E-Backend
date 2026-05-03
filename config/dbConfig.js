const mongoose = require("mongoose")

const dbConfig = () => {
    
    mongoose.connect("mongodb+srv://E-Backend:meHztp5m3C8lC7yT@cluster0.ryyhaiz.mongodb.net/ecobazar?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Database Connected");
    })
    
}

module.exports = dbConfig
