# Node Sample App

A small REST API for managing tasks, built with Node.js and Express.

## Run

    npm install
    npm run dev     # auto-restarts on file changes
    npm start       # production
    npm test        # runs tests with Node's built-in test runner

## Endpoints

| Method | Path                      | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | /health                   | Health check                    |
| GET    | /api/tasks?completed=true | List tasks (optional filter)    |
| GET    | /api/tasks/:id            | Get one task                    |
| POST   | /api/tasks                | Create `{ title, description }` |
| PATCH  | /api/tasks/:id            | Update fields                   |
| DELETE | /api/tasks/:id            | Delete a task                   |

## Example

    curl -X POST localhost:3000/api/tasks \
      -H "Content-Type: application/json" \
      -d '{"title":"Learn Node.js"}'
