import React, { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const useTest = () => useContext(TestContext);

export const TestProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [testConfig, setTestConfig] = useState({
    subject: '',
    difficulty: 'medium',
    duration: 30, 
    questionCount: 20
  });
  
  const resetTest = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTestResults(null);
  };
  
  return (
    <TestContext.Provider value={{
      questions,
      setQuestions,
      currentQuestionIndex,
      setCurrentQuestionIndex,
      userAnswers,
      setUserAnswers,
      testResults,
      setTestResults,
      testConfig,
      setTestConfig,
      resetTest
    }}>
      {children}
    </TestContext.Provider>
  );
};