import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../app.module'

describe('UserController (e2e)', () => {
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

    describe('GET /api/users/info - logged user info', () => {

      it('logged user info should success', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users/info')
          .set(`Authorization`, authHeader1)
          .expect(200)

        expect(res.body.id).toBeDefined()
        expect(res.body.name).toBe(TEST_USER_NAME1)
        expect(res.body.email).toBe(TEST_USER_EMAIL1)
        expect(res.body.balance).toBeDefined()
      })
    })

    describe('GET /api/users - filtered user list', () => {

      it('filtered user list should return empty list if nobody is found', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users?filter=Nobody')
          .set(`Authorization`, authHeader1)
          .expect(200)

        expect(res.body.length).toBe(0)
      })

      it('filtered user list should find user by filter', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users?filter=two')
          .set(`Authorization`, authHeader1)
          .expect(200)

        expect(res.body.length).toBe(1)
        expect(res.body[0].id).toBeDefined()
        expect(res.body[0].name).toBe(TEST_USER_NAME2)
      })

      it('filtered user list should not find request initiator', async () => {
        const res = await request(app.getHttpServer())
          .get('/api/users?filter=two')
          .set(`Authorization`, authHeader2)
          .expect(200)

        expect(res.body.length).toBe(0)
      })
    })
  })

  afterAll(() => {
  })
})
