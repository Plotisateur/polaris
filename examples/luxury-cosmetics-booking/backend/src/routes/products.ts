import type { Request, Response, Router } from 'express';
import express from 'express';
import { log } from '@polaris/logger';
import { products } from '../data/products.js';

const router: Router = express.Router();

// GET all products (public)
router.get('/', (req: Request, res: Response) => {
  log.info('Fetching products catalog', { count: products.length });
  res.json({
    success: true,
    data: products,
    total: products.length,
  });
});

// GET product by ID (public)
router.get('/:id', (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    log.warn('Product not found', { productId });
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  log.info('Product retrieved', { productId, name: product.name });
  res.json({
    success: true,
    data: product,
  });
});

// GET products by category (public)
router.get('/category/:category', (req: Request, res: Response) => {
  const { category } = req.params;
  const filtered = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  log.info('Products filtered by category', { category, count: filtered.length });
  res.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
});

export default router;
