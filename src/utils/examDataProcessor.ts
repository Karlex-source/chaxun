import { ExamResponse, ProcessedExamData, StudentScore, Template } from '../types/exam';

// 需要赋分的科目ID
export const TIERED_SUBJECT_IDS = [4, 5, 6, 7, 8, 9]; // 物理,化学,生物,地理,政治,历史

/**
 * 标准赋分函数 (临时占位, 您可以稍后根据实际规则修改此函数)
 * 当前规则：赋分 = 原始分 + 5 (仅用于演示)
 */
export function getTieredScore(originalScore: number): number {
  if (originalScore <= 0) return originalScore;
  // 这是一个非常临时的占位符规则
  const tieredScore = Math.min(originalScore + 5, 100); // 简单加5分，且不超过100
  return tieredScore;
}

export function processExamData(response: { imgs: any[], tmpl: Template, score: StudentScore }, subjectId: number): ProcessedExamData {
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