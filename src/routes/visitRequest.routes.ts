import { Router } from 'express';
import * as visitRequestController from '../controllers/visitRequest.controller';
import { authenticate, requireOwner } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    createVisitRequestSchema,
    updateVisitRequestStatusSchema,
    visitRequestIdSchema,
} from '../validations/visitRequest.validation';
import { propertyIdSchema } from '../validations/property.validation';

const router = Router();

/**
 * @route   POST /api/v1/properties/:id/visit-requests
 * @desc    Create visit request for a property
 * @access  Private (Tenant)
 */
router.post(
    '/properties/:id/visit-requests',
    authenticate,
    validate(propertyIdSchema, 'params'),
    validate(createVisitRequestSchema),
    visitRequestController.createVisitRequest
);

/**
 * @route   GET /api/v1/visit-requests/me
 * @desc    Get tenant's visit requests
 * @access  Private
 */
router.get('/visit-requests/me', authenticate, visitRequestController.getTenantVisitRequests);

/**
 * @route   GET /api/v1/owner/visit-requests
 * @desc    Get owner's visit requests
 * @access  Private (Owner only)
 */
router.get(
    '/owner/visit-requests',
    authenticate,
    requireOwner,
    visitRequestController.getOwnerVisitRequests
);

/**
 * @route   PATCH /api/v1/visit-requests/:id
 * @desc    Update visit request status
 * @access  Private (Owner only, ownership verified)
 */
router.patch(
    '/visit-requests/:id',
    authenticate,
    requireOwner,
    validate(visitRequestIdSchema, 'params'),
    validate(updateVisitRequestStatusSchema),
    visitRequestController.updateVisitRequestStatus
);

export default router;
