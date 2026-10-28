import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  const [search, setSearch] = useState('')

  useEffect(() => {
  personService
    .getAll()
    .then(persons => {
      console.log('Data from backend:', persons)
      console.log('Is array:', Array.isArray(persons))
      setPersons(persons)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name.trim().toLowerCase() === newName.trim().toLowerCase())
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({
              message: `Updated ${returnedPerson.name}`,
              type: 'success'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setNotification({
              message: error.response.data.error,
              type: 'error'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }
    } else {
      personService
        .create(nameObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setNotification({
            message: `Added ${newPerson.name}`,
            type: 'success'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
            setNotification({
              message: error.response.data.error,
              type: 'error'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
    }
  }
  

  const searchName = (event) => {
    setSearch(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm('Are you sure you want to delete this person?')) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(() => {
            setNotification({
              message: `Information of ${personToDelete.name} has already been removed from server`,
              type: 'error'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter search={search} searchName={searchName} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleSubmit={handleSubmit}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      {filteredPersons.map(person => 
        <Person 
          key={person.id} 
          person={person}
          handleDelete={handleDelete} />)}
    </div>
  )
}

const Filter = ({ search, searchName }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={searchName} />
    </div>
  )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, handleDelete }) => {
  return (
    <p>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></p>
  )
}

export default App