import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  const TEST_USER_NAME = 'Test'
  const TEST_USER_EMAIL = 'test@test.test'
  const TEST_USER_PASSWORD = 'test'

  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  describe('POST /users - register user', () => {

    it('register user should success', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: TEST_USER_NAME,
          password: TEST_USER_PASSWORD,
          email: TEST_USER_EMAIL
        })
        .expect(200)

      expect(res.body.id_token).toBeDefined()
      expect(res.body.id_token.split('.').length).toBe(3)
    })
  })

  describe('After register user', () => {

    let authHeader: string

    beforeEach(async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: TEST_USER_NAME,
          password: TEST_USER_PASSWORD,
          email: TEST_USER_EMAIL
        })

      authHeader = `Bearer ${res.body.id_token}`
    })

    describe('POST /sessions/create - login user', () => {

      it('login user should success', async () => {
        const res = await request(app.getHttpServer())
          .post('/sessions/create')
          .send({
            email: TEST_USER_EMAIL,
            password: TEST_USER_PASSWORD
          })
          .expect(200)

        expect(res.body.id_token).toBeDefined()
        expect(res.body.id_token.split('.').length).toBe(3)
      })
    })

    describe('GET /api/protected/transactions - logged user transactions', () => {

      it('logged user transactions should success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/protected/transactions')
          .set(`Authorization`, authHeader)
          .expect(200)

        expect(res.body.trans_token).toBeDefined()
      })
    })

    describe('POST /api/protected/transactions - create new transaction', () => {

      it('create new transaction should success', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/protected/transactions')
          .send({
            name: TEST_USER_NAME,
            amount: 50
          })
          .set(`Authorization`, authHeader)
          .expect(200)

        expect(res.body.trans_token).toBeDefined()
      })
    })

    describe('GET /api/protected/user-info - logged user info', () => {

      it('logged user info should success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/protected/user-info')
          .set(`Authorization`, authHeader)
          .expect(200)

        expect(res.body.id).toBeDefined()
        expect(res.body.name).toBe(TEST_USER_NAME)
        expect(res.body.email).toBe(TEST_USER_EMAIL)
        expect(res.body.balance).toBeDefined()
      })
    })

    describe('POST /api/protected/users/list - filtered user list', () => {

      it('filtered user list should success and return non-empty list', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/protected/users/list')
          .send({
            filter: 'Tes'
          })
          .set(`Authorization`, authHeader)
          .expect(200)

        expect(res.body.length).toBe(1)
        expect(res.body[0].id).toBeDefined()
        expect(res.body[0].name).toBe(TEST_USER_NAME)
      })

      it('filtered user list should success and return empty list', async () => {
        const res = await request(app.getHttpServer())
          .post('/api/protected/users/list')
          .send({
            filter: 'John'
          })
          .set(`Authorization`, authHeader)
          .expect(200)

        expect(res.body.length).toBe(0)
      })
    })
  })
})
