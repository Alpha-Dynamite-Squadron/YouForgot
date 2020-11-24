export class PublicAssignment {
  nameOfClass: string;
  uploadDate: string;
  assignmentName: string;
  assignmentDueDate: string;
  forGrade: boolean;
  grade: number;
  assignmentAverage: number;
  iForgotCount: number;
  assignmentID: number;
  iForgot: boolean;
  isReported: boolean;
  isIgnored: boolean;
  isDone: boolean;

  constructor(
    className: string,
    upload: string,
    name: string,
    dueDate: string,
    graded: boolean,
    grade: number,
    avg: number,
    count: number,
    id: number,
    forgot: boolean,
    report: boolean,
    ignore: boolean,
    done: boolean
  ) {
    this.nameOfClass = className;
    this.uploadDate = upload;
    this.assignmentName = name;
    this.assignmentDueDate = dueDate;
    this.forGrade = graded;
    this.grade = grade;
    this.assignmentAverage = avg;
    this.iForgotCount = count;
    this.assignmentID = id;
    this.iForgot = forgot;
    this.isReported = report;
    this.isIgnored = ignore;
    this.isDone = done;
  }
}