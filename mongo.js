const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0-wlcvv.mongodb.net/phoneBook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Note = mongoose.model("Note", noteSchema);

if (process.argv.length === 3) {
  Note.find({}).then(result => {
    let phones = [];
    result.forEach(phone => {
      phones.push(phone);
    });
    console.log(`phonebook:`);
    phones.forEach(
      phone => phone.name && console.log(`${phone.name} ${phone.number}`)
    );
    mongoose.connection.close();
  });
} else {
  const note = new Note({
    name: name,
    number: phoneNumber
  });

  note.save().then(response => {
    console.log(
      `added ${response.name} number ${response.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
