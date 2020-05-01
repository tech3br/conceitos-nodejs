const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

//definindo o respositório - método RUIM de fazer. deve ser criado um método persistente, ou seja, com banco de dados.
const repositories = [];

//rota para criar um repositório
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  //criando o repositório
  const repository = {
    
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
    
  };

  repositories.push(repository);

  return response.json(repository);
});

//rota para listar todos os repositórios
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//rota para alterar um repositório pelo ID
app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  //se o índice do repositório for igual a -1 retorna uma resposta de erro
  if(findRepositoryIndex == -1){
    return response.status(400).json({ error: 'Este repositório não existe.' });
  };

  const repository = {
    id, 
    title,
    url,
    techs,
    likes: repositories[findRepositoryIndex].likes,
  };

  repositories[findRepositoryIndex] = repository;

  return response.json(repository);

});

//rota para deletar um repositório pelo ID
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepositoryIndex >= 0) {
    repositories.splice(findRepositoryIndex, 1);
  } else {
    return response.status(400).json({ error: "Este repositório não existe." });
  }

  return response.status(204).json(repositories);
});

//rota para inserir um like pelo método POST pois está incrementando e não alterando a quantidade de likes
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id == id);

  if (!repository) {
    return response.status(400).send('Repositório não existe!');
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
