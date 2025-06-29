const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: {
    type: String,
    required: true,
  },
  description: String,
  status: { type: String, enum: ['to-do', 'in-progress', 'done'], default: 'to-do' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  additionaldetails: String,
  dueDate: {
    type: Date,
    // Removed default: Date.now as dueDate is typically set explicitly
  },
 projectId: { type: String, required: true },
  projectName: { type: String, required: true },
assignedToUserId: { type: String },
createdByUserId: { type: String },
github: { type: String }
}, { collection: 'tasks', timestamps: true }); // Correct collection name and enable timestamps

const Task = mongoose.model('Task', taskSchema); // Correct model name
module.exports = Task;
