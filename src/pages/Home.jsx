import React, { useState } from 'react';
import hftBotService from '../services/hftBotService';

const initialFormState = {
  name: '',
  account_id: '',
  pairs: '',
  base_order_volume: '',
  base_order_volume_type: 'quote_currency',
  take_profit: '',
  take_profit_type: 'total',
  safety_order_volume: '',
  safety_order_volume_type: 'quote_currency',
  safety_order_step_percentage: '',
  martingale_volume_coefficient: '',
  martingale_step_coefficient: '',
  max_safety_orders: '',
  active_safety_orders_count: '',
  cooldown: 300,
  strategy_list: [
    {
      strategy: 'rsi_ema_scalping',
      options: {
        rsi_period: 14,
        ema_period: 9,
        rsi_overbought: 70,
        rsi_oversold: 30,
      },
    },
  ],
};

const HomePage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStrategyChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      strategy_list: [{
        ...prev.strategy_list[0],
        options: {
          ...prev.strategy_list[0].options,
          [name]: Number(value)
        }
      }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload = {
      ...formData,
      account_id: Number(formData.account_id),
      base_order_volume: Number(formData.base_order_volume),
      take_profit: formData.take_profit ? Number(formData.take_profit) : null,
      safety_order_volume: Number(formData.safety_order_volume),
      safety_order_step_percentage: Number(formData.safety_order_step_percentage),
      martingale_volume_coefficient: Number(formData.martingale_volume_coefficient),
      martingale_step_coefficient: Number(formData.martingale_step_coefficient),
      max_safety_orders: Number(formData.max_safety_orders),
      active_safety_orders_count: Number(formData.active_safety_orders_count),
      cooldown: Number(formData.cooldown),
    };

    try {
      const data = await hftBotService.createDcaBot(payload);
      setResponse(data);
    } catch (err) {
      setError(err.message || 'An error occurred while creating the bot');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'base', label: 'Base Order' },
    { id: 'profit', label: 'Take Profit' },
    { id: 'safety', label: 'Safety Orders' },
    { id: 'strategy', label: 'Strategy' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create New DCA Bot</h1>
          <p className="mt-2 text-lg text-gray-600">
            Configure your Dollar Cost Averaging trading bot with precision
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Progress Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Bot Information</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Bot Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="My Trading Bot"
                      />
                    </div>

                    <div>
                      <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Account ID
                      </label>
                      <input
                        type="number"
                        id="account_id"
                        name="account_id"
                        value={formData.account_id}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="pairs" className="block text-sm font-medium text-gray-700 mb-1">
                        Trading Pairs
                      </label>
                      <input
                        type="text"
                        id="pairs"
                        name="pairs"
                        value={formData.pairs}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="BTC_USDT,ETH_USDT (comma separated)"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Enter the trading pairs you want this bot to operate on
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-400 bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('base')}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Base Order
                  </button>
                </div>
              </div>
            )}

            {/* Base Order Section */}
            {activeSection === 'base' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Base Order Settings</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="base_order_volume" className="block text-sm font-medium text-gray-700 mb-1">
                        Base Order Volume
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          id="base_order_volume"
                          name="base_order_volume"
                          step="0.0001"
                          value={formData.base_order_volume}
                          onChange={handleChange}
                          required
                          className="block w-full pr-12 pl-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <select
                            name="base_order_volume_type"
                            value={formData.base_order_volume_type}
                            onChange={handleChange}
                            className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-r-md"
                          >
                            <option value="quote_currency">Quote</option>
                            <option value="base_currency">Base</option>
                            <option value="percent">%</option>
                            <option value="xbt">XBT</option>
                          </select>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Initial order size when opening a new position
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection('basic')}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('profit')}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Take Profit
                  </button>
                </div>
              </div>
            )}

            {/* Take Profit Section */}
            {activeSection === 'profit' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Take Profit Settings</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="take_profit" className="block text-sm font-medium text-gray-700 mb-1">
                        Take Profit (%)
                      </label>
                      <input
                        type="number"
                        id="take_profit"
                        name="take_profit"
                        step="0.01"
                        value={formData.take_profit}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Percentage profit target to close the position
                      </p>
                    </div>

                    <div>
                      <label htmlFor="take_profit_type" className="block text-sm font-medium text-gray-700 mb-1">
                        Take Profit Type
                      </label>
                      <select
                        id="take_profit_type"
                        name="take_profit_type"
                        value={formData.take_profit_type}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="total">Total</option>
                        <option value="base">Base</option>
                        <option value="safety">Safety</option>
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        Which orders to consider for profit calculation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection('base')}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('safety')}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Safety Orders
                  </button>
                </div>
              </div>
            )}

            {/* Safety Orders Section */}
            {activeSection === 'safety' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Safety Order Settings</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="safety_order_volume" className="block text-sm font-medium text-gray-700 mb-1">
                        Safety Order Volume
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="number"
                          id="safety_order_volume"
                          name="safety_order_volume"
                          step="0.0001"
                          value={formData.safety_order_volume}
                          onChange={handleChange}
                          required
                          className="block w-full pr-12 pl-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <select
                            name="safety_order_volume_type"
                            value={formData.safety_order_volume_type}
                            onChange={handleChange}
                            className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-r-md"
                          >
                            <option value="quote_currency">Quote</option>
                            <option value="base_currency">Base</option>
                            <option value="percent">%</option>
                            <option value="xbt">XBT</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="safety_order_step_percentage" className="block text-sm font-medium text-gray-700 mb-1">
                        Safety Order Step (%)
                      </label>
                      <input
                        type="number"
                        id="safety_order_step_percentage"
                        name="safety_order_step_percentage"
                        step="0.01"
                        value={formData.safety_order_step_percentage}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Price deviation to trigger next safety order
                      </p>
                    </div>

                    <div>
                      <label htmlFor="martingale_volume_coefficient" className="block text-sm font-medium text-gray-700 mb-1">
                        Volume Coefficient
                      </label>
                      <input
                        type="number"
                        id="martingale_volume_coefficient"
                        name="martingale_volume_coefficient"
                        step="0.01"
                        value={formData.martingale_volume_coefficient}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Multiplier for each subsequent safety order
                      </p>
                    </div>

                    <div>
                      <label htmlFor="martingale_step_coefficient" className="block text-sm font-medium text-gray-700 mb-1">
                        Step Coefficient
                      </label>
                      <input
                        type="number"
                        id="martingale_step_coefficient"
                        name="martingale_step_coefficient"
                        step="0.01"
                        value={formData.martingale_step_coefficient}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="max_safety_orders" className="block text-sm font-medium text-gray-700 mb-1">
                        Max Safety Orders
                      </label>
                      <input
                        type="number"
                        id="max_safety_orders"
                        name="max_safety_orders"
                        value={formData.max_safety_orders}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="active_safety_orders_count" className="block text-sm font-medium text-gray-700 mb-1">
                        Active Safety Orders
                      </label>
                      <input
                        type="number"
                        id="active_safety_orders_count"
                        name="active_safety_orders_count"
                        value={formData.active_safety_orders_count}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="cooldown" className="block text-sm font-medium text-gray-700 mb-1">
                        Cooldown (seconds)
                      </label>
                      <input
                        type="number"
                        id="cooldown"
                        name="cooldown"
                        value={formData.cooldown}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Time between consecutive trades on the same pair
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection('profit')}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('strategy')}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next: Strategy
                  </button>
                </div>
              </div>
            )}

            {/* Strategy Section */}
            {activeSection === 'strategy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Trading Strategy</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="rsi_period" className="block text-sm font-medium text-gray-700 mb-1">
                        RSI Period
                      </label>
                      <input
                        type="number"
                        id="rsi_period"
                        name="rsi_period"
                        value={formData.strategy_list[0].options.rsi_period}
                        onChange={handleStrategyChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="ema_period" className="block text-sm font-medium text-gray-700 mb-1">
                        EMA Period
                      </label>
                      <input
                        type="number"
                        id="ema_period"
                        name="ema_period"
                        value={formData.strategy_list[0].options.ema_period}
                        onChange={handleStrategyChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="rsi_overbought" className="block text-sm font-medium text-gray-700 mb-1">
                        RSI Overbought Level
                      </label>
                      <input
                        type="number"
                        id="rsi_overbought"
                        name="rsi_overbought"
                        value={formData.strategy_list[0].options.rsi_overbought}
                        onChange={handleStrategyChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Sell when RSI reaches this level
                      </p>
                    </div>

                    <div>
                      <label htmlFor="rsi_oversold" className="block text-sm font-medium text-gray-700 mb-1">
                        RSI Oversold Level
                      </label>
                      <input
                        type="number"
                        id="rsi_oversold"
                        name="rsi_oversold"
                        value={formData.strategy_list[0].options.rsi_oversold}
                        onChange={handleStrategyChange}
                        required
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Buy when RSI reaches this level
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveSection('safety')}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Bot...
                      </>
                    ) : (
                      'Create Trading Bot'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Response and Error Messages */}
        {response && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Bot Created Successfully</h3>
                <div className="mt-2 text-sm text-green-700">
                  <pre className="whitespace-pre-wrap break-words">{JSON.stringify(response, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
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