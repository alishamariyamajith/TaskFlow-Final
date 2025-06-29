import React, { useState, useEffect } from 'react';
import { Box, Grid, Button, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TeamAnalyticsSection = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('performance');
  const [timeRange, setTimeRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    performance: { title: 'Team Performance', metrics: [] },
    tasks: { title: 'Task Distribution', metrics: [] },
    productivity: { title: 'Productivity Trends', metrics: [] }
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/tasks/metrics/${userId}`);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    if (userId) {
      fetchMetrics();
    }
  }, [userId]);

  const mockData = {
    performance: {
      title: 'Team Performance',
      metrics: [
        { name: 'Task Completion Rate', value: '87%', change: '+5%' },
        { name: 'Avg. Time per Task', value: '2.4h', change: '-0.3h' },
        { name: 'On-time Delivery', value: '92%', change: '+3%' },
        { name: 'Quality Rating', value: '4.7/5', change: '+0.2' }
      ]
    },
    tasks: {
      title: 'Task Distribution',
      metrics: [
        { name: 'Completed Tasks', value: '124', change: '+18' },
        { name: 'In Progress', value: '36', change: '-4' },
        { name: 'Pending Review', value: '18', change: '+2' },
        { name: 'Overdue', value: '7', change: '-3' }
      ]
    },
    productivity: {
      title: 'Productivity Trends',
      metrics: [
        { name: 'Weekly Output', value: '+12%', change: '↑' },
        { name: 'Focus Time', value: '34h', change: '+3h' },
        { name: 'Collaboration Index', value: '78%', change: '+5%' },
        { name: 'Workload Balance', value: 'Good', change: '→' }
      ]
    }
  };

  const currentData = analyticsData[activeTab] || mockData[activeTab];
  
  // Custom SVG Icons
  const BarChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4f46e5">
      <rect x="2" y="13" width="4" height="8" />
      <rect x="10" y="9" width="4" height="12" />
      <rect x="18" y="3" width="4" height="18" />
    </svg>
  );
  
  const TimelineIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4f46e5">
      <path d="M16 11.78l4.24-2.15.78 1.62-4.24 2.15z" />
      <circle cx="12" cy="8" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="12" cy="16" r="2" />
      <path d="M10.59 14.41l-1.58-1.58-4.24 4.24 1.42 1.42 2.82-2.82 1.58 1.58 6.83-6.83-1.42-1.42z" />
    </svg>
  );
  
  const PeopleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4f46e5">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
  
  const PieChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4f46e5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm7.93 9H13V4.07c3.61.45 6.48 3.32 6.93 6.93zM4 12c0-4.07 3.06-7.44 7-7.93v15.86c-3.94-.49-7-3.86-7-7.93zm9 7.93V13h6.93c-.45 3.61-3.32 6.48-6.93 6.93z" />
    </svg>
  );
  
  const LineChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4f46e5">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z" />
    </svg>
  );
  
  const AssessmentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4f46e5">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
    </svg>
  );

  return (
    <Box sx={{ 
      mt: 4, 
      p: 3, 
      backgroundColor: '#f9fbfd', 
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      border: '1px solid #eef2f6'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748' }}>
          Team Analytics Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['week', 'month', 'quarter'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'contained' : 'outlined'}
              onClick={() => setTimeRange(range)}
              sx={{
                textTransform: 'capitalize',
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 600,
                fontSize: '0.875rem',
                backgroundColor: timeRange === range ? '#4f46e5' : 'transparent',
                color: timeRange === range ? 'white' : '#4f46e5',
                borderColor: '#4f46e5',
                '&:hover': {
                  backgroundColor: timeRange === range ? '#4338ca' : '#eef2ff',
                  borderColor: '#4f46e5'
                }
              }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 4, 
        flexWrap: 'wrap',
        overflowX: 'auto',
        pb: 1
      }}>
        {[
          { id: 'performance', label: 'Performance', icon: <AssessmentIcon /> },
          { id: 'tasks', label: 'Task Metrics', icon: <BarChartIcon /> },
          { id: 'productivity', label: 'Productivity', icon: <LineChartIcon /> },
          { id: 'team', label: 'Team Insights', icon: <PeopleIcon /> },
          { id: 'timeline', label: 'Timeline', icon: <TimelineIcon /> },
          { id: 'breakdown', label: 'Breakdown', icon: <PieChartIcon /> }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'contained' : 'outlined'}
            startIcon={tab.icon}
            onClick={() => setActiveTab(tab.id)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              fontSize: '0.875rem',
              minWidth: 'max-content',
              backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#4f46e5',
              borderColor: '#4f46e5',
              '&:hover': {
                backgroundColor: activeTab === tab.id ? '#4338ca' : '#eef2ff',
                borderColor: '#4f46e5'
              },
              '& .MuiButton-startIcon': {
                marginRight: '8px'
              }
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#4f46e5', mb: 2 }}>
          {currentData.title} - Last {timeRange}
        </Typography>
        
        <Grid container spacing={3}>
          {currentData.metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
                borderLeft: '4px solid #4f46e5',
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 16px rgba(79, 70, 229, 0.15)'
                }
              }}>
                <Typography variant="subtitle2" sx={{ 
                  color: '#6b7280', 
                  mb: 1,
                  fontWeight: 500 
                }}>
                  {metric.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                    {metric.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1, 
                      fontWeight: 600,
                      color: metric.change.startsWith('+') || metric.change === '↑' 
                        ? '#10b981' 
                        : metric.change.startsWith('-') || metric.change === '↓' 
                          ? '#ef4444' 
                          : '#6b7280'
                    }}
                  >
                    {metric.change}
                  </Typography>
                </Box>
                <Box sx={{ 
                  height: 6, 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: 3, 
                  mt: 2,
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ 
                      height: '100%', 
                      backgroundColor: '#4f46e5', 
                      width: `${70 + index * 10}%`,
                      borderRadius: 3,
                      transition: 'width 0.5s ease'
                    }} 
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 2, 
        mt: 3,
        flexWrap: 'wrap'
      }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#4f46e5',
            borderColor: '#4f46e5',
            minWidth: 'max-content',
            '&:hover': {
              backgroundColor: '#eef2ff',
              borderColor: '#4f46e5'
            }
          }}
        >
          Export Data
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: '#4f46e5',
            minWidth: 'max-content',
            '&:hover': {
              backgroundColor: '#4338ca'
            }
          }}
        >
          Generate Report
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#4f46e5',
            borderColor: '#4f46e5',
            minWidth: 'max-content',
            '&:hover': {
              backgroundColor: '#eef2ff',
              borderColor: '#4f46e5'
            }
          }}
        >
          Share Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default TeamAnalyticsSection;
