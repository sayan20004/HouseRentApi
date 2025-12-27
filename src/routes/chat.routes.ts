import { Router } from 'express';
import * as chatController from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
    startConversationSchema,
    sendMessageSchema,
    conversationIdSchema
} from '../validations/chat.validation';

const router = Router();

router.post(
    '/conversations',
    authenticate,
    validate(startConversationSchema),
    chatController.startConversation
);

router.get('/conversations', authenticate, chatController.getConversations);

router.get(
    '/conversations/:id/messages',
    authenticate,
    validate(conversationIdSchema, 'params'),
    chatController.getMessages
);

router.post(
    '/conversations/:id/messages',
    authenticate,
    validate(conversationIdSchema, 'params'),
    validate(sendMessageSchema),
    chatController.sendMessage
);

export default router;