const TodoModel = require('../model/todo.model');

exports.createTodo = async (req, res, next) => {
  try {
    const createModel = await TodoModel.create(req.body);
    res.status(201).send(createModel);
  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const models = await TodoModel.find({});
    res.status(200).send(models);
  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const model = await TodoModel.findById(req.params.id);

    if(model) {
      res.status(200).send(model);
    } else {
      res.status(404).send()
    }
   
  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        useFindAndModify: false
      }
    );
    if (updatedTodo) {
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.id);

    if (deletedTodo) {
      res.status(200).json(deletedTodo);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    next(err);
  }
};
