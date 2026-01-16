import { createOpenApiRouter } from '@polaris/e2e-api';
import { log } from '@polaris/logger';
import { z } from 'zod';

import type { paths } from '../generated/openapi.js';
import type { Booking } from '../types.js';

const apiRouter = createOpenApiRouter<paths>();

// In-memory bookings storage (in real app: use database)
const bookings: Booking[] = [];
let nextBookingId = 1;

// Schema de validation Zod pour la création de booking
const createBookingBodySchema = z.object({
  productId: z.number().int().positive(),
  productName: z.string().min(1),
  quantity: z.number().int().min(1),
  appointmentDate: z.string().datetime(),
});

// GET user bookings (authenticated)
apiRouter.get('/bookings', {
  handler: (req, res) => {
    const userEmail = req.user?.email || 'unknown';
    const userBookings = bookings.filter((b) => b.userEmail === userEmail);

    log.info('User bookings retrieved', {
      userEmail,
      count: userBookings.length,
    });

    res.json({
      success: true,
      data: userBookings,
      total: userBookings.length,
    });
  },
});

// POST create booking (authenticated) - AVEC VALIDATION ZOD
apiRouter.post('/bookings', {
  bodyValidator: createBookingBodySchema,
  handler: (req, res) => {
    // Les données sont déjà validées par Zod grâce au middleware
    const { productId, productName, quantity, appointmentDate } = req.body;
    const userEmail = req.user?.email;
    const userName = req.user?.name || 'Guest';

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    // Create booking
    const booking: Booking = {
      id: nextBookingId++,
      productId,
      productName,
      quantity,
      appointmentDate,
      userEmail,
      userName,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    log.info('Booking created successfully', {
      bookingId: booking.id,
      userEmail,
      productId,
      quantity,
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking confirmed! You will receive a confirmation email shortly.',
    });
  },
});

// Note: La route DELETE n'est pas dans l'OpenAPI spec, donc on la garde sur l'express router classique
// Pour l'ajouter, il faudrait l'ajouter dans openapi.yaml d'abord

// Export le router Express interne pour l'utilisation dans server.ts
export default apiRouter.router;

