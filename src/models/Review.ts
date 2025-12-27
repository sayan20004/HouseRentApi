import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    reviewer: mongoose.Types.ObjectId;
    property?: mongoose.Types.ObjectId; // If reviewing a property
    user?: mongoose.Types.ObjectId;     // If reviewing a tenant/owner directly
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: 'Property'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews from same person
reviewSchema.index({ reviewer: 1, property: 1 }, { unique: true, partialFilterExpression: { property: { $exists: true } } });
reviewSchema.index({ reviewer: 1, user: 1 }, { unique: true, partialFilterExpression: { user: { $exists: true } } });

export const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);