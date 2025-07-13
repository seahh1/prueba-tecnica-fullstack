const request = require('supertest');
const app = require('../../src/app');

describe('User Endpoints', () => {
  let authToken;
  beforeEach(async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Auth User', email: 'auth@example.com', password: 'password123' });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'auth@example.com', password: 'password123' });
    
    authToken = res.body.token;
  });


  describe('GET /api/users', () => {
    it('debería obtener una lista de usuarios si está autenticado', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it('debería retornar 401 Unauthorized si no hay token', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toEqual(401);
    });
  });
});