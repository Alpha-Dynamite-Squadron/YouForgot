export class PublicAssignment {
  uploadDate: string;
  assignmentName: string;
  assignmentDueDate: string;
  forGrade: boolean;
  assignmentAverage: number;
  iForgotCount: number;

  constructor(
    upload: string,
    name: string,
    dueDate: string,
    graded: boolean,
    avg: number,
    count: number
  ) {
    this.uploadDate = upload;
    this.assignmentName = name;
    this.assignmentDueDate = dueDate;
    this.forGrade = graded;
    this.assignmentAverage = avg;
    this.iForgotCount = count;
  }
}