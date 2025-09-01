export class ResetPasswordDTO {
  currentPassword:string;

  password:string;

  email:string;

  constructor(data:{currentPassword:string; newPassword:string}, email:string) {
    this.currentPassword = data.currentPassword;
    this.password = data.newPassword;
    this.email = email;
  }
}
