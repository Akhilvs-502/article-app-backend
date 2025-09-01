//  entity should encapsulate important rules like email validation, password format rules, etc. You shouldn't create it just to wrap data — make it meaningful.

import { Types } from 'mongoose';

export class User {
  constructor(
        public firstName:string,
        public lastName:string,
        public email:string,
        public preferences:string[],
        public password?:string,
        public image?:string,
        public bio?:string,
        public createdAt?:Date,
        public status?:string,
        public _id?:Types.ObjectId,
        public updatedAt?:Date,
        public dateOfBirth?:string,
        public googleId?:string,
  ) {}
}
