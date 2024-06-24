const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())



let now = new Date() 

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('body', function getId (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time :body'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {

  let len = persons.length.toString();
  response.send(`Phonebook has info for ${len} people </br>
    ${now}`)
  
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id == id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const pname = body.name
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  const temp = persons.filter(person => person.name === pname)

  if(temp.length>0){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})