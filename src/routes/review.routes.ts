import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createReviewSchema } from '../validations/review.validation';
import { propertyIdSchema } from '../validations/property.validation';

const router = Router();

router.post(
    '/reviews',
    authenticate,
    validate(createReviewSchema),
    reviewController.createReview
);

router.get(
    '/properties/:id/reviews',
    validate(propertyIdSchema, 'params'),
    reviewController.getPropertyReviews
);

export default router;