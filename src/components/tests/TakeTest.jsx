import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionService from "../../services/question.service";
import TestService from "../../services/test.service";
import {
  Pagination,
  Spin,
  Alert,
  Card,
  List,
  Button,
  Tag,
  Typography,
  Modal,
  Radio,
} from "antd";

const { Title, Text } = Typography;

const TakeTest = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await QuestionService.getQuestions({
        page,
        page_size: pageSize,
      });
      const results = response?.data?.results || response?.results || [];
      setQuestions(results);
      setPagination({
        current: page,
        pageSize,
        total: response?.data?.count || response?.count || results.length,
      });
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError(err.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    fetchQuestions(page, pageSize);
  };

  const handleSelectAnswer = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmitTest = async () => {
    if (Object.keys(selectedAnswers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => ({
      question_id: parseInt(questionId),
      answer_id: selectedAnswers[questionId],
    }));

    try {
      const result = await TestService.submitTest(formattedAnswers);
      console.log("Test Submission Result:", result);

      if (result && typeof result.score !== "undefined") {
        setScore(result.score);
        setModalVisible(true);
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit test. Please try again.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-6">
      <Card
        title={
          <Title level={2} className="!mb-2 text-center text-blue-600">
            📖 Take a Test
          </Title>
        }
        bordered={false}
        className="w-full max-w-4xl shadow-lg rounded-xl bg-white p-6"
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-6"
            closable
          />
        )}

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Spin size="large" tip="Loading questions..." />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              <List
                itemLayout="vertical"
                dataSource={questions}
                renderItem={(question, index) => (
                  <List.Item
                    key={question.id}
                    className="p-4 rounded-lg bg-gray-50 shadow hover:shadow-md transition-all duration-300"
                  >
                    <List.Item.Meta
                      title={
                        <Text strong className="text-lg">
                          {index + 1}. {question.text || "No question text"}
                        </Text>
                      }
                      description={
                        <Radio.Group
                          onChange={(e) =>
                            handleSelectAnswer(question.id, e.target.value)
                          }
                          value={selectedAnswers[question.id]}
                          className="mt-2"
                        >
                          {question.answers.map((answer) => (
                            <Radio
                              key={answer.id}
                              value={answer.id}
                              className="block py-1 text-gray-700 hover:text-blue-500"
                            >
                              {answer.text}
                            </Radio>
                          ))}
                        </Radio.Group>
                      }
                    />
                  </List.Item>
                )}
                className="mb-6"
              />
            </div>

            <div className="flex justify-center mt-6">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePaginationChange}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={["10", "20", "50"]}
              />
            </div>

            <div className="flex justify-center mt-6">
              <Button
                type="primary"
                onClick={handleSubmitTest}
                size="large"
                className="px-6 py-3 text-lg rounded-lg shadow-lg bg-blue-600 hover:bg-blue-700 transition-all"
                disabled={
                  Object.keys(selectedAnswers).length !== questions.length
                }
              >
                Submit Test
              </Button>
            </div>
          </>
        )}
      </Card>

      <Modal
        title="🎯 Test Results"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="retry"
            type="primary"
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Retry Test
          </Button>,
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <div className="text-center">
          <Text className="text-2xl font-bold text-gray-700">
            Your Score: {score}%
          </Text>

          <div className="mt-4">
            <Text strong>Total Questions:</Text> <Text>{questions.length}</Text>
          </div>

          <div className="mt-2">
            <Text strong>Correct Answers:</Text>{" "}
            <Text>{Math.round((score / 100) * questions.length)}</Text>
          </div>

          <div className="mt-4">
            <Tag
              color={score >= 80 ? "green" : score >= 50 ? "orange" : "red"}
              className="text-lg p-2"
            >
              {score >= 80
                ? "Excellent! 🎉"
                : score >= 50
                ? "Good Job! 👍"
                : "Needs Improvement 😞"}
            </Tag>
          </div>

          <div className="mt-6 text-gray-600">
            {score >= 80
              ? "Great work! Keep practicing to stay sharp."
              : score >= 50
              ? "You're doing well! Review the incorrect ones and try again."
              : "Don't worry! Review the topics and take the test again."}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TakeTest;
