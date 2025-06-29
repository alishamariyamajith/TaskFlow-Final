
// src/components/TeamDashboard.jsx
import React, { useEffect, useState } from 'react';
import './TeamDashboard.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TeamDashboard = () => {
  const { name, userId } = useParams();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };


  const getFormattedDate = () => {
    const date = new Date();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const day = days[date.getDay()];
    const dayNum = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${day} ${dayNum}${getOrdinal(dayNum)} ${month} ${year}`;
  };

  // Mock task data
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`);
        if (response.data) {
          const formattedTasks = response.data.map(task => ({
            ...task,
            status: task.status === 'to-do' ? 'Pending' : 
                    task.status === 'in-progress' ? 'In Progress' : 
                    task.status === 'done' ? 'Completed' : task.status,
            priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
          }));
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId]);



  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  



  const pieData = [
    { name: 'Pending', value: pending },
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress }
  ];


  const COLORS = ['#7f8c8d', '#27ae60', '#2980b9']; // Pending, Completed, In Progress


  const barData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length },
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length }
  ];

  return (
    <div className="dashboard-container">
      <div className="header-card">
        <h2>{getGreeting()}!{name}</h2>
        <p>{getFormattedDate()}</p>

        <div className="task-summary">
          <span className="task-count total">{total} Total</span>
          <span className="task-count pending">{pending} Pending</span>
          <span className="task-count completed">{completed} Completed</span>
          <span className="task-count in-progress">{inProgress} In Progress</span>
        </div>

      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h4 >Task Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100} // ← increased size
                innerRadius={50}  // ← optional for a donut look
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-card">
          <h4>Task Priority Levels</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barData.map((entry, index) => {
                  const colorMap = {
                    Low: '#2ecc71',
                    Medium: '#f1c40f',
                    High: '#e74c3c'
                  };
                  return <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />;
                })}
              </Bar>
            </BarChart>

          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
