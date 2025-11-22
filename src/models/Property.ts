import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Property type enum
 */
export enum PropertyType {
    APARTMENT = 'apartment',
    INDEPENDENT_HOUSE = 'independent_house',
    PG = 'pg',
    STUDIO = 'studio',
    SHARED_FLAT = 'shared_flat',
}

/**
 * Furnishing enum
 */
export enum Furnishing {
    UNFURNISHED = 'unfurnished',
    SEMI_FURNISHED = 'semi_furnished',
    FULLY_FURNISHED = 'fully_furnished',
}

/**
 * Allowed tenants enum
 */
export enum AllowedTenants {
    FAMILY = 'family',
    BACHELORS = 'bachelors',
    STUDENTS = 'students',
    ANY = 'any',
}

/**
 * Property status enum
 */
export enum PropertyStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    RENTED_OUT = 'rented_out',
}

/**
 * Location sub-schema interface
 */
export interface ILocation {
    city: string;
    area: string;
    landmark?: string;
    pincode: string;
    geo?: {
        lat: number;
        lng: number;
    };
}

/**
 * Property document interface
 */
export interface IProperty extends Document {
    owner: mongoose.Types.ObjectId;
    title: string;
    description: string;
    propertyType: PropertyType;
    bhk: number;
    furnishing: Furnishing;
    rent: number;
    securityDeposit: number;
    maintenance: {
        amount: number;
        included: boolean;
    };
    builtUpArea: number;
    availableFrom: Date;
    minLockInPeriodMonths: number;
    allowedTenants: AllowedTenants;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    location: ILocation;
    amenities: string[];
    images: string[];
    isVerified: boolean;
    status: PropertyStatus;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Location schema
 */
const locationSchema = new Schema<ILocation>(
    {
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        area: {
            type: String,
            required: [true, 'Area is required'],
            trim: true,
        },
        landmark: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
        },
        geo: {
            lat: {
                type: Number,
                min: -90,
                max: 90,
            },
            lng: {
                type: Number,
                min: -180,
                max: 180,
            },
        },
    },
    { _id: false }
);

/**
 * Property schema
 */
const propertySchema = new Schema<IProperty>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner is required'],
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [10, 'Title must be at least 10 characters'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [50, 'Description must be at least 50 characters'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        propertyType: {
            type: String,
            enum: Object.values(PropertyType),
            required: [true, 'Property type is required'],
        },
        bhk: {
            type: Number,
            required: [true, 'BHK is required'],
            min: [1, 'BHK must be at least 1'],
            max: [10, 'BHK cannot exceed 10'],
        },
        furnishing: {
            type: String,
            enum: Object.values(Furnishing),
            required: [true, 'Furnishing type is required'],
        },
        rent: {
            type: Number,
            required: [true, 'Monthly rent is required'],
            min: [1000, 'Rent must be at least 1000'],
        },
        securityDeposit: {
            type: Number,
            required: [true, 'Security deposit is required'],
            min: [0, 'Security deposit cannot be negative'],
        },
        maintenance: {
            amount: {
                type: Number,
                default: 0,
                min: [0, 'Maintenance amount cannot be negative'],
            },
            included: {
                type: Boolean,
                default: false,
            },
        },
        builtUpArea: {
            type: Number,
            required: [true, 'Built-up area is required'],
            min: [50, 'Built-up area must be at least 50 sq ft'],
        },
        availableFrom: {
            type: Date,
            required: [true, 'Available from date is required'],
        },
        minLockInPeriodMonths: {
            type: Number,
            default: 0,
            min: [0, 'Lock-in period cannot be negative'],
            max: [36, 'Lock-in period cannot exceed 36 months'],
        },
        allowedTenants: {
            type: String,
            enum: Object.values(AllowedTenants),
            default: AllowedTenants.ANY,
        },
        petsAllowed: {
            type: Boolean,
            default: false,
        },
        smokingAllowed: {
            type: Boolean,
            default: false,
        },
        location: {
            type: locationSchema,
            required: [true, 'Location is required'],
        },
        amenities: {
            type: [String],
            default: [],
        },
        images: {
            type: [String],
            default: [],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: Object.values(PropertyStatus),
            default: PropertyStatus.ACTIVE,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Indexes for search optimization
 */
propertySchema.index({ 'location.city': 1, 'location.area': 1 });
propertySchema.index({ rent: 1 });
propertySchema.index({ bhk: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ owner: 1 });

/**
 * Property model
 */
export const Property: Model<IProperty> = mongoose.model<IProperty>('Property', propertySchema);
