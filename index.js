const express = require("express");
const app = express();
const defaultPort = 3000;
app.use(express.json());

let projects = [{ id: 1, title: "Projeto Default", tasks: [] }];
let contadorRequisicoes = 0;

app.use((req, res, next) => {
  next();
  contadorRequisicoes++;
});

app.get("/projects", (req, res) => {
  res.json(projects);
});

app.post("/projects", checkDuplicateProject, (req, res) => {
  let { id } = req.body;
  let { title } = req.body;

  let result = {
    id: id,
    title: title,
    tasks: []
  };
  projects.push(result);

  res.json(
    "Projeto criado com sucesso!!! Acesse GET /projects para visualizar todos."
  );
});

app.put("/projects/:id", checkIdExistsProjects, (req, res) => {
  let { id } = req.params;
  let { title } = req.body;

  let idxProject = getIndexById(projects, id);

  projects[idxProject].title = title;
  res.status(200).json({
    message: "Projeto alterado com sucesso",
    project: projects[idxProject]
  });
});

app.delete("/projects/:id", checkIdExistsProjects, (req, res) => {
  let { id } = req.params;
  let idxProject = getIndexById(projects, id);

  projects.splice(idxProject, 1);
  res.json("Projeto removido com sucesso !");
});

app.post("/projects/:id/tasks", checkIdExistsProjects, (req, res) => {
  let { id } = req.params;
  let { title } = req.body;

  let idxProject = getIndexById(projects, id);

  projects[idxProject].tasks.push(title);
  res.json("Tarefa inserida com sucesso!");
});

function checkIdExistsProjects(req, res, next) {
  let id = req.body.id ? req.body.id : req.params.id;
  if (getIndexById(projects, id) == -1) {
    return res.status(400).json({
      error: "ID do Projeto não encontrado!"
    });
  }
  return next();
}

function checkDuplicateProject(req, res, next) {
  let id = req.body.id ? req.body.id : req.params.id;
  if (getIndexById(projects, id) != -1) {
    return res.status(400).json({
      error: `ID já inserido, escolha outro maior que ${projects.length}`
    });
  }
  return next();
}

app.get("/requests", (req, res) => {
  res.json({ requestCounter: contadorRequisicoes });
});

function getIndexById(arr, id) {
  return arr.findIndex(it => it.id == id);
}

app.listen(defaultPort, console.log(`App Listening on port ${defaultPort}`));
