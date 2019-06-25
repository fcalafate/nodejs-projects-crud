const express = require("express");

const server = express();

const projects = [];
let reqCount = 0;

server.use(express.json());

function CheckIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

server.use((req, res, next) => {
  console.time(`Chamada ${++reqCount}`);
  console.log(`Recebida chamada ${reqCount}`);
  next();
  console.timeEnd(`Chamada ${reqCount}`);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  res.send(project);
});

server.put("/projects/:id", CheckIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === parseInt(id));

  project.title = title;

  return res.send(project);
});

server.delete("/projects/:id", CheckIdExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id === parseInt(id));

  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", CheckIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === parseInt(id));

  project.tasks.push(title);

  return res.send(project);
});

server.listen(3000);
