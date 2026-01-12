import type { Request, Response, Router } from 'express';
import express from 'express';
import { log } from '@polaris/logger';
import type { Booking, User } from '../types.js';

const router: Router = express.Router();

// In-memory bookings storage (in real app: use database)
const bookings: Booking[] = [];
let nextBookingId = 1;

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// GET user bookings (authenticated)
router.get('/', (req: Request, res: Response) => {
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
});

// POST create booking (authenticated)
router.post('/', (req: Request, res: Response) => {
  const { productId, productName, quantity, appointmentDate } = req.body;
  const userEmail = req.user?.email;
  const userName = req.user?.name || 'Guest';

  // Validation
  if (!productId || !quantity || !appointmentDate) {
    log.warn('Invalid booking request', { userEmail, body: req.body });
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: productId, quantity, appointmentDate',
    });
  }

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
});

// DELETE cancel booking (authenticated)
router.delete('/:id', (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  const userEmail = req.user?.email;
  const bookingIndex = bookings.findIndex(
    (b) => b.id === bookingId && b.userEmail === userEmail
  );

  if (bookingIndex === -1) {
    log.warn('Booking not found or unauthorized', { bookingId, userEmail });
    return res.status(404).json({
      success: false,
      error: 'Booking not found or you do not have permission to cancel it',
    });
  }

  const [cancelledBooking] = bookings.splice(bookingIndex, 1);

  log.info('Booking cancelled', {
    bookingId,
    userEmail,
    productId: cancelledBooking.productId,
  });

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: cancelledBooking,
  });
});

export default router;
