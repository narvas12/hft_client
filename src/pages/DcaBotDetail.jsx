import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import hftBotService from '../services/hftBotService';

const DcaBotDetail = () => {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    hftBotService.getDcaBot(id)
      .then((res) => setBot(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-oxblood-900">
      <div className="text-yellow-400 animate-pulse text-lg">Loading bot details...</div>
    </div>
  );

  if (!bot) return (
    <div className="flex flex-col justify-center items-center h-screen bg-oxblood-900 text-center p-6">
      <div className="text-yellow-500 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-300 mb-2">Bot Not Found</h2>
      <p className="text-gray-400 mb-6">The requested bot could not be found in the system.</p>
      <Link 
        to="/bots" 
        className="bg-yellow-500 hover:bg-yellow-600 text-oxblood-900 font-semibold py-2 px-6 rounded-lg transition duration-200"
      >
        Back to Bots List
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-oxblood-900 text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-1">{bot.name}</h1>
            <div className="flex items-center">
              <span className={`px-3 py-1 text-sm rounded-full mr-3 
                ${bot.is_enabled ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                {bot.is_enabled ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm text-gray-400">ID: {bot.id}</span>
            </div>
          </div>
          <Link 
            to="/bots" 
            className="flex items-center text-yellow-500 hover:text-yellow-400 transition duration-200"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </Link>
        </div>

        <div className="bg-oxblood-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-400 mb-4 border-b border-oxblood-700 pb-2">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailItem 
                icon="currency-exchange"
                label="Trading Pairs"
                value={bot.pairs.join(', ')}
              />
              <DetailItem 
                icon="account-balance"
                label="Account"
                value={bot.account_name}
              />
              <DetailItem 
                icon="strategy"
                label="Strategy"
                value={bot.strategy_list.map(s => s.strategy).join(', ')}
              />
            </div>
            <div className="space-y-4">
              <DetailItem 
                icon="layers"
                label="Base Order Volume"
                value={bot.base_order_volume}
              />
              <DetailItem 
                icon="safety-check"
                label="Safety Order Volume"
                value={bot.safety_order_volume}
              />
              <DetailItem 
                icon="trending-up"
                label="Take Profit %"
                value={bot.take_profit}
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-oxblood-900 font-semibold py-2 px-6 rounded-lg transition duration-200">
            {bot.is_enabled ? 'Pause Bot' : 'Activate Bot'}
          </button>
          <button className="bg-oxblood-700 hover:bg-oxblood-600 text-yellow-500 font-semibold py-2 px-6 rounded-lg border border-yellow-500 transition duration-200">
            Edit Configuration
          </button>
          <button className="bg-red-900 hover:bg-red-800 text-red-200 font-semibold py-2 px-6 rounded-lg transition duration-200">
            Delete Bot
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => {
  const getIconPath = () => {
    switch(icon) {
      case 'currency-exchange':
        return "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'account-balance':
        return "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z";
      case 'strategy':
        return "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z";
      case 'layers':
        return "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25";
      case 'safety-check':
        return "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z";
      case 'trending-up':
        return "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941";
      default:
        return "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z";
    }
  };

  return (
    <div className="flex items-start">
      <div className="bg-oxblood-700 p-2 rounded-lg mr-4">
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={getIconPath()} />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-400">{label}</h3>
        <p className="text-lg font-semibold text-gray-100">{value}</p>
      </div>
    </div>
  );
};

export default DcaBotDetail;