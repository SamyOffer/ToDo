const express = require('express');
const app = express();
const PORT = 8080;
const mongoose = require('mongoose');
const Note = require('./models/noteModel');

app.use(express.json());


mongoose
.connect('mongodb+srv://SamyOffer:80ypNZoGugtri5kf@todoapi.4gs28js.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => { console.log('Example app listening on port', PORT) });  
    
})
.catch(err => console.log(err));

app.post('/addNote', async (req, res) => {
    try {
        console.log(req.body);
        const note = await Note.create(req.body);
        res.status(200).json(note);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("err : ", err.message);
    }
});

app.get('/getNotes', async (req, res) => {
    try {
        const notes = await Note.find({});
        console.log(notes)
        res.status(200).json(notes);
    }
    catch (err) {
        console.log(err);
        res.status(500).json("err : ", err.message);
    }
});

// Ajout de la méthode getById
app.get('/getNoteById/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
        console.log(note)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Ajout de la route pour mettre à jour une note par son ID
app.put('/updateNoteById/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(updatedNote);
        console.log(updatedNote);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Ajout de la route pour supprimer une note par son ID
app.delete('/deleteNoteById/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully', deletedNote });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Ajout de la route pour mettre à jour une note par son ID et la marquer comme lue
app.put('/markAsFinished/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { $set: { finished: true } }, // Assume that you have a "read" field in your Note model
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(updatedNote);
        console.log(updatedNote);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});
