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
import { TransactionService } from './transaction.service'
import { CreateTransactionRequestDto, CreateTransactionResponseDto } from './dto/create-transaction.dto'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { UserService } from '../user/user.service'
import { GetTransactionsResponseDto } from './dto/get-transactions.dto'
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { SWAGGER_AUTH_TOKEN } from '../lib/constants.lib'

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly userService: UserService
  ) {}

  @ApiOkResponse({ type: GetTransactionsResponseDto })
  @ApiBearerAuth(SWAGGER_AUTH_TOKEN)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransactions(@Request() req): Promise<GetTransactionsResponseDto> {
    const user = await this.userService.findByEmail(req.user.email)
    if (!user) {
      throw new HttpException(
        'Invalid user',
        HttpStatus.UNAUTHORIZED
      )
    }

    const transactions = await this.transactionService.findByUserId(user._id)
    return {
      trans_token: transactions
    }
  }

  @ApiOkResponse({ type: CreateTransactionResponseDto })
  @ApiBearerAuth(SWAGGER_AUTH_TOKEN)
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async createTransaction(@Request() req, @Body() dto: CreateTransactionRequestDto): Promise<CreateTransactionResponseDto> {
    const transaction = await this.transactionService.createTransaction(
      req.user.email,
      dto.name,
      dto.amount
    )

    return {
      trans_token: transaction
    }
  }
}
