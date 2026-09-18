const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['customer', 'business', 'admin'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const enquirySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'closed'],
      default: 'pending',
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
