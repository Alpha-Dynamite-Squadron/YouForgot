export class Course {
  public nameOfClass: string;
  public imageID: number;
  public instructorName: string;
  public disciplineLetters: string;
  public courseNumber: number;
  public sectionNumber: number;
  public academicTerm: string;
  public academicYear: string;

  constructor(
    nameOfClass: string,
    img: number,
    instructor: string,
    disc: string,
    courseNum: number,
    sectionNum: number,
    term: string,
    year: string
  ) {
    this.nameOfClass = nameOfClass;
    this.imageID = img;
    this.instructorName = instructor;
    this.disciplineLetters = disc;
    this.courseNumber = courseNum;
    this.sectionNumber = sectionNum;
    this.academicTerm = term;
    this.academicYear = year;
  }
}