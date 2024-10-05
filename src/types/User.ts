export interface User {
  id: number;
  name: string;
  profilePicture: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: number;
  foto: string;
  username: string;
}
