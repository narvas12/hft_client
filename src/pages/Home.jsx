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
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6 text-center">Create DCA Bot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Bot Info */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Bot Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Account ID:</label>
          <input
            type="number"
            name="account_id"
            value={formData.account_id}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Trading Pairs (comma separated):</label>
          <input
            type="text"
            name="pairs"
            value={formData.pairs}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded"
            placeholder="BTC_USDT,ETH_USDT"
          />
        </div>

        {/* Base Order Settings */}
        <fieldset className="p-4 border border-gray-300 rounded">
          <legend className="px-2 font-medium">Base Order Settings</legend>
          
          <div className="flex flex-col mb-3">
            <label className="mb-1">Base Order Volume:</label>
            <input
              type="number"
              step="0.0001"
              name="base_order_volume"
              value={formData.base_order_volume}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Base Order Volume Type:</label>
            <select
              name="base_order_volume_type"
              value={formData.base_order_volume_type}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="quote_currency">Quote Currency</option>
              <option value="base_currency">Base Currency</option>
              <option value="percent">Percentage</option>
              <option value="xbt">XBT</option>
            </select>
          </div>
        </fieldset>

        {/* Take Profit Settings */}
        <fieldset className="p-4 border border-gray-300 rounded">
          <legend className="px-2 font-medium">Take Profit Settings</legend>
          
          <div className="flex flex-col mb-3">
            <label className="mb-1">Take Profit (%):</label>
            <input
              type="number"
              step="0.01"
              name="take_profit"
              value={formData.take_profit}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Take Profit Type:</label>
            <select
              name="take_profit_type"
              value={formData.take_profit_type}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="total">Total</option>
              <option value="base">Base</option>
              <option value="safety">Safety</option>
            </select>
          </div>
        </fieldset>

        {/* Safety Order Settings */}
        <fieldset className="p-4 border border-gray-300 rounded">
          <legend className="px-2 font-medium">Safety Order Settings</legend>
          
          <div className="flex flex-col mb-3">
            <label className="mb-1">Safety Order Volume:</label>
            <input
              type="number"
              step="0.0001"
              name="safety_order_volume"
              value={formData.safety_order_volume}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-1">Safety Order Volume Type:</label>
            <select
              name="safety_order_volume_type"
              value={formData.safety_order_volume_type}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="quote_currency">Quote Currency</option>
              <option value="base_currency">Base Currency</option>
              <option value="percent">Percentage</option>
              <option value="xbt">XBT</option>
            </select>
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-1">Safety Order Step (%):</label>
            <input
              type="number"
              step="0.01"
              name="safety_order_step_percentage"
              value={formData.safety_order_step_percentage}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-1">Martingale Volume Coefficient:</label>
            <input
              type="number"
              step="0.01"
              name="martingale_volume_coefficient"
              value={formData.martingale_volume_coefficient}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-1">Martingale Step Coefficient:</label>
            <input
              type="number"
              step="0.01"
              name="martingale_step_coefficient"
              value={formData.martingale_step_coefficient}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-1">Max Safety Orders:</label>
            <input
              type="number"
              name="max_safety_orders"
              value={formData.max_safety_orders}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Active Safety Orders Count:</label>
            <input
              type="number"
              name="active_safety_orders_count"
              value={formData.active_safety_orders_count}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </fieldset>

        {/* Cooldown */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Cooldown (seconds):</label>
          <input
            type="number"
            name="cooldown"
            value={formData.cooldown}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Strategy Settings */}
        <fieldset className="p-4 border border-gray-300 rounded">
          <legend className="px-2 font-medium">Strategy Settings (RSI/EMA Scalping)</legend>
          
          <div className="flex flex-col mb-3">
            <label className="mb-1">RSI Period:</label>
            <input
              type="number"
              name="rsi_period"
              value={formData.strategy_list[0].options.rsi_period}
              onChange={handleStrategyChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-1">EMA Period:</label>
            <input
              type="number"
              name="ema_period"
              value={formData.strategy_list[0].options.ema_period}
              onChange={handleStrategyChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col mb-3">
            <label className="mb-1">RSI Overbought Level:</label>
            <input
              type="number"
              name="rsi_overbought"
              value={formData.strategy_list[0].options.rsi_overbought}
              onChange={handleStrategyChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">RSI Oversold Level:</label>
            <input
              type="number"
              name="rsi_oversold"
              value={formData.strategy_list[0].options.rsi_oversold}
              onChange={handleStrategyChange}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </fieldset>

        <button 
          type="submit" 
          disabled={loading}
          className={`py-2 px-4 rounded text-white font-medium ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating Bot...' : 'Create Bot'}
        </button>
      </form>

      {response && (
        <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-green-700 font-medium">Bot Created Successfully</h3>
          <pre className="mt-2 whitespace-pre-wrap break-words">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-red-700 font-medium">Error</h3>
          <pre className="mt-2 whitespace-pre-wrap break-words">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default HomePage;