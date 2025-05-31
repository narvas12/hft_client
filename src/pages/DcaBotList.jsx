import { useEffect, useState } from 'react';
import hftBotService from '../services/hftBotService';
import { Link } from 'react-router-dom';

const DcaBotList = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    hftBotService.listDcaBots()
      .then((res) => {
        // Ensure the response is an array before setting it
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

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <p className="text-yellow-400 animate-pulse">Loading bots...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-oxblood-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-oxblood-800 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-300">{error}</h3>
          </div>
          <p className="mt-2 text-gray-300">Please try again later or contact support.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-oxblood-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">DCA Bots</h1>
          <Link 
            to="/bots/create" 
            className="bg-yellow-500 hover:bg-yellow-600 text-oxblood-900 font-semibold py-2 px-4 rounded transition duration-200"
          >
            Create New Bot
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => (
            <div 
              key={bot.id} 
              className={`p-5 rounded-lg shadow-lg transition-transform hover:scale-105 
                ${bot.is_enabled ? 'border-l-4 border-yellow-500 bg-oxblood-800' : 'border-l-4 border-gray-600 bg-oxblood-950'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-yellow-400">{bot.name}</h2>
                <span className={`px-2 py-1 text-xs rounded-full 
                  ${bot.is_enabled ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                  {bot.is_enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">Pairs:</span>
                  <span className="ml-2 text-gray-300">
                    {Array.isArray(bot.pairs) ? bot.pairs.join(', ') : bot.pairs}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Account:</span>
                  <span className="ml-2 text-gray-300">{bot.account_name}</span>
                </div>
              </div>
              
              <Link 
                to={`/bots/${bot.id}`} 
                className="mt-4 inline-flex items-center text-yellow-500 hover:text-yellow-400 transition duration-200"
              >
                View Details
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {bots.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-yellow-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300">No DCA Bots Found</h3>
            <p className="text-gray-500 mt-2">Create your first bot to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DcaBotList;