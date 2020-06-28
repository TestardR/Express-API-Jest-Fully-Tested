const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');
const mockMongoDb = require("../../db/mongodb.mock.connect");

const endpointUrl = '/todos/';

let firstTodo, newTodoId;
const nonExistingTodoId = '5d5fff416bef3c07ecf11f00';
const testData = { title: 'Make integration test for PUT', done: true };

describe(endpointUrl, () => {
  beforeAll(async () => {
    await mockMongoDb.connect();
  });

  it('POST ' + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });

  it(
    'should return error 500 on malformed data with POST' + endpointUrl,
    async () => {
      const response = await request(app)
        .post(endpointUrl)
        .send({ title: 'Missing done property' });
      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: 'Todo validation failed: done: Path `done` is required.',
      });
    }
  );

  it('GET ' + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    firstTodo = response.body[0];
  });

  it('GET BY ID ' + endpointUrl + ':id', async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
  });

  it('GET BY ID does not exist' + endpointUrl + ':id', async () => {
    const response = await request(app).get(
      endpointUrl + '5ef8d58fae4d6c10087637e9'
    );

    expect(response.status).toBe(404);
  });

  it('PUT ' + endpointUrl, async () => {
    const testData = { title: 'Make integration test for PUT', done: true };
    const res = await request(app)
      .put(endpointUrl + newTodoId)
      .send(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.done).toBe(testData.done);
  });

  it('should return 404 on PUT ' + endpointUrl, async () => {
    const res = await request(app)
      .put(endpointUrl + nonExistingTodoId)
      .send(testData);

    expect(res.statusCode).toBe(404);
  });

  test("HTTP DELETE", async () => {
    const res = await request(app)
      .delete(endpointUrl + newTodoId)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.done).toBe(testData.done);
  });

  test("HTTP DELETE 404", async () => {
    const res = await request(app)
      .delete(endpointUrl + nonExistingTodoId)
      .send();

    expect(res.statusCode).toBe(404);
  });
});
