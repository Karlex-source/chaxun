import { ExamResponse } from '../types/exam';

const EXAM_GROUP = '90376'; // 固定的考试组

export async function fetchExamData(studentId: string, subjectId: number, signal?: AbortSignal): Promise<ExamResponse> {
  const examId = `${EXAM_GROUP}000${subjectId}`;
  
  // 关键修复：确保所有请求都使用相对路径，以便 Netlify 代理能够生效
  const proxyUrl = `/api/exam?eg=${EXAM_GROUP}&sid=${studentId}&eid=${examId}`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal, // 传递 AbortSignal 以便可以取消请求
    });

    if (!response.ok) {
      throw new Error(`服务器请求失败 (状态码: ${response.status})。请检查考号是否正确。`);
    }

    const htmlText = await response.text();
    
    // 使用更健壮的正则表达式来解析数据
    const imgsMatch = htmlText.match(/var\s+imgs\s*=\s*(\[.*?\]);/s);
    const tmplMatch = htmlText.match(/var\s+tmpl\s*=\s*(\{.*?\});/s);
    const scoreMatch = htmlText.match(/var\s+score\s*=\s*(\{.*?\});/s);

    if (!imgsMatch || !tmplMatch || !scoreMatch) {
      throw new Error('无法从服务器响应中解析出有效的成绩数据。');
    }

    try {
      // Function 构造函数比 eval 更安全地解析 JS 对象字面量
      const parseJsonp = (jsonp: string) => new Function(`return ${jsonp}`)();

      const imgs = parseJsonp(imgsMatch[1]);
      const tmpl = parseJsonp(tmplMatch[1]);
      const score = parseJsonp(scoreMatch[1]);

      return { imgs, tmpl, score };
    } catch (parseError) {
      console.error("数据解析JSONP失败:", parseError);
      throw new Error('解析服务器返回的数据时发生内部错误。');
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Fetch aborted by user.');
      throw error;
    }
    console.error('API调用或处理失败:', error);
    // 重新抛出一个对用户更友好的错误信息
    throw new Error(error instanceof Error ? error.message : '网络请求失败，请检查您的网络连接。');
  }
}