const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))  
 
  const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
    return maxId + 1
}

app.get('/info', (request, response) =>{
    response.send(
        '<p>Phonebook has info for ' + generateId() + ' people</p><p>'+ Date() +'</p>')
})

app.get('/api/persons', (request, response) =>{
    Person.find({}).then(Person => {
        response.json(Person)
      })
})

app.post('/api/persons', (request, response, next) =>{
    console.log(request.body);
    const body = request.body
    
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    app.use(morgan(`:method :url :status :res[content-length] - :response-time ms  {"name": ${person.name}, "number": ${person.number}}`))
    person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    }) 
    .catch(error => next(error))
})

app.use(express.json())

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) =>{
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})