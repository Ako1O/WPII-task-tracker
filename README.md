# Your Simple Task Tracker

A full stack web application for managing your daily tasks. Built as a homework project for Web Programming II.

---

## What it does

You can add tasks, mark them as done, edit them or delete them. Tasks are saved on the server so they stay there even after you restart the app. ALso there is a filter so you can view all tasks, only active ones, or only completed ones. A counter at the top shows how many tasks you still have left to do.

---

## Technologies that were used

- **Node js + Express** — backend server and REST API
- **HTML, CSS, JS** — frontend, no frameworks
- **Bootstrap 5** — styling and responsive layout
- **JSON file** — stores the tasks locally on disk

---

## Project structure

- index.js - starts the Express server
- tasksRoutes.js - defines the API routes
- validateTask.js - checks request body
- validateId.js - checks task ID param
- errorHandler.js - handles errors
- taskService.js - reads and writes tasks.json
- tasks.json - all tasks are stored there

```
task-tracker/
├── server/
│   └── index.js
├── routes/
│   └── tasksRoutes.js
├── controllers/
│   ├── getTasksController.js
│   ├── getTaskByIdController.js
│   ├── addTaskController.js
│   ├── updateTaskController.js
│   └── deleteTaskController.js
├── middleware/
│   ├── validateTask.js
│   ├── validateId.js
│   └── errorHandler.js
├── services/
│   └── taskService.js
├── data/
│   └── tasks.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── package.json
└── README.md
```

---

## How to run it

You will need **Node.js** installed on your computer. You can download it from (nodejs.org). 

**Step 1 — clone the repository**
make sure you change "your-username" to yours.
```
git clone https://github.com/your-username/WPII-task-tracker.git
cd WPII-task-tracker
```

**Step 2 — install dependencies**
```
npm install
```

**Step 3 — start the server**
```
npm start
```

**Step 4 — open the app**

Go to `http://localhost:3000` in your browser, or click ctrl+lmb on your link in VS code

---

## Screenshots

### Installation and startup
<img width="732" height="167" alt="image" src="https://github.com/user-attachments/assets/23990aec-7d2d-432f-9b69-93cf75f5ce20" />

### Main page
<img width="1716" height="867" alt="image" src="https://github.com/user-attachments/assets/d5cb9d84-ae31-4621-8499-8ec394f70aa1" />

### Edit modal
<img width="647" height="297" alt="image" src="https://github.com/user-attachments/assets/60c1fb95-2f04-4aa6-afa9-541406340b07" />

---

## API endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | /api/tasks | get all tasks |
| GET | /api/tasks/:id | get one task by id |
| POST | /api/tasks | create a new task |
| PUT | /api/tasks/:id | update a task |
| DELETE | /api/tasks/:id | delete a task |

---

## Features

- Add new tasks
- Edit task title
- Delete tasks
- Mark tasks as completed
- Filter by All / Active / Completed
- Counter showing remaining tasks
- Success and error notifications
- Data is saved between sessions
- Works on mobile too

---

## Notes

This project was built for the Web Programming II course. The goal was to demonstrate a working full stack CRUD application using Express on the backend and vanilla JavaScript on the frontend, following the layered architecture shown in lectures.
