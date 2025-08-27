import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  [key: string]: any;
};

export const getClaim = (claim: string, token: string): string => {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken[claim] ?? '';
  } catch (error) {
    console.error('Invalid JWT:', error);
    return '';
  }
};
