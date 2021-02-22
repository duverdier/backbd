"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var express = require('express');

var morgan = require('morgan');

var app = express();
app.use(express.json());

var cors = require('cors');

app.use(express["static"]('build'));
app.use(cors());
app.use(morgan('tiny'));
var persons = [{
  id: 1,
  name: 'Arto Hellas',
  number: "040-123456"
}, {
  id: 2,
  name: 'Ada Lovelace',
  number: "39-44-5323523"
}, {
  id: 3,
  name: 'Dan Abramov',
  number: "12-43-234345"
}, {
  id: 4,
  name: 'Mary Poppendieck',
  number: "39-23-6423122"
}];

var generateId = function generateId() {
  var maxId = persons.length > 0 ? Math.max.apply(Math, _toConsumableArray(persons.map(function (p) {
    return p.id;
  }))) : 0;
  return maxId + 1;
};

app.get('/info', function (request, response) {
  response.send('<p>Phonebook has info for ' + generateId() + ' people</p><p>' + Date() + '</p>');
});
app.get('/api/persons', function (request, response) {
  response.json(persons);
});
app.post('/api/persons', function (request, response) {
  var personne = request.body;
  var name = persons.find(function (person) {
    return person.name === personne.name;
  });

  if (!personne.name && !personne.number || name) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  var person = {
    id: generateId(),
    name: personne.name,
    number: personne.number
  };
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms  {\"name\": ".concat(person.name, ", \"number\": ").concat(person.number, "}")));
  persons = persons.concat(person);
  response.json(person);
});
app.get('/api/persons/:id', function (request, response) {
  var id = Number(request.params.id);
  var person = persons.find(function (person) {
    return person.id === id;
  });

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app["delete"]('/api/persons/:id', function (request, response) {
  var id = Number(request.params.id);
  persons = persons.filter(function (person) {
    return person.id !== id;
  });
  response.status(204).end();
});
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});