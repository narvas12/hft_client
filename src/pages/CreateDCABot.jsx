import React, { useState } from 'react';
import hftBotService from '../services/hftBotService';

const initialFormState = {
  account_id: '33213047',
  name: '',
  pairs: '',
  base_order_volume: '20.0',
  safety_order_volume: '10.0',
  max_safety_orders: '3',
  active_safety_orders_count: 3,
  safety_order_step_percentage: '0.8',
  take_profit: '1.0',
  take_profit_type: 'total',
  stop_loss_percentage: '0.0',
  stop_loss_type: 'stop_loss',
  cooldown: '300',
  martingale_volume_coefficient: '1.7',
  martingale_step_coefficient: '1.5',
  trailing_enabled: true,
  trailing_deviation: '0.2',
  max_active_deals: '1',
  strategy: 'long',
  profit_currency: 'quote_currency',
  start_order_type: 'limit',
  reinvesting_percentage: '100.0',
  safety_order_volume_type: 'quote_currency',
  base_order_volume_type: 'quote_currency',
  safety_order_calculation_mode: 'last_executed',
  
  // Strategy lists
  strategy_list: [
    {
      strategy: "nonstop",
      options: {}
    }
  ],
  safety_strategy_list: [
    {
      strategy: "rsi",
      options: {
        time: "3m",
        points: 30,
        time_period: 7,
        trigger_condition: "less"
      }
    }
  ],
  close_strategy_list: []
};

const tradingPairs = [
  'USDT_BTC',
  'USDT_PEPE',
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

const CreateDCABot = () => {

  const [formData, setFormData] = useState({
    ...initialFormState,
    name: `BOT-${initialFormState.pairs}` // Set initial name based on initial pair
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  setFormData(prev => {
    const newData = { 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    };
    
    // Automatically update the name when pairs changes
    if (name === 'pairs') {
      newData.name = `BOT-${value}`;
    }
    
    return newData;
  });
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
        pairs: [formData.pairs], // Note: API expects an array
        base_order_volume: formData.base_order_volume,
        safety_order_volume: formData.safety_order_volume,
        max_safety_orders: parseInt(formData.max_safety_orders),
        active_safety_orders_count: parseInt(formData.active_safety_orders_count),
        safety_order_step_percentage: formData.safety_order_step_percentage,
        take_profit: formData.take_profit,
        take_profit_type: formData.take_profit_type,
        stop_loss_percentage: formData.stop_loss_percentage,
        stop_loss_type: formData.stop_loss_type,
        martingale_volume_coefficient: formData.martingale_volume_coefficient,
        martingale_step_coefficient: formData.martingale_step_coefficient,
        trailing_enabled: formData.trailing_enabled,
        trailing_deviation: formData.trailing_deviation,
        max_active_deals: parseInt(formData.max_active_deals),
        strategy: formData.strategy,
        profit_currency: formData.profit_currency,
        start_order_type: formData.start_order_type,
        reinvesting_percentage: formData.reinvesting_percentage,
        safety_order_volume_type: formData.safety_order_volume_type,
        base_order_volume_type: formData.base_order_volume_type,
        safety_order_calculation_mode: formData.safety_order_calculation_mode,
        strategy_list: formData.strategy_list,
        safety_strategy_list: formData.safety_strategy_list,
        close_strategy_list: formData.close_strategy_list,
        
        // Fields that should be null or default in payload but not in form
        take_profit_steps: [],
        min_profit_percentage: "0.0",
        min_profit_type: null,
        cooldown: "300",
        btc_price_limit: "0.0",
        min_volume_btc_24h: "0.0",
        deal_start_delay_seconds: null,
        stop_loss_timeout_enabled: false,
        stop_loss_timeout_in_seconds: 0,
        disable_after_deals_count: null,
        deals_counter: null,
        allowed_deals_on_same_pair: null,
        close_deals_timeout: null,
        min_price: null,
        max_price: null,
        leverage_type: "not_specified",
        leverage_custom_value: null,
        reinvested_volume_usd: null,
        min_price_percentage: null,
        max_price_percentage: null
      };

      const data = await hftBotService.createDcaBot(payload);
      setResponse(data);
      setCurrentStep(3);
    } catch (err) {
      setCurrentStep(3);
      
      if (err.response?.data?.error_attributes) {
        const errorMessages = [];
        
        if (err.response.data.error_attributes.pairs) {
          errorMessages.push(`Invalid trading pair: ${err.response.data.error_attributes.pairs.join(', ')}`);
        }
        
        if (err.response.data.error_attributes.base_order_volume) {
          const maxValue = err.response.data.error_attributes.base_order_volume[0].match(/Max: (.*)/)?.[1] || '';
          errorMessages.push(`Base order size is too large. ${maxValue ? `Maximum allowed: ${maxValue}` : ''}`);
        }
        
        if (err.response.data.error_attributes.safety_order_volume) {
          const maxValue = err.response.data.error_attributes.safety_order_volume[0].match(/Max: (.*)/)?.[1] || '';
          errorMessages.push(`Safety order size is too large. ${maxValue ? `Maximum allowed: ${maxValue}` : ''}`);
        }
        
        Object.entries(err.response.data.error_attributes).forEach(([field, errors]) => {
          if (!['pairs', 'base_order_volume', 'safety_order_volume'].includes(field)) {
            errorMessages.push(`${field}: ${errors.join(', ')}`);
          }
        });
        
        setError(errorMessages.join('\n'));
      } else if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'object') {
          setError('Invalid parameters: ' + JSON.stringify(err.response.data.detail));
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError(err.message || 'An unexpected error occurred while creating the bot');
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
        {['safety_order_step_percentage', 'take_profit', 'stop_loss_percentage', 'trailing_deviation'].includes(id) && (
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
          checked={formData[id]}
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

  const renderSelect = (id, label, options) => (
    <div className="mb-6">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={formData[id]}
        onChange={handleChange}
        className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-sm text-gray-500">Provide basic details for your trading bot</p>
      </div>
      
      {renderInput('name', 'Bot Name', 'text', '', '', 'Auto-generated from trading pair', true)}
      {renderInput('account_id', 'Account ID', 'text', '', '', 'Your exchange account ID', true)}
      
      <div className="mb-6">
        <label htmlFor="pairs" className="block text-sm font-medium text-gray-700 mb-1">
          Trading Pair
        </label>
        <select
          id="pairs"
          name="pairs"
          value={formData.pairs}
          onChange={handleChange}
          className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {tradingPairs.map(pair => (
            <option key={pair} value={pair}>{pair}</option>
          ))}
        </select>
      </div>
      
      {renderSelect('strategy', 'Strategy', [
        { value: 'long', label: 'Long' },
        { value: 'short', label: 'Short' }
      ])}
      
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
        <p className="text-sm text-gray-500">Configure your trading bot parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('base_order_volume', 'Base Order', 'number', '0.01', '0', 'Initial order size in quote currency')}
        {renderInput('safety_order_volume', 'Safety Order', 'number', '0.01', '0', 'Additional order size in quote currency')}
        {renderInput('max_safety_orders', 'Max Safety Orders', 'number', '1', '1', 'Maximum safety orders')}
        {renderInput('active_safety_orders_count', 'Active Safety Orders', 'number', '1', '0', 'Concurrent safety orders')}
        {renderInput('safety_order_step_percentage', 'Price Drop Step', 'number', '0.01', '0.1', 'Percentage before next safety order')}
        {renderInput('martingale_volume_coefficient', 'Volume Coefficient', 'number', '0.1', '1', 'Multiplier for safety orders')}
        {renderInput('martingale_step_coefficient', 'Step Coefficient', 'number', '0.1', '1', 'Multiplier for price steps')}
        {renderInput('max_active_deals', 'Max Active Deals', 'number', '1', '1', 'Maximum concurrent deals')}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Take Profit Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-6">
            <label htmlFor="take_profit_type" className="block text-sm font-medium text-gray-700 mb-1">
              Take Profit Type
            </label>
            <select
              id="take_profit_type"
              name="take_profit_type"
              value={formData.take_profit_type}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="total">Total</option>
              <option value="base">Base</option>
              <option value="base_and_safety">Base and Safety</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="take_profit" className="block text-sm font-medium text-gray-700 mb-1">
              Take Profit (%)
            </label>
            <input
              type="number"
              id="take_profit"
              name="take_profit"
              value={formData.take_profit}
              onChange={handleChange}
              step="0.1"
              min="0"
              className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Stop Loss Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-6">
            <label htmlFor="stop_loss_type" className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss Type
            </label>
            <select
              id="stop_loss_type"
              name="stop_loss_type"
              value={formData.stop_loss_type}
              onChange={handleChange}
              className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="stop_loss">Stop Loss</option>
              <option value="trailing">Trailing Stop</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="stop_loss_percentage" className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss (%)
            </label>
            <input
              type="number"
              id="stop_loss_percentage"
              name="stop_loss_percentage"
              value={formData.stop_loss_percentage}
              onChange={handleChange}
              step="0.1"
              min="0"
              className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {formData.stop_loss_type === 'trailing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderCheckbox('trailing_enabled', 'Enable Trailing Stop', 'Automatically adjust stop loss as price moves favorably')}
            {renderInput('trailing_deviation', 'Trailing Deviation (%)', 'number', '0.1', '0', 'Percentage deviation for trailing stop')}
          </div>
        )}
      </div>

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
            {renderSelect('profit_currency', 'Profit Currency', [
              { value: 'quote_currency', label: 'Quote Currency' },
              { value: 'base_currency', label: 'Base Currency' }
            ])}
            
            {renderSelect('start_order_type', 'Start Order Type', [
              { value: 'limit', label: 'Limit' },
              { value: 'market', label: 'Market' }
            ])}
            
            {renderInput('reinvesting_percentage', 'Reinvesting Percentage', 'number', '1', '0', 'Percentage of profits to reinvest')}
            
            {renderSelect('safety_order_volume_type', 'Safety Order Volume Type', [
              { value: 'quote_currency', label: 'Quote Currency' },
              { value: 'base_currency', label: 'Base Currency' }
            ])}
            
            {renderSelect('base_order_volume_type', 'Base Order Volume Type', [
              { value: 'quote_currency', label: 'Quote Currency' },
              { value: 'base_currency', label: 'Base Currency' }
            ])}
            
            {renderSelect('safety_order_calculation_mode', 'Safety Order Calculation Mode', [
              { value: 'last_executed', label: 'Last Executed' },
              { value: 'next_execution', label: 'Next Execution' }
            ])}
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
          <p className="mt-2 text-sm text-gray-500">Your trading bot has been successfully created and activated.</p>
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
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Error Creating Bot</h2>
          <div className="mt-4 text-left bg-red-50 p-4 rounded-md">
            {error.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-red-600 mb-2">
                • {line}
              </p>
            ))}
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Configuration
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
                    <span className="text-gray-500">Max Safety Orders:</span>
                    <span className="font-medium">{formData.max_safety_orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active Safety Orders:</span>
                    <span className="font-medium">{formData.active_safety_orders_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price Drop Step:</span>
                    <span className="font-medium">{formData.safety_order_step_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volume Coefficient:</span>
                    <span className="font-medium">{formData.martingale_volume_coefficient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Step Coefficient:</span>
                    <span className="font-medium">{formData.martingale_step_coefficient}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Active Deals:</span>
                    <span className="font-medium">{formData.max_active_deals}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Take Profit Configuration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Take Profit Type:</span>
                  <span className="font-medium">{formData.take_profit_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Take Profit:</span>
                  <span className="font-medium">{formData.take_profit}%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Stop Loss Configuration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Stop Loss Type:</span>
                  <span className="font-medium">{formData.stop_loss_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stop Loss:</span>
                  <span className="font-medium">{formData.stop_loss_percentage}%</span>
                </div>
                {formData.stop_loss_type === 'trailing' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trailing Enabled:</span>
                      <span className="font-medium">{formData.trailing_enabled ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trailing Deviation:</span>
                      <span className="font-medium">{formData.trailing_deviation}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {showAdvanced && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Configuration</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Profit Currency:</span>
                    <span className="font-medium">{formData.profit_currency === 'quote_currency' ? 'Quote Currency' : 'Base Currency'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Order Type:</span>
                    <span className="font-medium">{formData.start_order_type === 'limit' ? 'Limit' : 'Market'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reinvesting Percentage:</span>
                    <span className="font-medium">{formData.reinvesting_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Safety Order Volume Type:</span>
                    <span className="font-medium">{formData.safety_order_volume_type === 'quote_currency' ? 'Quote Currency' : 'Base Currency'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Base Order Volume Type:</span>
                    <span className="font-medium">{formData.base_order_volume_type === 'quote_currency' ? 'Quote Currency' : 'Base Currency'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Safety Order Calculation Mode:</span>
                    <span className="font-medium">{formData.safety_order_calculation_mode === 'last_executed' ? 'Last Executed' : 'Next Execution'}</span>
                  </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Create Trading Bot</h1>
          <p className="mt-2 text-lg text-gray-600">
            Configure your bot according to the API specifications
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
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

export default CreateDCABot;