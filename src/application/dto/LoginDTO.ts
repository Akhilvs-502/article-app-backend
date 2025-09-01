export class LoginDTO {
  
  identifier:string;

  password:string;

  constructor(data:{identifier:string;password:string}) {
    this.identifier = data.identifier.trim(),
    this.password = data.password.trim();
  }
}

