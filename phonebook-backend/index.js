const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const persons = require('./persons')
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :body'))

app.use(cors())

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const requestTime = new Date()
  const numberOfPersons = persons.length

  res.send(`<p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${requestTime}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const personIndex = persons.findIndex(p => p.id === id)

  if (personIndex !== -1) {
    persons.splice(personIndex, 1)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  const newPerson = {
    name: body.name,
    number: body.number,
    id: (Math.floor(Math.random() * 1000000)).toString()
  }

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({
      error: 'Name or number is missing'
    })
  } else if (persons.find(p => p.name === newPerson.name)) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  }

  persons.push(newPerson)

  res.json(newPerson)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})