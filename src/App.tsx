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
  const [allSubjectsData, setAllSubjectsData] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [currentApiUrl, setCurrentApiUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 查询所有科目成绩
  const queryAllSubjects = async (studentIdToQuery: string, signal?: AbortSignal) => {
    const allScores: any[] = [];
    let total = 0;

    // 并发查询所有科目，而不是串行查询
    const queryPromises = subjects.map(async (subject) => {
      try {
        const examGroup = '90376';
        const examId = `${examGroup}000${subject.id}`;
        const url = `/api/exam?eg=${examGroup}&sid=${studentIdToQuery}&eid=${examId}`;
        
        const response = await fetch(url, { signal });
        if (response.ok) {
          const htmlText = await response.text();
          const scoreMatch = htmlText.match(/var score = (\{.*?\});/s);
          
          if (scoreMatch) {
            const score = JSON.parse(scoreMatch[1]);
            return {
              id: subject.id,
              name: subject.name,
              score: score.score || 0,
              omrscore: score.omrscore || 0,
              itemscore: score.itemscore || 0,
              color: subject.color
            };
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          throw error;
        }
        console.error(`查询${subject.name}失败:`, error);
      }
      
      // 如果查询失败，返回默认数据
      return {
        id: subject.id,
        name: subject.name,
        score: 0,
        omrscore: 0,
        itemscore: 0,
        color: subject.color
      };
    });

    try {
      const results = await Promise.all(queryPromises);
      results.forEach(result => {
        if (result) {
          allScores.push(result);
          total += result.score || 0;
        }
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      // 如果并发查询失败，使用默认数据
      subjects.forEach(subject => {
        allScores.push({
          id: subject.id,
          name: subject.name,
          score: 0,
          omrscore: 0,
          itemscore: 0,
          color: subject.color
        });
      });
    }

    setAllSubjectsData(allScores);
    setTotalScore(total);
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
      // 并发查询：同时查询所有科目成绩和当前科目详细信息
      const [_, detailResponse] = await Promise.all([
        queryAllSubjects(studentId.trim(), abortController.signal),
        (async () => {
          const examGroup = '90376';
          const examId = `${examGroup}000${finalSubjectId}`;
          const url = `/api/exam?eg=${examGroup}&sid=${studentId.trim()}&eid=${examId}`;
          
          setCurrentApiUrl(url);
          return fetch(url, { signal: abortController.signal });
        })()
      ]);
      
      if (!detailResponse.ok) {
        throw new Error(`HTTP error! status: ${detailResponse.status}`);
      }

      const htmlText = await detailResponse.text();
      
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
      if (err.name === 'AbortError') {
        return; // 用户取消了请求
      }
      console.error('API调用失败:', err);
      setError(err instanceof Error ? err.message : '查询失败，请检查考号是否正确或稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubject(subjectId);
    if (studentId.trim()) {
      // 只查询当前科目详情，不重新查询所有科目
      handleQuerySingleSubject(subjectId);
    } else {
      setExamData(null);
      setError(null);
    }
  };

  // 单独查询某个科目的详细信息
  const handleQuerySingleSubject = async (subjectId: number) => {
    setLoading(true);
    setError(null);
    setExamData(null);

    try {
      const examGroup = '90376';
      const examId = `${examGroup}000${subjectId}`;
      const url = `/api/exam?eg=${examGroup}&sid=${studentId.trim()}&eid=${examId}`;
      
      setCurrentApiUrl(url);
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
            {/* 标题部分 */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                临沂期末考试成绩查询系统
              </h1>
            </div>

            {/* ✨ 修改点：搜索控件的容器 */}
            <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center gap-2 md:gap-0 md:space-x-2">
              <input
                type="text"
                placeholder="请输入考号"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                className="w-full md:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleQuery()}
                disabled={loading}
                className="w-full md:w-auto justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
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
            
            {/* All Subjects Score Summary */}
            {allSubjectsData.length > 0 && (
              <AllSubjectsScore scores={allSubjectsData} totalScore={totalScore} />
            )}
            
            {/* Current Subject Score */}
            <CurrentSubjectScore 
              subjectName={getCurrentSubjectName()}
              score={examData.studentInfo.score}
              omrscore={examData.studentInfo.omrscore}
              itemscore={examData.studentInfo.itemscore}
            />
            
            {/* Exam Paper Images */}
            <ExamPaperImages images={examData.images} originalApiUrl={currentApiUrl} />
            
            {/* OMR Details */}
            <OMRDetails omrDetails={examData.omrDetails} />
            
            {/* Item Details */}
            <ItemDetails itemDetails={examData.itemDetails} />
          </div>
        )}

        {/* Show all subjects score even when no specific subject is selected */}
        {allSubjectsData.length > 0 && !examData && !loading && !error && studentId.trim() && (
          <div className="space-y-6">
            <AllSubjectsScore scores={allSubjectsData} totalScore={totalScore} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;