const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("type", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

let notes = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

let PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/info", (request, response) => {
  let d = new Date();
  response.send(
    `<div>Phonebook has info for ${
      notes.length
    } people <br/> ${new Date()}</div>`
  );
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id == id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => !(note.id === id));
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({ error: "name or number misssing" });
  }
  if (notes.find((note) => note.name == body.name)) {
    return response.status(404).json({ error: "name exists" });
  }
  const note = {
    name: body.name,
    number: body.number,
    id: Math.random() * 2000,
  };
  notes = notes.concat(note);
  response.json(note);
});
