import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminFieldLevel: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const isWholesaleOrAdminFieldLevel: FieldAccess = ({ req }) =>
	req.user?.role === 'wholesale' || req.user?.role === 'admin'

export const anyone: Access = () => true
