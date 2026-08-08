const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        default: "Personal"
    },

    completed: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


const Todo = mongoose.model("Todo", todoSchema);


module.exports = Todo;