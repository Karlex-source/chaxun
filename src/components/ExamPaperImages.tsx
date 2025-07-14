import React, { useState } from 'react';
import { FileImage, Maximize2, Minimize2, RefreshCw, ExternalLink } from 'lucide-react';

interface ExamPaperImagesProps {
  images: any[];
  originalApiUrl: string;
}

export function ExamPaperImages({ images, originalApiUrl }: ExamPaperImagesProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从代理URL构造参数
  const getUrlParams = (proxyUrl: string) => {
    try {
      const url = new URL(proxyUrl, window.location.origin);
      const eg = url.searchParams.get('eg');
      const sid = url.searchParams.get('sid');
      const eid = url.searchParams.get('eid');
      
      if (eg && sid && eid) {
        return { eg, sid, eid };
      }
    } catch (error) {
      console.error('解析URL参数失败:', error);
    }
    return null;
  };

  const urlParams = getUrlParams(originalApiUrl);

  // 构造直接访问的URL
  const getDirectUrl = () => {
    if (!urlParams) return '';
    return `https://yunyj.linyi.net/wechat/imgs?eg=${urlParams.eg}&sid=${urlParams.sid}&eid=${urlParams.eid}`;
  };

  const directUrl = getDirectUrl();

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('无法加载答题卡，请检查网络连接或考号是否正确');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    if (directUrl) {
      window.open(directUrl, '_blank');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    // 通过重新设置src来刷新iframe
    const iframe = document.getElementById('exam-iframe') as HTMLIFrameElement;
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  };

  if (!urlParams || !directUrl) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FileImage className="w-6 h-6 mr-2 text-blue-600" />
          答题卡查看
        </h2>
        <div className="text-center py-8 text-red-500">
          无法构造答题卡查看链接
        </div>
      </div>
    );
  }

  const ExamViewer = ({ className = "" }: { className?: string }) => (
    <div className={`relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">正在加载答题卡...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="text-red-500 mb-2">加载失败</div>
            <div className="text-sm text-gray-600 mb-4">{error}</div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      )}
      
      <iframe
        id="exam-iframe"
        src={directUrl}
        className={`w-full border-0 ${isFullscreen ? 'h-full' : 'h-[600px]'}`}
        title="答题卡查看"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
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
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
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
        
        <ExamViewer />
        
        <div className="mt-3 text-sm text-gray-500 text-center">
          <p>答题卡实时查看 - 直接访问原始页面</p>
          <p className="text-xs mt-1">
            访问链接: <span className="font-mono text-blue-600">{directUrl}</span>
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
              <ExamViewer className="h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}