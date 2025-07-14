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
import { processExamData, calculateTotalScores, ProcessedExamData } from './utils/examDataProcessor';
import { fetchExamData } from './services/examApi';

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

// ✨ 新增：考试组/年级选项
const examGroups = [
  { name: '高一', id: '90404' },
  { name: '高二', id: '90405' },
  { name: '往届高三 (测试)', id: '90376' },
];

function App() {
  const [studentId, setStudentId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [examData, setExamData] = useState<ProcessedExamData | null>(null);
  const [allSubjectsData, setAllSubjectsData] = useState<any[]>([]);
  // ✨ 新增：管理所选考试组的状态，并设置默认值
  const [examGroup, setExamGroup] = useState(examGroups[2].id); 

  const [originalTotal, setOriginalTotal] = useState(0);
  const [tieredTotal, setTieredTotal] = useState(0);
  const [classRank, setClassRank] = useState(0);
  const [gradeRank, setGradeRank] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryAllSubjects = async (studentIdToQuery: string, signal?: AbortSignal) => {
    const queryPromises = subjects.map(async (subject) => {
      try {
        // ✨ 修改点：传递动态的 examGroup
        const data = await fetchExamData(examGroup, studentIdToQuery, subject.id, signal);
        return {
          id: subject.id, name: subject.name,
          score: data.score.score || 0, omrscore: data.score.omrscore || 0,
          itemscore: data.score.itemscore || 0, color: subject.color
        };
      } catch {
        return { id: subject.id, name: subject.name, score: 0, omrscore: 0, itemscore: 0, color: subject.color };
      }
    });

    const results = await Promise.all(queryPromises);
    const validScores = results.filter(r => r.score > 0);
    setAllSubjectsData(validScores);
    
    const { originalTotal, tieredTotal } = calculateTotalScores(validScores);
    setOriginalTotal(originalTotal);
    setTieredTotal(tieredTotal);
    
    // 使用随机数作为排名占位符
    setClassRank(Math.floor(Math.random() * 40) + 1);
    setGradeRank(Math.floor(Math.random() * 500) + 20);
  };

  const handleQuerySingleSubject = async (subjectId: number, idToQuery: string, signal?: AbortSignal) => {
    setExamData(null);
    try {
      // ✨ 修改点：传递动态的 examGroup
      const response = await fetchExamData(examGroup, idToQuery, subjectId, signal);
      const processedData = processExamData(response, subjectId);
      setExamData(processedData);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') throw err;
      setError(`加载科目 "${subjects.find(s=>s.id === subjectId)?.name}" 的详细信息失败。`);
    }
  };

  const handleQuery = async () => {
    if (!studentId.trim()) {
      setError('请输入考号');
      return;
    }
    setLoading(true);
    setError(null);
    setOriginalTotal(0);
    setTieredTotal(0);
    setClassRank(0);
    setGradeRank(0);
    const abortController = new AbortController();
    try {
      await Promise.all([
        queryAllSubjects(studentId.trim(), abortController.signal),
        handleQuerySingleSubject(selectedSubject, studentId.trim(), abortController.signal)
      ]);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubject(subjectId);
    if (studentId.trim()) {
      setLoading(true);
      setError(null);
      handleQuerySingleSubject(subjectId, studentId.trim()).finally(() => setLoading(false));
    } else {
      setExamData(null);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleQuery();
  };

  const getCurrentSubjectName = () => subjects.find(s => s.id === selectedSubject)?.name || '未知科目';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">临沂期末考试成绩查询系统</h1>
            </div>
            
            {/* ✨ 关键修改：将输入、选择和按钮包裹在一个容器中，实现移动端垂直排列 */}
            <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center gap-2">
              <input
                type="text"
                placeholder="请输入考号"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                className="w-full md:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={examGroup}
                onChange={(e) => setExamGroup(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {examGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
              <button
                onClick={handleQuery}
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

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            选择科目 - 当前: <span className="text-blue-600 font-bold">{getCurrentSubjectName()}</span>
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectChange(subject.id)}
                disabled={loading}
                className={`px-3 py-3 text-sm sm:text-base text-white rounded-lg font-medium transition-all duration-200 ${subject.color} ${
                  selectedSubject === subject.id ? 'ring-4 ring-offset-2 ring-blue-300 transform scale-105' : ''
                } disabled:opacity-50`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="bg-white rounded-lg shadow-lg p-6"><LoadingSpinner message="正在查询..." /></div>}
        {error && !loading && <ErrorMessage message={error} onRetry={handleRetry} />}

        <div className="space-y-6">
          {examData && !loading && (
            <>
              <StudentInfoCard {...examData.studentInfo} />
              <CurrentSubjectScore {...examData.studentInfo} subjectName={getCurrentSubjectName()} />
            </>
          )}

          {allSubjectsData.length > 0 && !loading && (
            <AllSubjectsScore
              scores={allSubjectsData}
              originalTotal={originalTotal}
              tieredTotal={tieredTotal}
              classRank={classRank}
              gradeRank={gradeRank}
            />
          )}

          {examData && !loading && studentId.trim() && (
            <>
              {/* ✨ 修改点：传递 examGroup prop */}
              <ExamPaperImages studentId={studentId} subjectId={selectedSubject} examGroup={examGroup} />
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