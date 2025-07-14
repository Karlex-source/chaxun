import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface OMRDetail {
  itemid: number;
  title: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  fullScore: number;
}

interface OMRDetailsProps {
  omrDetails: OMRDetail[];
}

export function OMRDetails({ omrDetails }: OMRDetailsProps) {
  if (!omrDetails || omrDetails.length === 0) {
    return null;
  }

  const getScoreIcon = (score: number, fullScore: number) => {
    if (score === 0) return <XCircle className="w-5 h-5 text-red-500" />;
    if (score === fullScore) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const getScoreColor = (score: number, fullScore: number) => {
    if (score === 0) return 'text-red-600 bg-red-50';
    if (score === fullScore) return 'text-green-600 bg-green-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">客观题详情</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">题号</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">学生答案</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">正确答案</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">得分</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {omrDetails.map((detail) => (
              <tr key={detail.itemid} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {detail.title}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                    {detail.studentAnswer || '未答'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono">
                    {detail.correctAnswer}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded font-semibold ${getScoreColor(detail.score, detail.fullScore)}`}>
                    {detail.score}/{detail.fullScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {getScoreIcon(detail.score, detail.fullScore)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}