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

const getBalance = (statement) => {
  const balance = statement.reduce((accumulator, operation) => {
    if (operation.type === 'credit') {
      return operation.amount + accumulator;
    } else {
      return accumulator - operation.amount 
    }
  }, 0);

  return balance;
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

app.get('/statement/date', verifyIfCostumerAlreadyExists, (request, response) => {

  const { date } = request.query;
  const { costumer } = request;

  const formattedDate = new Date(date + " 00:00");

  const statement = costumer.statement.find(statement => {
    return formattedDate.toDateString() === statement.created_at.toDateString()
  })

  return response.json(statement);
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

app.post('/withdraw', verifyIfCostumerAlreadyExists, (request, response) => {
  const { amount } = request.body;

  const { costumer } = request;

  const balance = getBalance(costumer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: 'Insufficient funds!'});
  };

  const newStatement = {
    amount,
    created_at: new Date(),
    type: 'debit'
  }

  costumer.statement.push(newStatement);

  return response.status(201).send();
})

app.put('/account', verifyIfCostumerAlreadyExists, (request, response) => {
  const { costumer } = request;
  const { name } = request.body;

  costumer.name = name;

  return response.status(204).send();
});

app.get('/account', verifyIfCostumerAlreadyExists, (request, response) => {
  const { costumer } = request;

  return response.json(costumer);
})

app.delete('/account', verifyIfCostumerAlreadyExists, (request, response) => {
  const { costumer } = request;
  
  costumers.splice(costumer, 1);

  return response.status(204).send();
});

app.get('/balance', verifyIfCostumerAlreadyExists, (request, response) => {
  const { costumer } = request;

  const balance = getBalance(costumer.statement);

  return response.json(balance);
})

app.listen(3333, () => console.log('Listening at port 3333'));