import React, { useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { StudentInfoCard } from './components/StudentInfoCard';
import { AllSubjectsScore } from './components/AllSubjectsScore';
import { CurrentSubjectScore } from './components/CurrentSubjectScore';
import { ExamPaperImages } from './components/ExamPaperImages';
import { OMRDetails } from './components/OMRDetails';
import { ItemDetails } from './components/ItemDetails';
import { processExamData, ProcessedExamData } from './utils/examDataProcessor';
import { fetchExamData } from './services/examApi'; // 统一的 API 服务

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
  const [examData, setExamData] = useState<ProcessedExamData | null>(null);
  const [allSubjectsData, setAllSubjectsData] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询所有科目成绩
  const queryAllSubjects = async (studentIdToQuery: string, signal?: AbortSignal) => {
    let total = 0;

    const queryPromises = subjects.map(async (subject) => {
      try {
        const data = await fetchExamData(studentIdToQuery, subject.id, signal);
        return {
          id: subject.id,
          name: subject.name,
          score: data.score.score || 0,
          omrscore: data.score.omrscore || 0,
          itemscore: data.score.itemscore || 0,
          color: subject.color
        };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        console.error(`查询${subject.name}失败:`, error);
        return {
          id: subject.id,
          name: subject.name,
          score: 0,
          omrscore: 0,
          itemscore: 0,
          color: subject.color
        };
      }
    });

    try {
      const results = await Promise.all(queryPromises);
      const validScores = results.filter(r => r.score > 0);
      setAllSubjectsData(validScores);
      total = validScores.reduce((acc, cur) => acc + (cur.score || 0), 0);
      setTotalScore(total);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setError('查询部分科目时出错');
      }
    }
  };

  const handleQuery = async (subjectToQuery?: number) => {
    if (!studentId.trim()) {
      setError('请输入考号');
      return;
    }

    setLoading(true);
    setError(null);
    setExamData(null);
    setAllSubjectsData([]);
    setTotalScore(0);

    const finalSubjectId = subjectToQuery ?? selectedSubject;
    const abortController = new AbortController();

    try {
      // 并发查询
      await Promise.all([
        queryAllSubjects(studentId.trim(), abortController.signal),
        handleQuerySingleSubject(finalSubjectId, studentId.trim(), abortController.signal)
      ]);
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // 用户取消了请求
      }
      console.error('API调用失败:', err);
      setError(err instanceof Error ? err.message : '查询失败，请检查考号是否正确或稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 单独查询某个科目的详细信息
  const handleQuerySingleSubject = async (subjectId: number, idToQuery: string, signal?: AbortSignal) => {
    setExamData(null); // Clear previous subject details
    try {
      const response = await fetchExamData(idToQuery, subjectId, signal);
      const processedData = processExamData(response, subjectId);
      setExamData(processedData);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw err;
      }
      // 在此处只记录错误，不设置全局错误状态，因为可能是单个科目查询失败
      console.error(`查询科目 ${subjectId} 详情失败`, err);
      setError(`加载科目 "${subjects.find(s=>s.id === subjectId)?.name}" 的详细信息失败。`);
    }
  };
  
  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubject(subjectId);
    if (studentId.trim()) {
      setLoading(true);
      setError(null);
      handleQuerySingleSubject(subjectId, studentId.trim()).finally(()=> setLoading(false));
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Side: Title */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">临沂期末考试成绩查询</h1>
            </div>
            {/* Right Side: Search Controls */}
            <div className="flex w-full md:w-auto items-center space-x-2">
              <input
                type="text"
                placeholder="请输入考号"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleQuery()}
                disabled={loading}
                className="flex-shrink-0 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? '查询中' : '查询'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Subject Selection */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            选择科目 - 当前: <span className="text-blue-600 font-bold">{getCurrentSubjectName()}</span>
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectChange(subject.id)}
                  disabled={loading}
                  className={`flex-1 px-3 py-3 text-sm sm:text-base text-white rounded-lg font-medium transition-all duration-200 ${subject.color} ${
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
            <LoadingSpinner message={`正在查询...`} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Results */}
        <div className="space-y-6">
          {/* Student Info and Scores (only shown if a specific subject's data is loaded) */}
          {examData && !loading && (
            <>
              <StudentInfoCard {...examData.studentInfo} />
              <CurrentSubjectScore
                subjectName={getCurrentSubjectName()}
                score={examData.studentInfo.score}
                omrscore={examData.studentInfo.omrscore}
                itemscore={examData.studentInfo.itemscore}
              />
            </>
          )}

          {/* All Subjects Score Summary (shown if available) */}
          {allSubjectsData.length > 0 && !loading && (
            <AllSubjectsScore scores={allSubjectsData} totalScore={totalScore} />
          )}

          {/* Detailed Views (only shown if a specific subject's data is loaded) */}
          {examData && !loading && (
            <>
              <ExamPaperImages studentId={studentId} subjectId={selectedSubject} />
              <OMRDetails omrDetails={examData.omrDetails} />
              <ItemDetails itemDetails={examData.itemDetails} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;