import React, { useState } from 'react';
import { FileImage, Maximize2, Minimize2, ExternalLink, AlertTriangle } from 'lucide-react';

// ✨ 回退点：Props 接口不再需要 examGroup
interface ExamPaperImagesProps {
  studentId: string;
  subjectId: number;
  // examGroup prop 已移除
}

// ✨ 回退点：恢复硬编码的 EXAM_GROUP
const EXAM_GROUP = '90376';

export function ExamPaperImages({ studentId, subjectId }: ExamPaperImagesProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // ✨ 回退点：保持了对 studentId 的检查，但不再需要 examGroup
  if (!studentId.trim()) { 
      return (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileImage className="w-6 h-6 mr-2 text-blue-600" />
                  答题卡查看
              </h2>
              <div className="text-center py-8 text-gray-500">
                  请输入考号以查看答题卡。
              </div>
          </div>
      );
  }

  // ✨ 回退点：使用硬编码的 EXAM_GROUP 来构造链接
  const examId = `${EXAM_GROUP}000${subjectId}`; 
  const proxyUrl = `/api/exam?eg=${EXAM_GROUP}&sid=${studentId.trim()}&eid=${examId}`;
  const directUrl = `https://yunyj.linyi.net/wechat/imgs?eg=${EXAM_GROUP}&sid=${studentId.trim()}&eid=${examId}`;

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const openInNewTab = () => window.open(directUrl, '_blank', 'noopener,noreferrer');

  const IframeView = ({ className = "" }: { className?: string }) => (
    <div className={`relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${className}`}>
      <iframe
        src={proxyUrl}
        className={`w-full border-0 ${isFullscreen ? 'h-full' : 'h-[70vh]'}`}
        title="答题卡查看"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FileImage className="w-6 h-6 mr-2 text-blue-600" />
            答题卡查看
          </h2>
          <div className="flex items-center space-x-2">
            <button onClick={openInNewTab} className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" title="在新标签页中打开">
              <ExternalLink className="w-5 h-5" />
            </button>
            <button onClick={toggleFullscreen} className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title={isFullscreen ? "退出全屏" : "全屏查看"}>
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* ✨ 回退点：直接显示 iframe，即默认加载 */}
        <IframeView />
        
        <div className="mt-4 text-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>如果答题卡区域空白，请点击右上角的“新标签页”图标直接访问。</span>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col p-2 sm:p-4">
          <div className="flex items-center justify-between p-2 bg-white rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-800 ml-2">答题卡全屏查看</h3>
            <button onClick={toggleFullscreen} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="退出全屏">
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 bg-white rounded-b-lg overflow-hidden">
            <IframeView className="h-full w-full" />
          </div>
        </div>
      )}
    </>
  );
}