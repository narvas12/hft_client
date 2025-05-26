import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionService from '../../services/question.service';

const UploadPDFQuestions = () => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('English Language');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage({ text: '', variant: '' });

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    } else {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage({ text: 'Please select a PDF file', variant: 'danger' });
      return;
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setMessage({ text: 'Only PDF files are allowed', variant: 'danger' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', variant: '' });
    setUploadProgress(0);

    try {
      const progressConfig = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      const response = await QuestionService.uploadPdfQuestions(file, subject, progressConfig);
      
      setMessage({
        text: `Successfully uploaded ${response.total_questions} questions from PDF`,
        variant: 'success',
      });
      clearFile();
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to upload PDF',
        variant: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const alertVariants = {
    success: 'bg-green-100 border-green-400 text-green-700',
    danger: 'bg-red-100 border-red-400 text-red-700',
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/questions/list')}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H6a1 1 0 00-1 1v1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1h-1V4a1 1 0 00-1-1h-2V3a1 1 0 00-1-1H9zm-1 6a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 100 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          View Questions
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white py-4 px-6">
          <h2 className="text-xl font-semibold">Upload Questions from PDF</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={handleSubjectChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="English Language">English Language</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                PDF File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-md cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      {file ? file.name : 'Click to select PDF file'}
                    </p>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Only PDF files containing WAEC-style questions are supported
              </p>
            </div>

            {previewUrl && (
              <div className="mb-4 border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">PDF Preview</h3>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove File
                  </button>
                </div>
                <div className="h-64 border rounded-md overflow-hidden">
                  <iframe 
                    src={previewUrl} 
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Note: This preview may not show all content perfectly. Download the file to view properly.
                </p>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Uploading...</span>
                  <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full animate-pulse" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {message.text && (
              <div className={`mb-4 px-4 py-3 border rounded ${alertVariants[message.variant]}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !file}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                (isLoading || !file) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload PDF'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPDFQuestions;