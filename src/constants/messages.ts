export const ERROR_MESSAGES = {
    // General errors
    NAME_IS_REQUIRED: 'Name is required',
    NAME_IS_STRING: 'Name must be a string',
    EMAIL_IS_REQUIRED: 'Email is required',
    EMAIL_MUST_VALID: 'Email must be valid',
    EMAIL_AND_PASSWORD_REQUIRED: 'Email and password are required',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    PASSWORD_IS_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    PASSWORD_TOO_WEAK:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
    ACCOUNT_LOCKED: 'Your account has been locked due to multiple failed login attempts',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    RESOURCE_NOT_FOUND: 'Requested resource not found',
    SERVER_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request',
    FIELD_IS_REQUIRED: '{field} is required',
    FIELD_MUST_BE_STRING: '{field} must be a string',
    FIELD_MUST_BE_NUMBER: '{field} must be a number',
    FIELD_MUST_BE_DATE: '{field} must be a valid date',

    // User-specific errors
    USER_ALREADY_EXISTS: 'User already exists',
    USER_CREATION_FAILED: 'Failed to create user',
    USER_UPDATE_FAILED: 'Failed to update user',
    USER_DELETION_FAILED: 'Failed to delete user',

    // Authentication errors
    AUTHENTICATION_FAILED: 'Authentication failed',
    TOKEN_EXPIRED: 'Your session has expired, please log in again',
    TOKEN_INVALID: 'Invalid token, please log in again',

    // Validation errors
    FIELD_TOO_SHORT: '{field} is too short',
    FIELD_TOO_LONG: '{field} is too long',
    FIELD_INVALID_FORMAT: '{field} has an invalid format',
    FIELD_NOT_UNIQUE: '{field} must be unique'
};

export const SUCCESS_MESSAGES = {
    // General success messages
    OPERATION_COMPLETED: 'Operation completed successfully',
    CHANGES_SAVED: 'Your changes have been saved',
    ITEM_DELETED: 'Item deleted successfully',

    // User-specific success messages
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',

    // Authentication success messages
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PASSWORD_CHANGED: 'Password changed successfully',

    // Register success messages
    REGISTER_SUCCESS: 'Register new account successful',

    // Validation success messages
    VALIDATION_SUCCESS: 'All fields are valid'
};
