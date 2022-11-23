import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  passwordHash: string
}