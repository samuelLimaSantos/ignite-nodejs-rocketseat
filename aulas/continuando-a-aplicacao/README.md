# Cadastro de carro
**RF** => Requisitos funcionais

- Deve ser possível cadastrar um carro
- Deve ser possível listar todas as categorias

**RN** => Regra de negócio

- Não deve ser possível um carro com uma placa já existente.
- Não deve ser possível alterar a placa de um carro já cadastrado.
- O carro deve ser cadastrado por padrão com disponibilidade.
- O usuário responsável pelo cadastro deve ser um usuário administrador. 

# Listagem de carros

**RF** => Requisitos funcionais

- Deve ser possível listar todos os carros disponíveis
- Deve ser possível listar todos os carros disponíveis pelo nome da categoria
- Deve ser possível listar todos os carros disponíveis pelo nome da marca
- Deve ser possível listar todos os carros disponíveis pelo nome do carro

**RN** => Regra de negócio

- Para fazer a consulta com carro não é necessário estar logado no sistema.

# Cadastro de Especificação no carro

**RF** => Requisitos funcionais

- Deve ser possível cadastrar uma especificação para um carro
- Deve ser possível todas as especificações
- Deve ser possível listar todos os carros

**RN** => Regra de negócio

- Não deve ser possível cadastrar uma especificação para um carro não cadastrado
- Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um usuário administrador. 


# Cadastro de imagens do carro

**RF** => Requisitos funcionais

- Deve ser possível cadastrar a imagem do carro

**RNF** => Requisitos não funcionais

- Utilizar o multer para upload dos arquivos

**RN** => Regra de negócio

- O usuário deve poder cadastrar mais de uma imagem para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um usuário administrador. 

# Aluguel de carro 

**RF** => Requisitos funcionais

- Deve ser possível cadastrar um aluguel

**RN** => Regra de negócio

- O aluguel deve ter duração mínima de 24 horas.
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
- Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
- Ao realizar um aluguel, o status do carro deverá ser alterado para indisponível.