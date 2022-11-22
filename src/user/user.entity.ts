import {Column, Entity, ObjectIdColumn} from 'typeorm'

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  passwordHash: string

  @Column()
  balance: number
}