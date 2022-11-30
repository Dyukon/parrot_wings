import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'

describe('TransactionController (e2e)', () => {
  const TEST_USER_NAME1 = 'One'
  const TEST_USER_EMAIL1 = 'one@one.one'
  const TEST_USER_PASSWORD1 = 'one'

  const TEST_USER_NAME2 = 'Two'
  const TEST_USER_EMAIL2 = 'two@two.two'
  const TEST_USER_PASSWORD2 = 'two'

  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
  })

  it('/ (GET)', () => {
    request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  describe('After login users', () => {

    let authHeader1: string
    let authHeader2: string

    beforeAll(async () => {

      const registerRes1 = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: TEST_USER_NAME1,
          password: TEST_USER_PASSWORD1,
          email: TEST_USER_EMAIL1
        })

      // expect(registerRes1.body.id_token).toBeDefined()
      // expect(registerRes1.body.id_token.split('.').length).toBe(3)

      const registerRes2 = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: TEST_USER_NAME2,
          password: TEST_USER_PASSWORD2,
          email: TEST_USER_EMAIL2
        })

      // expect(registerRes2.body.id_token).toBeDefined()
      // expect(registerRes2.body.id_token.split('.').length).toBe(3)

      const loginRes1 = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: TEST_USER_EMAIL1,
          password: TEST_USER_PASSWORD1
        })
      authHeader1 = `Bearer ${loginRes1.body.id_token}`

      const loginRes2 = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          email: TEST_USER_EMAIL2,
          password: TEST_USER_PASSWORD2
        })
      authHeader2 = `Bearer ${loginRes2.body.id_token}`
    })

    describe('GET /api/transactions - logged user transactions', () => {

      it('logged user transactions should success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/transactions')
          .set(`Authorization`, authHeader1)
          .expect(200)

        expect(res.body.trans_token).toBeDefined()
      })
    })

    describe('POST /api/transactions - create new transaction', () => {

      it('create new transaction should success', async () => {
        const res1 = await request(app.getHttpServer())
          .post('/api/transactions')
          .send({
            name: TEST_USER_NAME2,
            amount: 50
          })
          .set(`Authorization`, authHeader1)
          .expect(200)

        const tran1 = res1.body.trans_token
        expect(tran1).toBeDefined()
        expect(tran1.id).toBeDefined()
        expect(tran1.username).toBe(TEST_USER_NAME2)
        expect(tran1.amount).toBe(-50)
        expect(tran1.balance).toBeDefined()

        const res2 = await request(app.getHttpServer())
          .post('/api/transactions')
          .send({
            name: TEST_USER_NAME1,
            amount: 50
          })
          .set(`Authorization`, authHeader2)
          .expect(200)

        const tran2 = res2.body.trans_token
        expect(tran2).toBeDefined()
        expect(tran2.id).toBeDefined()
        expect(tran2.username).toBe(TEST_USER_NAME1)
        expect(tran2.amount).toBe(-50)
        expect(tran2.balance).toBeDefined()
      })
    })
  })

  afterAll(() => {
  })
})

