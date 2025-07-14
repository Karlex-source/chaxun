import React from 'react';
import { Edit3 } from 'lucide-react';

interface ItemDetail {
  itemid: number;
  title: string;
  score: number;
  fullscore: number;
  score1: number;
  score2: number;
}

interface ItemDetailsProps {
  itemDetails: ItemDetail[];
}

export function ItemDetails({ itemDetails }: ItemDetailsProps) {
  if (!itemDetails || itemDetails.length === 0) {
    return null;
  }

  const getScoreColor = (score: number, fullScore: number) => {
    const percentage = (score / fullScore) * 100;
    if (percentage >= 90) return 'text-green-600 bg-green-50';
    if (percentage >= 70) return 'text-blue-600 bg-blue-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Edit3 className="w-6 h-6 mr-2 text-blue-600" />
        主观题详情
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">题号</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">最终得分</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">满分</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">1评</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">2评</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">得分率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {itemDetails.map((detail) => {
              const percentage = ((detail.score / detail.fullscore) * 100).toFixed(1);
              return (
                <tr key={detail.itemid} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {detail.title}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(detail.score, detail.fullscore)}`}>
                      {detail.score}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {detail.fullscore}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {detail.score1}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {detail.score2}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            parseFloat(percentage) >= 90 ? 'bg-green-500' :
                            parseFloat(percentage) >= 70 ? 'bg-blue-500' :
                            parseFloat(percentage) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-[3rem]">{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}