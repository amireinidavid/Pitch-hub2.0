import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  title: String,
  message: String,
  type: {
    type: String,
    enum: ['investment', 'pitch', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  link: String
}, {
  timestamps: true
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification; 