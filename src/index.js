const express = require("express");

const server = express();

const projects = [];
var reqCount = 0;

server.use(express.json());

function CheckIdExists(req, res, next) {
  let IdExist = false;

  projects.map(project => {
    project.id == req.params.id ? (IdExist = true) : null;
  });

  IdExist ? next() : res.sendStatus(400);
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
  const { id, name } = req.body;

  projects.push({ id: id, name: name, tasks: [] });

  res.send();
});

server.put("/projects/:id", CheckIdExists, (req, res) => {
  const { name } = req.body;

  projects.map(project => {
    if (project.id == req.params.id) {
      project.name = name;
    }
  });

  return res.send();
});

server.delete("/projects/:id", CheckIdExists, (req, res) => {
  projects.map((project, index) => {
    if (project.id == req.params.id) {
      projects.splice(index, 1);
    }
  });

  return res.send();
});

server.post("projects/:id/tasks", CheckIdExists, (req, res) => {
  const { title } = req.body;

  projects.map(project => {
    if (project.id == req.params.id) {
      project.tasks.push(title);
    }
  });

  return res.send();
});

server.listen(3000);
