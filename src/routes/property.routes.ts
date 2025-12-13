import { Router } from 'express';
import * as propertyController from '../controllers/property.controller';
import { authenticate, requireOwner } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    createPropertySchema,
    updatePropertySchema,
    searchPropertySchema,
    propertyIdSchema,
} from '../validations/property.validation';

const router = Router();

/**
 * @route   POST /api/v1/properties
 * @desc    Create new property
 * @access  Private (Owner only)
 */
router.post(
    '/properties',
    authenticate,
    requireOwner,
    validate(createPropertySchema),
    propertyController.createProperty
);

/**
 * @route   GET /api/v1/owner/properties
 * @desc    Get owner's properties
 * @access  Private (Owner only)
 */
router.get('/owner/properties', authenticate, requireOwner, propertyController.getOwnerProperties);

/**
 * @route   GET /api/v1/properties
 * @desc    Get all properties with filters and pagination
 * @access  Public
 */
router.get('/properties', validate(searchPropertySchema, 'query'), propertyController.getProperties);

/**
 * @route   GET /api/v1/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
router.get('/properties/:id', validate(propertyIdSchema, 'params'), propertyController.getPropertyById);

/**
 * @route   PATCH /api/v1/properties/:id
 * @desc    Update property
 * @access  Private (Owner only, ownership verified)
 */
router.patch(
    '/properties/:id',
    authenticate,
    requireOwner,
    validate(propertyIdSchema, 'params'),
    validate(updatePropertySchema),
    propertyController.updateProperty
);

/**
 * @route   DELETE /api/v1/properties/:id
 * @desc    Delete property (soft delete)
 * @access  Private (Owner only, ownership verified)
 */
router.delete(
    '/properties/:id',
    authenticate,
    requireOwner,
    validate(propertyIdSchema, 'params'),
    propertyController.deleteProperty
);

export default router;