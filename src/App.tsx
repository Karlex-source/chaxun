import React, { useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { StudentInfoCard } from './components/StudentInfoCard';
import { ExamPaperImages } from './components/ExamPaperImages';
import { OMRDetails } from './components/OMRDetails';
import { ItemDetails } from './components/ItemDetails';
import { processExamData } from './utils/examDataProcessor';

const subjects = [
  { name: '语文', id: 1, color: 'bg-red-500 hover:bg-red-600' },
  { name: '数学', id: 2, color: 'bg-blue-500 hover:bg-blue-600' },
  { name: '英语', id: 3, color: 'bg-green-500 hover:bg-green-600' },
  { name: '物理', id: 4, color: 'bg-purple-500 hover:bg-purple-600' },
  { name: '化学', id: 5, color: 'bg-yellow-500 hover:bg-yellow-600' },
  { name: '生物', id: 6, color: 'bg-teal-500 hover:bg-teal-600' },
  { name: '地理', id: 7, color: 'bg-indigo-500 hover:bg-indigo-600' },
  { name: '政治', id: 8, color: 'bg-pink-500 hover:bg-pink-600' },
  { name: '历史', id: 9, color: 'bg-orange-500 hover:bg-orange-600' }
];

function App() {
  const [studentId, setStudentId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [examData, setExamData] = useState<any>(null);
  const [currentApiUrl, setCurrentApiUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async (subjectToQuery?: number) => {
    if (!studentId.trim()) {
      setError('请输入考号');
      return;
    }

    setLoading(true);
    setError(null);
    setExamData(null);

    const finalSubjectId = subjectToQuery ?? selectedSubject;

    try {
      const examGroup = '90376';
      const examId = `${examGroup}000${finalSubjectId}`;
      const url = `/api/exam?eg=${examGroup}&sid=${studentId.trim()}&eid=${examId}`;
      
      setCurrentApiUrl(url); // 使用代理URL来显示图片
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const htmlText = await response.text();
      
      const imgsMatch = htmlText.match(/var imgs = (\[.*?\]);/s);
      const tmplMatch = htmlText.match(/var tmpl = (\{.*?\});/s);
      const scoreMatch = htmlText.match(/var score = (\{.*?\});/s);

      if (!imgsMatch || !tmplMatch || !scoreMatch) {
        throw new Error('无法解析响应数据，请检查考号是否正确');
      }

      try {
        const imgs = JSON.parse(imgsMatch[1]);
        const tmpl = JSON.parse(tmplMatch[1]);
        const score = JSON.parse(scoreMatch[1]);

        const processedData = processExamData({ imgs, tmpl, score });
        setExamData(processedData);
        
      } catch (parseError) {
        throw new Error('数据解析失败，请稍后重试');
      }
      
    } catch (err) {
      console.error('API调用失败:', err);
      setError(err instanceof Error ? err.message : '查询失败，请检查考号是否正确或稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubject(subjectId);
    if (studentId.trim()) {
      handleQuery(subjectId);
    } else {
      setExamData(null);
      setError(null);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleQuery();
  };

  const getCurrentSubjectName = () => {
    return subjects.find(s => s.id === selectedSubject)?.name || '未知科目';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">临沂期末考试成绩查询系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="请输入考号"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleQuery()}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? '查询中...' : '查询'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Subject Selection */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            选择科目 - 当前选择: <span className="text-blue-600">{getCurrentSubjectName()}</span>
          </h2>
          <div className="space-y-4">
            {/* 第一行：语文数学英语 */}
            <div className="flex space-x-4">
              {subjects.slice(0, 3).map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectChange(subject.id)}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 ${subject.color} ${
                    selectedSubject === subject.id ? 'ring-4 ring-offset-2 ring-blue-300 transform scale-105' : ''
                  } disabled:opacity-50`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
            
            {/* 第二行：物理化学生物 */}
            <div className="flex space-x-4">
              {subjects.slice(3, 6).map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectChange(subject.id)}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 ${subject.color} ${
                    selectedSubject === subject.id ? 'ring-4 ring-offset-2 ring-blue-300 transform scale-105' : ''
                  } disabled:opacity-50`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
            
            {/* 第三行：政治历史地理 */}
            <div className="flex space-x-4">
              {subjects.slice(6, 9).map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectChange(subject.id)}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 ${subject.color} ${
                    selectedSubject === subject.id ? 'ring-4 ring-offset-2 ring-blue-300 transform scale-105' : ''
                  } disabled:opacity-50`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <LoadingSpinner message={`正在查询${getCurrentSubjectName()}成绩...`} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Exam Results */}
        {examData && !loading && !error && (
          <div className="space-y-6">
            {/* Student Info */}
            <StudentInfoCard {...examData.studentInfo} />
            
            {/* Exam Paper Images */}
            <ExamPaperImages images={examData.images} originalApiUrl={currentApiUrl} />
            
            {/* OMR Details */}
            <OMRDetails omrDetails={examData.omrDetails} />
            
            {/* Item Details */}
            <ItemDetails itemDetails={examData.itemDetails} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;