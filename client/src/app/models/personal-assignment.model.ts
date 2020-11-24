export class PersonalAssignment {
  customUploadDate: string;
  customAssignmentName: string;
  customAssignmentDescription: string;
  customDueDate: string;
  isDone: string;
  grade: number;
  forGrade: boolean;
  assignmentID: number;
  isIgnored: boolean;
  nameOfClass: string;

  constructor(
    upload: string,
    name: string,
    desc: string,
    due: string,
    done: string,
    grade: number,
    forGrade: boolean,
    id: number,
    ignored: boolean,
    nameOfClass: string
  ) {
    this.customUploadDate = upload;
    this.customAssignmentName = name;
    this.customAssignmentDescription = desc;
    this.customDueDate = due;
    this.isDone = done;
    this.grade = grade;
    this.forGrade = forGrade;
    this.assignmentID = id;
    this.isIgnored = ignored;
    this.nameOfClass = nameOfClass;
  }
}