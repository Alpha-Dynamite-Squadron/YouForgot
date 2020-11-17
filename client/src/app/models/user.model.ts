export class User {
  public username: string;
  public imageID: string;
  public receivePostNotifications: boolean;
  public receiveDeadlineNotifications: boolean;
  public receiveExcessiveDeadlineNotifications: boolean;

  constructor(
    username: string, 
    id: string, 
    post: boolean, 
    deadline: boolean, 
    execessive: boolean) {
    this.username = username;
    this.imageID = id;
    this.receivePostNotifications = post;
    this.receiveDeadlineNotifications = deadline;
    this.receiveExcessiveDeadlineNotifications = execessive;
  }
}