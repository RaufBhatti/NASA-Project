const mongoose = require('mongoose');
const colors = require('colors');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once('open', () => {
  console.log('\nMongoDB Connected!'.underline.brightGreen);
});

mongoose.connection.on('MongoDB Connection Failed: '.brightRed, (err) => {
  console.error(err);
});

const mongoConnect = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const mongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = { mongoConnect, mongoDisconnect };
