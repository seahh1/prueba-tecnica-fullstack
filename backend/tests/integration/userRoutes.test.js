const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('User Endpoints', () => {
  let authToken;
  let testUserId;

  beforeEach(async () => {
    await mongoose.model('User').deleteMany({});

    const registerRes = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    
    expect(registerRes.statusCode).toEqual(201);
    testUserId = registerRes.body.userId;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    console.log('Login Response Body:', loginRes.body);
    console.log('Login Status Code:', loginRes.statusCode);
    
    expect(loginRes.statusCode).toEqual(200); 
    
    authToken = loginRes.body.accessToken;
    
    expect(authToken).toBeDefined();
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
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener un usuario específico por su ID', async () => {
      const res = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testUserId);
    });

    it('debería retornar 404 si el ID del usuario no existe', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Usuario no encontrado');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debería actualizar un usuario correctamente', async () => {
      const updatedData = { name: 'Updated Name' };
      const res = await request(app)
        .put(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Name');
    });

    it('debería retornar 404 si se intenta actualizar un usuario que no existe', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedData = { name: 'Does Not Matter' };
      const res = await request(app)
        .put(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Usuario no encontrado');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debería eliminar un usuario correctamente', async () => {
      const res = await request(app)
        .delete(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Usuario eliminado');
    });

    it('debería retornar 404 si se intenta eliminar un usuario que no existe', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);
        
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Usuario no encontrado');
    });
  });
});