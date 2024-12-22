const cluster = require('cluster');
const os = require('os');
const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Menu = require('./models/menuModel'); 
const Feedback = require('./models/feedbackModel');
const Order = require('./models/orderModel');
require('dotenv').config();
const app = express();
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');   
require('./config/passport');
const { isAdmin } = require('./authMiddleware');
require('./report');

app.use(express.json());
app.use(cors());

const feedbackrouter = require('./routes/feedbackRoutes');
const menuRouter = require('./routes/menuRouter');
const orderRoutes = require('./routes/orderRouter');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('http://localhost:5000/auth/google');
};

app.use('/auth', authRoutes);
app.use('/feedback', feedbackrouter);
app.use('/menu', isAuthenticated, isAdmin, menuRouter);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);//serve static report files from the reports directory.
app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});
// if (cluster.isMaster) {
//     // Master process code
//     require('./report');
//     const numCPUs = os.cpus().length;
//     console.log(`Master ${process.pid} is running`);

//     // Fork workers
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`Worker ${worker.process.pid} died`);
//     });
// } else {
//     // Worker process code

//     app.listen(PORT, () =>{
//         console.log(`started and server is running on port ${PORT}`);
//     });
// //};



console.log(process.env.MONGO_ADRESS);
const URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS || 'localhost'}:27017/appdb?authSource=admin`;

mongoose.connect(URI).then(()=>{
    console.log("connected to mongodb");
}).catch(err=>{
    console.log(err);
}).then(()=>initializeOrders()).then(()=>initializeMENU()).then(()=>initializeFEEDBACK());


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
const ordersFilePath = path.join(__dirname, 'orders.json');//reading items from menu.json and uploading to db
function readOrdersFile() {
    try {
        const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
        console.log(ordersData);
        return JSON.parse(ordersData);
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
    const generateShortName = (name) => {
        return name.toLowerCase().replace(/\s+/g, '_');
    }
    try {
        // Read menu items from menu.json
        const menuItems = readMenuFile();
        const menuItemsWithTimestamps = menuItems.map(item => ({
            ...item,
            shortName: generateShortName(item.name),
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
async function initializeOrders() {
    try {
        // Read menu items from menu.json
        const ordersItems = readOrdersFile();
        console.log(ordersItems);
        // Insert menu items into MongoDB using Mongoose
        await Order.insertMany(ordersItems);

        // Insert menu items into MongoDB
        console.log('Orders inserted into MongoDB');
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
            menu_item: "cheese_pizza",
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





