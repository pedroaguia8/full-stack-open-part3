const express = require('express');

const app = express();

app.use(express.json());




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
    return "‎ ";
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));






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
];



app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date();

    const infoPage = `<div>Phonebook has info for ${persons.length} people</div>
        <br/>
        <div>${date.toString()}</div>`;

    response.send(infoPage);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const person = request.body;

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'content missing'
        });
    }
    if (persons.find(p => p.name === person.name
        || persons.find(p => p.number === person.number))
    ) {
        return response.status(400).json({
            error: 'name and number must be unique'
        });
    }

    person.id = Math.floor(Math.random() * 1000) + 1;
    persons = persons.concat(person);

    response.json(person);
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


