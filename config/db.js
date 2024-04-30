const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectionString = process.env.DB_URI;

const connectToDB = async () => {
    try {
        await mongoose.connect(connectionString, {autoIndex: true});
        console.log('Connected to MongoDB Atlas')
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDB;
