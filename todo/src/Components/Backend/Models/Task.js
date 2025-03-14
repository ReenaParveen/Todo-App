const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['todo', 'doing', 'done'],
    default: 'todo'
  },
  tags: [String]
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
