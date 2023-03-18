const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('./product');

const app = express();

// Database Connection
mongoose.connect('mongodb://localhost:27017/productdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Initialize Database with Seed Data
app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get(
            'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
        );
        const products = response.data;
        // Create the Product Model and insert seed data

        await Product.insertMany(products);
        res.send('Database initialized successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing database');
    }
});



// API Endpoints
// Total Sale Statistics API
app.get('/api/stats/:month', async (req, res) => {
    try {
        const month = parseInt(req.params.month);
        const Product = mongoose.model('Product');
        const totalSaleAmount = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, month],
                    },
                    sold: true,
                },
            },
            {
                $group: {
                    _id: null,
                    totalSaleAmount: { $sum: '$price' },
                    totalSoldItems: { $sum: 1 },
                },
            },
        ]);
        const totalNotSoldItems = await Product.countDocuments({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, month],
            },
            sold: false,
        });
        res.json({
            totalSaleAmount: totalSaleAmount[0].totalSaleAmount,
            totalSoldItems: totalSaleAmount[0].totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching statistics');
    }
});

// Define the endpoint for the bar chart data
app.get('/api/barchart/:month', async (req, res) => {
    const month = parseInt(req.params.month);

    try {
        const items = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, month]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $switch: {
                            branches: [
                                { case: { $lte: ['$price', 100] }, then: '0 - 100' },
                                { case: { $lte: ['$price', 200] }, then: '101 - 200' },
                                { case: { $lte: ['$price', 300] }, then: '201 - 300' },
                                { case: { $lte: ['$price', 400] }, then: '301 - 400' },
                                { case: { $lte: ['$price', 500] }, then: '401 - 500' },
                                { case: { $lte: ['$price', 600] }, then: '501 - 600' },
                                { case: { $lte: ['$price', 700] }, then: '601 - 700' },
                                { case: { $lte: ['$price', 800] }, then: '701 - 800' },
                                { case: { $lte: ['$price', 900] }, then: '801 - 900' },
                                { case: { $gt: ['$price', 900] }, then: '901-above' }
                            ],
                            default: 'Unknown'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    range: '$_id',
                    count: 1
                }
            }
        ]);
        barChartResponse = JSON.stringify(items, null, 2);

        res.header("Content-Type", 'application/json');
        res.status(200).send(barChartResponse);

        // res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

// Define a route for the pie chart API
app.get('/api/piechart/:month', async (req, res) => {
    const month = req.params.month;

    const categoryData = await Product.aggregate([
        {
            $match: {
                $expr: {
                    $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
                }
            }
        },
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                count: 1
            }
        }
    ]);
    categoryDataResponse = JSON.stringify(categoryData, null, 2);

    res.header("Content-Type", 'application/json');
    res.status(200).send(categoryDataResponse);
});

// data from all 3 APIs
app.get('/api/alldata/:month', async (req, res) => {
    const month = parseInt(req.params.month);
    // const month = 5;
    try {
        // Fetch data from all three APIs
        const totalSaleData = await axios.get(`http://localhost:5000/api/stats/${month}`);
        const barChartData = await axios.get(`http://localhost:5000/api/barchart/${month}`);
        const pieChartData = await axios.get(`http://localhost:5000/api/piechart/${month}`);

        // Combine the data and send as a response
        const combinedData = {
            totalSaleData: totalSaleData.data,
            barChartData: barChartData.data,
            pieChartData: pieChartData.data,
        };
        const responseJSON = JSON.stringify(combinedData, null, 2);

        res.header("Content-Type", 'application/json'); // set the Content-Type header to 'application/json'
        res.status(200).send(responseJSON);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});






app.get("/", (req, res) => {
    res.send("server running on port 5000");
})
app.listen(5000, () => {
    console.log("server started at port 5000");
})