import { Router } from 'express';
import * as ctrl from '../controllers/petsController.js';

const router = Router();

router.get('/', ctrl.getPets);
router.post('/', ctrl.createPet);
router.delete('/:id', ctrl.deletePet);

export default router;
