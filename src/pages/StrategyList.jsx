import React, { useEffect, useState } from 'react';
import hftBotService from '../services/hftBotService';

const StrategyList = () => {
  const [strategies, setStrategies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [strategyOptions, setStrategyOptions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data = await hftBotService.getStrategyList();
        setStrategies(data);
      } catch (err) {
        setError(err?.detail || 'Failed to fetch strategies');
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  const handleOptionChange = (key, optionType, value) => {
    setStrategyOptions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [optionType]: value
      }
    }));
  };

  const filteredStrategies = Object.entries(strategies).filter(([key, strategy]) => {
    // Search filter
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         key.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = filterType === 'all' || 
                       (filterType === 'indicator' && strategy.strategy_type === 'indicator') || 
                       (filterType === 'signal' && strategy.strategy_type === 'signal');
    
    return matchesSearch && matchesType;
  });

  const renderOptionInput = (key, optionKey, option) => {
    if (option === null) {
      return (
        <input
          type="number"
          placeholder={`Enter ${optionKey}`}
          className="input input-bordered w-full"
          onChange={(e) => handleOptionChange(key, optionKey, e.target.value)}
        />
      );
    }

    if (typeof option === 'object' && !Array.isArray(option)) {
      return (
        <select
          className="select select-bordered w-full"
          onChange={(e) => handleOptionChange(key, optionKey, e.target.value)}
        >
          <option value="">Select {optionKey.replace('_', ' ')}</option>
          {Object.entries(option).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      );
    }

    return null;
  };

  const renderStrategyCard = ([key, strategy]) => {
    const isSelected = selectedStrategy === key;
    const selectedOptions = strategyOptions[key] || {};
    const isIndicator = strategy.strategy_type === 'indicator';
    const isSignal = strategy.strategy_type === 'signal';

    return (
      <div
        key={key}
        className={`card bg-base-100 shadow-xl mb-6 transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
        }`}
      >
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="card-title">
                {strategy.name}
                {strategy.beta && (
                  <span className="badge badge-warning ml-2">BETA</span>
                )}
                {strategy.payed && (
                  <span className="badge badge-accent ml-2">PREMIUM</span>
                )}
              </h2>
              <div className="flex gap-2 mt-1">
                <span className={`badge ${
                  isIndicator ? 'badge-info' : 'badge-success'
                }`}>
                  {isIndicator ? 'Indicator' : 'Signal'}
                </span>
                {strategy.accounts_whitelist && (
                  <span className="badge badge-outline">
                    {strategy.accounts_whitelist.length} supported exchanges
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedStrategy(isSelected ? null : key)}
              className="btn btn-sm btn-ghost"
            >
              {isSelected ? '▲ Hide Details' : '▼ Show Details'}
            </button>
          </div>

          {isSelected && (
            <div className="mt-4 space-y-4">
              {strategy.options && (
                <div>
                  <h3 className="font-semibold mb-2">Configuration Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(strategy.options).map(([optionKey, option]) => (
                      <div key={optionKey} className="form-control">
                        <label className="label">
                          <span className="label-text capitalize">
                            {optionKey.replace('_', ' ')}
                          </span>
                        </label>
                        {renderOptionInput(key, optionKey, option)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {strategy.accounts_whitelist && (
                <div>
                  <h3 className="font-semibold mb-2">Supported Exchanges</h3>
                  <div className="flex flex-wrap gap-2">
                    {strategy.accounts_whitelist.map((account, index) => (
                      <div key={index} className="badge badge-outline">
                        {account.replace(/Account::|Accounts::/g, '')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-actions justify-end">
                <button className="btn btn-outline">Learn More</button>
                <button className="btn btn-primary">
                  Apply Strategy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Trading Strategies</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search strategies..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div className="flex-none">
            <select
              className="select select-bordered w-full md:w-48"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="indicator">Indicators</option>
              <option value="signal">Signals</option>
            </select>
          </div>
        </div>

        <div className="stats shadow mb-6">
          <div className="stat">
            <div className="stat-title">Total Strategies</div>
            <div className="stat-value">{Object.keys(strategies).length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Indicator Strategies</div>
            <div className="stat-value">
              {Object.values(strategies).filter(s => s.strategy_type === 'indicator').length}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Signal Strategies</div>
            <div className="stat-value">
              {Object.values(strategies).filter(s => s.strategy_type === 'signal').length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredStrategies.length > 0 ? (
          filteredStrategies.map(renderStrategyCard)
        ) : (
          <div className="alert alert-warning shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>No strategies found matching your criteria</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyList;