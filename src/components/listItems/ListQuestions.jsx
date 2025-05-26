import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionService from "../../services/question.service";
import { Pagination, Spin, Alert, Card, List, Button, Tag, Typography, Modal } from "antd";

const { Title, Text } = Typography;

const ListQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handlePaginationChange = (page, pageSize) => {
    fetchQuestions(page, pageSize);
  };

  const handleViewDetails = (question) => {
    setSelectedQuestion(question);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedQuestion(null);
  };

  const difficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "green";
      case "medium":
        return "orange";
      case "hard":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card
        title={<Title level={3} className="!mb-0">Questions List</Title>}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/questions/upload")}
            size="large"
          >
            Upload Questions
          </Button>
        }
        bordered={false}
        className="shadow-sm"
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
          <div className="text-center p-12">
            <Spin size="large" tip="Loading questions..." />
          </div>
        ) : (
          <>
            <List
              itemLayout="vertical"
              dataSource={questions}
              renderItem={(question) => (
                <List.Item
                  key={question?.id}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => handleViewDetails(question)}
                      size="small"
                    >
                      View Details
                    </Button>,
                    <Tag color={difficultyColor(question?.difficulty)}>
                      {question?.difficulty}
                    </Tag>,
                    <Tag color="blue">{question?.subject}</Tag>,
                  ]}
                  className="hover:bg-gray-50 p-4 rounded-lg transition-colors shadow-md my-6"
                >
                  <List.Item.Meta
                    title={<Text strong className="text-lg">{question?.text || "No question text"}</Text>}
                    description={
                      <div className="mt-2">
                        {question?.answers?.map((answer) => (
                          <div
                            key={answer?.id}
                            className={`mb-1 p-2 rounded ${
                              answer?.is_correct
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50"
                            }`}
                          >
                            <Text className={answer?.is_correct ? "text-green-600 font-medium" : ""}>
                              {answer?.text}
                              {answer?.is_correct && (
                                <Tag color="green" className="ml-2 p-4">Correct</Tag>
                              )}
                            </Text>
                          </div>
                        ))}
                      </div>
                    }
                  />
                </List.Item>
              )}
              className="mb-6 p-4"
            />

            <div className="flex justify-center mt-6">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePaginationChange}
                onShowSizeChange={handlePaginationChange}
                showSizeChanger
                showQuickJumper
                pageSizeOptions={["10", "20", "50"]}
                size="default"
                className="ant-pagination-item-active:bg-blue-500"
              />
            </div>
          </>
        )}
      </Card>

      <Modal
        title="Question Details"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedQuestion && (
          <div className="p-4">
            <div className="mb-6">
              <Text strong className="text-lg block mb-2">Question:</Text>
              <Text className="text-base">{selectedQuestion.text}</Text>
            </div>

            <div className="mb-4">
              <Text strong className="block mb-2">Subject:</Text>
              <Tag color="blue">{selectedQuestion.subject}</Tag>
            </div>

            <div className="mb-4">
              <Text strong className="block mb-2">Difficulty:</Text>
              <Tag color={difficultyColor(selectedQuestion.difficulty)}>
                {selectedQuestion.difficulty}
              </Tag>
            </div>

            {selectedQuestion.explanation && (
              <div className="mb-6">
                <Text strong className="block mb-2">Explanation:</Text>
                <Text>{selectedQuestion.explanation}</Text>
              </div>
            )}

            <div>
              <Text strong className="block mb-4">Answers:</Text>
              <List
                dataSource={selectedQuestion.answers}
                renderItem={(answer) => (
                  <List.Item
                    className={`p-3 rounded mb-2 ${
                      answer.is_correct ? "bg-green-50" : "bg-gray-50"
                    }`}
                  >
                    <List.Item.Meta
                      title={
                        <div className="flex items-center">
                          <Text className={answer.is_correct ? "text-green-600 font-medium" : ""}>
                            {answer.text}
                          </Text>
                          {answer.is_correct && (
                            <Tag color="green" className="ml-2">
                              Correct Answer
                            </Tag>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListQuestions;