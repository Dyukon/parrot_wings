import {randomBytes} from 'crypto'

export class IdLib {
  
  static createId(): string {
    return randomBytes(10).toString('hex')
  }
}