const express = require('express');
const app = express();
require('dotenv').config();

const Person = require('./models/person');

app.use(express.static('dist'));

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(requestLogger);

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}


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
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(error => next(error));
})

app.get('/info', (request, response) => {
    const date = new Date();

    const infoPage = `<div>Phonebook has info for ${persons.length} people</div>
        <br/>
        <div>${date.toString()}</div>`;

    response.send(infoPage);
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error));
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

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body;

    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }

    const person = {
        name: body.name,
        number: body.number,
    };

    // the optional { new: true } parameter will cause our event handler
    // to be called with the new modified document instead of the original
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error));
});



// handler of requests with unknown endpoint
app.use(unknownEndpoint);

// handler of requests with result to errors
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
