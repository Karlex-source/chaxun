import React, { useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { StudentInfoCard } from './components/StudentInfoCard';
import { AllSubjectsScore } from './components/AllSubjectsScore'; // 假设您已添加此组件
import { CurrentSubjectScore } from './components/CurrentSubjectScore'; // 假设您已添加此组件
import { ExamPaperImages } from './components/ExamPaperImages';
import { OMRDetails } from './components/OMRDetails';
import { ItemDetails } from './components/ItemDetails';
import { processExamData } from './utils/examDataProcessor';
import { ProcessedExamData } from './types/exam';

const subjects = [
  // ... subjects 数组保持不变
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
  const [iframeUrl, setIframeUrl] = useState<string>(''); // 改个更清晰的名字
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryAllSubjects = async (studentIdToQuery: string, signal: AbortSignal) => {
    // ... 此函数逻辑保持不变
  };

  const handleQuery = async (subjectToQuery?: number) => {
    if (!studentId.trim()) {
      setError('请输入考号');
      return;
    }

    setLoading(true);
    setError(null);
    setExamData(null);
    setIframeUrl('');

    const finalSubjectId = subjectToQuery ?? selectedSubject;
    const studentIdTrimmed = studentId.trim();
    
    try {
      const examGroup = '90376';
      const examId = `${examGroup}000${finalSubjectId}`;
      
      // 用于 fetch 数据的代理 URL
      const dataFetchUrl = `/api/exam?eg=${examGroup}&sid=${studentIdTrimmed}&eid=${examId}`;
      
      // ✨ 用于 iframe 的、会移除安全头的代理 URL
      const pageRenderUrl = `/api/exam-page?eg=${examGroup}&sid=${studentIdTrimmed}&eid=${examId}`;
      setIframeUrl(pageRenderUrl);

      // queryAllSubjects(studentIdTrimmed); // 可以选择性地在这里触发所有科目查询

      const response = await fetch(dataFetchUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const htmlText = await response.text();
      
      const imgsMatch = htmlText.match(/var imgs = (\[.*?\]);/s);
      const tmplMatch = htmlText.match(/var tmpl = (\{.*?\});/s);
      const scoreMatch = htmlText.match(/var score = (\{.*?\});/s);

      if (!imgsMatch || !tmplMatch || !scoreMatch) {
         console.warn('无法解析成绩详情，但仍会显示答题卡 iframe。');
      } else {
        const imgs = JSON.parse(imgsMatch[1]);
        const tmpl = JSON.parse(tmplMatch[1]);
        const score = JSON.parse(scoreMatch[1]);
        const processedData = processExamData({ imgs, tmpl, score });
        setExamData(processedData);
      }
    } catch (err: any) {
      console.error('API 调用或解析失败:', err);
      setError(err.message || '查询失败，请检查考号或网络。');
      setIframeUrl(''); // 查询失败，不显示iframe
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubject(subjectId);
    if (studentId.trim()) {
      handleQuery(subjectId); // 重新执行完整查询
    }
  };

  // ... 其他 handle 函数保持不变

  const getCurrentSubjectName = () => subjects.find(s => s.id === selectedSubject)?.name || '未知科目';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header 和 Subject Selection 保持不变 */}
      <header>...</header>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">...</div>

        {loading && <LoadingSpinner message={`正在查询...`} />}
        {error && !loading && <ErrorMessage message={error} onRetry={handleQuery} />}
        
        {/* 主要渲染逻辑 */}
        <div className="space-y-6">
          {examData && !loading && (
            <>
              <StudentInfoCard {...examData.studentInfo} />
              <CurrentSubjectScore
                subjectName={getCurrentSubjectName()}
                score={examData.studentInfo.score}
                omrscore={examData.studentInfo.omrscore}
                itemscore={examData.studentInfo.itemscore}
              />
              <OMRDetails omrDetails={examData.omrDetails} />
              <ItemDetails itemDetails={examData.itemDetails} />
            </>
          )}

          {iframeUrl && !loading && (
            <ExamPaperImages iframeSrcUrl={iframeUrl} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;