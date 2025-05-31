import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import hftBotService from '../services/hftBotService';

const DcaBotDetail = () => {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    hftBotService.getDcaBot(id)
      .then((res) => setBot(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-gray-700 font-medium">Loading bot details...</div>
      </div>
    </div>
  );

  if (!bot) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-center p-6">
      <div className="bg-red-100 p-6 rounded-full mb-6">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Bot Not Found</h2>
      <p className="text-gray-600 mb-6 max-w-md">The requested bot could not be found in the system. Please check the ID or return to the bots list.</p>
      <Link 
        to="/bots" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Bots List
      </Link>
    </div>
  );

  const toggleBotStatus = () => {
    // Implement bot status toggle logic
    console.log(`Toggling bot status to ${!bot.is_enabled}`);
  };

  const handleDelete = () => {
    // Implement delete logic
    console.log('Deleting bot');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${bot.is_enabled ? 'bg-green-100' : 'bg-gray-200'}`}>
              <svg className={`w-6 h-6 ${bot.is_enabled ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{bot.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 text-xs rounded-full 
                  ${bot.is_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                  {bot.is_enabled ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">ID: {bot.id}</span>
                <span className="text-xs text-gray-500">Created: {new Date(bot.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/bots" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to List
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('configuration')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'configuration'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Configuration
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'performance'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Performance
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <DetailItem 
                      icon="account-balance"
                      label="Account"
                      value={bot.account_name || 'Not specified'}
                    />
                    <DetailItem 
                      icon="currency-exchange"
                      label="Trading Pairs"
                      value={bot.pairs.join(', ')}
                    />
                    <DetailItem 
                      icon="calendar"
                      label="Created At"
                      value={new Date(bot.created_at).toLocaleString()}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
                  <div className="space-y-4">
                    <DetailItem 
                      icon="activity"
                      label="Active Deals"
                      value={`${bot.active_deals_count} of ${bot.max_active_deals}`}
                    />
                    <DetailItem 
                      icon="check-circle"
                      label="Finished Deals"
                      value={bot.finished_deals_count}
                    />
                    <DetailItem 
                      icon="dollar-sign"
                      label="Total Profit"
                      value={`$${bot.finished_deals_profit_usd} USDT`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'configuration' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Trading Parameters</h2>
                  <div className="space-y-4">
                    <DetailItem 
                      icon="layers"
                      label="Base Order Volume"
                      value={`$${bot.base_order_volume} USDT`}
                    />
                    <DetailItem 
                      icon="safety-check"
                      label="Safety Order Volume"
                      value={`$${bot.safety_order_volume} USDT`}
                    />
                    <DetailItem 
                      icon="trending-up"
                      label="Take Profit"
                      value={`${bot.take_profit}%`}
                    />
                    <DetailItem 
                      icon="shield"
                      label="Stop Loss"
                      value={bot.stop_loss_percentage === "0.0" ? 'Disabled' : `${bot.stop_loss_percentage}%`}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h2>
                  <div className="space-y-4">
                    <DetailItem 
                      icon="settings"
                      label="Strategy"
                      value={bot.strategy_list.map(s => s.strategy).join(', ')}
                    />
                    <DetailItem 
                      icon="repeat"
                      label="Max Safety Orders"
                      value={bot.max_safety_orders}
                    />
                    <DetailItem 
                      icon="clock"
                      label="Cooldown"
                      value={`${bot.cooldown} seconds`}
                    />
                    <DetailItem 
                      icon="zap"
                      label="Martingale Coefficient"
                      value={bot.martingale_volume_coefficient}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                      icon="activity"
                      title="Active Deals"
                      value={bot.active_deals_count}
                      maxValue={bot.max_active_deals}
                    />
                    <StatCard 
                      icon="check-circle"
                      title="Completed Deals"
                      value={bot.finished_deals_count}
                    />
                    <StatCard 
                      icon="dollar-sign"
                      title="Total Profit"
                      value={`$${bot.finished_deals_profit_usd}`}
                      currency="USDT"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Performance analytics</h3>
                      <p className="mt-1 text-sm text-gray-500">Detailed performance charts coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button 
            onClick={toggleBotStatus}
            className={`flex items-center gap-2 font-medium py-2.5 px-6 rounded-lg transition duration-200 ${
              bot.is_enabled 
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={bot.is_enabled ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"}/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {bot.is_enabled ? 'Pause Bot' : 'Activate Bot'}
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEditing ? 'Cancel Editing' : 'Edit Configuration'}
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2.5 px-6 rounded-lg transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Bot
          </button>
        </div>

        {/* Edit Form (Conditional) */}
        {isEditing && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Bot Configuration</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField 
                    label="Bot Name"
                    type="text"
                    value={bot.name}
                    onChange={() => {}}
                  />
                  <FormField 
                    label="Base Order Volume (USDT)"
                    type="number"
                    value={bot.base_order_volume}
                    onChange={() => {}}
                  />
                  <FormField 
                    label="Take Profit (%)"
                    type="number"
                    value={bot.take_profit}
                    onChange={() => {}}
                  />
                </div>
                <div className="space-y-4">
                  <FormField 
                    label="Safety Order Volume (USDT)"
                    type="number"
                    value={bot.safety_order_volume}
                    onChange={() => {}}
                  />
                  <FormField 
                    label="Max Safety Orders"
                    type="number"
                    value={bot.max_safety_orders}
                    onChange={() => {}}
                  />
                  <FormField 
                    label="Stop Loss (%)"
                    type="number"
                    value={bot.stop_loss_percentage === "0.0" ? '' : bot.stop_loss_percentage}
                    onChange={() => {}}
                    placeholder="0 for disabled"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
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
      case 'activity':
        return "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z";
      case 'check-circle':
        return "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'dollar-sign':
        return "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'shield':
        return "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z";
      case 'settings':
        return "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z";
      case 'repeat':
        return "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99";
      case 'clock':
        return "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'zap':
        return "M13 10V3L4 14h7v7l9-11h-7z";
      case 'calendar':
        return "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5";
      default:
        return "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z";
    }
  };

  return (
    <div className="flex items-start">
      <div className="bg-gray-100 p-2 rounded-lg mr-4">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={getIconPath()} />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-base font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, maxValue, currency }) => {
  const getIconPath = () => {
    switch(icon) {
      case 'activity':
        return "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z";
      case 'check-circle':
        return "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case 'dollar-sign':
        return "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      default:
        return "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start">
        <div className="bg-blue-100 p-2 rounded-lg mr-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={getIconPath()} />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}{currency && <span className="text-sm font-normal text-gray-500 ml-1">{currency}</span>}</p>
          {maxValue && (
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${(value / maxValue) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default DcaBotDetail;