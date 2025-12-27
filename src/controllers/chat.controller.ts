import { Response, NextFunction } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { successResponse } from '../utils/ApiResponse';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/ApiError';
import { AuthRequest } from '../middlewares/auth';

export const startConversation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { propertyId, ownerId } = req.body;
        const tenantId = req.user!.userId;

        if (ownerId === tenantId) {
            throw new BadRequestError('You cannot chat with yourself');
        }

        let conversation = await Conversation.findOne({
            property: propertyId,
            participants: { $all: [tenantId, ownerId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                property: propertyId,
                participants: [tenantId, ownerId],
                lastMessage: 'Started conversation',
                lastMessageAt: new Date()
            });
        }

        await conversation.populate('participants', 'name email phone');
        await conversation.populate('property', 'title');

        res.status(201).json(successResponse(conversation, 'Conversation started'));
    } catch (error) {
        next(error);
    }
};

export const getConversations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const conversations = await Conversation.find({
            participants: req.user!.userId
        })
        .sort({ updatedAt: -1 })
        .populate('participants', 'name email phone')
        .populate('property', 'title images');

        res.json(successResponse(conversations));
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const conversation = await Conversation.findById(id);
        if (!conversation) {
            throw new NotFoundError('Conversation not found');
        }

        if (!conversation.participants.map(p => p.toString()).includes(req.user!.userId)) {
            throw new ForbiddenError('Not authorized to view these messages');
        }

        const messages = await Message.find({ conversation: id })
            .sort({ createdAt: 1 })
            .populate('sender', 'name');

        res.json(successResponse(messages));
    } catch (error) {
        next(error);
    }
};

export const sendMessage = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const conversation = await Conversation.findById(id);
        if (!conversation) {
            throw new NotFoundError('Conversation not found');
        }

        if (!conversation.participants.map(p => p.toString()).includes(req.user!.userId)) {
            throw new ForbiddenError('Not authorized to send messages to this conversation');
        }

        const message = await Message.create({
            conversation: id,
            sender: req.user!.userId,
            content,
            readBy: [req.user!.userId]
        });

        conversation.lastMessage = content;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        await message.populate('sender', 'name');

        res.status(201).json(successResponse(message));
    } catch (error) {
        next(error);
    }
};