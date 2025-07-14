import React from 'react';
import { BookOpen } from 'lucide-react';

interface CurrentSubjectScoreProps {
  subjectName: string;
  score: number;
  omrscore: number;
  itemscore: number;
}

export function CurrentSubjectScore({ subjectName, score, omrscore, itemscore }: CurrentSubjectScoreProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
        {subjectName} - 本科目成绩
      </h2>
      
      <div className="flex items-center justify-center space-x-12">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{score}</div>
          <div className="text-sm text-gray-600 font-medium">总分</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{omrscore}</div>
          <div className="text-sm text-gray-600 font-medium">客观题</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{itemscore}</div>
          <div className="text-sm text-gray-600 font-medium">主观题</div>
        </div>
      </div>
    </div>
  );
}