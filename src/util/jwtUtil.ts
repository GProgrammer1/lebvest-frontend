import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  [key: string]: any;
};

export const getClaim = (claim: string, token: string): string => {
  try {
    if (!token || token.trim() === '') {
      console.error('getClaim: Token is empty or null');
      return '';
    }
    
    const decodedToken = jwtDecode<DecodedToken>(token);
    
    // Check if claim exists in token (use 'in' operator to check key existence, not value)
    if (!(claim in decodedToken)) {
      console.warn(`Claim "${claim}" not found in token. Available claims:`, Object.keys(decodedToken));
      return '';
    }
    
    // Handle both string and number types for userId
    const claimValue = decodedToken[claim];
    
    // Only return empty if it's explicitly null or undefined (not if it's 0 or false)
    if (claimValue === null || claimValue === undefined) {
      console.warn(`Claim "${claim}" exists but value is null/undefined`);
      return '';
    }
    
    // Convert to string if it's a number (userId is likely a number)
    const stringValue = String(claimValue);
    console.log(`Successfully extracted claim "${claim}":`, stringValue);
    return stringValue;
  } catch (error) {
    console.error('Invalid JWT:', error);
    console.error('Token (first 50 chars):', token?.substring(0, 50));
    return '';
  }
};
