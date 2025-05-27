import React, { useState } from 'react';
import hftBotService from '../services/hftBotService';

const initialFormState = {
  account_id: '',
  name: '',
  pairs: 'BTC_USDT',
  base_order_volume: '100.00',
  max_safety_orders: '4',
  take_profit: '2.00',
  stop_loss: '5.00',
  profit_margin: '1.00',
  cooldown: '60',
  close_deals_timeout: '60',
  active_safety_orders_count: '1',
  safety_order_volume: '30.00',
  safety_order_step_percentage: '1.00',
  base_order_volume_type: 'quote_currency',
  safety_order_volume_type: 'quote_currency',
  take_profit_type: 'total',
  min_profit_type: null,
  martingale_volume_coefficient: '2.00',
  martingale_step_coefficient: '4.00',
  take_profit_steps: [
    { amount_percentage: 50, profit_percentage: 10 },
    { amount_percentage: 50, profit_percentage: 20 },
  ],
  strategy_list: [{ strategy: 'nonstop', options: {} }],
};

const HomePage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload = {
        ...formData,
        account_id: Number(formData.account_id),
        base_order_volume: parseFloat(formData.base_order_volume),
        take_profit: parseFloat(formData.take_profit),
        stop_loss: parseFloat(formData.stop_loss),
        safety_order_volume: parseFloat(formData.safety_order_volume),
        safety_order_step_percentage: parseFloat(formData.safety_order_step_percentage),
        martingale_volume_coefficient: parseFloat(formData.martingale_volume_coefficient),
        martingale_step_coefficient: parseFloat(formData.martingale_step_coefficient),
        max_safety_orders: parseInt(formData.max_safety_orders),
        active_safety_orders_count: parseInt(formData.active_safety_orders_count),
        cooldown: parseInt(formData.cooldown),
        profit_margin: parseFloat(formData.profit_margin),
      };

      const data = await hftBotService.createDcaBot(payload);
      setResponse(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred while creating the bot');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (id, label, type = 'text', step = '1', min = '0.1', helpText = '', disabled = false) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          name={id}
          step={step}
          min={min}
          value={formData[id]}
          onChange={handleChange}
          
          className={`block w-full px-4 py-2 border ${disabled ? 'bg-gray-100 text-gray-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
        />
        {['base_order_volume', 'safety_order_volume'].includes(id) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">USDT</span>
          </div>
        )}
        {['take_profit', 'stop_loss', 'profit_margin', 'safety_order_step_percentage'].includes(id) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">%</span>
          </div>
        )}
      </div>
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create DCA Trading Bot</h1>
          <p className="mt-2 text-lg text-gray-600">
            Configure your automated trading strategy with our smart defaults
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Basic Configuration
                </h2>
              </div>
              
              {renderInput('name', 'Bot Name *', 'text', '', '', 'Give your bot a descriptive name')}
              
              <div>
                <label htmlFor="pairs" className="block text-sm font-medium text-gray-700 mb-1">
                  Trading Pair *
                </label>
                <select
                  id="pairs"
                  name="pairs"
                  value={formData.pairs}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="BTC_USDT">BTC/USDT</option>
                  <option value="ETH_USDT">ETH/USDT</option>
                  <option value="BNB_USDT">BNB/USDT</option>
                  <option value="SOL_USDT">SOL/USDT</option>
                </select>
              </div>

              {renderInput('account_id', 'Account ID *', 'number', '1', '1', 'Your exchange account identifier', true)}
              
              {/* Trading Parameters */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Trading Parameters
                </h2>
              </div>
              
              {renderInput('base_order_volume', 'Base Order Volume *', 'number', '0.01', '10')}
              {renderInput('take_profit', 'Take Profit *', 'number', '0.01', '0.1')}
              {renderInput('stop_loss', 'Stop Loss *', 'number', '0.01', '0.1')}
              {renderInput('profit_margin', 'Profit Margin *', 'number', '0.01', '0.1')}
              
              {/* Advanced Options Toggle */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                  <svg
                    className={`ml-1 h-5 w-5 transform ${showAdvanced ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <>
                  {renderInput('max_safety_orders', 'Max Safety Orders', 'number', '1', '1', '', true)}
                  {renderInput('active_safety_orders_count', 'Active Safety Orders', 'number', '1', '1', '', true)}
                  {renderInput('safety_order_volume', 'Safety Order Volume', 'number', '0.01', '1')}
                  {renderInput('safety_order_step_percentage', 'Safety Order Step %', 'number', '0.01', '0.1')}
                  {renderInput('martingale_volume_coefficient', 'Volume Multiplier', 'number', '0.01', '1', '', true)}
                  {renderInput('martingale_step_coefficient', 'Step Multiplier', 'number', '0.01', '1', '', true)}
                  {renderInput('cooldown', 'Cooldown (seconds)', 'number', '1', '0', '', true)}
                </>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
                  loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Bot...
                  </>
                ) : (
                  'Launch Trading Bot'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Response and Error Messages */}
        {response && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Bot Successfully Created!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your trading bot is now active. Here are the details:</p>
                  <pre className="mt-2 p-2 bg-green-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Creating Bot</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-1">Please check your settings and try again.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;