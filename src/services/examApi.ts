import { ExamResponse } from '../types/exam';

export async function fetchExamData(examGroup: string, studentId: string, subjectId: number, signal?: AbortSignal): Promise<ExamResponse> {
  const examId = `${examGroup}000${subjectId}`;
  
  const proxyUrl = `/api/exam?eg=${examGroup}&sid=${studentId}&eid=${examId}`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`服务器请求失败 (状态码: ${response.status})。请检查考号和所选年级是否正确。`);
    }

    const htmlText = await response.text();
    
    const imgsMatch = htmlText.match(/var\s+imgs\s*=\s*(\[.*?\]);/s);
    const tmplMatch = htmlText.match(/var\s+tmpl\s*=\s*(\{.*?\});/s);
    const scoreMatch = htmlText.match(/var\s+score\s*=\s*(\{.*?\});/s);

    if (!imgsMatch || !tmplMatch || !scoreMatch) {
      throw new Error('无法从服务器响应中解析出有效的成绩数据。');
    }

    try {
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
    throw new Error(error instanceof Error ? error.message : '网络请求失败，请检查您的网络连接。');
  }
}