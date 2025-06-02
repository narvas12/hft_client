import React, { useState } from 'react';
import hftBotService from '../services/hftBotService';

const initialFormState = {
  account_id: '33202706',
  name: 'BOT',
  pairs: 'USDT_BTC',
  base_order_volume: '10.0',
  safety_order_volume: '30.0',
  base_order_volume_type: 'quote_currency',
  safety_order_volume_type: 'quote_currency',
  max_safety_orders: '4',
  active_safety_orders_count: '1',
  safety_order_step_percentage: '1.0',
  take_profit: '3.5',
  take_profit_type: 'total',
  min_profit_type: null,
  martingale_volume_coefficient: '2.0',
  martingale_step_coefficient: '4.0',
  cooldown: '60',
  close_deals_timeout: '60',
  stop_loss_percentage: '1.0',
  stop_loss_type: 'stop_loss',
  trailing_enabled: false,
  trailing_deviation: '0.2',
  tsl_enabled: false,
  deal_start_delay_seconds: null,
  stop_loss_timeout_enabled: false,
  stop_loss_timeout_in_seconds: 0,
  max_active_deals: '1',
  allowed_deals_on_same_pair: null,
  strategy: 'long',
  leverage_type: 'not_specified',
  leverage_custom_value: null,
  start_order_type: 'limit',
  reinvesting_percentage: null,
  risk_reduction_percentage: null,
  min_price: null,
  max_price: null,
  min_price_percentage: null,
  max_price_percentage: null
};

const defaultStrategyList = [
  {
    strategy: 'nonstop',
    options: {}
  }
];

// List of available trading pairs
const tradingPairs = [
  'USDT_BTC',
  'USDT_ETH',
  'USDT_BNB',
  'USDT_SOL',
  'USDT_XRP',
  'USDT_ADA',
  'USDT_DOGE',
  'USDT_DOT',
  'USDT_AVAX',
  'USDT_LINK',
  'USDT_LTC',
  'USDT_BCH',
  'USDT_UNI',
  'USDT_ATOM',
  'USDT_FIL',
  'USDT_XLM',
  'USDT_ETC',
  'USDT_ALGO',
  'USDT_VET',
  'USDT_ICP',
  'USDT_MATIC',
  'USDT_AAVE',
  'USDT_XMR',
  'USDT_EOS',
  'USDT_GRT'
];

const HomePage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showRiskManagement, setShowRiskManagement] = useState(false);
  const [showOrderSettings, setShowOrderSettings] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
        safety_order_volume: formData.safety_order_volume,
        base_order_volume_type: formData.base_order_volume_type,
        safety_order_volume_type: formData.safety_order_volume_type,
        max_safety_orders: parseInt(formData.max_safety_orders),
        active_safety_orders_count: parseInt(formData.active_safety_orders_count),
        safety_order_step_percentage: formData.safety_order_step_percentage,
        take_profit: formData.take_profit,
        take_profit_type: formData.take_profit_type,
        min_profit_type: formData.min_profit_type,
        martingale_volume_coefficient: formData.martingale_volume_coefficient,
        martingale_step_coefficient: formData.martingale_step_coefficient,
        cooldown: parseInt(formData.cooldown),
        close_deals_timeout: parseInt(formData.close_deals_timeout),
        stop_loss_percentage: formData.stop_loss_percentage,
        stop_loss_type: formData.stop_loss_type,
        trailing_enabled: formData.trailing_enabled,
        trailing_deviation: formData.trailing_deviation,
        tsl_enabled: formData.tsl_enabled,
        deal_start_delay_seconds: formData.deal_start_delay_seconds,
        stop_loss_timeout_enabled: formData.stop_loss_timeout_enabled,
        stop_loss_timeout_in_seconds: formData.stop_loss_timeout_in_seconds,
        max_active_deals: parseInt(formData.max_active_deals),
        allowed_deals_on_same_pair: formData.allowed_deals_on_same_pair,
        strategy: formData.strategy,
        leverage_type: formData.leverage_type,
        leverage_custom_value: formData.leverage_custom_value,
        start_order_type: formData.start_order_type,
        reinvesting_percentage: formData.reinvesting_percentage,
        risk_reduction_percentage: formData.risk_reduction_percentage,
        min_price: formData.min_price,
        max_price: formData.max_price,
        min_price_percentage: formData.min_price_percentage,
        max_price_percentage: formData.max_price_percentage,
        strategy_list: defaultStrategyList
      };

      const data = await hftBotService.createDcaBot(payload);
      setResponse(data);
      setCurrentStep(3); // Success step
    } catch (err) {
      setCurrentStep(3); // Show error state
      if (err.response?.data?.error_attributes) {
        const errorMessages = Object.entries(err.response.data.error_attributes)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('; ');
        setError(`Validation errors: ${errorMessages}`);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError(err.message || 'An error occurred while creating the bot');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const renderInput = (id, label, type = 'text', step = '1', min = '0.1', helpText = '', disabled = false) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {helpText && (
          <span className="text-xs text-gray-500">{helpText}</span>
        )}
      </div>
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          name={id}
          step={step}
          min={min}
          value={formData[id] || ''}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full px-4 py-2 ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900 border-gray-300'} rounded-md border focus:ring-blue-500 focus:border-blue-500`}
        />
        {['base_order_volume', 'safety_order_volume'].includes(id) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">USDT</span>
          </div>
        )}
        {['take_profit', 'stop_loss_percentage', 'safety_order_step_percentage', 'trailing_deviation'].includes(id) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">%</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCheckbox = (id, label, helpText = '') => (
    <div className="mb-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={formData[id] || false}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      </div>
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );

  const renderSelect = (id, label, options, helpText = '') => (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={formData[id] || ''}
        onChange={handleChange}
        className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {step}
            </div>
            <div className={`mt-2 text-sm font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>
              {step === 1 && 'Basic Info'}
              {step === 2 && 'Configuration'}
              {step === 3 && 'Review'}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-1 bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-sm text-gray-500">Provide basic details for your trading bot</p>
      </div>
      
      {renderInput('name', 'Bot Name', 'text', '', '', 'Give your bot a descriptive name')}
      {renderSelect('pairs', 'Trading Pair', tradingPairs.map(pair => ({
        value: pair,
        label: pair
      })), 'Select a trading pair')}
      {renderInput('account_id', 'Account ID', 'text', '', '', 'Your exchange account ID', true)}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Trading Parameters</h2>
        <p className="text-sm text-gray-500">Configure your DCA strategy parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('base_order_volume', 'Base Order', 'number', '0.01', '0', 'Initial order size')}
        {renderInput('safety_order_volume', 'Safety Order', 'number', '0.01', '0', 'Additional order size')}
        {renderInput('take_profit', 'Take Profit', 'number', '0.01', '0.1', 'Target profit percentage')}
        {renderInput('safety_order_step_percentage', 'Price Drop Step', 'number', '0.01', '0.1', 'Before next safety order')}
        {renderInput('max_safety_orders', 'Max Safety Orders', 'number', '1', '1', 'Maximum safety orders')}
        {renderInput('active_safety_orders_count', 'Active Safety Orders', 'number', '1', '1', 'Concurrent safety orders')}
        {renderInput('max_active_deals', 'Max Active Deals', 'number', '1', '1', 'Maximum concurrent deals')}
      </div>

      {/* Risk Management Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setShowRiskManagement(!showRiskManagement)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          {showRiskManagement ? 'Hide' : 'Show'} Risk Management
          <svg className={`ml-1 w-4 h-4 transition-transform ${showRiskManagement ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showRiskManagement && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('stop_loss_percentage', 'Stop Loss', 'number', '0.01', '0', 'Set to 0 to disable')}
            {renderSelect('stop_loss_type', 'Stop Loss Type', [
              { value: 'stop_loss', label: 'Stop Loss' },
              { value: 'stop_loss_and_disable_bot', label: 'Stop Loss & Disable Bot' }
            ])}
            {renderCheckbox('tsl_enabled', 'Trailing Stop Loss Enabled', 'Enable trailing stop loss')}
            {renderInput('trailing_deviation', 'Trailing Deviation', 'number', '0.01', '0', 'Percentage for trailing stop')}
            {renderCheckbox('stop_loss_timeout_enabled', 'Stop Loss Timeout Enabled', 'Enable timeout for stop loss')}
            {renderInput('stop_loss_timeout_in_seconds', 'Stop Loss Timeout (seconds)', 'number', '1', '0', 'Timeout duration')}
            {renderInput('risk_reduction_percentage', 'Risk Reduction', 'number', '0.01', '0', 'Percentage to reduce risk')}
          </div>
        )}
      </div>

      {/* Advanced Settings Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          <svg className={`ml-1 w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput('cooldown', 'Cooldown', 'number', '1', '0', 'Delay between deals (seconds')}
            {renderInput('close_deals_timeout', 'Close Timeout', 'number', '1', '0', 'Timeout for closing (seconds)')}
            {renderInput('martingale_volume_coefficient', 'Volume Coefficient', 'number', '0.1', '1', 'Multiplier for safety orders')}
            {renderInput('martingale_step_coefficient', 'Step Coefficient', 'number', '0.1', '1', 'Multiplier for price steps')}
            {renderInput('deal_start_delay_seconds', 'Deal Start Delay (seconds)', 'number', '1', '0', 'Delay before starting new deal')}
            {renderInput('allowed_deals_on_same_pair', 'Allowed Deals on Same Pair', 'number', '1', '1', 'Max concurrent deals per pair')}
          </div>
        )}
      </div>

      {/* Order Settings Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => setShowOrderSettings(!showOrderSettings)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          {showOrderSettings ? 'Hide' : 'Show'} Order Settings
          <svg className={`ml-1 w-4 h-4 transition-transform ${showOrderSettings ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showOrderSettings && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSelect('strategy', 'Strategy', [
              { value: 'long', label: 'Long' },
              { value: 'short', label: 'Short' }
            ], 'Trading strategy direction')}
            {renderSelect('leverage_type', 'Leverage Type', [
              { value: 'not_specified', label: 'Not Specified' },
              { value: 'cross', label: 'Cross' },
              { value: 'isolated', label: 'Isolated' },
              { value: 'custom', label: 'Custom' }
            ], 'Margin trading leverage type')}
            {formData.leverage_type === 'custom' && renderInput('leverage_custom_value', 'Custom Leverage', 'number', '1', '1', 'Custom leverage value')}
            {renderSelect('start_order_type', 'Start Order Type', [
              { value: 'limit', label: 'Limit' },
              { value: 'market', label: 'Market' }
            ], 'Type of order to start with')}
            {renderInput('min_price', 'Minimum Price', 'number', '0.00000001', '0', 'Minimum allowed price')}
            {renderInput('max_price', 'Maximum Price', 'number', '0.00000001', '0', 'Maximum allowed price')}
            {renderInput('min_price_percentage', 'Minimum Price Percentage', 'number', '0.01', '0', 'Percentage from current price')}
            {renderInput('max_price_percentage', 'Maximum Price Percentage', 'number', '0.01', '0', 'Percentage from current price')}
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Review & Create
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {response ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Bot Created Successfully!</h2>
          <p className="mt-2 text-sm text-gray-500">Your DCA trading bot has been successfully created and activated.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setFormData(initialFormState);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Another Bot
            </button>

            
          </div>

          <div className="mt-6">
           

            <a
              href='/bots/list'
              
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              View Bots
            </a>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Error Creating Bot</h2>
          <p className="mt-2 text-sm text-red-500">{error}</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setError(null)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Your Configuration</h2>
            <p className="text-sm text-gray-500">Please review your settings before creating the bot</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bot Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trading Pair:</span>
                    <span className="font-medium">{formData.pairs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account ID:</span>
                    <span className="font-medium">{formData.account_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Strategy:</span>
                    <span className="font-medium">{formData.strategy}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Trading Parameters</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Order:</span>
                    <span className="font-medium">{formData.base_order_volume} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Safety Order:</span>
                    <span className="font-medium">{formData.safety_order_volume} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Take Profit:</span>
                    <span className="font-medium">{formData.take_profit}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Safety Orders:</span>
                    <span className="font-medium">{formData.max_safety_orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Active Deals:</span>
                    <span className="font-medium">{formData.max_active_deals}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {(showRiskManagement || showAdvanced || showOrderSettings) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Risk Management */}
                  {showRiskManagement && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Stop Loss:</span>
                        <span className="font-medium">{formData.stop_loss_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Stop Loss Type:</span>
                        <span className="font-medium">{formData.stop_loss_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trailing Stop Loss:</span>
                        <span className="font-medium">{formData.tsl_enabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trailing Deviation:</span>
                        <span className="font-medium">{formData.trailing_deviation}%</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Advanced Settings */}
                  {showAdvanced && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cooldown:</span>
                        <span className="font-medium">{formData.cooldown} seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Close Timeout:</span>
                        <span className="font-medium">{formData.close_deals_timeout} seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Volume Coefficient:</span>
                        <span className="font-medium">{formData.martingale_volume_coefficient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Step Coefficient:</span>
                        <span className="font-medium">{formData.martingale_step_coefficient}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Order Settings */}
                  {showOrderSettings && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Leverage Type:</span>
                        <span className="font-medium">{formData.leverage_type}</span>
                      </div>
                      {formData.leverage_type === 'custom' && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Custom Leverage:</span>
                          <span className="font-medium">{formData.leverage_custom_value}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Start Order Type:</span>
                        <span className="font-medium">{formData.start_order_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Min Price:</span>
                        <span className="font-medium">{formData.min_price || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Max Price:</span>
                        <span className="font-medium">{formData.max_price || 'Not set'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
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
                'Confirm & Create Bot'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create DCA Trading Bot</h1>
          <p className="mt-2 text-lg text-gray-600">
            Automate your trading strategy with Dollar Cost Averaging
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {renderStepIndicator()}

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;