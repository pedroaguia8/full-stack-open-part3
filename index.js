
//Require dotenv
require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))



const Person = require('./models/person')







// Morgan middleware
const morgan = require('morgan');

morgan.token('postData', (req, res) => {
    if (req.method === "POST") {
        const { id, ...dataWithoutId } = req.body;
        console.log(req.body);

        console.log(dataWithoutId);

        return JSON.stringify(dataWithoutId);
    }
    // returns empty character because without it Morgan
    // prints a dash '-' at the end if it's not POST
    return "‎";
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));










app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
})

app.get('/info', (request, response) => {
    const date = new Date();

    const infoPage = `<div>Phonebook has info for ${persons.length} people</div>
        <br/>
        <div>${date.toString()}</div>`;

    response.send(infoPage);
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});


