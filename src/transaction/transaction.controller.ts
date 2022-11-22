import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Request,
  ValidationPipe,
  HttpException,
  HttpStatus, HttpCode
} from '@nestjs/common'
import { TransactionService } from './transaction.service';
import {CreateTransactionDto} from "./dto/create-transaction.dto"
import {JwtAuthGuard} from "../guards/jwt.guard"
import {UserService} from "../user/user.service"

@Controller()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('api/protected/transactions')
  async getTransactions(@Request() req) {
    const user = await this.userService.findByEmail(req.user.email)
    if (!user) {
      throw new HttpException(
        'Invalid user',
        HttpStatus.UNAUTHORIZED
      )
    }

    const transactions = await this.transactionService.findByName(user.name)
    return {
      trans_token: transactions
    }
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('api/protected/transactions')
  async createTransaction(@Request() req, @Body() dto: CreateTransactionDto) {
    const user = await this.userService.findByEmail(req.user.email)
    if (!user) {
      throw new HttpException(
        'Invalid user',
        HttpStatus.UNAUTHORIZED
      )
    }

    const transaction = await this.transactionService.createTransaction(dto)
    return {
      trans_token: transaction
    }
  }
}
