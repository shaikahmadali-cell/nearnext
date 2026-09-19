const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Business = require('./models/Business');
const Offer = require('./models/Offer');
const Enquiry = require('./models/Enquiry');
const SavedOffer = require('./models/SavedOffer');
const Review = require('./models/Review');

const clearDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_business_db';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    console.log('Clearing all dummy data from database collections...');
    await User.deleteMany();
    await Business.deleteMany();
    await Offer.deleteMany();
    await Enquiry.deleteMany();
    await SavedOffer.deleteMany();
    await Review.deleteMany();

    console.log('Creating clean Master Admin account...');
    await User.create({
      name: 'Locora Admin',
      email: 'admin@locora.com',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '+91 9876543210'
    });

    console.log('\nAll dummy data has been removed successfully!');
    console.log('Database is now fresh and ready for real data.');
    console.log('Default Admin Account created:');
    console.log('   Email: admin@locora.com');
    console.log('   Password: AdminPassword123!');
    console.log('\nYou can now register real businesses, customers, and post real offers via the app.');

    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
