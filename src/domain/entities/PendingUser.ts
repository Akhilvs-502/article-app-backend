// here i extends User
export class PendingUser {
  constructor(
        public firstName:string,
        public lastName:string,
        public email:string,
        public password?:string| null,
        public createdAt?:Date,
        public otp?:string| null,
        public expireAt?:Date,
        public dateOfBirth?:string
  ){}
}
