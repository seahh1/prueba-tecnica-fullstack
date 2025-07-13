const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: El ID único del usuario.
 *           example: 60d0fe4f5311236168a109ca
 *         name:
 *           type: string
 *           description: El nombre del usuario.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: El email del usuario.
 *           example: john.doe@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: La fecha de creación del usuario.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: La fecha de la última actualización.
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operaciones relacionadas con la gestión de usuarios.
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario (Registro).
 *     tags: [Users]
 *     description: Endpoint público para registrar un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuario creado exitosamente.
 *                 userId:
 *                   type: string
 *                   example: 60d0fe4f5311236168a109ca
 *       '400':
 *         description: Datos de entrada inválidos.
 */
router.post('/', userController.createNewUser);

router.use(protect);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene una lista de usuarios con paginación.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de resultados por página.
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       '401':
 *         description: No autorizado (token no válido o no proporcionado).
 */
router.get('/', userController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del usuario a obtener.
 *     responses:
 *       '200':
 *         description: Datos del usuario obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: No autorizado.
 *       '404':
 *         description: Usuario no encontrado.
 *   put:
 *     summary: Actualiza un usuario por su ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del usuario a actualizar.
 *     requestBody:
 *       description: Campos a actualizar del usuario .
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: No autorizado.
 *       '404':
 *         description: Usuario no encontrado.
 *   delete:
 *     summary: Elimina un usuario por su ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del usuario a eliminar.
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *       '401':
 *         description: No autorizado.
 *       '404':
 *         description: Usuario no encontrado.
 */
router
  .route('/:id')

  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;