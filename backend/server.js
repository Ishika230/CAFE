const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Menu = require('./models/menuModel'); 
const Feedback = require('./models/feedbackModel');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get('/', (req, res) => {
    res.json({msg: "test"})
})

const router = require('./routes/feedbackRoutes');
const menuRouter = require('./routes/menuRouter');
app.use('/feedback', router);
app.use('/menu', menuRouter);

app.listen(PORT, () =>{
    console.log('server is running');
})



const URI = process.env.MONGO_URL;
mongoose.connect(URI).then(()=>{
    console.log("connected to mongodb");
}).catch(err=>{
    console.log(err);
}).then(()=>initializeMENU()).then(()=>initializeFEEDBACK());


const menuFilePath = path.join(__dirname, 'menu.json');//reading items from menu.json and uploading to db
function readMenuFile() {
    try {
        const menuData = fs.readFileSync(menuFilePath, 'utf8');
        return JSON.parse(menuData);
    } catch (err) {
        console.error('Error reading menu file:', err);
        return [];
    }
}
const feedbackFilePath = path.join(__dirname, 'feedback.json');//reading items from menu.json and uploading to db
function readFeedbackFile() {
    try {
        const feedbackData = fs.readFileSync(feedbackFilePath, 'utf8');
        return JSON.parse(feedbackData);
    } catch (err) {
        console.error('Error reading feedback file:', err);
        return [];
    }
}

async function initializeMENU() {
    try {
        // Read menu items from menu.json
        const menuItems = readMenuFile();
        const menuItemsWithTimestamps = menuItems.map(item => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Insert menu items into MongoDB using Mongoose
        await Menu.insertMany(menuItemsWithTimestamps);

        // Insert menu items into MongoDB
        console.log('Menu items inserted into MongoDB');
    } catch (error) {
        console.error('Error initializing MongoDB with menu items:', error);
    }
}
async function initializeFEEDBACK() {
    try {
        // Read menu items from menu.json
        const feedbacks = readFeedbackFile();
        const feedbacksWithTimestamps = feedbacks.map(item => ({
            ...item,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        // Insert menu items into MongoDB using Mongoose
        await Feedback.insertMany(feedbacksWithTimestamps);

        // Insert menu items into MongoDB
        console.log('Feedbacks inserted into MongoDB');
    } catch (error) {
        console.error('Error initializing MongoDB with feedback items:', error);
    }
}



//connect mongodb



