import React, { useState } from 'react';
import { FileImage, Maximize2, Minimize2, ExternalLink, AlertTriangle } from 'lucide-react';

interface ExamPaperImagesProps {
  images: any[];
  originalApiUrl: string;
}

export function ExamPaperImages({ images, originalApiUrl }: ExamPaperImagesProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // ✨ 修改点：默认设置为 true，直接显示答题卡
  const [showDirectAccess, setShowDirectAccess] = useState(true);

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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    if (directUrl) {
      window.open(directUrl, '_blank');
    }
  };

  const handleDirectAccess = () => {
    setShowDirectAccess(true);
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

  const DirectAccessView = ({ className = "" }: { className?: string }) => (
    <div className={`relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${className}`}>
      <iframe
        src={directUrl}
        className={`w-full border-0 ${isFullscreen ? 'h-full' : 'h-[600px]'}`}
        title="答题卡查看"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
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
        
        {!showDirectAccess ? (
          <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">答题卡</h3>
           
            <div className="space-y-3">
              
              <button
                onClick={handleDirectAccess}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                显示
              </button>
            </div>
          </div>
        ) : (
          <DirectAccessView />
        )}
        
        <div className="mt-3 text-sm text-gray-500 text-center">
         
         
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
              <DirectAccessView className="h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}