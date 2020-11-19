export class User {
  public email: string;
  public username: string;
  public imageID: number;
  public receivePostNotifications: boolean;
  public receiveDeadlineNotifications: boolean;
  public receiveExcessiveDeadlineNotifications: boolean;
  public schoolName: string;
  public profileRating: number;

  constructor(
    email: string,
    username: string, 
    id: number, 
    post: boolean, 
    deadline: boolean, 
    execessive: boolean,
    schoolName: string, 
    rating: number) {
    this.email = email;
    this.username = username;
    this.imageID = id;
    this.receivePostNotifications = post;
    this.receiveDeadlineNotifications = deadline;
    this.receiveExcessiveDeadlineNotifications = execessive;
    this.schoolName = schoolName;
    this.profileRating = rating;
  }
}