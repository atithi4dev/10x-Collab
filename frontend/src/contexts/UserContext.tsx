import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'offline';
  role: string;
}

export const users: User[] = [
  { id: '1', name: 'Alex Chen', avatar: 'AC', status: 'online', role: 'Frontend Dev' },
  { id: '2', name: 'Jordan Lee', avatar: 'JL', status: 'online', role: 'Backend Dev' },
  { id: '3', name: 'Sam Wilson', avatar: 'SW', status: 'idle', role: 'Full Stack' },
  { id: '4', name: 'Taylor Kim', avatar: 'TK', status: 'online', role: 'Designer' },
];

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, users }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
