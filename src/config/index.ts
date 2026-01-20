export const isProd = () => process.env.NODE_ENV === 'production'
export const jwtSecret = () => process.env.JWT_SECRET || 'dev-secret'