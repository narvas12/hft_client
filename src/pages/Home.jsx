import React, { useState } from 'react';
import hftBotService from '../services/hftBotService';

const initialFormState = {
  account_id: '2045951',
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
};

const defaultStrategyList = [
  {
    strategy: 'short',
    options: {}
  }
];

const HomePage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
        {['take_profit', 'stop_loss', 'profit_margin', 'safety_order_step_percentage'].includes(id) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">%</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}>
          {currentStep > 1 ? (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span>1</span>
          )}
        </div>
        <span className="text-sm font-medium">Basic Info</span>
      </div>
      
      <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      
      <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}>
          {currentStep > 2 ? (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span>2</span>
          )}
        </div>
        <span className="text-sm font-medium">Trading Settings</span>
      </div>
      
      <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      
      <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'} mr-2`}>
          <span>3</span>
        </div>
        <span className="text-sm font-medium">Confirmation</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-sm text-gray-500">Configure the basic settings for your DCA bot</p>
      </div>
      
      {renderInput('name', 'Bot Name', 'text', '', '', 'Give your bot a descriptive name')}
      
      <div>
        <label htmlFor="pairs" className="block text-sm font-medium text-gray-700 mb-1">
          Trading Pair
        </label>
        <select
          id="pairs"
          name="pairs"
          value={formData.pairs}
          onChange={handleChange}
          required
          className="block w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="USDT_BTC">BTC/USDT</option>
          <option value="USDT_ETH">ETH/USDT</option>
          <option value="USDT_BNB">BNB/USDT</option>
          <option value="USDT_SOL">SOL/USDT</option>
          <option value="USDT_ADA">ADA/USDT</option>
          <option value="USDT_DOT">DOT/USDT</option>
        </select>
      </div>

      {renderInput('account_id', 'Account ID', 'number', '1', '1', 'Your exchange account identifier')}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next: Trading Settings
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
            {renderInput('cooldown', 'Cooldown', 'number', '1', '0', 'Delay between deals (seconds)')}
            {renderInput('close_deals_timeout', 'Close Timeout', 'number', '1', '0', 'Timeout for closing (seconds)')}
            {renderInput('martingale_volume_coefficient', 'Volume Coefficient', 'number', '0.1', '1', 'Multiplier for safety orders')}
            {renderInput('martingale_step_coefficient', 'Step Coefficient', 'number', '0.1', '1', 'Multiplier for price steps')}
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
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Bot Successfully Created!</h2>
          <p className="mt-2 text-sm text-gray-500">Your DCA trading bot is now active and ready to trade.</p>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md text-left">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Bot Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Bot Name:</span>
                <span className="font-medium">{response.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Trading Pair:</span>
                <span className="font-medium">{response.pairs}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setResponse(null);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Another Bot
            </button>
          </div>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Error Creating Bot</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          
          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Settings
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentStep(1);
                setError(null);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Over
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
                </div>
              </div>
            </div>
            
            {showAdvanced && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cooldown:</span>
                      <span className="font-medium">{formData.cooldown} seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Close Timeout:</span>
                      <span className="font-medium">{formData.close_deals_timeout} seconds</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Volume Coefficient:</span>
                      <span className="font-medium">{formData.martingale_volume_coefficient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Step Coefficient:</span>
                      <span className="font-medium">{formData.martingale_step_coefficient}</span>
                    </div>
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