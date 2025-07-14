import React from 'react';
import { BookOpen, Trophy } from 'lucide-react';

interface SubjectScore {
  id: number;
  name: string;
  score: number;
  omrscore: number;
  itemscore: number;
  color: string;
}

interface AllSubjectsScoreProps {
  scores: SubjectScore[];
  totalScore: number;
}

export function AllSubjectsScore({ scores, totalScore }: AllSubjectsScoreProps) {
  // 过滤掉总分为0的科目
  const validScores = scores.filter(score => score.score > 0);
  
  if (!validScores || validScores.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
        各科成绩汇总
      </h2>
      
      {/* 总分显示 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <div className="flex items-center justify-center">
          <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{totalScore}</div>
            <div className="text-sm text-gray-600">累计总分</div>
          </div>
        </div>
      </div>

      {/* 各科成绩网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validScores.map((subject) => (
          <div
            key={subject.id}
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{subject.name}</h3>
              <div className={`w-3 h-3 rounded-full ${subject.color.replace('hover:', '').replace('bg-', 'bg-').replace('-500', '-400').replace('-600', '-500')}`}></div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">{subject.score}</span>
                <span className="text-sm text-gray-500">总分</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-green-600">客观题: {subject.omrscore}</span>
                <span className="text-purple-600">主观题: {subject.itemscore}</span>
              </div>
              
              {/* 分数条 */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${subject.color.replace('hover:', '').replace('bg-', 'bg-').replace('-500', '-400').replace('-600', '-500')}`}
                  style={{ width: `${Math.min((subject.score / 150) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}