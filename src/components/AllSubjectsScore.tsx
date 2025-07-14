import React from 'react';
import { BookOpen, Trophy, Award } from 'lucide-react';
import { getTieredScore, TIERED_SUBJECT_IDS } from '../utils/examDataProcessor';

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
  originalTotal: number;
  tieredTotal: number;
  classRank: number;
  gradeRank: number;
}

export function AllSubjectsScore({ scores, originalTotal, tieredTotal, classRank, gradeRank }: AllSubjectsScoreProps) {
  // ✨ 修复点：不再过滤0分科目，只要有查询结果就显示
  if (!scores || scores.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
        各科成绩汇总
      </h2>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex flex-col md:flex-row justify-around items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{originalTotal}</div>
          <div className="text-sm text-gray-600">总分 (原始分)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-600">{tieredTotal}</div>
          <div className="text-sm text-gray-600">总分 (赋分)</div>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 flex items-center gap-1"><Award className="w-5 h-5"/>{classRank}</div>
              <div className="text-xs text-gray-500">班级排名</div>
          </div>
          <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center gap-1"><Trophy className="w-5 h-5"/>{gradeRank}</div>
              <div className="text-xs text-gray-500">年级排名</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((subject) => (
          <div key={subject.id} className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{subject.name}</h3>
              <div className={`w-3 h-3 rounded-full ${subject.color.replace('hover:', '').replace('bg-', 'bg-').replace('-500', '-400').replace('-600', '-500')}`}></div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-blue-600">{subject.score}</span>
                {TIERED_SUBJECT_IDS.includes(subject.id) && (
                  <span className="text-base font-bold text-teal-600">
                    (赋分: {getTieredScore(subject.score)})
                  </span>
                )}
                <span className="text-sm text-gray-500">原始分</span>
              </div>
              
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