import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { testCaseAPI, buildAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BuildComparison = () => {
  const [builds, setBuilds] = useState([]);
  const [build1Id, setBuild1Id] = useState('');
  const [build2Id, setBuild2Id] = useState('');
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(false);
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
    }
  };

  const handleCompare = async () => {
    if (!build1Id || !build2Id) {
      toast.error('Please select both builds');
      return;
    }
    if (build1Id === build2Id) {
      toast.error('Please select different builds');
      return;
    }

    setLoading(true);
    try {
      const response = await testCaseAPI.compare(build1Id, build2Id);
      setComparison(response.data);
      toast.success('Comparison completed');
    } catch (error) {
      toast.error('Failed to compare builds');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChangeColor = (change) => {
    if (change === 'REGRESSION') return 'bg-red-100 text-red-800';
    if (change === 'FIXED') return 'bg-green-100 text-green-800';
    if (change === 'CHANGED') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const stats = comparison.reduce((acc, item) => {
    if (item.statusChange === 'REGRESSION') acc.regressions++;
    if (item.statusChange === 'FIXED') acc.fixed++;
    if (item.statusChange === 'SAME') acc.same++;
    return acc;
  }, { regressions: 0, fixed: 0, same: 0 });

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Build Comparison</h1>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Builds to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Build 1</label>
              <select
                value={build1Id}
                onChange={(e) => setBuild1Id(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Build 1</option>
                {builds.map((build) => (
                  <option key={build.id} value={build.id}>
                    {build.version}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Build 2</label>
              <select
                value={build2Id}
                onChange={(e) => setBuild2Id(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Build 2</option>
                {builds.map((build) => (
                  <option key={build.id} value={build.id}>
                    {build.version}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCompare}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Comparing...' : 'Compare'}
              </button>
            </div>
          </div>
        </div>

        {comparison.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Regressions</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.regressions}</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-full">
                    <span className="text-3xl">⚠️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Fixed</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.fixed}</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-full">
                    <span className="text-3xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Unchanged</p>
                    <p className="text-3xl font-bold text-gray-600 mt-2">{stats.same}</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-full">
                    <span className="text-3xl">➖</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Case</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Build 1 Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Build 2 Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration Δ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparison.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.testCaseName}</td>
                      <td className="px-6 py-4 text-gray-600">{item.module}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.build1Status === 'PASS' ? 'bg-green-100 text-green-800' : 
                          item.build1Status === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.build1Status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.build2Status === 'PASS' ? 'bg-green-100 text-green-800' : 
                          item.build2Status === 'FAIL' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.build2Status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusChangeColor(item.statusChange)}`}>
                          {item.statusChange}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.durationChange !== null ? (
                          <span className={item.durationChange > 0 ? 'text-red-600' : 'text-green-600'}>
                            {item.durationChange > 0 ? '+' : ''}{item.durationChange.toFixed(2)}s
                          </span>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default BuildComparison;
