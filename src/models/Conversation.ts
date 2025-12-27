import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    property: mongoose.Types.ObjectId;
    lastMessage: string;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        property: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: true
        },
        lastMessage: {
            type: String,
            default: ''
        },
        lastMessageAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ property: 1 });
conversationSchema.index({ updatedAt: -1 });

export const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', conversationSchema);