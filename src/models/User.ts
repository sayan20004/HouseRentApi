import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * User role enum
 */
export enum UserRole {
    TENANT = 'tenant',
    OWNER = 'owner',
    ADMIN = 'admin',
}

/**
 * KYC status enum
 */
export enum KycStatus {
    NOT_SUBMITTED = 'not_submitted',
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

/**
 * User document interface
 */
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    isEmailVerified: boolean;
    kycStatus: KycStatus;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.TENANT,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        kycStatus: {
            type: String,
            enum: Object.values(KycStatus),
            default: KycStatus.NOT_SUBMITTED,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Pre-save hook to hash password
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

/**
 * Method to compare password
 */
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Indexes
 */
userSchema.index({ email: 1 });

/**
 * User model
 */
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
