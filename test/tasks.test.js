process.env.NODE_ENV = 'test';

const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const store = require('../src/store/taskStore');

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  baseUrl = `http://localhost:${server.address().port}`;
});
after(() => server.close());
beforeEach(() => store.clear());

const request = (path, options = {}) =>
  fetch(baseUrl + path, { headers: { 'Content-Type': 'application/json' }, ...options });

test('GET /health returns ok', async () => {
  const res = await request('/health');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('creates and fetches a task', async () => {
  const created = await request('/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'Write docs' }) });
  assert.equal(created.status, 201);
  const task = await created.json();

  const fetched = await request(`/api/tasks/${task.id}`);
  assert.equal(fetched.status, 200);
  assert.equal((await fetched.json()).title, 'Write docs');
});

test('rejects a task without a title', async () => {
  const res = await request('/api/tasks', { method: 'POST', body: JSON.stringify({}) });
  assert.equal(res.status, 400);
});

test('updates, filters and deletes a task', async () => {
  const task = await (await request('/api/tasks', { method: 'POST', body: JSON.stringify({ title: 'Ship it' }) })).json();

  const patched = await request(`/api/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ completed: true }) });
  assert.equal((await patched.json()).completed, true);

  const done = await (await request('/api/tasks?completed=true')).json();
  assert.equal(done.length, 1);

  const del = await request(`/api/tasks/${task.id}`, { method: 'DELETE' });
  assert.equal(del.status, 204);
  assert.equal((await request(`/api/tasks/${task.id}`)).status, 404);
});
