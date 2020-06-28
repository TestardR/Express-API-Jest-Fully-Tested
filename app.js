const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const connectDB = require('./db/mongodb.connect');
const app = express();

connectDB();

app.use(express.json());

app.use('/todos', todoRoutes);

/* app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
}); */

app.get('/', (req, res) => {
  res.json('Hello World');
});

module.exports = app;
