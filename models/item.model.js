const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'назва є обов\'язковою'],
        trim: true,
        maxlength: [200, 'назва не може бути довшою за 200 символів']
    },
    author: {
        type: String,
        required: [true, 'автор є обов\'язковим'],
        trim: true
    },
    type: {
        type: String,
        enum: ['book', 'article', 'journal', 'other'],
        default: 'book',
        required: true
    },
    year: {
        type: Number,
        min: [1000, 'рік має бути більшим за 1000'],
        max: [new Date().getFullYear(), 'рік не може бути у майбутньому'],
        required: [true, 'рік публікації є обов\'язковим']
    },
    description: {
        type: String,
        maxlength: [2000, 'опис не може перевищувати 2000 символів']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    borrowCount: {
        type: Number,
        default: 0,
        min: 0
    },
    lastBorrowedAt: {
        type: Date
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


itemSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});


itemSchema.statics.findByTags = function(tags) {
    return this.find({ tags: { $in: tags } });
};


itemSchema.virtual('fullTitle').get(function() {
    return `${this.title} (${this.author}, ${this.year})`;
});


itemSchema.index({ title: 'text', author: 'text', description: 'text' });


const Item = mongoose.model('Item', itemSchema);
module.exports = Item;