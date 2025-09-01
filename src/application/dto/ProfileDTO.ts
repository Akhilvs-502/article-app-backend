

export class ProfileDTO {
  
  firstName :string;

  lastName :string;

  email:string;

  password:string;

  dateOfBirth:string

  bio:string


  constructor(data:{firstName:string, lastName: string; email: string; password: string;dateOfBirth:string; bio:string  }) {
    this.firstName = data.firstName.trim();
    this.lastName = data.lastName.trim();
    this.email = data.email.trim().toLowerCase();
    this.password = data.password;
    this.dateOfBirth=data.dateOfBirth;
    this.bio=data.bio;
  }
}
