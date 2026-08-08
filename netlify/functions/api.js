
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

const Todo = require("../../models/Todo");

const app = express();
app.get("/", (req, res) => {
    res.json({ message: "API is working" });
});

app.use(express.json());
app.use(cors());


// MongoDB connection

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.log(
            "❌ MongoDB Connection Error:",
            err
        );
    });


// GET ALL TODOS

app.get("/todos", async (req, res) => {

    try {

        const todos = await Todo.find();

        res.json(todos);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Error fetching todos",

            error: error.message

        });

    }

});


// GET SINGLE TODO

app.get("/todos/:id", async (req, res) => {

    try {

        const todo =
            await Todo.findById(req.params.id);


        if (!todo) {

            return res.status(404).json({

                message: "Todo not found"

            });

        }


        res.json(todo);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Error fetching todo",

            error: error.message

        });

    }

});


// CREATE TODO

app.post("/todos", async (req, res) => {

    try {

        const todo = new Todo({

            title: req.body.title,

            category:
                req.body.category || "Personal",

            completed:
                req.body.completed || false,

            date:
                req.body.date || null

        });


        await todo.save();


        res.status(201).json({

            message:
                "Todo created successfully",

            todo: todo

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Error creating todo",

            error: error.message

        });

    }

});


// UPDATE TODO

app.put("/todos/:id", async (req, res) => {

    try {

        const todo =
            await Todo.findById(req.params.id);


        if (!todo) {

            return res.status(404).json({

                message: "Todo not found"

            });

        }


        if (req.body.title !== undefined) {

            todo.title =
                req.body.title;

        }


        if (req.body.category !== undefined) {

            todo.category =
                req.body.category;

        }


        if (req.body.completed !== undefined) {

            todo.completed =
                req.body.completed;

        }


        if (req.body.date !== undefined) {

            todo.date =
                req.body.date;

        }


        await todo.save();


        res.json({

            message:
                "Todo updated successfully",

            todo: todo

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Error updating todo",

            error: error.message

        });

    }

});


// DELETE TODO

app.delete("/todos/:id", async (req, res) => {

    try {

        await Todo.findByIdAndDelete(
            req.params.id
        );


        res.json({

            message:
                "Todo deleted successfully!"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Error deleting todo",

            error: error.message

        });

    }

});


// Netlify Function

exports.handler = serverless(app);

