import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { buildAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Builds = () => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBuild, setEditingBuild] = useState(null);
  const [formData, setFormData] = useState({ version: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      const response = await buildAPI.getAll();
      setBuilds(response.data);
    } catch (error) {
      toast.error('Failed to fetch builds');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBuild) {
        await buildAPI.update(editingBuild.id, formData);
        toast.success('Build updated successfully');
      } else {
        await buildAPI.create(formData);
        toast.success('Build created successfully');
      }
      setShowModal(false);
      setFormData({ version: '', description: '' });
      setEditingBuild(null);
      fetchBuilds();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (build) => {
    setEditingBuild(build);
    setFormData({ version: build.version, description: build.description });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this build?')) {
      try {
        await buildAPI.delete(id);
        toast.success('Build deleted successfully');
        fetchBuilds();
      } catch (error) {
        toast.error('Failed to delete build');
      }
    }
  };

  const canModify = user?.role === 'ADMIN' || user?.role === 'TESTER';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Builds</h1>
          {canModify && (
            <button
              onClick={() => {
                setEditingBuild(null);
                setFormData({ version: '', description: '' });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              + New Build
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  {canModify && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {builds.map((build) => (
                  <tr key={build.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{build.version}</td>
                    <td className="px-6 py-4 text-gray-600">{build.description}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(build.createdAt).toLocaleDateString()}</td>
                    {canModify && (
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(build)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        {user?.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDelete(build.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
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
              <h2 className="text-2xl font-bold mb-6">{editingBuild ? 'Edit Build' : 'New Build'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                  <input
                    type="text"
                    required
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
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
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                  >
                    {editingBuild ? 'Update' : 'Create'}
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
      </div>
    </Layout>
  );
};

export default Builds;
