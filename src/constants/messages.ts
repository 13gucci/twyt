export const ERROR_MESSAGES = {
    // General errors
    NAME_IS_REQUIRED: 'Name is required',
    NAME_IS_STRING: 'Name must be a string',
    EMAIL_IS_REQUIRED: 'Email is required',
    EMAIL_MUST_VALID: 'Email must be valid',
    EMAIL_AND_PASSWORD_REQUIRED: 'Email and password are required',
    EMAIL_ALREADY_EXISTS: 'Email already exist',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    PASSWORD_IS_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    PASSWORD_IS_STRING: 'Password must be a string',
    PASSWORD_TOO_WEAK:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
    ACCOUNT_LOCKED: 'Your account has been locked due to multiple failed login attempts',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    RESOURCE_NOT_FOUND: 'Requested resource not found',
    SERVER_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request',

    //Confirm password
    CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
    CONFIRM_PASSWORD_MUST_MATCH: 'Confirm password must match password',

    // User-specific errors
    USER_ALREADY_EXISTS: 'User already exists',
    USER_CREATION_FAILED: 'Failed to create user',
    USER_UPDATE_FAILED: 'Failed to update user',
    USER_DELETION_FAILED: 'Failed to delete user',

    //Date of birth
    DOB_REQUIRED: 'Date of birth is required',
    DOB_MUST_VALID: 'Date of birth must be a valid ISO8601 date',
    // Authentication errors
    AUTHENTICATION_FAILED: 'Authentication failed',
    TOKEN_EXPIRED: 'Your session has expired, please log in again',
    TOKEN_INVALID: 'Invalid token, please log in again',

    // Validation errors
    VALIDATION_ERROR: 'Validation error',
    FIELD_TOO_SHORT: '{field} is too short',
    FIELD_TOO_LONG: '{field} is too long',
    FIELD_INVALID_FORMAT: '{field} has an invalid format',
    FIELD_NOT_UNIQUE: '{field} must be unique',

    // Token
    ACCESS_TOKEN_REQUIRED: 'Access_token is required',
    ACCESS_TOKEN_INVALID_FORMAT: 'Access_token is invalid format',
    REFRESH_TOKEN_REQUIRED: 'Access_token is required',
    REFRESH_TOKEN_MUST_BE_STRING: 'Refresh_token must be a string',
    REFRESH_TOKEN_NOT_EXIST: 'Refresh_token is not existed',
    EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
    FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Fotgot password token is required',
    VERIFY_TOKEN_NOT_SAME: 'Verify token is not valid'
} as const;

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
    VALIDATION_SUCCESS: 'All fields are valid',

    //Verify email
    EMAIL_VERIFIED: 'Email already verified',
    EMAIL_VERIFY_SUCCESS: 'Email verify successful',
    RESEND_VERIFY_EMAIL_SUCCESS: 'Resend email verify success',
    SEND_LINK_FORGOT_PASSWORD_EMAIL_SUCCESS: 'Send link reset forgot password success',
    FORGOT_PASSWORD_VERIFY_SUCCESS: 'Veriy forgot password success'
} as const;
