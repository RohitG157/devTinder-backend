const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://rohit157rg_db_user:a24O9pmq9btdRxOy@namastenode.tlevhgk.mongodb.net/devTinder',
  );
};

module.exports = connectDB;
