const userService = require('../../src/services/userService');
const User = require('../../src/models/userModel');

describe('User Service', () => {
  describe('createUser', () => {
    it('debería crear y guardar un nuevo usuario correctamente', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const createdUser = await userService.createUser(userData);
      
      expect(createdUser).toBeDefined();
      expect(createdUser.name).toBe(userData.name);
      expect(createdUser.email).toBe(userData.email);

      const userInDb = await User.findById(createdUser._id);
      expect(userInDb).not.toBeNull();
    });

    it('debería fallar al crear un usuario con un email duplicado', async () => {
      const userData1 = { name: 'User 1', email: 'duplicate@example.com', password: 'password123' };
      await userService.createUser(userData1);

      const userData2 = { name: 'User 2', email: 'duplicate@example.com', password: 'password456' };
      await expect(userService.createUser(userData2)).rejects.toThrow();
    });
  });
});
