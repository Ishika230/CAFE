const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cron= require('node-cron');
// Load orders and feedbacks data
const Order = require('./models/orderModel');
const Feedback = require('./models/feedbackModel');
// const cors = require('cors'); 
// const URI = process.env.MONGO_URL
// mongoose.connect(URI).then(() => {
//     console.log("Connected to MongoDB");
// }).catch(err => {
//     console.log(err);
// });

async function generateReport() {
    try {
        // Fetch data from MongoDB
        //const start=performance.now();
        const orders = await Order.find({ paymentStatus: "Completed" }).exec();
        const feedbacks = await Feedback.find().exec();

        const report = generateSalesReport(orders, feedbacks);
        writeReportToFile(report);
        //const end=performance.now();
        console.log(`Time taken (single core): ${(end - start) / 1000} seconds`);
    } catch (error) {
        console.error('Error generating report', error);
    } 
}

function generateSalesReport(orders, feedbacks) {
    const itemSales = {};
    const itemFeedbacks = {};

    // Calculate total sales and sales per item
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!itemSales[item.name]) {
                itemSales[item.name] = { quantity: 0, totalSales: 0, category: item.category };
            }
            itemSales[item.name].quantity += item.quantity;
            itemSales[item.name].totalSales += item.price * item.quantity;
        });
    });

    // Calculate ratings per item
    feedbacks.forEach(feedback => {
        feedback.menu_items.forEach(menu_item => {
            if (!itemFeedbacks[menu_item]) {
                itemFeedbacks[menu_item] = { totalRating: 0, count: 0 };
            }
            itemFeedbacks[menu_item].totalRating += feedback.rating;
            itemFeedbacks[menu_item].count += 1;
        });
    });

    // Combine sales and feedback data
    const combinedData = Object.keys(itemSales).map(itemName => ({
        name: itemName,
        category: itemSales[itemName].category,
        totalSales: itemSales[itemName].totalSales,
        quantity: itemSales[itemName].quantity,
        avgRating: itemFeedbacks[itemName] ? (itemFeedbacks[itemName].totalRating / itemFeedbacks[itemName].count).toFixed(2) : 'N/A',
        feedbackCount: itemFeedbacks[itemName] ? itemFeedbacks[itemName].count : 0
    }));

    const categories = [...new Set(combinedData.map(item => item.category))];
    const categoryReports = categories.map(category => {
        const itemsInCategory = combinedData.filter(item => item.category === category);
        const bestSoldInCategory = itemsInCategory.reduce((acc, item) => item.quantity > acc.quantity ? item : acc, { quantity: 0 });
        const worstSoldInCategory = itemsInCategory.reduce((acc, item) => item.quantity < acc.quantity ? item : acc, { quantity: Infinity });
        const bestRatedInCategory = itemsInCategory.reduce((acc, item) => (item.avgRating !== 'N/A' && item.avgRating > acc.avgRating) ? item : acc, { avgRating: 0 });
        const worstRatedInCategory = itemsInCategory.reduce((acc, item) => (item.avgRating !== 'N/A' && item.avgRating < acc.avgRating) ? item : acc, { avgRating: Infinity });

        return {
            category,
            bestSold: bestSoldInCategory,
            worstSold: worstSoldInCategory,
            bestRated: bestRatedInCategory,
            worstRated: worstRatedInCategory
        };
    });

    // Generate reports
    const totalSales = combinedData.reduce((acc, item) => acc + item.totalSales, 0);
    const highestSellingItem = combinedData.reduce((acc, item) => item.quantity > acc.quantity ? item : acc, { quantity: 0 });
    const lowestSellingItem = combinedData.reduce((acc, item) => item.quantity < acc.quantity ? item : acc, { quantity: Infinity });
    const bestRatedItem = combinedData.reduce((acc, item) => (item.avgRating !== 'N/A' && item.avgRating > acc.avgRating) ? item : acc, { avgRating: 0 });
    const worstRatedItem = combinedData.reduce((acc, item) => (item.avgRating !== 'N/A' && item.avgRating < acc.avgRating) ? item : acc, { avgRating: Infinity });

    return {
        totalSales,
        highestSellingItem,
        lowestSellingItem,
        bestRatedItem,
        worstRatedItem,
        categoryReports
    };
}

function getReportFilename(startDate, endDate) {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const startStr = formatDate(startDate);
    const endStr = formatDate(endDate);
    return `report_${startStr}_to_${endStr}.txt`;
}

function ensureReportsDirectory() {
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir);
    }
}

function writeReportToFile(report) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Example start date, 7 days ago
    const endDate = new Date(); // Example end date, today

    const filename = getReportFilename(startDate, endDate);
    const filePath = path.join(__dirname, 'reports', filename);

    ensureReportsDirectory(); // Ensure the reports directory exists

    const reportText = `
Weekly Sales Report (${startDate.toDateString()} to ${endDate.toDateString()})
-------------------
Total Sales: $${report.totalSales.toFixed(2)}
Highest Selling Item: ${report.highestSellingItem.name} (${report.highestSellingItem.quantity} orders, $${report.highestSellingItem.totalSales.toFixed(2)})
Lowest Selling Item: ${report.lowestSellingItem.name} (${report.lowestSellingItem.quantity} orders, $${report.lowestSellingItem.totalSales.toFixed(2)})
Best Rated Item: ${report.bestRatedItem.name} (${report.bestRatedItem.avgRating} rating)
Worst Rated Item: ${report.worstRatedItem.name} (${report.worstRatedItem.avgRating} rating)

Category Reports:
${report.categoryReports.map(categoryReport => `
Category: ${categoryReport.category}
Best Sold Item: ${categoryReport.bestSold.name} (${categoryReport.bestSold.quantity} orders, $${categoryReport.bestSold.totalSales.toFixed(2)})
Worst Sold Item: ${categoryReport.worstSold.name} (${categoryReport.worstSold.quantity} orders, $${categoryReport.worstSold.totalSales.toFixed(2)})
Best Rated Item: ${categoryReport.bestRated.name} (${categoryReport.bestRated.avgRating} rating)
Worst Rated Item: ${categoryReport.worstRated.name} (${categoryReport.worstRated.avgRating} rating)
`).join('\n')}
`;

    fs.writeFileSync(filePath, reportText, 'utf8');
    console.log(`Report written to ${filePath}`);
}

cron.schedule('0 0 * * 0', () => {
    console.log('Generating weekly report...');
    generateReport();
});
