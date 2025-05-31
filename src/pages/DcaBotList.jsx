import { useEffect, useState } from 'react';
import hftBotService from '../services/hftBotService';
import { Link } from 'react-router-dom';

const DcaBotList = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    hftBotService.listDcaBots()
      .then((res) => {
        if (Array.isArray(res)) {
          setBots(res);
        } else {
          console.error('Unexpected response format:', res);
          setError('Received unexpected data format from server');
          setBots([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load bots');
        setBots([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBots = [...bots].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredBots = sortedBots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(bot.pairs) ? bot.pairs.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) : 
    bot.pairs.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-xl font-medium text-gray-800">{error}</h3>
              <p className="mt-1 text-gray-600">Please try refreshing the page or contact support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with search and create button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">DCA Trading Bots</h1>
            <p className="text-gray-600 mt-1">Manage your automated trading strategies</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bots..."
                className="bg-white border border-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Link 
              to="/bots/create" 
              className="bg-indigo-600 hover:bg-indigo-900 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Bot
            </Link>
          </div>
        </div>

        {/* Sort controls */}
        <div className="mb-4 flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button 
            onClick={() => requestSort('name')}
            className={`text-sm px-3 py-1 rounded ${sortConfig.key === 'name' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => requestSort('is_enabled')}
            className={`text-sm px-3 py-1 rounded ${sortConfig.key === 'is_enabled' ? 'bg-indigo-100 text-indigo-900' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Status {sortConfig.key === 'is_enabled' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
          </button>
        </div>

        {/* Bot Cards Grid */}
        {filteredBots.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBots.map((bot) => (
              <Link 
                to={`/bots/detail/${bot.id}`} 
                key={bot.id} 
                className="group relative bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-indigo-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[70%]">{bot.name}</h2>
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium
                    ${bot.is_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {bot.is_enabled ? 'Active' : 'Paused'}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <div className="bg-indigo-50 p-1.5 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pairs</p>
                      <p className="text-gray-700 font-medium">
                        {Array.isArray(bot.pairs) ? bot.pairs.join(', ') : bot.pairs}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-indigo-50 p-1.5 rounded-lg mr-3">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Account</p>
                      <p className="text-gray-700 font-medium">{bot.account_name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-900 transition duration-200 font-medium">
                  <span>View Details</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-indigo-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-800 mb-2">No Bots Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No bots match your search' : 'You currently have no trading bots'}
            </p>
            <Link 
              to="/bots/create" 
              className="bg-indigo-600 hover:bg-indigo-900 text-white font-medium py-2 px-6 rounded-lg transition duration-200 inline-flex items-center shadow-sm"
            >
              Create Your First Bot
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DcaBotList;