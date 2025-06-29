import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Task.css';
import { AiOutlineFileText } from 'react-icons/ai';
import { MdErrorOutline, MdCheckCircle, MdAutorenew, MdHourglassEmpty, MdArrowDownward } from 'react-icons/md';
import { FaFlag } from 'react-icons/fa';


const Task = () => {
  const { name, userId } = useParams();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Use the userId from URL params to fetch tasks
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`);
        console.log('API Response:', response.data); // Debug log
        if (response.data) {
          const formattedTasks = response.data.map(task => ({
            projectId: task.projectId,
            name: task.projectName,
            task: task.title,
            duedate: new Date(task.dueDate).toISOString().split('T')[0],
            priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
            status: task.status === 'to-do' ? 'Pending' : 
                   task.status === 'in-progress' ? 'In Progress' : 
                   task.status === 'done' ? 'Completed' : task.status,
            assignedto: name
          }));
          console.log('Formatted Tasks:', formattedTasks); // Debug log
          setRows(formattedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const renderBadge = (value) => {
    const iconMap = {
      High: <MdErrorOutline style={{ marginRight: '5px' }} />,
      Medium: <FaFlag style={{ marginRight: '5px' }} />,
      Low: <MdArrowDownward style={{ marginRight: '5px' }} />,
      Pending: <MdHourglassEmpty style={{ marginRight: '5px' }} />,
      'In Progress': <MdAutorenew style={{ marginRight: '5px' }} />,
      Completed: <MdCheckCircle style={{ marginRight: '5px' }} />
    };
    const colorMap = {
      High: '#e74c3c',
      Medium: '#f1c40f',
      Low: '#2ecc71',
      Pending: '#7f8c8d',
      Completed: '#27ae60',
      'In Progress': '#2980b9'
    };

    return (
      <span
        className="badge"
        style={{
          backgroundColor: colorMap[value] || '#ccc',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '30px',
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '0.8rem',
          fontWeight: 600,
          minWidth: '130px',
          justifyContent: 'center'
        }}
      >
        {iconMap[value]} {value}
      </span>
    );
  };

  const filteredRows = rows;

  const grouped = filteredRows.reduce((acc, task) => {
    if (!acc[task.projectId]) {
      acc[task.projectId] = {
        projectId: task.projectId,
        name: task.name,
        tasks: []
      };
    }
    acc[task.projectId].tasks.push(task);
    return acc;
  }, {});
  
  const projects = Object.values(grouped);

  return (
    <div className="task-table-container">
      <div className="task-title">My Projects</div>
      <TableContainer component={Paper} className="task-table">
        <Table>
          <TableHead>
            <TableRow className="task-header-row" style={{ backgroundColor: '#f9f9f9' }}>
              <TableCell style={{ color: '#080808' }}>Project ID</TableCell>
              <TableCell style={{ color: '#080808' }}>Project</TableCell>
              <TableCell style={{ color: '#080808' }}>Due Dates</TableCell>
              <TableCell style={{ color: '#080808' }}>Priority</TableCell>
              <TableCell style={{ color: '#080808' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => {
              const priorities = [...new Set(project.tasks.map(t => t.priority))];
              const statuses = [...new Set(project.tasks.map(t => t.status))];
              const dueDates = [...new Set(project.tasks.map(t => t.duedate))];

              return (
                <TableRow
                  key={project.projectId}
                  onClick={() => navigate(`/user/${name}/${userId}/submit/${project.projectId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{project.projectId}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AiOutlineFileText size={18} color="#3498db" /> {project.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {dueDates.map(date => (
                      <div key={date}>
                        {date}
                        <div style={{ fontSize: '0.75rem', color: new Date(date) < new Date() ? 'red' : '#888' }}>
                          {new Date(date) < new Date() ? 'Overdue' : 'On track'}
                        </div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {priorities.map((p, index) => (
                      <div key={`${project.projectId}-priority-${index}`}>
                        {renderBadge(p)}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {statuses.map((s, index) => (
                      <div key={`${project.projectId}-status-${index}`}>
                        {renderBadge(s)}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Task;
