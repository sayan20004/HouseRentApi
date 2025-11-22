import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Visit request status enum
 */
export enum VisitRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

/**
 * Visit request document interface
 */
export interface IVisitRequest extends Document {
    property: mongoose.Types.ObjectId;
    tenant: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    preferredDateTime: Date;
    status: VisitRequestStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Visit request schema
 */
const visitRequestSchema = new Schema<IVisitRequest>(
    {
        property: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property is required'],
        },
        tenant: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Tenant is required'],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner is required'],
        },
        preferredDateTime: {
            type: Date,
            required: [true, 'Preferred date and time is required'],
            validate: {
                validator: function (v: Date) {
                    return v > new Date();
                },
                message: 'Preferred date must be in the future',
            },
        },
        status: {
            type: String,
            enum: Object.values(VisitRequestStatus),
            default: VisitRequestStatus.PENDING,
        },
        notes: {
            type: String,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes
 */
visitRequestSchema.index({ property: 1, tenant: 1 });
visitRequestSchema.index({ owner: 1, status: 1 });
visitRequestSchema.index({ tenant: 1, status: 1 });

/**
 * Visit request model
 */
export const VisitRequest: Model<IVisitRequest> = mongoose.model<IVisitRequest>(
    'VisitRequest',
    visitRequestSchema
);
