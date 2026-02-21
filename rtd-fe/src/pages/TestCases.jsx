import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { testCaseAPI, buildAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TestCases = () => {
  const [testCases, setTestCases] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importBuildId, setImportBuildId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'PENDING',
    buildId: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testCasesRes, buildsRes] = await Promise.all([
        testCaseAPI.getAll(),
        buildAPI.getAll(),
      ]);
      setTestCases(testCasesRes.data);
      setBuilds(buildsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestCase) {
        await testCaseAPI.update(editingTestCase.id, formData);
        toast.success('Test case updated successfully');
      } else {
        await testCaseAPI.create(formData);
        toast.success('Test case created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', description: '', status: 'PENDING', buildId: '' });
      setEditingTestCase(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!selectedFile || !importBuildId) {
      toast.error('Please select a file and build');
      return;
    }

    try {
      const response = await testCaseAPI.import(importBuildId, selectedFile);
      toast.success(`Imported ${response.data.length} test cases successfully`);
      setShowImportModal(false);
      setSelectedFile(null);
      setImportBuildId('');
      fetchData();
    } catch (error) {
      console.error('Import error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Import failed';
      toast.error(errorMsg);
    }
  };

  const handleEdit = (testCase) => {
    setEditingTestCase(testCase);
    setFormData({
      name: testCase.name,
      description: testCase.description,
      status: testCase.status,
      buildId: testCase.build?.id || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      try {
        await testCaseAPI.delete(id);
        toast.success('Test case deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete test case');
      }
    }
  };

  const canModify = user?.role === 'ADMIN' || user?.role === 'TESTER';

  const getStatusColor = (status) => {
    const colors = {
      PASS: 'bg-green-100 text-green-800',
      FAIL: 'bg-red-100 text-red-800',
      BLOCKED: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Test Cases</h1>
          <div className="space-x-3">
            {canModify && (
              <>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                >
                  📁 Import CSV/JSON
                </button>
                <button
                  onClick={() => {
                    setEditingTestCase(null);
                    setFormData({ name: '', description: '', status: 'PENDING', buildId: '' });
                    setShowModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  + New Test Case
                </button>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Build</th>
                  {canModify && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testCases.map((testCase) => (
                  <tr key={testCase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{testCase.name}</td>
                    <td className="px-6 py-4 text-gray-600">{testCase.module || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(testCase.status)}`}>
                        {testCase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{testCase.duration ? `${testCase.duration}s` : 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{testCase.build?.version || 'N/A'}</td>
                    {canModify && (
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(testCase)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(testCase.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">{editingTestCase ? 'Edit Test Case' : 'New Test Case'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PASS">Pass</option>
                    <option value="FAIL">Fail</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Build</label>
                  <select
                    value={formData.buildId}
                    onChange={(e) => setFormData({ ...formData, buildId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Build</option>
                    {builds.map((build) => (
                      <option key={build.id} value={build.id}>
                        {build.version}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    {editingTestCase ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Import Test Results</h2>
              <form onSubmit={handleImport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Build</label>
                  <select
                    value={importBuildId}
                    onChange={(e) => setImportBuildId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Build</option>
                    {builds.map((build) => (
                      <option key={build.id} value={build.id}>
                        {build.version}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File (CSV or JSON)</label>
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">Supported formats: CSV, JSON</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                  >
                    Import
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportModal(false);
                      setSelectedFile(null);
                      setImportBuildId('');
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestCases;
