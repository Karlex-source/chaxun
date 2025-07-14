import React, { useState } from 'react';
import { FileImage, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface ExamPaperImagesProps {
  images: any[];
  originalApiUrl: string;
}

export function ExamPaperImages({ images, originalApiUrl }: ExamPaperImagesProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 从代理URL构造原始URL
  const constructOriginalUrl = (proxyUrl: string) => {
    try {
      const url = new URL(proxyUrl, window.location.origin);
      const eg = url.searchParams.get('eg');
      const sid = url.searchParams.get('sid');
      const eid = url.searchParams.get('eid');
      
      if (eg && sid && eid) {
        return `https://yunyj.linyi.net/wechat/imgs?eg=${eg}&sid=${sid}&eid=${eid}`;
      }
    } catch (error) {
      console.error('构造URL失败:', error);
    }
    return null;
  };

  const originalUrl = constructOriginalUrl(originalApiUrl);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.getElementById('exam-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!originalUrl) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FileImage className="w-6 h-6 mr-2 text-blue-600" />
          答题卡查看
        </h2>
        <div className="text-center py-8 text-gray-500">
          无法构造答题卡查看链接
        </div>
      </div>
    );
  }

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
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-5 h-5" />
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
        
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">正在加载答题卡...</p>
              </div>
            </div>
          )}
          
          <iframe
            id="exam-iframe"
            src={originalUrl}
            className="w-full h-[600px] border-0"
            onLoad={handleIframeLoad}
            title="答题卡查看"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
        
        <div className="mt-3 text-sm text-gray-500 text-center">
          <p>答题卡实时查看 - 支持缩放和交互操作</p>
          <p className="text-xs mt-1">
            链接: <span className="font-mono text-blue-600">{originalUrl}</span>
          </p>
        </div>
      </div>

      {/* 全屏模态框 */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">答题卡全屏查看</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="刷新"
                >
                  <RefreshCw className="w-5 h-5" />
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
            
            <div className="flex-1 relative bg-gray-50">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">正在加载答题卡...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src={originalUrl}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                title="答题卡全屏查看"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}