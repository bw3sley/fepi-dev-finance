# Casos de uso
Os casos de uso são uma técnica de descoberta de requisitos, sendo que em sua forma mais simples, um caso de uso identifica os atores envolvidos em uma interação e dá nome ao tipo de interação. Essa é, então, suplementada por informações adicionais que descrevem a interação com o sistema. A informação adicional pode ser uma descrição textual, que foi o método completar que o grupo escolheu, mas pode ser feito através de um ou mais modelos gráficos, como diagrama de sequência ou de estados da UML.

O conjunto de casos de uso representa todas as possíveis interações que serão descritas nos requisitos de sistema. Um diagrama de caso de uso possui os seguintes elementos:

- **Atores**: que podem ser pessoas ou outros sistemas, e são representados como figuras ‘palito’;
- **Classe de interação**: representa as ações dos usuários ou do sistema, e são representadas por uma elipse;
- **Relacionamentos**: fazem a ligação entre os atores e a interação;
- **Caixa de limite do sistema**: define um escopo do sistema para os casos de uso. Todos os casos de uso fora da caixa são considerados fora do escopo do sistema.

<center>

<div style="width: 640px; height: 480px; margin: 10px; position: relative;"><iframe allowfullscreen frameborder="0" style="width:640px; height:480px" src="https://lucid.app/documents/embedded/298a6a30-33ee-4a99-b014-6f442cf2c912" id="opVEFJ5Mpd1b"></iframe></div>

</center>

# Classes

Uma classe em programação é um conceito fundamental na programação orientada a objetos (POO). Ela serve como um modelo para criar objetos, representando uma estrutura que contém atributos (variáveis) e métodos (funções ou operações) relacionados a um determinado tipo de entidade ou conceito.

Vamos explorar seus componentes principais:

1. **Atributos (Variáveis de Instância):**
   Os atributos são as variáveis que armazenam os dados associados à classe. Eles representam as características ou propriedades da entidade que a classe está modelando. Por exemplo, uma classe `Pessoa` pode ter atributos como `nome`, `idade` e `endereço`.

2. **Métodos (Funções de Instância):**
   Os métodos são as funções definidas dentro da classe que representam o comportamento ou as operações que podem ser realizadas nos objetos dessa classe. Eles manipulam os atributos e executam ações relacionadas à entidade que a classe representa. Por exemplo, uma classe `Pessoa` pode ter métodos como `andar()`, `falar()` e `calcularIdade()`.

3. **Construtores:**
   Os construtores são métodos especiais usados para inicializar os objetos da classe. Eles são chamados quando um objeto é criado e podem receber parâmetros para configurar os atributos iniciais do objeto.

4. **Encapsulamento:**
   O encapsulamento é o princípio de esconder os detalhes internos de uma classe e fornecer uma interface para interagir com ela. Isso é alcançado usando modificadores de acesso (como `public`, `private`, `protected`) para controlar o acesso aos atributos e métodos.

5. **Herança:**
   A herança é um mecanismo que permite criar uma nova classe (subclasse) com base em uma classe existente (superclasse). A subclasse herda os atributos e métodos da superclasse e pode adicionar novos ou modificar os existentes.

6. **Polimorfismo:**
   O polimorfismo é a capacidade de objetos de diferentes classes serem tratados de forma uniforme se tiverem uma relação de herança. Isso significa que um método em uma superclasse pode ser implementado de maneira diferente nas subclasses.

Assim a equipe, identificou os relacionamentos e funcionalidades presentes no aplicativo e levantamos essas classes como as primordiais para o funcionamento do back-end e do banco de dados.

### Classe do User
Como o exercício pedia no mínimo **3 classes**, essas foi uma das classes da aplicação que acabou por não ser utilizado, tendo a noção que seria necessário criar outra tabela para gerar o vinculo entre usuário e transação.

```
    public class User {
        public String publicId;
        
        private int id;
        private String name;
        private String email;

        public User(String name, String email) {
            this.name = name;
            this.email = email;

            this.publicId = "9381888d-77c7-4aaa-86e4-aa9f830839db" // eu ainda não sei gerar uuid por aqui
            this.id += 1;
        }

        public string getName() {
            return name; 
        }

        public void setName(String name) {
            this.name = name;
        }

        public string getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
```

### Classe de Transaction

```
    public class Transaction {
        private String description;
        private int amount;
        private Date created_at;


        public Transaction(long id, String description, int amount, String created_at) {
            this.id = id;
            this.description = description;
            this.amount = amount;
            this.created_at = created_at;
        }

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getAmount() {
            return amount;
        }

        public void setAmount(int value) {
            this.amount = value;
        }

        public String getCreated_at() {
            return created_at;
        }

        public void setCreated_at(String created_at) {
            this.created_at = created_at;
        }
    }

```

### Classe de TransactionType
Essa classe achei melhor transformar em um enum dentro da classe `Transaction`, porém não utilizo, pois trato quando o valor é negativo para **outcome** e positivo para **income**.

```
    public class TransactionType {
        private Bool income;
        private Bool outcome;

        public TransactionType(int value) {
            if (value < 0) {
                this.income = true;
            }

            else {
                this.outcome = true;
            }
        }

        public void setTypeTransaction(enum type) {
            this.type = type;
        }
    }
```