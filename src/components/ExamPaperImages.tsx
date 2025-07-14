import React, { useState } from 'react';
import { FileImage } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface ExamPaperImagesProps {
  iframeSrcUrl: string; // 使用我在上个回答中建议的 props 名称
}

export function ExamPaperImages({ iframeSrcUrl }: ExamPaperImagesProps) {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  if (!iframeSrcUrl) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FileImage className="w-6 h-6 mr-2 text-blue-600" />
        答题卡详情
      </h2>
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height: '80vh' }}>
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
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  );
}