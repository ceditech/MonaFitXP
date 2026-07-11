
import React from 'react';
import { RequireTier } from './RequireTier';

interface RequireProProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Guard for Pro-only features. Thin wrapper over RequireTier so all
 * tier-gating logic lives in one place.
 */
export const RequirePro: React.FC<RequireProProps> = (props) => (
    <RequireTier minTier="pro" {...props} />
);
