export class PublicAssignment {
  nameOfClass: string;
  uploadDate: string;
  assignmentName: string;
  assignmentDueDate: string;
  forGrade: boolean;
  assignmentAverage: number;
  iForgotCount: number;
  assignmentID: number;

  constructor(
    className: string,
    upload: string,
    name: string,
    dueDate: string,
    graded: boolean,
    avg: number,
    count: number,
    id: number
  ) {
    this.nameOfClass = className;
    this.uploadDate = upload;
    this.assignmentName = name;
    this.assignmentDueDate = dueDate;
    this.forGrade = graded;
    this.assignmentAverage = avg;
    this.iForgotCount = count;
    this.assignmentID = id;
  }
}