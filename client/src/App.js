import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Footer } from 'flowbite-react';


function App() {
  const [notes, setNotes] = useState([]); // use to display all the notes 
  const { register, handleSubmit, reset } = useForm(); // use for the form to add a note
  const [editingNoteId, setEditingNoteId] = useState(null); // pour editer une note

  useEffect(() => {
    const getNotes = async () => {
      try{
        const response = await fetch("/getNotes");
        const data = await response.json();
        setNotes(data);
      }
      catch(error){
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
    getNotes();
  }, []);

  const deleteNoteById = async (id) => {
    try {
      const response = await fetch(`/deleteNoteById/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Update the local state by removing the deleted note
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      } else {
        console.error('Failed to delete note:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const markAsFinished = async (id) => {
    try {
        const response = await fetch(`/markAsFinished/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ finished: true }),
        });
        const updatedNote = await response.json();

        // Update the local state with the updated note
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note._id === id ? updatedNote : note
            )
        );
        console.log(updatedNote);
    } catch (error) {
        console.error('Error marking note as read:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingNoteId) {
        // Si editingNoteId est défini, cela signifie que nous sommes en train de mettre à jour une note existante
        const response = await fetch(`/updateNoteById/${editingNoteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const updatedNote = await response.json();
  
        setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editingNoteId ? updatedNote : note
        ));

        // Réinitialisez l'état d'édition
        setEditingNoteId(null);
        // Réinitialisez le formulaire
        window.location.reload();
      } else {
        // Sinon, nous ajoutons une nouvelle note
        const response = await fetch("/addNote", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const newNote = await response.json();
  
        // Ajoutez la nouvelle note à la liste locale
        setNotes((prevNotes) => [...prevNotes, newNote]);
        // Réinitialisez le formulaire
      }
      reset();
    } catch (error) {
      console.error('Error adding/updating note:', error);
    }
  };
  
  

  const editNote = (id) => {
    // Remplissez le formulaire avec les données de la note à éditer
    const noteToEdit = notes.find((note) => note._id === id);
    setEditingNoteId(noteToEdit._id);
    reset(noteToEdit);
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-gray-100">
      <h1 className="text-3xl mb-4 flex flex-col items-center	">Notes</h1>
      {/* Note Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-600">
            Title:
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-600">
            Content:
          </label>
          <textarea
            id="content"
            {...register('content', { required: true })}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          {editingNoteId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note._id} className="mb-4 p-4 border rounded-md">
            <h2 className="text-2xl font-medium mb-2">{note.title}</h2>
            <p>{note.content}</p>
            {note.finished && <p className="text-green-500 font-bold">Terminé</p>}
            {!note.finished && (
              <button
                onClick={() => markAsFinished(note._id)}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mr-2"
              >
                Mark as finished
              </button>
            )}
            <button
              onClick={() => deleteNoteById(note._id)}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
            >
              Remove the note
            </button>
            <button
              onClick={() => editNote(note._id)}
              className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 mr-2"
            >
              Edit Note
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <Footer container>
          <Footer.Copyright href="#" by="SamyOffer" />
        </Footer>
      </div>
      
    </div>
    
  );

};

export default App;
