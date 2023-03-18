const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    dateOfSale: Date,
    sold: Boolean,
});

module.exports = mongoose.model('Product', productSchema);