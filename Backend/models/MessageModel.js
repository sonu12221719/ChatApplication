import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: {
    type: String,
    required: true,
    maxLength: 1000,
    trim: true,
    validate: {
      validator: (value) => typeof value === 'string' && value.trim().length > 0,
      message: 'Message must be a non-empty string.'
    }
  }
}, { timestamps: true });

export const Message = mongoose.model('Message', MessageSchema);
