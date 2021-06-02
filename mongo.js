const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster0.wlcvv.mongodb.net/phoneBook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    let phones = [];
    result.forEach((phone) => {
      phones.push(phone);
    });
    console.log(`phonebook:`);
    phones.forEach(
      (phone) => phone.name && console.log(`${phone.name} ${phone.number}`)
    );
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: name,
    number: phoneNumber,
  });

  person.save().then((response) => {
    console.log(
      `added ${response.name} number ${response.number} to phonebook`
    );
    mongoose.connection.close();
  });
}
