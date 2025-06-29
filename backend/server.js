const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Project = require('./model/project');
const Task = require('./model/task');
const User = require('./model/user');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); 

const app = new express();
 
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;


// Add bcrypt hashing for passwords
const saltRounds = 10;

 app.post('/user/:userId/newtask', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Request body:', req.body);
     console.log('userId1:', userId);
    const { title, description, status, priority, dueDate, projectId, projectName, assignedToUserId, createdByUserId } = req.body;

    if (!title || !projectId || !assignedToUserId || !createdByUserId) {
      return res.status(400).json({ message: 'Missing required fields: title, projectId, assignedToUserId, or createdByUserId' });
    }

    const newTask = new Task({
      title,
      userId,
      description,
      status,
      priority,
      dueDate,
      projectId: projectId.toString(),
      projectName: projectName.toString(),
      assignedToUserId: assignedToUserId.toString(),
      createdByUserId: createdByUserId.toString()
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.put('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, projectId, projectName, assignedToUserId } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
        projectName,
        assignedToUserId
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/users-with-stats', async (req, res) => {
  try {
    const users = await User.find();
    const tasks = await Task.find();

   const userStats = users.map(user => {
  const userTasks = tasks.filter(t => t.assignedToUserId === user.userId);
  
  const completedCount = userTasks.filter(t =>
    t.status && ['done', 'completed'].includes(t.status.toLowerCase())
  ).length;

  const total = userTasks.length;
  const completion = total > 0 ? Math.round((completedCount / total) * 100) : 0;



      return {
        ...user.toObject(),
        tasks: total,
        completion
      };
    });

    res.json(userStats);
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/task', async (req, res) => {
  try {
    const tasksWithUser = await Task.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'assignedToUserId',
          foreignField: 'userId',
          as: 'userDetails'
        }
      },
      { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          title: 1,
          github: 1,
          description: 1,
          status: 1,
          priority: 1,
          dueDate: 1,
          projectId: 1,
          projectName: 1,
          assignedToUserId: 1,
          createdByUserId: 1,
          createdAt: 1,
          assignedToUsername: '$userDetails.username' // 👈 this is the key your frontend expects
        }
      }
    ]);

    res.json(tasksWithUser);
  } catch (err) {
    console.error('Error fetching tasks with user info:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.patch('/api/tasks/user/:userId/project/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const { status, github } = req.body;
    
    const tasks = await Task.updateMany(
      { assignedToUserId: userId, projectId: projectId },
      {  $set: { status, github }  }
    );

    if (tasks.modifiedCount === 0) {
      return res.status(404).json({ message: 'No tasks found to update' });
    }

    res.json({ message: 'Tasks updated successfully' });
  } catch (err) {
    console.error('Error updating tasks:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/tasks/metrics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ assignedToUserId: userId });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    const total = tasks.length;
    const metrics = {
      performance: {
        title: 'Team Performance',
        metrics: [
          { 
            name: 'Task Completion Rate', 
            value: `${Math.round((tasks.filter(t => t.status === 'done').length / total) * 100)}%`,
            change: '+5%'
          },
          { 
            name: 'Tasks This Week', 
            value: tasks.filter(t => {
              const taskDate = new Date(t.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return taskDate >= weekAgo;
            }).length.toString(),
            change: '+3'
          },
          { 
            name: 'On-time Delivery', 
            value: `${Math.round((tasks.filter(t => new Date(t.dueDate) >= new Date()).length / total) * 100)}%`,
            change: '+2%'
          },
          { 
            name: 'In Progress', 
            value: tasks.filter(t => t.status === 'in-progress').length.toString(),
            change: '0'
          }
        ]
      },
      tasks: {
        title: 'Task Distribution',
        metrics: [
          { 
            name: 'Completed Tasks', 
            value: tasks.filter(t => t.status === 'done').length.toString(),
            change: '+0'
          },
          { 
            name: 'In Progress', 
            value: tasks.filter(t => t.status === 'in-progress').length.toString(),
            change: '+0'
          },
          { 
            name: 'Pending Tasks', 
            value: tasks.filter(t => t.status === 'to-do').length.toString(),
            change: '+0'
          },
          { 
            name: 'High Priority', 
            value: tasks.filter(t => t.priority === 'high').length.toString(),
            change: '+0'
          }
        ]
      },
      productivity: {
        title: 'Productivity Trends',
        metrics: [
          { 
            name: 'Weekly Output', 
            value: `${Math.round((tasks.filter(t => t.status === 'done').length / total) * 100)}%`,
            change: '↑'
          },
          { 
            name: 'Active Tasks', 
            value: tasks.filter(t => t.status !== 'done').length.toString(),
            change: '→'
          },
          { 
            name: 'Completion Rate', 
            value: `${Math.round((tasks.filter(t => t.status === 'done').length / total) * 100)}%`,
            change: '↑'
          },
          { 
            name: 'Task Balance', 
            value: total > 0 ? 'Good' : 'N/A',
            change: '→'
          }
        ]
      }
    };

    res.json(metrics);
  } catch (err) {
    console.error('Error fetching task metrics:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/tasks/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
     const user = await User.findById(userId);
    const tasks = await Task.find({ assignedToUserId: user.userId});
    
//     console.log("task",tasks);
//         console.log("userId",userId);
 console.log("userID",user.userId);
console.log('Fetching tasks for userId:', userId);
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks for user:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Updated newuser endpoint with password hashing
app.post('/newuser', async (req, res) => {
  try {
    const { username, email, role, userId, password } = req.body;

    if (!username || !email || !role || !userId || !password) {
      return res.status(400).json({ message: 'Missing required fields: username, email, role, userId, or password' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      role,
      userId,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Deleting user with userId:', userId);
    const deletedUser = await User.findOneAndDelete({ userId });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/user', async(req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 👇 Paste this below 👇

app.get('/api/tasks/with-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const tasksWithUser = await Task.aggregate([
      { $match: { assignedToUserId: userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedToUserId',
          foreignField: 'userId',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          priority: 1,
          dueDate: 1,
          projectId: 1,
          projectName: 1,
          assignedToUserId: 1,
          createdByUserId: 1,
          createdAt: 1,
          user: {
            username: '$userDetails.username',
            email: '$userDetails.email',
            role: '$userDetails.role',
            userId: '$userDetails.userId'
          }
        }
      }
    ]);

    res.json(tasksWithUser);
  } catch (err) {
    console.error('Error fetching tasks with user info:', err);
    res.status(500).send('Internal Server Error');
  }
});


mongoose.connect('mongodb+srv://Nexus:nexus4@bookclubcluster.qiwnm.mongodb.net/taskmanagerDB?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });