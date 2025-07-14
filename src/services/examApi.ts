import { ExamResponse } from '../types/exam';

const BASE_URL = 'https://yunyj.linyi.net/wechat/imgs';
const EXAM_GROUP = '90376'; // 固定的考试组

export async function fetchExamData(studentId: string, subjectId: number): Promise<ExamResponse> {
  const examId = `${EXAM_GROUP}000${subjectId}`;
  const url = `${BASE_URL}?eg=${EXAM_GROUP}&sid=${studentId}&eid=${examId}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const htmlText = await response.text();
    
    // 解析HTML中的JavaScript数据
    const imgsMatch = htmlText.match(/var imgs = (\[.*?\]);/s);
    const tmplMatch = htmlText.match(/var tmpl = (\{.*?\});/s);
    const scoreMatch = htmlText.match(/var score = (\{.*?\});/s);

    if (!imgsMatch || !tmplMatch || !scoreMatch) {
      throw new Error('无法解析响应数据');
    }

    try {
      const imgs = JSON.parse(imgsMatch[1]);
      const tmpl = JSON.parse(tmplMatch[1]);
      const score = JSON.parse(scoreMatch[1]);

      return { imgs, tmpl, score };
    } catch (parseError) {
      throw new Error('数据解析失败');
    }
  } catch (error) {
    console.error('API调用失败:', error);
    throw new Error('查询失败，请检查考号是否正确或稍后重试');
  }
}

// 备用：如果直接调用API有跨域问题，可以通过代理服务器
export async function fetchExamDataViaProxy(studentId: string, subjectId: number): Promise<ExamResponse> {
  // 这里可以调用您的后端代理接口
  const response = await fetch('/api/exam-query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentId,
      subjectId,
      examGroup: EXAM_GROUP
    })
  });

  if (!response.ok) {
    throw new Error('查询失败');
  }

  return response.json();
}