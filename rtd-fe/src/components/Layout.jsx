import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
