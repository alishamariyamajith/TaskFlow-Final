import React from 'react';
import { Card, Table, Badge, Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Home.css';

const Home = ({ setLoginOpen }) => {
  const user = JSON.parse(localStorage.getItem('user'));
const isAdmin = user?.role === 'admin';
  // Sample data for the demo
  const tasks = [
    { 
      id: 1, 
      title: 'Complete project proposal', 
      assignee: { name: 'John Doe', avatar: 'JD' }, 
      dueDate: '2023-06-15', 
      status: 'In Progress', 
      priority: 'High',
      progress: 65
    },
    { 
      id: 2, 
      title: 'Review marketing materials', 
      assignee: { name: 'Jane Smith', avatar: 'JS' }, 
      dueDate: '2023-06-10', 
      status: 'Pending', 
      priority: 'Medium',
      progress: 20
    },
    { 
      id: 3, 
      title: 'Client meeting preparation', 
      assignee: { name: 'Mike Johnson', avatar: 'MJ' }, 
      dueDate: '2023-06-12', 
      status: 'Completed', 
      priority: 'Low',
      progress: 100
    },
    { 
      id: 4, 
      title: 'API documentation', 
      assignee: { name: 'Sarah Williams', avatar: 'SW' }, 
      dueDate: '2023-06-18', 
      status: 'In Progress', 
      priority: 'High',
      progress: 40
    },
  ];

  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'Developer', tasks: 5, completion: 92 },
    { id: 2, name: 'Jane Smith', role: 'Designer', tasks: 3, completion: 78 },
    { id: 3, name: 'Mike Johnson', role: 'Project Manager', tasks: 2, completion: 100 },
    { id: 4, name: 'Sarah Williams', role: 'Frontend Developer', tasks: 4, completion: 65 },
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge bg="danger" className="d-flex align-items-center"><i className="bi bi-exclamation-circle me-1"></i> High</Badge>;
      case 'Medium':
        return <Badge bg="warning" className="d-flex align-items-center"><i className="bi bi-flag me-1"></i> Medium</Badge>;
      case 'Low':
        return <Badge bg="success" className="d-flex align-items-center"><i className="bi bi-arrow-down me-1"></i> Low</Badge>;
      default:
        return <Badge bg="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge bg="success" className="d-flex align-items-center"><i className="bi bi-check-circle me-1"></i> Completed</Badge>;
      case 'In Progress':
        return <Badge bg="primary" className="d-flex align-items-center"><i className="bi bi-arrow-repeat me-1"></i> In Progress</Badge>;
      case 'Pending':
        return <Badge bg="secondary" className="d-flex align-items-center"><i className="bi bi-hourglass-split me-1"></i> Pending</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="task-tracker-app">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-primary text-white py-6">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">Professional Task Management</h1>
              <p className="lead mb-4">Streamline workflows, assign tasks efficiently, and track progress with our enterprise-grade solution</p>
              <div className="d-flex gap-3">
                {!user && (
                <Button 
                  variant="light" 
                  size="lg" 
                  className="fw-medium"
                  onClick={() => setLoginOpen(true)}
                >
                  Get Started
                </Button>
                )}
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="dashboard-frame-container">
                <div className="dashboard-frame">
                  <div className="frame-header">
                    <div className="frame-controls">
                      <span className="frame-control close"></span>
                      <span className="frame-control minimize"></span>
                      <span className="frame-control maximize"></span>
                    </div>
                    <div className="frame-title">app.tasktracker.com/dashboard</div>
                  </div>
                  <div className="dashboard-preview p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Team Dashboard</h5>
                      <Badge bg="primary">Demo</Badge>
                    </div>
                    <div className="d-flex gap-2 mb-3">
                      <div className="bg-light border rounded p-2 flex-grow-1">
                        <small className="text-muted">Tasks Completed</small>
                        <h4 className="mb-0">24</h4>
                      </div>
                      <div className="bg-light border rounded p-2 flex-grow-1">
                        <small className="text-muted">Active Projects</small>
                        <h4 className="mb-0">5</h4>
                      </div>
                    </div>
                    <div className="progress mb-3" style={{ height: '10px' }}>
                      <div className="progress-bar bg-success" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-muted small mb-0">Overall progress this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="fw-bold display-5 mb-3">Enterprise-Grade Features</h2>
            <p className="text-muted fs-5">Professional tools for high-performing teams</p>
          </div>
          <div className="row g-5">
            <div className="col-md-4">
              <Card className="h-100 border-0 shadow-lg-hover overflow-hidden">
                <div className="feature-icon-bg bg-primary bg-opacity-10">
                  <i className="bi bi-list-check text-primary fs-1"></i>
                </div>
                <Card.Body className="p-4 pt-5 position-relative">
                  <Card.Title className="h4 fw-bold mb-3">Intuitive Task Assignment</Card.Title>
                  <Card.Text className="text-muted">
                    Delegate responsibilities with precision using our intelligent assignment system.
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="h-100 border-0 shadow-lg-hover overflow-hidden">
                <div className="feature-icon-bg bg-success bg-opacity-10">
                  <i className="bi bi-bar-chart text-success fs-1"></i>
                </div>
                <Card.Body className="p-4 pt-5 position-relative">
                  <Card.Title className="h4 fw-bold mb-3">Performance Analytics</Card.Title>
                  <Card.Text className="text-muted">
                    Gain actionable insights with our advanced analytics dashboard.
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="h-100 border-0 shadow-lg-hover overflow-hidden">
                <div className="feature-icon-bg bg-info bg-opacity-10">
                  <i className="bi bi-bell text-info fs-1"></i>
                </div>
                <Card.Body className="p-4 pt-5 position-relative">
                  <Card.Title className="h4 fw-bold mb-3">Smart Action Notifications</Card.Title>
                  <Card.Text className="text-muted">
                    Stay informed with Action made with popup alerts.
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Task Dashboard Preview */}
      <section className="py-6 bg-soft">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="fw-bold display-5 mb-3">Task Management Dashboard</h2>
            <p className="text-muted fs-5">See how tasks are managed in our system</p>
          </div>
          
          <div className="dashboard-frame-container mb-5">
            <div className="dashboard-frame">
              <div className="frame-header">
                <div className="frame-controls">
                  <span className="frame-control close"></span>
                  <span className="frame-control minimize"></span>
                  <span className="frame-control maximize"></span>
                </div>
                <div className="frame-title">app.tasktracker.com/tasks</div>
              </div>
              <div className="dashboard-preview p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-0">Task Dashboard</h5>
                    <p className="text-muted small mb-0">Demo Preview</p>
                  </div>
                  <Button variant="primary" size="sm" className="disabled">Create New Task</Button>
                </div>
                
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-3 fw-medium">Task</th>
                        <th className="fw-medium">Assignee</th>
                        <th className="fw-medium">Due Date</th>
                        <th className="fw-medium">Priority</th>
                        <th className="fw-medium">Status</th>
                        <th className="pe-3 fw-medium">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map(task => (
                        <tr key={task.id} className="border-top">
                          <td className="ps-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                                <i className="bi bi-card-checklist text-primary"></i>
                              </div>
                              <div>
                                <div className="fw-semibold">{task.title}</div>
                                <small className="text-muted">ID: TSK-{task.id.toString().padStart(3, '0')}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar bg-primary bg-opacity-10 text-primary rounded-circle me-2">
                                {task.assignee.avatar}
                              </div>
                              <div>{task.assignee.name}</div>
                            </div>
                          </td>
                          <td>
                            <div className="fw-medium">{task.dueDate}</div>
                            <small className={task.dueDate === '2023-06-10' ? 'text-danger' : 'text-muted'}>
                              {task.dueDate === '2023-06-10' ? 'Overdue' : 'On track'}
                            </small>
                          </td>
                          <td>{getPriorityBadge(task.priority)}</td>
                          <td>{getStatusBadge(task.status)}</td>
                          <td className="pe-3">
                            <div className="d-flex align-items-center">
                              <div className="flex-grow-1 me-3">
                                <ProgressBar 
                                  now={task.progress} 
                                  variant={
                                    task.progress > 90 ? 'success' : 
                                    task.progress > 50 ? 'primary' : 'warning'
                                  } 
                                  className="rounded-pill"
                                  style={{ height: '8px' }}
                                />
                              </div>
                              <div className="fw-medium">{task.progress}%</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted small">
                    Showing {tasks.length} of {tasks.length} tasks
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-secondary" size="sm" className="disabled">Export CSV</Button>
                    <Button variant="primary" size="sm" className="disabled">Print</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted">This is a preview of the task dashboard. All functionality is disabled in this demo view.</p>
          </div>
        </div>
      </section>

      {/* Team Management Preview */}
      <section className="py-6">
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="fw-bold display-5 mb-3">Team Management</h2>
            <p className="text-muted fs-5">Assign tasks to your team members</p>
          </div>
          
          <div className="dashboard-frame-container">
            <div className="dashboard-frame">
              <div className="frame-header">
                <div className="frame-controls">
                  <span className="frame-control close"></span>
                  <span className="frame-control minimize"></span>
                  <span className="frame-control maximize"></span>
                </div>
                <div className="frame-title">app.tasktracker.com/team</div>
              </div>
              <div className="dashboard-preview p-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h5 className="fw-bold mb-0">Team Management</h5>
                    <p className="text-muted small mb-0">Demo Preview</p>
                  </div>
                  <Button variant="primary" size="sm" className="disabled">Add Member</Button>
                </div>
                
                <div className="row g-3">
                  {teamMembers.map(member => (
                    <div key={member.id} className="col-md-6">
                      <Card className="border-0 shadow-sm-hover">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-xl me-3">
                              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center w-100 h-100 fs-3 fw-bold">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <Card.Title className="mb-1 fw-bold">{member.name}</Card.Title>
                              <p className="text-primary small fw-medium mb-2">{member.role}</p>
                              <div className="d-flex justify-content-between">
                                <div className="text-center">
                                  <div className="fw-bold">{member.tasks}</div>
                                  <small className="text-muted">Tasks</small>
                                </div>
                                <div className="text-center">
                                  <div className="fw-bold">{member.completion}%</div>
                                  <small className="text-muted">Completion</small>
                                </div>
                                <div className="text-center">
                                  <div className="fw-bold">4.8</div>
                                  <small className="text-muted">Rating</small>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              className="disabled"
                            >
                              Assign Task
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* About Our Team Section with attractive background */}
      {/* About Our Team Section */}
<section className="py-6 bg-light">
  <div className="container">
    <div className="text-center mb-5">
      <h2 className="fw-bold display-5 mb-2 text-dark">About Our Team</h2>
      <div className="divider mx-auto" style={{width: '80px', height: '4px', background: '#0d6efd'}}></div>
      <p className="text-muted fs-5 mt-3">A team of BTech students delivering professional solutions</p>
    </div>
    
    <div className="row g-5">
      <div className="col-lg-6">
        <div className="bg-white p-5 rounded-3 shadow-sm h-100">
          <p className="lead text-dark mb-4">
            We are a team of four BTech students who developed this task management system 
            as part of our internship project. Our solution empowers administrators to 
            efficiently manage tasks and team members.
          </p>
          <p className="text-dark mb-5">
            Throughout this project, we focused on delivering a professional-grade application 
            that meets all specified requirements, with particular emphasis on robust task 
            management capabilities for team leaders.
          </p>
          
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3">
                  <i className="bi bi-check2-circle fs-2"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">100%</h4>
                  <p className="text-muted mb-0">Requirements Met</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3">
                  <i className="bi bi-people fs-2"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">4</h4>
                  <p className="text-muted mb-0">Developers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-6">
        <div className="bg-white p-5 rounded-3 shadow-sm h-100">
          <div className="d-flex align-items-start mb-4">
            <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3">
              <i className="bi bi-journal-bookmark fs-2"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-1 text-dark">Project Overview</h3>
              <p className="text-muted mb-3">Internship project delivering enterprise solution</p>
            </div>
          </div>
          
          <p className="text-dark mb-5">
            This task management system was developed as part of our BTech internship program. 
            We focused on creating an intuitive platform where administrators can effectively 
            assign, track, and manage tasks across teams.
          </p>
          
          <div className="d-flex align-items-start mb-4">
            <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3">
              <i className="bi bi-diagram-3 fs-2"></i>
            </div>
            <div>
              <h3 className="fw-bold mb-1 text-dark">Admin Capabilities</h3>
              <p className="text-muted mb-3">Comprehensive team management features</p>
            </div>
          </div>
          
          <p className="text-dark mb-3">
            The system provides administrators with powerful tools to:
          </p>
          <ul className="list-unstyled mb-0">
            <li className="mb-3 d-flex align-items-start">
              <i className="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
              <span>Create and assign tasks to team members</span>
            </li>
            <li className="mb-3 d-flex align-items-start">
              <i className="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
              <span>Monitor task progress in real-time</span>
            </li>
            <li className="mb-3 d-flex align-items-start">
              <i className="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
              <span>Manage user roles and permissions</span>
            </li>
            <li className="d-flex align-items-start">
              <i className="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
              <span>Generate performance reports</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    {/* Technology Stack */}
    <div className="row mt-5">
      <div className="col-12">
        <div className="bg-white p-5 rounded-3 shadow-sm">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark">Technology Stack</h3>
            <p className="text-muted">Modern technologies powering our solution</p>
          </div>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <div className="tech-badge d-flex flex-column align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-code-slash fs-3"></i>
              </div>
              <span className="fw-medium">React.js</span>
            </div>
            <div className="tech-badge d-flex flex-column align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-layout-wtf fs-3"></i>
              </div>
              <span className="fw-medium">Bootstrap</span>
            </div>
            <div className="tech-badge d-flex flex-column align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-server fs-3"></i>
              </div>
              <span className="fw-medium">Node.js</span>
            </div>
            <div className="tech-badge d-flex flex-column align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-hdd-stack fs-3"></i>
              </div>
              <span className="fw-medium">Express</span>
            </div>
            <div className="tech-badge d-flex flex-column align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-2" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-database fs-3"></i>
              </div>
              <span className="fw-medium">MongoDB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default Home;