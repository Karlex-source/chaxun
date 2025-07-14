export interface ExamImage {
  md5: string;
  pageno: number;
  posx: number;
  posy: number;
  skew: number;
  url: string;
}

export interface OMRItem {
  answers: Array<{ a: string; s: number }>;
  area: {
    h: number;
    p: number;
    w: number;
    x: number;
    y: number;
  };
  itemid: number;
  options: string;
  ptype: string;
  score: number;
  scorerule: number;
  title: string;
}

export interface TemplateItem {
  changed: boolean;
  frameid: number;
  itemid: number;
  itemtype: number;
  optcount: number;
  optgroup: number;
  score: number;
  subitems: Array<{
    id: number;
    score: number;
    title: string;
  }>;
  title: string;
}

export interface Template {
  _id: number;
  course: string;
  courseid: number;
  examgroup: number;
  items: TemplateItem[];
  itemscore: number;
  omr: OMRItem[];
  omrscore: number;
  score: number;
}

export interface ItemDetail {
  itemid: number;
  itemtype: number;
  optgroup: number;
  score: number;
  subscore: Array<{
    id: number;
    score: number;
    title: string;
  }>;
  title: string;
}

export interface OMRDetail {
  a: string;
  itemid: number;
  s: number;
  title: string;
}

export interface StudentScore {
  _id: string;
  absent: string;
  cardid: string;
  classroom: string;
  classtype: string;
  code: string;
  course: string;
  courseroom: string;
  ctime: string;
  district: string;
  examgroup: number;
  examid: number;
  itemdetail: ItemDetail[];
  itemscore: number;
  name: string;
  omrdetail: OMRDetail[];
  omrscore: number;
  ptype: string;
  schoolid: string;
  schoolname: string;
  score: number;
  studid: string;
  studtype: string;
}

export interface ExamResponse {
  imgs: ExamImage[];
  tmpl: Template;
  score: StudentScore;
}

export interface ProcessedExamData {
  studentInfo: {
    name: string;
    code: string;
    district: string;
    schoolname: string;
    classroom: string;
    course: string;
    score: number;
    omrscore: number;
    itemscore: number;
  };
  images: Array<{
    pageno: number;
    url: string;
  }>;
  omrDetails: Array<{
    itemid: number;
    title: string;
    studentAnswer: string;
    correctAnswer: string;
    score: number;
    fullScore: number;
  }>;
  itemDetails: Array<{
    itemid: number;
    title: string;
    score: number;
    fullscore: number;
    score1: number;
    score2: number;
  }>;
}