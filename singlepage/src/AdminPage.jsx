import React, { useState, useEffect, useMemo } from 'react';
import { login, getInviteRequests } from './api/subscribe';
import { jwtDecode } from 'jwt-decode';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteRequests, setInviteRequests] = useState([]);
  const [dataError, setDataError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Check for existing token on mount and validate
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);
          setShowModal(true);
          return;
        }
        if (decoded.role === 'Admin') {
          setIsLoggedIn(true);
          setShowModal(false);
        } else {
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);
          setShowModal(true);
        }
      } catch (err) {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setShowModal(true);
      }
    } else {
      setIsLoggedIn(false);
      setShowModal(true);
    }
  }, []);

  // Fetch invite requests after login
  useEffect(() => {
    const fetchInviteRequests = async () => {
      const token = localStorage.getItem('authToken');
      if (token && isLoggedIn) {
        try {
          const response = await getInviteRequests(token);
          setInviteRequests(response.inviteRequests);
          setDataError('');
        } catch (err) {
          setDataError(err.message || 'Failed to load invite requests.');
        }
      }
    };

    fetchInviteRequests();
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      const token = response.token;
      const decoded = jwtDecode(token);

      if (decoded.role !== 'Admin') {
        throw new Error('Access denied: Admin role required');
      }

      localStorage.setItem('authToken', token);
      setIsLoggedIn(true);
      setShowModal(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setShowModal(true);
    setEmail('');
    setPassword('');
    setInviteRequests([]);
    setDataError('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Search logic
  const filteredRequests = useMemo(() => {
    return inviteRequests.filter(row => {
      const searchLower = searchTerm.toLowerCase();
      return (
        String(row.FullName || '').toLowerCase().includes(searchLower) ||
        String(row.Email || '').toLowerCase().includes(searchLower) ||
        String(row.Source || '').toLowerCase().includes(searchLower) ||
        String(row.Status || '').toLowerCase().includes(searchLower)
      );
    });
  }, [inviteRequests, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / pageSize);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Admin Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table Content - Only shown when logged in */}
      {isLoggedIn && (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Admin Dashboard</h1>
          
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {dataError && <p className="text-red-500 mb-6 text-center">{dataError}</p>}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Note
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Last Email At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Invited At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRequests.map((row) => (
                    <tr key={row.Id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{row.Id}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium text-center">
                        {row.FullName || '-'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{row.Email}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{row.Source || '-'}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">{row.Status || '-'}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">{row.Note || '-'}</td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                        {row.CreatedAt ? new Date(row.CreatedAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                        {row.UpdatedAt ? new Date(row.UpdatedAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                        {row.LastEmailAt ? new Date(row.LastEmailAt).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                        {row.InvitedAt ? new Date(row.InvitedAt).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition-colors duration-200"
                title="Previous Page"
              >
                <FaArrowLeft size={20} />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({filteredRequests.length} total records)
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-700 transition-colors duration-200"
                title="Next Page"
              >
                <FaArrowRight size={20} />
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-8 w-full sm:w-auto bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPage;