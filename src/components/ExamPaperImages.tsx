import React, { useState, useEffect, useRef } from 'react';
import { FileImage, Maximize2, Minimize2, RefreshCw, ExternalLink } from 'lucide-react';

interface ExamPaperImagesProps {
  images: any[];
  originalApiUrl: string;
}

export function ExamPaperImages({ images, originalApiUrl }: ExamPaperImagesProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // 加载并处理HTML内容
  const loadExamPage = async () => {
    if (!urlParams) {
      setError('无法解析URL参数');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 通过代理获取HTML内容
      const proxyUrl = `/api/exam-page?eg=${urlParams.eg}&sid=${urlParams.sid}&eid=${urlParams.eid}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('未能找到该考号和科目的答题卡页面，请确认考号和科目是否正确。');
        }
        throw new Error(`加载失败 (${response.status}): ${response.statusText || '服务器错误'}`);
      }

      let html = await response.text();
      
      // 处理HTML内容，修复资源路径
      html = html.replace(/src="([^"]*?)"/g, (match, src) => {
        if (src.startsWith('http')) {
          return match; // 绝对路径保持不变
        }
        if (src.startsWith('/')) {
          return `src="/api/proxy${src}"`;
        }
        return `src="/api/proxy/${src}"`;
      });

      html = html.replace(/href="([^"]*?)"/g, (match, href) => {
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
          return match;
        }
        if (href.startsWith('/')) {
          return `href="/api/proxy${href}"`;
        }
        return `href="/api/proxy/${href}"`;
      });

      // 添加基础样式和脚本修复
      const processedHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <base href="https://yunyj.linyi.net/">
          <style>
            body { 
              margin: 0; 
              padding: 10px; 
              font-family: Arial, sans-serif;
              background: #f5f5f5;
            }
            .container {
              max-width: 100%;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          ${html.replace(/<html[^>]*>|<\/html>|<head[^>]*>.*?<\/head>|<body[^>]*>|<\/body>/gis, '')}
          <script>
            // 修复可能的跨域问题
            window.addEventListener('error', function(e) {
              console.log('Resource loading error:', e);
            });
            
            // 确保所有链接在父窗口打开
            document.addEventListener('click', function(e) {
              if (e.target.tagName === 'A') {
                e.preventDefault();
                if (e.target.href && !e.target.href.startsWith('javascript:')) {
                  window.parent.open(e.target.href, '_blank');
                }
              }
            });
          </script>
        </body>
        </html>
      `;

      setHtmlContent(processedHtml);
    } catch (err) {
      console.error('加载答题卡页面失败:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExamPage();
  }, [originalApiUrl]);

  const handleRefresh = () => {
    loadExamPage();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    if (urlParams) {
      const originalUrl = `https://yunyj.linyi.net/wechat/imgs?eg=${urlParams.eg}&sid=${urlParams.sid}&eid=${urlParams.eid}`;
      window.open(originalUrl, '_blank');
    }
  };

  if (!urlParams) {
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

  const MiniExamViewer = ({ className = "" }: { className?: string }) => (
    <div className={`relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 ${className}`}>
      {isLoading && (
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
      
      {htmlContent && !error && (
        <iframe
          ref={iframeRef}
          srcDoc={htmlContent}
          className={`w-full border-0 ${isFullscreen ? 'h-full' : 'h-[600px]'}`}
          title="答题卡查看"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => setIsLoading(false)}
        />
      )}
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
        
        <MiniExamViewer />
        
        <div className="mt-3 text-sm text-gray-500 text-center">
          <p>答题卡实时查看 - 通过代理加载完整页面内容</p>
          <p className="text-xs mt-1">
            原始链接: <span className="font-mono text-blue-600">
              https://yunyj.linyi.net/wechat/imgs?eg={urlParams.eg}&sid={urlParams.sid}&eid={urlParams.eid}
            </span>
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
              <MiniExamViewer className="h-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}