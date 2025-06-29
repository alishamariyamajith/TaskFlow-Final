import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Submit.css';
import { ArrowLeft } from 'lucide-react';

const SubmitPage = () => {
  const { projectId, name, userId } = useParams(); // userId here is Mongo _id
  const navigate = useNavigate();

  const [link, setLink] = useState('');
  const [checkedTasks, setCheckedTasks] = useState({});
  const [tasks, setTasks] = useState([]);
  const [customUserId, setCustomUserId] = useState(''); // This will be your assignedToUserId (e.g., "u001")

  useEffect(() => {
    const fetchTasksAndUser = async () => {
      try {
        // Step 1: Fetch user data to get custom userId
        const usersResponse = await axios.get('http://localhost:3000/user');
        const user = usersResponse.data.find(u => u._id === userId);
        if (!user) {
          console.error('User not found');
          return;
        }
        setCustomUserId(user.userId); // assignedToUserId

        // Step 2: Fetch tasks for this MongoDB userId
        const response = await axios.get(`http://localhost:3000/api/tasks/user/${userId}`);
        if (response.data) {
          const filteredTasks = response.data.filter(task => task.projectId === projectId)
            .map(task => ({
              id: task._id,
              projectId: task.projectId,
              name: task.projectName,
              title: task.title,
              duedate: new Date(task.dueDate).toISOString().split('T')[0],
              status: task.status,
              github: task.github || ''
            }));
          setTasks(filteredTasks);

          const initialCheckedState = {};
          filteredTasks.forEach(task => {
            initialCheckedState[task.title] = task.status === 'done' || task.status === 'in-progress';
          });
          setCheckedTasks(initialCheckedState);

          if (filteredTasks[0]?.github) {
            setLink(filteredTasks[0].github);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userId && projectId) {
      fetchTasksAndUser();
    }
  }, [userId, projectId]);

  const handleCheck = (taskTitle) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskTitle]: !prev[taskTitle]
    }));
  };

  const handleSubmit = async () => {
    try {
      const total = tasks.length;
      const selected = Object.values(checkedTasks).filter(checked => checked).length;

      let newStatus = 'to-do'; // Backend expects: 'to-do', 'in-progress', 'done'
      if (selected === total) newStatus = 'done';
      else if (selected > 0) newStatus = 'in-progress';

      await axios.patch(`http://localhost:3000/api/tasks/user/${customUserId}/project/${projectId}`, {
        status: newStatus,
        github: link
      });

      navigate(`/user/${name}/${userId}/tasks`);
    } catch (error) {
      console.error('Error updating tasks:', error);
      alert('Failed to update tasks. Please try again.');
    }
  };

  if (tasks.length === 0) return <p>Task not found</p>;

  return (
    <div className="submit-container">
      <div className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} />
      </div>

      <h2>Submit Tasks for Project</h2>
      <form className="submit-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label>Project:</label>
          <input type="text" value={tasks[0]?.name || ''} readOnly />
        </div>

        <div>
          <label>Due Dates:</label>
          <input
            type="text"
            value={tasks.map(t => t.duedate).join(', ')}
            readOnly
          />
        </div>

        <div>
          <label>Tasks:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {tasks.map(task => (
              <label key={task.id}>
                <input
                  type="checkbox"
                  checked={checkedTasks[task.title] || false}
                  onChange={() => handleCheck(task.title)}
                />
                {task.title}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>GitHub Link:</label>
          <input
            type="url"
            placeholder="Enter GitHub link"
            value={link}
            onChange={e => setLink(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default SubmitPage;
