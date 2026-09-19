const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a business name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Dining & Cafes',
        'Health & Wellness',
        'Beauty & Spa',
        'Retail & Shopping',
        'Automotive & Repairs',
        'Home & Local Services',
        'Fitness & Sports',
        'Entertainment & Events',
        'Education & Tutoring',
        'Other',
      ],
      default: 'Retail & Shopping',
    },
    description: {
      type: String,
      required: [true, 'Please add a business description'],
    },
    address: {
      type: String,
      required: [true, 'Please add a physical address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    state: {
      type: String,
      default: '',
    },
    zipCode: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact phone number'],
    },
    email: {
      type: String,
      required: [true, 'Please add a business email'],
    },
    website: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 24,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    openingHours: {
      type: String,
      default: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM',
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for active offers
businessSchema.virtual('offers', {
  ref: 'Offer',
  localField: '_id',
  foreignField: 'business',
  justOne: false,
});

module.exports = mongoose.model('Business', businessSchema);
