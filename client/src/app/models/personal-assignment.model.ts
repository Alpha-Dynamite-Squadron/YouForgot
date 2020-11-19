export class PersonalAssignment {
  customUploadDate: string;
  customAssignmentName: string;
  customAssignmentDescription: string;
  customDueDate: string;
  isDone: string;
  grade: number;

  constructor(
    upload: string,
    name: string,
    desc: string,
    due: string,
    done: string,
    grade: number
  ) {
    this.customUploadDate = upload;
    this.customAssignmentName = name;
    this.customAssignmentDescription = desc;
    this.customDueDate = due;
    this.isDone = done;
    this.grade = grade;
  }
}