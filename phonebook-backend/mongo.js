const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://knguyen_db_user:${password}@cluster0.bj2lmuv.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('Đã kết nối MongoDB thành công!')
  })
  .catch(err => {
    console.log('Lỗi kết nối MongoDB rồi:', err.message)
  })
  
const Person = require('./models/person')

if (process.argv.length === 5) {
  const person = new Person({
    name: personName,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${personName} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}