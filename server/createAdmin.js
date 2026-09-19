const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const User = require('./models/User');

const createOrUpdateAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_business_db';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    const email = 'ahmadali@gmail.com';
    const password = '123456';
    const name = 'Ahmad Ali';
    const role = 'admin';

    let user = await User.findOne({ email });
    if (user) {
      user.password = password;
      user.role = role;
      user.name = name;
      await user.save();
      console.log(`Admin account [${email}] updated successfully!`);
    } else {
      user = await User.create({
        name,
        email,
        password,
        role,
        phone: '+91 9876543210'
      });
      console.log(`Admin account [${email}] created successfully!`);
    }

    console.log('\nAdmin Details:');
    console.log(`- Email: ${email}`);
    console.log(`- Password: ${password}`);
    console.log(`- Role: ${role}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
};

createOrUpdateAdmin();
