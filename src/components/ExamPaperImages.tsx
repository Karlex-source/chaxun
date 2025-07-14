import React from 'react';
import { FileImage } from 'lucide-react';

interface ExamImage {
  pageno: number;
  url: string;
}

interface ExamPaperImagesProps {
  images: ExamImage[];
}

export function ExamPaperImages({ images }: ExamPaperImagesProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FileImage className="w-6 h-6 mr-2 text-blue-600" />
        答题卡图片
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {images.map((image) => (
          <div key={image.pageno} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 text-center">
              第 {image.pageno} 页
            </h3>
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
              <img
                src={image.url}
                alt={`答题卡第${image.pageno}页`}
                className="w-full h-auto cursor-pointer hover:scale-105 transition-transform"
                onClick={() => window.open(image.url, '_blank')}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">点击图片查看大图</p>
          </div>
        ))}
      </div>
    </div>
  );
}