const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica el estado de salud de la API.
 *     tags: [Health]
 *     responses:
 *       '200':
 *         description: La API está funcionando correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = router;