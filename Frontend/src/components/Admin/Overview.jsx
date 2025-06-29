// src/components/Admin/Overview.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Chip } from '@mui/material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FiberManualRecord as BulletIcon } from '@mui/icons-material';
 


const COLORS = ['#4caf50', '#2196f3', '#ff9800'];

const Overview = () => {
  const [rows, setRows] = useState([]);
  const [projectSummary, setProjectSummary] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/task')
      .then(res => res.json())
      .then(data => {
        setRows(data);

        const summary = {};
        data.forEach(task => {
          if (task.projectName) {
            summary[task.projectName] = (summary[task.projectName] || 0) + 1;
          }
        });
        setProjectSummary(Object.entries(summary));
      });
  }, []);

  const chartData = [
    { name: 'Completed', value: rows.filter(r => ['done', 'completed'].includes(r.status?.toLowerCase())).length },
    { name: 'In Progress', value: rows.filter(r => r.status?.toLowerCase() === 'in-progress').length },
    { name: 'Pending', value: rows.filter(r => r.status?.toLowerCase() === 'to-do').length },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box p={2} border="1px solid #ccc" borderRadius={2} bgcolor="#f9f9f9">
        <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
          Project-wise Task Summary
        </Typography>
        <List dense>
          {projectSummary.map(([project, count], index) => (
            <ListItem key={project} disablePadding>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <BulletIcon fontSize="small" sx={{ color: '#4f46e5' }} />
              </ListItemIcon>
              <ListItemText
                primary={`${count} task(s) in "${project}"`}
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}
              />
            </ListItem>
          ))}
        </List>

      </Box>

      <Box p={2} border="1px solid #ccc" borderRadius={2} bgcolor="#f9f9f9">
        <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
          Overview
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <Box mt={2} display="flex" gap={2} flexWrap="wrap">
          {chartData.map((entry, index) => (
            <Chip
              key={index}
              label={`${entry.name}: ${entry.value}`}
              sx={{
                backgroundColor: COLORS[index],
                color: '#fff',
                fontWeight: 600,
                borderRadius: 2,
                px: 1.5
              }}
            />
          ))}
        </Box>


      </Box>
    </Box>
  );
};

export default Overview;
