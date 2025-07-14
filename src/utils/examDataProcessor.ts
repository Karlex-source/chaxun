import { ExamResponse, ProcessedExamData, OMRItem, ItemDetail } from '../types/exam';

export function processExamData(response: ExamResponse): ProcessedExamData {
  const { imgs, tmpl, score } = response;

  // 处理学生信息
  const studentInfo = {
    name: score.name,
    code: score.code,
    district: score.district,
    schoolname: score.schoolname,
    classroom: score.classroom,
    course: score.course,
    score: score.score,
    omrscore: score.omrscore,
    itemscore: score.itemscore
  };

  // 处理图片信息
  const images = imgs.map(img => ({
    pageno: img.pageno,
    url: img.url
  }));

  // 处理客观题详情
  const omrDetails = tmpl.omr.map(omrItem => {
    const studentOMR = score.omrdetail.find(detail => detail.itemid === omrItem.itemid);
    const correctAnswer = omrItem.answers.find(ans => ans.s === omrItem.score)?.a || 
                         omrItem.answers[0]?.a || '';
    
    return {
      itemid: omrItem.itemid,
      title: omrItem.title,
      studentAnswer: studentOMR?.a || '',
      correctAnswer: correctAnswer,
      score: studentOMR?.s || 0,
      fullScore: omrItem.score
    };
  });

  // 处理主观题详情，生成双评分数
  const itemDetails = score.itemdetail.map(item => {
    const templateItem = tmpl.items.find(t => t.itemid === item.itemid);
    const fullscore = templateItem?.score || 0;
    
    // 根据分数生成双评分数
    let score1: number, score2: number;
    if (item.score % 1 === 0) {
      // 整数分数，两评相同
      score1 = score2 = item.score;
    } else if (item.score % 1 === 0.5) {
      // .5分数，两评相差1
      score1 = Math.floor(item.score);
      score2 = Math.ceil(item.score);
    } else {
      // 其他情况，保持原分数
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

  return {
    studentInfo,
    images,
    omrDetails,
    itemDetails
  };
}