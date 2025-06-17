export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  occupation?: string;
  image?: File | string;
  address?: string;
  dob?: Date;
  gender?: "male" | "female";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

