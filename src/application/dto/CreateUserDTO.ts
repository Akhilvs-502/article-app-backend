

export class CreateUserDTO {
  
  firstName :string;

  lastName :string;

  email:string;

  password:string;

  dateOfBirth:string

  preferences:string[]

  constructor(data:{firstName:string, lastName: string; email: string; password: string;dateOfBirth:string,preferences:string[]}) {
    this.firstName = data.firstName.trim();
    this.lastName = data.lastName.trim();
    this.email = data.email.trim().toLowerCase();
    this.password = data.password;
    this.dateOfBirth=data.dateOfBirth
    this.preferences=data.preferences
  }
}
