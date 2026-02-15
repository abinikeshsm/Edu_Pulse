export type UserRole = 'professor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
