import { Router } from 'express';
import * as propertyController from '../controllers/property.controller';
import { authenticate, requireOwner } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { uploadImages, handleImageUpload } from '../middlewares/upload';
import {
    createPropertySchema,
    updatePropertySchema,
    searchPropertySchema,
    propertyIdSchema,
} from '../validations/property.validation';

const router = Router();

router.post(
    '/properties',
    authenticate,
    requireOwner,
    uploadImages,
    handleImageUpload,
    validate(createPropertySchema),
    propertyController.createProperty
);

router.get('/owner/properties', authenticate, requireOwner, propertyController.getOwnerProperties);

router.get('/properties', validate(searchPropertySchema, 'query'), propertyController.getProperties);

router.get('/properties/:id', validate(propertyIdSchema, 'params'), propertyController.getPropertyById);

router.patch(
    '/properties/:id',
    authenticate,
    requireOwner,
    validate(propertyIdSchema, 'params'),
    validate(updatePropertySchema),
    propertyController.updateProperty
);

router.delete(
    '/properties/:id',
    authenticate,
    requireOwner,
    validate(propertyIdSchema, 'params'),
    propertyController.deleteProperty
);

export default router;