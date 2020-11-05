export class Course {
  public name: string;
  public number: string;
  public image: string;
  public instructor: string;
  public semester: string;

  constructor(name: string, num: string, img: string, instr: string, sem: string) {
    this.name = name;
    this.number = num;
    this.image = img;
    this.instructor = instr;
    this.semester = sem;
  }
}