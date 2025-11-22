import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Rental application status enum
 */
export enum ApplicationStatus {
    PENDING = 'pending',
    SHORTLISTED = 'shortlisted',
    REJECTED = 'rejected',
    ACCEPTED = 'accepted',
    CANCELLED = 'cancelled',
}

/**
 * Rental application document interface
 */
export interface IRentalApplication extends Document {
    property: mongoose.Types.ObjectId;
    tenant: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    message: string;
    status: ApplicationStatus;
    monthlyRentOffered?: number;
    moveInDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Rental application schema
 */
const rentalApplicationSchema = new Schema<IRentalApplication>(
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
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [20, 'Message must be at least 20 characters'],
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
        },
        status: {
            type: String,
            enum: Object.values(ApplicationStatus),
            default: ApplicationStatus.PENDING,
        },
        monthlyRentOffered: {
            type: Number,
            min: [0, 'Rent offered cannot be negative'],
        },
        moveInDate: {
            type: Date,
            required: [true, 'Move-in date is required'],
            validate: {
                validator: function (v: Date) {
                    return v >= new Date();
                },
                message: 'Move-in date must be today or in the future',
            },
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes
 */
rentalApplicationSchema.index({ property: 1, tenant: 1 });
rentalApplicationSchema.index({ owner: 1, status: 1 });
rentalApplicationSchema.index({ tenant: 1, status: 1 });

/**
 * Rental application model
 */
export const RentalApplication: Model<IRentalApplication> = mongoose.model<IRentalApplication>(
    'RentalApplication',
    rentalApplicationSchema
);
