import { prisma } from '../prisma/client.js';

// GET /api/pets
export async function getPets(req, res, next) {
  try {
    const pets = await prisma.pet.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(pets);
  } catch (err) {
    next(err);
  }
}

// POST /api/pets
export async function createPet(req, res, next) {
  try {
    const { name, avatarUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Pet name is required' });
    }

    const pet = await prisma.pet.create({ data: { name, avatarUrl: avatarUrl || null } });
    res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/pets/:id
export async function deletePet(req, res, next) {
  try {
    await prisma.pet.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
