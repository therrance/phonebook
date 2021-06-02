require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

morgan.token("body", (req, res) => JSON.stringify(req.body));

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  console.log(request.params);
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("body: ", request.body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log(
      `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
    );
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
