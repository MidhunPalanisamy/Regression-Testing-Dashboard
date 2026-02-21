import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { regressionAPI, buildAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RegressionRuns = () => {
  const [runs, setRuns] = useState([]);
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuildId, setSelectedBuildId] = useState('');
  const [executing, setExecuting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [runsRes, buildsRes] = await Promise.all([
        regressionAPI.getAll(),
        buildAPI.getAll(),
      ]);
      setRuns(runsRes.data);
      setBuilds(buildsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!selectedBuildId) {
      toast.error('Please select a build');
      return;
    }

    setExecuting(true);
    try {
      await regressionAPI.execute(selectedBuildId);
      toast.success('Regression run executed successfully');
      setSelectedBuildId('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const canExecute = user?.role === 'ADMIN' || user?.role === 'TESTER';

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Regression Runs</h1>

        {canExecute && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Execute Regression Run</h2>
            <div className="flex space-x-4">
              <select
                value={selectedBuildId}
                onChange={(e) => setSelectedBuildId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Build</option>
                {builds.map((build) => (
                  <option key={build.id} value={build.id}>
                    {build.version}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExecute}
                disabled={executing || !selectedBuildId}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {executing ? 'Executing...' : 'Execute Run'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Build</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pass Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Executed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {runs.map((run) => {
                  const passRate = run.totalTests > 0 ? ((run.passed / run.totalTests) * 100).toFixed(1) : 0;
                  return (
                    <tr key={run.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{run.build?.version}</td>
                      <td className="px-6 py-4 text-gray-600">{run.totalTests}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{run.passed}</td>
                      <td className="px-6 py-4 text-red-600 font-semibold">{run.failed}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          passRate >= 80 ? 'bg-green-100 text-green-800' :
                          passRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {passRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(run.executedAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RegressionRuns;
