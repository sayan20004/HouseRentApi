import validator from 'validator';

/**
 * Sanitize string to prevent NoSQL injection
 */
export const sanitizeString = (str: string): string => {
    if (typeof str !== 'string') return str;

    // Remove MongoDB operators but preserve allowed characters like @ for emails
    // Only remove $ at start of string to prevent MongoDB operators
    return str.replace(/^\$/g, '');
};

/**
 * Sanitize object recursively to prevent NoSQL injection
 */
export const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        if (typeof obj === 'string') {
            return sanitizeString(obj);
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    const sanitized: any = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const sanitizedKey = sanitizeString(key);
            sanitized[sanitizedKey] = sanitizeObject(obj[key]);
        }
    }
    return sanitized;
};

/**
 * Escape HTML to prevent XSS attacks
 */
export const escapeHtml = (str: string): string => {
    if (typeof str !== 'string') return str;
    return validator.escape(str);
};

/**
 * Sanitize input data for safe usage
 */
export const sanitizeInput = (data: any): any => {
    return sanitizeObject(data);
};
