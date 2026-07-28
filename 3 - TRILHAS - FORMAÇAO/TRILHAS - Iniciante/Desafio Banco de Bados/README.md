# Documentação – Desafio Banco de Dados (LoanShelf)

# Objetivo

O objetivo deste desafio foi desenvolver um sistema de gerenciamento de empréstimos de livros utilizando **Python** integrado ao **MySQL**, substituindo o armazenamento em listas na memória por um banco de dados relacional. O sistema deveria permitir o cadastro de usuários e livros, controle de empréstimos e devoluções, consulta de disponibilidade dos livros e visualização do histórico de empréstimos.

# Tecnologias Utilizadas

* Python
* MySQL Server
* MySQL Workbench
* Visual Studio Code
* Draw.io
 

# Etapas Desenvolvidas

## 1. Modelagem do Banco de Dados

Inicialmente foi realizada a modelagem do banco de dados, definindo as entidades, atributos e relacionamentos necessários para o funcionamento do sistema.

Foram definidas três tabelas principais:

* **usuarios**
* **livros**
* **emprestimos**

Durante essa etapa foram aplicados conceitos de modelagem de dados, como:

* Chave Primária (Primary Key);
* Chave Estrangeira (Foreign Key);
* Relacionamentos entre tabelas;
* Integridade referencial;
* Tipos de dados adequados para cada informação.

Também foi elaborado o diagrama Entidade-Relacionamento (ER), representando a estrutura completa do banco de dados.

---

## 2. Criação do Banco de Dados

Após a modelagem, foi criado o banco de dados **loanshelf** utilizando comandos SQL.

Em seguida, foram criadas as tabelas:

* usuarios
* livros
* emprestimos

Cada tabela recebeu seus respectivos campos, restrições e relacionamentos, garantindo a consistência dos dados.

---

## 3. Inserção de Dados

Foram realizados testes utilizando comandos **INSERT**, cadastrando usuários e livros para validar a estrutura do banco.

Também foram executadas consultas utilizando **SELECT** para verificar se os dados estavam sendo armazenados corretamente.

---

## 4. Integração entre Python e MySQL

Depois da criação do banco, foi realizada a integração do projeto Python com o MySQL.

Para isso, foi instalado o driver oficial:

```bash
pip install mysql-connector-python
```

Em seguida foi criado um arquivo responsável pela conexão com o banco de dados, permitindo que todas as operações do sistema fossem executadas diretamente no MySQL.

---

## 5. Refatoração do Sistema

O sistema que anteriormente utilizava listas em memória foi adaptado para trabalhar diretamente com o banco de dados.

As listas de usuários, livros e empréstimos deixaram de existir, sendo substituídas por consultas SQL.

Foram utilizados comandos como:

* INSERT
* SELECT
* UPDATE
* COUNT
* INNER JOIN

Além disso, foi utilizado **commit()** após operações de inserção e atualização para garantir a gravação permanente das informações.

---

# Funcionalidades Implementadas

O sistema passou a oferecer as seguintes funcionalidades:

* Listar livros cadastrados
* Listar usuários cadastrados
* Cadastrar novos livros
* Cadastrar novos usuários
* Realizar empréstimos
* Registrar devoluções
* Consultar histórico de empréstimos.

Todas essas operações passaram a utilizar o banco de dados MySQL.

---

# Regras de Negócio Implementadas

Durante o desenvolvimento foram implementadas diversas validações importantes:

* Não permitir cadastro de usuários com dados inválidos
* Não permitir cadastro de livros com informações incorretas
* Verificar se o usuário existe antes do empréstimo
* Verificar se o usuário está ativo
* Verificar se o livro existe
* Calcular automaticamente a disponibilidade dos livros
* Impedir empréstimos quando não houver exemplares disponíveis
* Respeitar o limite máximo de empréstimos de cada usuário
* Impedir que um usuário realize dois empréstimos ativos do mesmo livro
* Registrar corretamente a devolução dos livros
* Manter o histórico completo de empréstimos.

---

# Principais Aprendizados

Durante o desenvolvimento deste desafio foi possível consolidar conhecimentos sobre:

* Banco de Dados Relacional
* Modelagem de Dados
* SQL
* Criação de tabelas
* Relacionamentos entre tabelas
* Chaves primárias e estrangeiras
* Consultas SQL;
* Integração entre Python e MySQL
* Organização de código em funções
* Estruturação de projetos em Python
* Implementação de regras de negócio.

---

# Desafios Encontrados

Durante o desenvolvimento alguns desafios precisaram ser resolvidos, como:

* Configuração do ambiente MySQL
* Criação correta do banco de dados
* Organização das tabelas
* Integração do Python com o MySQL
* Configuração da conexão utilizando o MySQL Connector
* Adaptação do sistema para deixar de utilizar listas e passar a utilizar consultas SQL
* Implementação das regras de negócio diretamente utilizando o banco de dados.

Todos esses desafios contribuíram para ampliar a compreensão sobre desenvolvimento de sistemas utilizando banco de dados relacionais.

---

# Resultado Final

Ao final do desafio foi desenvolvido um sistema funcional de gerenciamento de empréstimos de livros, totalmente integrado ao MySQL. O projeto passou a armazenar todas as informações diretamente no banco de dados, permitindo realizar cadastros, consultas, empréstimos, devoluções e histórico de forma organizada e persistente.

Além da implementação das funcionalidades solicitadas, o desafio proporcionou uma melhor compreensão sobre modelagem de dados, linguagem SQL, integração entre Python e banco de dados e aplicação prática de conceitos fundamentais utilizados no desenvolvimento de sistemas.

