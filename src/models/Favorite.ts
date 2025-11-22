import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Favorite document interface
 */
export interface IFavorite extends Document {
    tenant: mongoose.Types.ObjectId;
    property: mongoose.Types.ObjectId;
    createdAt: Date;
}

/**
 * Favorite schema
 */
const favoriteSchema = new Schema<IFavorite>(
    {
        tenant: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Tenant is required'],
        },
        property: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property is required'],
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

/**
 * Compound unique index to prevent duplicate favorites
 */
favoriteSchema.index({ tenant: 1, property: 1 }, { unique: true });

/**
 * Favorite model
 */
export const Favorite: Model<IFavorite> = mongoose.model<IFavorite>('Favorite', favoriteSchema);
