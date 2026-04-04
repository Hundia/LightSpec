import { Router } from 'express';
const router = Router();

router.get('/users', (_req, res) => res.json([]));
router.post('/users', (_req, res) => res.status(201).json({}));

export default router;
