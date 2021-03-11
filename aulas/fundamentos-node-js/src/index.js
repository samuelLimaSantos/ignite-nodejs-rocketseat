const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const costumers = [];

const verifyIfCostumerAlreadyExists = (request, response, next) => {
  const { cpf } = request.headers;

  const costumer = costumers.find(costumer => costumer.cpf === cpf);  

  if (!costumer) {
    return response.status(400).json({ error: 'Costumer not found!'});
  }

  request.costumer = costumer;

  return next();
}

app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const cpfAlreadyExists = costumers.some(costumer => costumer.cpf === cpf);

  if (cpfAlreadyExists) {
    return response.status(400).json({ message: 'Costumer already exists!'});
  }

  costumers.push({
    id: uuidv4(),
    name,
    cpf,
    statement: []
  });

  return response.status(201).send();
});

app.get('/statement', verifyIfCostumerAlreadyExists, (request, response) => {
  
  const { costumer } = request;

  return response.json(costumer.statement);
})

app.post('/deposit', verifyIfCostumerAlreadyExists, (request, response) => {
  const { amount, description } = request.body;
  const { costumer } = request;

  const newStatement = {
    amount,
    description,
    created_at: new Date(),
    type: 'credit'
  }

  costumer.statement.push(newStatement);

  return response.status(201).send();
});

app.listen(3333, () => console.log('Listening at port 3333'));