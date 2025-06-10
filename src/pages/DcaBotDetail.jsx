import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import hftBotService from '../services/hftBotService';
import { toast } from 'react-toastify';

const DcaBotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showActiveDeals, setShowActiveDeals] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchBot();

    const interval = setInterval(() => {
      fetchBot();
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);


  const fetchBot = () => {
    setLoading(true);
    hftBotService.getDcaBot(id)
      .then((res) => setBot(res))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load bot details');
      })
      .finally(() => setLoading(false));
  };

  const toggleBotStatus = async () => {
    if (!bot) return;
    setStatusLoading(true);
    try {
      if (bot.is_enabled) {
        await hftBotService.disableDcaBot(bot.id);
        toast.success('Bot paused successfully');
      } else {
        await hftBotService.enableDcaBot(bot.id);
        toast.success('Bot activated successfully');
      }
      // Refresh bot data after status change
      await fetchBot();
    } catch (err) {
      console.error('Error toggling bot status:', err);
      toast.error(`Failed to ${bot.is_enabled ? 'pause' : 'activate'} bot: ${err.message}`);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bot) return;
    if (!window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await hftBotService.deleteDcaBot(bot.id);
      toast.success('Bot deleted successfully');
      // Redirect to bots list after successful deletion
      navigate('/bots');
    } catch (err) {
      console.error('Error deleting bot:', err);
      toast.error('Failed to delete bot');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  };

  const formatPercentage = (value) => {
    return parseFloat(value).toFixed(2) + '%';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

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
      <button
        onClick={() => navigate('/bots/list')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center"
      >

        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Bots List
      </button>
    </div>
  );

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
                <span className="text-xs text-gray-500">Created: {formatDate(bot.created_at)}</span>
                <span className="text-xs text-gray-500">Strategy: {bot.strategy_list[0].strategy}</span>
                <span className="text-xs text-gray-500">Strategy: {bot.strategy}</span>
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
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('configuration')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'configuration'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Configuration
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'performance'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'events'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Events
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
                      value={formatDate(bot.created_at)}
                    />
                    <DetailItem
                      icon="update"
                      label="Last Updated"
                      value={formatDate(bot.updated_at)}
                    />
                    <DetailItem
                      icon="strategy"
                      label="Strategy"
                      value={bot.strategy_list.map(s => s.strategy).join(', ')}
                    />
                    <DetailItem
                      icon="market"
                      label="Market Type"
                      value={bot.active_deals?.[0]?.market_type || 'spot'}
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
                      value={`$${formatCurrency(bot.finished_deals_profit_usd)} USDT`}
                    />
                    <DetailItem
                      icon="profit"
                      label="Active Deals Profit"
                      value={`$${formatCurrency(bot.active_deals_usd_profit)}`}
                    />
                    <DetailItem
                      icon="reinvest"
                      label="Reinvesting Percentage"
                      value={formatPercentage(bot.reinvesting_percentage)}
                    />
                    <button
                      onClick={() => setShowActiveDeals(!showActiveDeals)}
                      className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200 text-sm font-medium"
                    >
                      {showActiveDeals ? 'Hide Active Deals' : 'View Active Deals'}
                    </button>
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
                      value={`$${formatCurrency(bot.base_order_volume)} ${bot.base_order_volume_type === 'quote_currency' ? 'USDT' : bot.pairs[0].split('_')[1]}`}
                    />
                    <DetailItem
                      icon="safety-check"
                      label="Safety Order Volume"
                      value={`$${formatCurrency(bot.safety_order_volume)} ${bot.safety_order_volume_type === 'quote_currency' ? 'USDT' : bot.pairs[0].split('_')[1]}`}
                    />
                    <DetailItem
                      icon="trending-up"
                      label="Take Profit"
                      value={formatPercentage(bot.take_profit)}
                    />
                    <DetailItem
                      icon="shield"
                      label="Stop Loss"
                      value={bot.stop_loss_percentage === "0.0" ? 'Disabled' : formatPercentage(bot.stop_loss_percentage)}
                    />
                    <DetailItem
                      icon="steps"
                      label="Safety Order Step"
                      value={formatPercentage(bot.safety_order_step_percentage)}
                    />
                    <DetailItem
                      icon="cooldown"
                      label="Cooldown"
                      value={`${bot.cooldown} seconds`}
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
                      icon="active-orders"
                      label="Active Safety Orders"
                      value={bot.active_safety_orders_count}
                    />
                    <DetailItem
                      icon="martingale"
                      label="Martingale Volume Coefficient"
                      value={bot.martingale_volume_coefficient}
                    />
                    <DetailItem
                      icon="martingale-step"
                      label="Martingale Step Coefficient"
                      value={bot.martingale_step_coefficient}
                    />
                    <DetailItem
                      icon="risk"
                      label="Risk Reduction Percentage"
                      value={formatPercentage(bot.risk_reduction_percentage)}
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
                      value={`$${formatCurrency(bot.finished_deals_profit_usd)}`}
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

            {activeTab === 'events' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bot Events</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  {bot.bot_events.map((event, index) => (
                    <div key={index} className="py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-800">{event.message}</p>
                        <span className="text-xs text-gray-500">{formatDate(event.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Deals Section */}
        {showActiveDeals && bot.active_deals && bot.active_deals.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Deals</h2>
              {bot.active_deals.map((deal, index) => (
                <div key={deal.id} className="mb-6 last:mb-0 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">
                      Deal #{index + 1}: {deal.pair} ({deal.status})
                    </h3>
                    <span className="text-sm text-gray-500">
                      Created: {formatDate(deal.created_at)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Buy Details</h4>
                      <p className="text-sm">
                        Amount: {formatCurrency(deal.bought_amount)} {deal.to_currency}
                      </p>
                      <p className="text-sm">
                        Volume: ${formatCurrency(deal.bought_volume)}
                      </p>
                      <p className="text-sm">
                        Avg Price: ${formatCurrency(deal.bought_average_price)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Profit/Loss</h4>
                      <p className={`text-sm ${deal.actual_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Current: ${formatCurrency(deal.actual_usd_profit)} ({formatPercentage(deal.actual_profit_percentage)})
                      </p>
                      <p className="text-sm">
                        Projected: ${formatCurrency(deal.usd_final_profit)}
                      </p>
                      <p className="text-sm">
                        Take Profit: ${formatCurrency(deal.take_profit_price)} ({formatPercentage(deal.take_profit)})
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Current Status</h4>
                      <p className="text-sm">
                        Current Price: ${formatCurrency(deal.current_price)}
                      </p>
                      <p className="text-sm">
                        Safety Orders: {deal.current_active_safety_orders_count}/{deal.max_safety_orders}
                      </p>
                      <p className="text-sm">
                        {deal.cancellable ? 'Cancellable' : 'Not cancellable'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Order Steps</h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Base: ${formatCurrency(deal.base_order_average_price)}
                      </div>
                      {deal.crypto_widget?.buySteps?.map((step, i) => (
                        <div key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          SO {i + 1}: ${formatCurrency(step.price)} ({step.filled || '0%'})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={toggleBotStatus}
            disabled={statusLoading}
            className={`flex items-center gap-2 font-medium py-2.5 px-6 rounded-lg transition duration-200 ${bot.is_enabled
                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
              } disabled:opacity-70`}
          >
            {statusLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {bot.is_enabled ? 'Pausing...' : 'Activating...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={bot.is_enabled ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {bot.is_enabled ? 'Pause Bot' : 'Activate Bot'}
              </>
            )}
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEditing ? 'Cancel Editing' : 'Edit Configuration'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2.5 px-6 rounded-lg transition duration-200 disabled:opacity-70"
          >
            {deleteLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Bot
              </>
            )}
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
                    onChange={() => { }}
                  />
                  <FormField
                    label="Base Order Volume (USDT)"
                    type="number"
                    value={bot.base_order_volume}
                    onChange={() => { }}
                  />
                  <FormField
                    label="Take Profit (%)"
                    type="number"
                    value={bot.take_profit}
                    onChange={() => { }}
                  />
                  <FormField
                    label="Safety Order Step (%)"
                    type="number"
                    value={bot.safety_order_step_percentage}
                    onChange={() => { }}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    label="Safety Order Volume (USDT)"
                    type="number"
                    value={bot.safety_order_volume}
                    onChange={() => { }}
                  />
                  <FormField
                    label="Max Safety Orders"
                    type="number"
                    value={bot.max_safety_orders}
                    onChange={() => { }}
                  />
                  <FormField
                    label="Stop Loss (%)"
                    type="number"
                    value={bot.stop_loss_percentage === "0.0" ? '' : bot.stop_loss_percentage}
                    onChange={() => { }}
                    placeholder="0 for disabled"
                  />
                  <FormField
                    label="Cooldown (seconds)"
                    type="number"
                    value={bot.cooldown}
                    onChange={() => { }}
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
  const getIcon = (iconName) => {
    const icons = {
      'account-balance': 'M4 6h16v10H4V6zm2 2v6h12V8H6zm12-2V4H6v2h12z',
      'currency-exchange': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      'update': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      'strategy': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
      'market': 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
      'activity': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'dollar-sign': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'profit': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      'reinvest': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      'layers': 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      'safety-check': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'trending-up': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      'shield': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'steps': 'M13 5l7 7-7 7M5 5l7 7-7 7',
      'cooldown': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'repeat': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      'active-orders': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      'martingale': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      'martingale-step': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      'risk': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    };

    return icons[iconName] || icons['settings'];
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={getIcon(icon)} />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, maxValue, currency }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {maxValue && (
          <span className="text-sm text-gray-500">of {maxValue}</span>
        )}
        {currency && (
          <span className="text-sm text-gray-500">{currency}</span>
        )}
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