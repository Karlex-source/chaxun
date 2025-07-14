import React, { useState } from 'react';
import { FileImage } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

// 接口简化，现在只需要一个从 App.tsx 传递过来的 src url
interface ExamPaperImagesProps {
  iframeSrcUrl: string;
}

export function ExamPaperImages({ iframeSrcUrl }: ExamPaperImagesProps) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  // 如果父组件没有传来 URL，则不渲染任何内容
  if (!iframeSrcUrl) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FileImage className="w-6 h-6 mr-2 text-blue-600" />
        答题卡详情
      </h2>
      
      {/* iframe 容器 */}
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height: '80vh' }}>
        
        {/* iframe 加载时显示加载动画 */}
        {isIframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <LoadingSpinner message="正在载入答题卡..." />
          </div>
        )}

        {/* 
          iframe 本身。
          我们直接使用父组件传递的代理URL，不再进行任何客户端的URL构造。
          也不再需要 sandbox 属性，因为 Netlify 代理会处理跨域问题。
        */}
        <iframe
          src={iframeSrcUrl}
          onLoad={() => setIsIframeLoading(false)}
          className={`w-full h-full border-0 ${isIframeLoading ? 'invisible' : 'visible'}`}
          title="答题卡查看"
        />
      </div>
    </div>
  );
}