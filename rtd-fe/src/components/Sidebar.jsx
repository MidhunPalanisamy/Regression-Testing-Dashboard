import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'TESTER', 'VIEWER'] },
    { path: '/builds', label: 'Builds', icon: '🏗️', roles: ['ADMIN', 'TESTER', 'VIEWER'] },
    { path: '/testcases', label: 'Test Cases', icon: '📝', roles: ['ADMIN', 'TESTER', 'VIEWER'] },
    { path: '/comparison', label: 'Build Comparison', icon: '🔍', roles: ['ADMIN', 'TESTER', 'VIEWER'] },
    { path: '/regression', label: 'Regression Runs', icon: '🔄', roles: ['ADMIN', 'TESTER', 'VIEWER'] },
    { path: '/users', label: 'User Management', icon: '👥', roles: ['ADMIN'] },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">RTD</h1>
        <p className="text-sm text-gray-400 mt-1">Regression Testing Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => 
          item.roles.includes(user?.role) && (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        )}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="mb-3">
          <p className="text-sm font-medium">{user?.username}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
