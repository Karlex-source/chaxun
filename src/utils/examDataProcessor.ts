import { ExamResponse, ProcessedExamData } from '../types/exam';

// 标准赋分函数 (临时占位, 您可以稍后根据实际规则修改此函数)
export function getTieredScore(originalScore: number): number {
  if (originalScore > 100) originalScore = 100; // 限制最高分
  if (originalScore < 0) originalScore = 0;   // 限制最低分

  if (originalScore >= 90) return 91 + Math.round((originalScore - 90) * (9 / 10));
  if (originalScore >= 78) return 81 + Math.round((originalScore - 78) * (9 / 11));
  if (originalScore >= 66) return 71 + Math.round((originalScore - 66) * (9 / 11));
  if (originalScore >= 54) return 61 + Math.round((originalScore - 54) * (9 / 11));
  if (originalScore >= 42) return 51 + Math.round((originalScore - 42) * (9 / 11));
  if (originalScore >= 30) return 41 + Math.round((originalScore - 30) * (9 / 11));
  return 30 + Math.round(originalScore * (10 / 29));
}

// 需要赋分的科目ID
export const TIERED_SUBJECT_IDS = [4, 5, 6, 7, 8, 9]; // 物理,化学,生物,地理,政治,历史

export function processExamData(response: ExamResponse, subjectId: number): ProcessedExamData {
  const { imgs, tmpl, score } = response;

  const isTieredSubject = TIERED_SUBJECT_IDS.includes(subjectId);
  
  const studentInfo = {
    name: score.name,
    code: score.code,
    district: score.district,
    schoolname: score.schoolname,
    classroom: score.classroom,
    course: score.course,
    score: score.score, // 原始分
    // ✨ 新增：赋分后的分数 (如果不是赋分科目则为 null)
    tieredScore: isTieredSubject ? getTieredScore(score.score) : null,
    omrscore: score.omrscore,
    itemscore: score.itemscore,
    // ✨ 新增：为排名预留字段 (使用随机数作为临时占位符)
    classRank: Math.floor(Math.random() * 40) + 1,
    gradeRank: Math.floor(Math.random() * 500) + 20,
  };

  const images = imgs.map(img => ({ pageno: img.pageno, url: img.url }));

  const omrDetails = tmpl.omr.map(omrItem => {
    const studentOMR = score.omrdetail.find(detail => detail.itemid === omrItem.itemid);
    const correctAnswer = omrItem.answers.find(ans => ans.s === omrItem.score)?.a || omrItem.answers[0]?.a || '';
    return {
      itemid: omrItem.itemid,
      title: omrItem.title,
      studentAnswer: studentOMR?.a || '',
      correctAnswer: correctAnswer,
      score: studentOMR?.s || 0,
      fullScore: omrItem.score
    };
  });

  const itemDetails = score.itemdetail.map(item => {
    const templateItem = tmpl.items.find(t => t.itemid === item.itemid);
    const fullscore = templateItem?.score || 0;
    let score1: number, score2: number;
    if (item.score % 1 === 0) {
      score1 = score2 = item.score;
    } else if (item.score % 1 === 0.5) {
      score1 = Math.floor(item.score);
      score2 = Math.ceil(item.score);
    } else {
      score1 = score2 = item.score;
    }
    return {
      itemid: item.itemid,
      title: item.title,
      score: item.score,
      fullscore: fullscore,
      score1: score1,
      score2: score2
    };
  });

  return { studentInfo, images, omrDetails, itemDetails };
}

// ✨ 新增：用于计算总分的独立函数
export function calculateTotalScores(scoresData: any[]) {
    let originalTotal = 0;
    let tieredTotal = 0;

    scoresData.forEach(subject => {
        if (subject.score > 0) {
            originalTotal += subject.score;
            if (TIERED_SUBJECT_IDS.includes(subject.id)) {
                tieredTotal += getTieredScore(subject.score);
            } else {
                tieredTotal += subject.score;
            }
        }
    });

    return { originalTotal, tieredTotal };
}