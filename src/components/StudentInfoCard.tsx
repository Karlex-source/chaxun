import React from 'react';
import { User, MapPin, School, Users } from 'lucide-react';

interface StudentInfoProps {
  name: string;
  code: string;
  district: string;
  schoolname: string;
  classroom: string;
  course: string;
  score: number;
  omrscore: number;
  itemscore: number;
}

export function StudentInfoCard({ name, code, district, schoolname, classroom, course, score, omrscore, itemscore }: StudentInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <User className="w-6 h-6 mr-2 text-blue-600" />
        学生信息
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">姓名:</span>
          <span className="font-semibold text-gray-800">{name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">考号:</span>
          <span className="font-semibold text-gray-800">{code}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">科目:</span>
          <span className="font-semibold text-blue-600">{course}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">地区:</span>
          <span className="font-semibold text-gray-800">{district}</span>
        </div>
        <div className="flex items-center space-x-2">
          <School className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">学校:</span>
          <span className="font-semibold text-gray-800">{schoolname}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">班级:</span>
          <span className="font-semibold text-gray-800">{classroom}</span>
        </div>
      </div>
      
      {/* 总分显示 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">总分</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{omrscore}</div>
            <div className="text-sm text-gray-600">客观题</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{itemscore}</div>
            <div className="text-sm text-gray-600">主观题</div>
          </div>
        </div>
      </div>
    </div>
  );
}