import { Router } from 'express';
import * as applicationController from '../controllers/application.controller';
import { authenticate, requireOwner } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    createApplicationSchema,
    updateApplicationStatusSchema,
    applicationIdSchema,
} from '../validations/application.validation';
import { propertyIdSchema } from '../validations/property.validation';

const router = Router();

/**
 * @route   POST /api/v1/properties/:id/applications
 * @desc    Create rental application for a property
 * @access  Private (Tenant)
 */
router.post(
    '/properties/:id/applications',
    authenticate,
    validate(propertyIdSchema, 'params'),
    validate(createApplicationSchema),
    applicationController.createApplication
);

/**
 * @route   GET /api/v1/applications/me
 * @desc    Get tenant's applications
 * @access  Private
 */
router.get('/applications/me', authenticate, applicationController.getTenantApplications);

/**
 * @route   GET /api/v1/owner/applications
 * @desc    Get owner's applications
 * @access  Private (Owner only)
 */
router.get(
    '/owner/applications',
    authenticate,
    requireOwner,
    applicationController.getOwnerApplications
);

/**
 * @route   PATCH /api/v1/applications/:id
 * @desc    Update application status
 * @access  Private (Owner only, ownership verified)
 */
router.patch(
    '/applications/:id',
    authenticate,
    requireOwner,
    validate(applicationIdSchema, 'params'),
    validate(updateApplicationStatusSchema),
    applicationController.updateApplicationStatus
);

export default router;
