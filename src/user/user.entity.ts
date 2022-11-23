import { Column, Entity, Index, ObjectIdColumn } from 'typeorm'

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string

  @Index({ unique: true })
  @Column()
  name: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column()
  passwordHash: string
}