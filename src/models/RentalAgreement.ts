import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Rental agreement status enum
 */
export enum AgreementStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    TERMINATED = 'terminated',
}

/**
 * Rental agreement document interface
 */
export interface IRentalAgreement extends Document {
    property: mongoose.Types.ObjectId;
    tenant: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    securityDeposit: number;
    lockInPeriodMonths: number;
    terms: string;
    isSignedByOwner: boolean;
    isSignedByTenant: boolean;
    status: AgreementStatus;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Rental agreement schema
 */
const rentalAgreementSchema = new Schema<IRentalAgreement>(
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
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
            validate: {
                validator: function (this: IRentalAgreement, v: Date) {
                    return v > this.startDate;
                },
                message: 'End date must be after start date',
            },
        },
        monthlyRent: {
            type: Number,
            required: [true, 'Monthly rent is required'],
            min: [0, 'Monthly rent cannot be negative'],
        },
        securityDeposit: {
            type: Number,
            required: [true, 'Security deposit is required'],
            min: [0, 'Security deposit cannot be negative'],
        },
        lockInPeriodMonths: {
            type: Number,
            default: 0,
            min: [0, 'Lock-in period cannot be negative'],
        },
        terms: {
            type: String,
            required: [true, 'Terms are required'],
            trim: true,
        },
        isSignedByOwner: {
            type: Boolean,
            default: false,
        },
        isSignedByTenant: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: Object.values(AgreementStatus),
            default: AgreementStatus.DRAFT,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes
 */
rentalAgreementSchema.index({ property: 1 });
rentalAgreementSchema.index({ tenant: 1 });
rentalAgreementSchema.index({ owner: 1 });
rentalAgreementSchema.index({ status: 1 });

/**
 * Rental agreement model
 */
export const RentalAgreement: Model<IRentalAgreement> = mongoose.model<IRentalAgreement>(
    'RentalAgreement',
    rentalAgreementSchema
);
