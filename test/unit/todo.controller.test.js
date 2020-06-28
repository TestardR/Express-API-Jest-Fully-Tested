const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require('node-mocks-http');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todo.json');
const todoById = require('../mock-data/todo-by-id.json');

jest.mock('../../model/todo.model.js');

const todoId = '5ef8bf8ba65cf233288babf2';

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('TodoController.getTodoById', () => {
  it('should have a getTodoById', () => {
    expect(typeof TodoController.getTodoById).toBe('function');
  });

  it('should call TodoModel.findById() with route parameters', async () => {
    req.params.id = todoId;
    await TodoController.getTodoById(req, res, next);

    expect(TodoModel.findById).toBeCalledWith('5ef8bf8ba65cf233288babf2');
  });

  it('should return 200 response code', async () => {
    TodoModel.findById.mockReturnValue(todoById);
    req.params.id = todoId;
    await TodoController.getTodoById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return a todo in response', async () => {
    TodoModel.findById.mockReturnValue(todoById);
    req.params.id = todoId;
    await TodoController.getTodoById(req, res, next);

    expect(res._getData()).toBe(todoById);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Something went wrong' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);
    await TodoController.getTodoById(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });

  it('should return 400 response code when item does not exist', async () => {
    TodoModel.findById.mockReturnValue(null);
    await TodoController.getTodoById(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe('TodoController.getTodos', () => {
  expect(typeof TodoController.getTodos).toBe('function');

  it('should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next);

    expect(TodoModel.find).toBeCalledWith({});
  });

  it('should return 201 response code', async () => {
    await TodoController.getTodos(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return all todos in response', async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);

    expect(res._getData()).toBe(allTodos);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Something went wrong' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.createTodo', () => {
  it('should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', () => {
    let req, res, next;
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    req.body = newTodo;
    TodoController.createTodo(req, res, next);

    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next);

    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return json body in response', async () => {
    req.body = newTodo;
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);

    expect(res._getData()).toBe(newTodo);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('TodoController.updateTodo', () => {
  it('should have a updateTodo function', () => {
    expect(typeof TodoController.updateTodo).toBe('function');
  });
  it('should update with TodoModel.findByIdAndUpdate', async () => {
    req.params.id = todoId;
    req.body = newTodo;
    await TodoController.updateTodo(req, res, next);

    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
  });

  it('should return a response with json data and http code 200', async () => {
    req.params.id = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
    await TodoController.updateTodo(req, res, next);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });

  describe('TodoController.deleteTodo', () => {
    it('should have a deleteTodo function', () => {
      expect(typeof TodoController.deleteTodo).toBe('function');
    });
    it('should call findByIdAndDelete', async () => {
      req.params.id = todoId;
      await TodoController.deleteTodo(req, res, next);
      expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId);
    });
    it('should return 200 OK and deleted todomodel', async () => {
      TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
      await TodoController.deleteTodo(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(newTodo);
      expect(res._isEndCalled()).toBeTruthy();
    });
    it('should handle errors', async () => {
      const errorMessage = { message: 'Error deleting' };
      const rejectedPromise = Promise.reject(errorMessage);
      TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
      await TodoController.deleteTodo(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
    it('should handle 404', async () => {
      TodoModel.findByIdAndDelete.mockReturnValue(null);
      await TodoController.deleteTodo(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });
  });
});
