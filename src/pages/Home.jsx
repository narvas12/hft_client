import React, { useState } from 'react';
import hftBotService from '../services/hftBotService';

const initialFormState = {
  account_id: '548644752',
  name: 'BOT',
  pairs: 'BTC_USDT',
  base_order_volume: '100.00',
  take_profit: '2.00',
  stop_loss: '5.00',
  profit_margin: '1.00',
  safety_order_volume: '30.00',
  safety_order_step_percentage: '1.00',
  max_safety_orders: '4',
  cooldown: '60',
  close_deals_timeout: '60',
  active_safety_orders_count: '1',
  base_order_volume_type: 'quote_currency',
  safety_order_volume_type: 'quote_currency',
  take_profit_type: 'total',
  min_profit_type: null,
  martingale_volume_coefficient: '2.00',
  martingale_step_coefficient: '4.00',
};

const defaultTakeProfitSteps = [
  { amount_percentage: 50, profit_percentage: 10 },
  { amount_percentage: 50, profit_percentage: 20 },
];

const defaultStrategyList = [
  {
    strategy: 'rsi_ema_scalping',
    options: {
      rsi_period: 14,
      rsi_lower_bound: 30,
      rsi_upper_bound: 70,
      ema_period: 20,
      buy_signal: {
        rsi_below: 30,
        price_above_ema: true
      },
      sell_signal: {
        rsi_above: 70,
        price_below_ema: true
      }
    }
  }
];

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
        account_id: Number(formData.account_id),
        name: formData.name,
        pairs: formData.pairs,
        base_order_volume: formData.base_order_volume,
        take_profit: parseFloat(formData.take_profit),
        stop_loss: parseFloat(formData.stop_loss),
        profit_margin: parseFloat(formData.profit_margin),
        safety_order_volume: formData.safety_order_volume,
        safety_order_step_percentage: formData.safety_order_step_percentage,
        max_safety_orders: parseInt(formData.max_safety_orders),
        cooldown: parseInt(formData.cooldown),
        close_deals_timeout: parseInt(formData.close_deals_timeout),
        active_safety_orders_count: parseInt(formData.active_safety_orders_count),
        base_order_volume_type: formData.base_order_volume_type,
        safety_order_volume_type: formData.safety_order_volume_type,
        take_profit_type: formData.take_profit_type,
        min_profit_type: formData.min_profit_type,
        martingale_volume_coefficient: formData.martingale_volume_coefficient,
        martingale_step_coefficient: formData.martingale_step_coefficient,
        take_profit_steps: defaultTakeProfitSteps,
        strategy_list: defaultStrategyList
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-1">
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
          disabled={disabled}
          className={`block w-full px-4 py-2 ${disabled ? 'bg-oxblood-950 text-gray-900' : 'bg-oxblood-800 text-gray-900 border-oxblood-700'} rounded-md focus:ring-yellow-500 focus:border-yellow-500 border`}
        />
        {['base_order_volume', 'safety_order_volume'].includes(id) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-900">USDT</span>
          </div>
        )}
        {['take_profit', 'stop_loss', 'profit_margin', 'safety_order_step_percentage'].includes(id) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-900">%</span>
          </div>
        )}
      </div>
      {helpText && <p className="mt-1 text-xs text-gray-900">{helpText}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-oxblood-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Create DCA Trading Bot</h1>
          <p className="mt-2 text-lg text-gray-900">
            Configure your automated trading strategy with our smart defaults
          </p>
        </div>

        <div className="bg-oxblood-800 shadow-xl rounded-lg overflow-hidden border border-oxblood-700">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-yellow-400 mb-4 pb-2 border-b border-oxblood-700">
                  Basic Configuration
                </h2>
              </div>
              
              {renderInput('name', 'Bot Name *', 'text', '', '', 'Give your bot a descriptive name')}
              
              <div>
                <label htmlFor="pairs" className="block text-sm font-medium text-gray-900 mb-1">
                  Trading Pair *
                </label>
                <select
                  id="pairs"
                  name="pairs"
                  value={formData.pairs}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-2 bg-oxblood-800 border border-oxblood-700 text-gray-900 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="BTC_USDT">BTC/USDT</option>
                  <option value="ETH_USDT">ETH/USDT</option>
                  <option value="BNB_USDT">BNB/USDT</option>
                  <option value="SOL_USDT">SOL/USDT</option>
                  <option value="ADA_USDT">ADA/USDT</option>
                  <option value="DOT_USDT">DOT/USDT</option>
                </select>
              </div>

              {renderInput('account_id', 'Account ID *', 'number', '1', '1', 'Your exchange account identifier')}
              
              {/* Trading Parameters */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-lg font-medium text-yellow-400 mb-4 pb-2 border-b border-oxblood-700">
                  Trading Parameters
                </h2>
              </div>
              
              {renderInput('base_order_volume', 'Base Order Volume (USDT) *', 'number', '0.01', '10', 'Initial order size in USDT')}
              {renderInput('take_profit', 'Take Profit (%) *', 'number', '0.01', '0.1', 'Target profit percentage')}
              {renderInput('stop_loss', 'Stop Loss (%) *', 'number', '0.01', '0.1', 'Maximum loss percentage')}
              {renderInput('profit_margin', 'Profit Margin (%) *', 'number', '0.01', '0.1', 'Minimum profit percentage')}
              
              {/* Advanced Options Toggle */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm font-medium text-yellow-500 hover:text-yellow-400 focus:outline-none transition-colors"
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
                  {renderInput('safety_order_volume', 'Safety Order Volume (USDT)', 'number', '0.01', '1', 'Additional order size in USDT')}
                  {renderInput('safety_order_step_percentage', 'Safety Order Step (%)', 'number', '0.01', '0.1', 'Price drop percentage before next safety order')}
                </>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium ${
                  loading ? 'bg-gray-600' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-oxblood-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-oxblood-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          <div className="mt-6 p-4 bg-green-900 bg-opacity-20 border-l-4 border-green-400 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-300">Bot Successfully Created!</h3>
                <div className="mt-2 text-sm text-green-200">
                  <p>Your trading bot is now active. Here are the details:</p>
                  <pre className="mt-2 p-2 bg-green-900 bg-opacity-30 rounded text-xs overflow-x-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900 bg-opacity-20 border-l-4 border-red-400 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-300">Error Creating Bot</h3>
                <div className="mt-2 text-sm text-red-200">
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