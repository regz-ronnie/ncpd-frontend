import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogisticList from './components/LogisticList';
import LogisticForm from './components/LogisticForm';
import MonthlyView from './components/MonthlyView';
import EditView from './components/EditView';
import Footer from './components/Footer';
import api from './services/api';

function Home() {
  const [logistics, setLogistics] = useState([]);
  const [showLogisticForm, setShowLogisticForm] = useState(false);
  const [editingLogistic, setEditingLogistic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchLogistics();
  }, []);

  const fetchLogistics = async () => {
    try {
      const response = await api.get('/api/logistics/');
      setLogistics(response.data);
    } catch (error) {
      console.error('Error fetching logistics:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleAddLogistic = () => {
    setEditingLogistic(null);
    setShowLogisticForm(true);
  };

  const handleEditLogistic = (logistic) => {
    setEditingLogistic(logistic);
    setShowLogisticForm(true);
  };

  const handleLogisticSubmit = async (logisticData) => {
    try {
      console.log('Submitting logistic:', logisticData);
      
      if (editingLogistic) {
        // Update existing logistic
        const response = await api.put(`/api/logistics/${editingLogistic.id}/`, logisticData);
        console.log('Update response:', response.data);
      } else {
        // Create new logistic
        const response = await api.post('/api/logistics/', logisticData);
        console.log('Create response:', response.data);
      }
      
      // Reset form state
      setShowLogisticForm(false);
      setEditingLogistic(null);
      
      // Refresh logistics list
      await fetchLogistics();
    } catch (error) {
      console.error('Error saving logistic:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Error saving logistic. Please try again.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        }
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteLogistic = async (id) => {
    if (window.confirm('Are you sure you want to delete this logistic?')) {
      try {
        await api.delete(`/api/logistics/${id}/`);
        fetchLogistics();
      } catch (error) {
        console.error('Error deleting logistic:', error);
        alert('Error deleting logistic. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/api/logistics/${id}/update_status/`, { status });
      fetchLogistics();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const filteredLogistics = logistics.filter(logistic => {
    const typeMatch = filterType === 'all' || logistic.logistic_type === filterType;
    const statusMatch = filterStatus === 'All' || logistic.status === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Main Header */}
          <div className="main-header">
            <div className="main-header-content">
              <div className="main-header-left">
                <div className="main-header-logo">
                  <img src={`${process.env.PUBLIC_URL}/ncpd-logo.png`} alt="NCPD Logo" className="logo-image" />
                  <div className="logo-text">
                    <div className="logo-main-text">National Council for Population and Development</div>
                  </div>
                </div>
                <div className="main-header-title">
                  <h1>NCPD NOTICE BOARD</h1>
                </div>
              </div>
              <div className="main-header-right">
              </div>
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="nav-tabs-container">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('home');
                    setShowLogisticForm(false);
                    setEditingLogistic(null);
                  }}
                >
                  <i className="fas fa-home me-1"></i>Home
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
                  onClick={() => setActiveTab('monthly')}
                >
                  <i className="fas fa-calendar-alt me-1"></i>Monthly View
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                >
                  <i className="fas fa-edit me-1"></i>Edit
                </button>
              </li>
            </ul>
            <div className="nav-right-items">
              <a href="#" className="nav-action">
                <i className="fas fa-star"></i>
                Not following
              </a>
              <a href="#" className="nav-action">
                <i className="fas fa-globe"></i>
                Site access
              </a>
            </div>
          </div>

          {/* Home Tab Content */}
          {activeTab === 'home' && (
            <div>
              {/* Content Header */}
              <div className="content-header">
                <h2 className="content-title">Logistics</h2>
              </div>
              
              {/* Command Bar - Hide on monthly view */}
              {activeTab !== 'monthly' && (
                <div className="command-bar">
                  <div className="command-bar-left">
                    <button className="btn btn-primary" onClick={handleAddLogistic}>
                      <i className="fas fa-truck me-2"></i> Add Logistic
                    </button>
                  </div>
                  <div className="command-bar-right">
                    <button className="btn btn-icon" title="New" onClick={handleAddLogistic}>
                      <i className="fas fa-plus"></i>
                    </button>
                    <div className="btn-icon-separator"></div>
                    <button className="btn btn-icon" title="Edit" onClick={() => {
                      if (logistics.length > 0) {
                        const firstLogistic = logistics[0];
                        handleEditLogistic(firstLogistic);
                      }
                    }}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-icon" title="Delete" onClick={() => {
                      if (logistics.length > 0) {
                        const firstLogistic = logistics[0];
                        handleDeleteLogistic(firstLogistic.id);
                      }
                    }}>
                      <i className="fas fa-trash"></i>
                    </button>
                    <div className="btn-icon-separator"></div>
                    <button className="btn btn-icon" title="Export" onClick={() => {
                      const dataStr = JSON.stringify(logistics, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                      const exportFileDefaultName = 'logistics_export.json';
                      const linkElement = document.createElement('a');
                      linkElement.setAttribute('href', dataUri);
                      linkElement.setAttribute('download', exportFileDefaultName);
                      linkElement.click();
                    }}>
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="btn btn-icon" title="Settings" onClick={() => {
                      alert('Settings functionality coming soon!');
                    }}>
                      <i className="fas fa-cog"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Logistic Form - SharePoint Style */}
              {showLogisticForm && (
                <div className="page-content">
                  <div className="page-header">
                    <h1 className="page-title">
                      {editingLogistic ? 'Edit Logistic' : 'Add Logistic'}
                    </h1>
                  </div>
                  <LogisticForm
                    show={true}
                    onHide={() => {
                      setShowLogisticForm(false);
                      setEditingLogistic(null);
                    }}
                    onSubmit={handleLogisticSubmit}
                    editingLogistic={editingLogistic}
                    inline={true}
                  />
                </div>
              )}

              {/* Filters Section - Only show when not displaying forms */}
              {!showLogisticForm && (
                <div className="filters-section mb-4">
                  <div className="row">
                    <div className="col-md-3">
                      <label className="filter-label">From</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="filter-label">To</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="filter-label">Category</label>
                      <select 
                        className="form-control"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="board_meeting">Board Meeting</option>
                        <option value="book_launch">Book Launch</option>
                        <option value="conference">Conference</option>
                        <option value="research_activity">Research Activity</option>
                        <option value="smt_meeting">SMT Meeting</option>
                        <option value="staff_meeting">Staff Meeting</option>
                        <option value="training">Training</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="filter-label">Status</label>
                      <select 
                        className="form-control"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All</option>
                        <option value="available">Available</option>
                        <option value="in_use">In Use</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Logistics List - Only show when not displaying forms */}
              {!showLogisticForm && (
                <LogisticList
                  logistics={filteredLogistics}
                  loading={loading}
                  onEdit={handleEditLogistic}
                  onDelete={handleDeleteLogistic}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
            </div>
          )}

          {/* Monthly Tab Content */}
          {activeTab === 'monthly' && (
            <MonthlyView setActiveTab={setActiveTab} />
          )}

          {/* Edit Tab Content */}
          {activeTab === 'edit' && (
            <EditView />
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <div className="App">
        <style>{`
          /* Dropdown arrow visibility fix */
          .form-control {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 16px;
            padding-right: 32px !important;
          }
          
          .form-control::-ms-expand {
            display: none;
          }
          
          .form-control:focus {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2328a745' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          }
          
          /* Calendar date picker styling */
          input[type="date"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2328a745' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3e%3c/rect%3e%3cline x1='16' y1='2' x2='16' y2='6'%3e%3c/line%3e%3cline x1='8' y1='2' x2='8' y2='6'%3e%3c/line%3e%3cline x1='3' y1='10' x2='21' y2='10'%3e%3c/line%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 18px;
            padding-right: 32px !important;
            cursor: pointer;
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator {
            opacity: 0;
            cursor: pointer;
          }
          
          input[type="date"]::-moz-calendar-picker-indicator {
            opacity: 0;
            cursor: pointer;
          }
          
          input[type="date"]::-ms-calendar-picker-indicator {
            opacity: 0;
            cursor: pointer;
          }
          
          input[type="date"]:focus {
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2328a745' stroke='%2328a745' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3e%3c/rect%3e%3cline x1='16' y1='2' x2='16' y2='6'%3e%3c/line%3e%3cline x1='8' y1='2' x2='8' y2='6'%3e%3c/line%3e%3cline x1='3' y1='10' x2='21' y2='10'%3e%3c/line%3e%3c/svg%3e");
            border-color: #28a745;
            box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
          }
          
          input[type="date"]:hover {
            border-color: #28a745;
          }
        `}</style>
        <div className="container-fluid">
          <Home activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
