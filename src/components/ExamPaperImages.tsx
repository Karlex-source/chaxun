import React, { useState } from 'react';
import { FileImage, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

// 接口现在只需要一个 src url
interface ExamPaperImagesProps {
  iframeSrcUrl: string;
}

export function ExamPaperImages({ iframeSrcUrl }: ExamPaperImagesProps) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!iframeSrcUrl) {
    return null; // 如果没有URL，不渲染
  }

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  
  const openInNewTab = () => window.open(iframeSrcUrl, '_blank');

  const IframeView = ({ className = "" }: { className?: string }) => (
    <div className={`relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${className}`}>
      {isIframeLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <LoadingSpinner message="正在载入答题卡..." />
        </div>
      )}
      <iframe
        src={iframeSrcUrl}
        onLoad={() => setIsIframeLoading(false)}
        className={`w-full h-full border-0 ${isIframeLoading ? 'invisible' : 'visible'}`}
        title="答题卡查看"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
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
            <button
              onClick={openInNewTab}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="在新标签页打开"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="全屏查看"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 嵌入的 iframe 视图 */}
        <div className="h-[80vh]">
          <IframeView className="h-full" />
        </div>
      </div>

      {/* 全屏模态框 */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={toggleFullscreen}>
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">答题卡全屏查看</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={openInNewTab}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="在新标签页打开"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="退出全屏"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <IframeView className="h-full rounded-b-lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}