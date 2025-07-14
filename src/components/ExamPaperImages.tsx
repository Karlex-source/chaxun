import React, { useState } from 'react';
import { FileImage, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

// 接口简化，我们只需要从 App.tsx 传入代理后的 URL
interface ExamPaperImagesProps {
  iframeSrcUrl: string;
}

export function ExamPaperImages({ iframeSrcUrl }: ExamPaperImagesProps) {
  // 我们只保留控制 Iframe 加载动画和全屏功能的 state
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 如果 App 组件还没有传来 URL，则不渲染任何东西
  if (!iframeSrcUrl) {
    return null;
  }

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // “在新标签页打开”功能，将代理 URL 转换回原始 URL
  const openInNewTab = () => {
    // Netlify 代理规则会去掉 /api/exam-page，所以我们直接用相对路径
    const directUrl = iframeSrcUrl.replace('/api/exam-page', 'https://yunyj.linyi.net/wechat/imgs');
    window.open(directUrl, '_blank');
  };

  // 这是一个可复用的 iframe 视图组件
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
        
        {/* ✨ 删除了所有判断逻辑，直接显示 iframe ✨ */}
        <div className="h-[80vh]">
          <IframeView className="h-full" />
        </div>
        
        {/* ✨ 底部的明文链接已被删除 ✨ */}
      </div>

      {/* 全屏模态框功能保持不变，这是一个很好的功能 */}
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