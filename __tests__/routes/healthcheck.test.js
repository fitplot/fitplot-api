const server = require('../../server');
const request = require('supertest');

afterEach((done) => {
  server.close(done);
});

describe('GET /ping', () => {
  it('Test Server', async () => {
    const response = await request(server).get('/ping');
    expect(response.status).toEqual(200);
    expect(response.type).toEqual('application/json');
    expect(response.body.data).toEqual('Test Server');
  });
});
