import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('pw_users')
export class User {
  @PrimaryGeneratedColumn()
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