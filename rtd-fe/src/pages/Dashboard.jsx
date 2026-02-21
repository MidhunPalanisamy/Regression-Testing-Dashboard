import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  const pieData = [
    { name: 'Passed', value: stats?.passedTests || 0, color: '#10b981' },
    { name: 'Failed', value: stats?.failedTests || 0, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Total Builds', value: stats?.totalBuilds || 0 },
    { name: 'Total Tests', value: stats?.totalTestCases || 0 },
    { name: 'Passed', value: stats?.passedTests || 0 },
    { name: 'Failed', value: stats?.failedTests || 0 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Builds</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalBuilds || 0}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <span className="text-3xl">🏗️</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Test Cases</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalTestCases || 0}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <span className="text-3xl">📝</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Passed Tests</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats?.passedTests || 0}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <span className="text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Failed Tests</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats?.failedTests || 0}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-full">
                <span className="text-3xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pass Percentage</h2>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-8">
              <div
                className="bg-green-500 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ width: `${stats?.passPercentage || 0}%` }}
              >
                {stats?.passPercentage?.toFixed(1) || 0}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Test Results Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pass/Fail Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
