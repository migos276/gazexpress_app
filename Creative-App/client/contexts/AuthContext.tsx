
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthTokens, UserRole } from "@/types";
import { apiRequest } from "@/lib/query-client";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKENS_KEY = "@gazexpress_tokens";
const USER_KEY = "@gazexpress_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedTokens, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKENS_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedTokens && storedUser) {
        setTokens(JSON.parse(storedTokens));
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading auth:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Appeler l'API Django pour l'authentification
      const response = await apiRequest('POST', '/api/auth/login/', {
        email,
        password,
      });

      const tokens: AuthTokens = await response.json();
      
      // Obtenir les informations utilisateur
      const userResponse = await apiRequest('GET', '/api/auth/profile/');
      const user: User = await userResponse.json();

      await Promise.all([
        AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokens)),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);

      setTokens(tokens);
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Erreur de connexion. Vérifiez vos identifiants.");
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Appeler l'API Django pour l'inscription
      await apiRequest('POST', '/api/auth/register/', data);

      // Après inscription réussie, se connecter automatiquement
      const response = await apiRequest('POST', '/api/auth/login/', {
        email: data.email,
        password: data.password,
      });

      const tokens: AuthTokens = await response.json();
      
      // Obtenir les informations utilisateur
      const userResponse = await apiRequest('GET', '/api/auth/profile/');
      const user: User = await userResponse.json();

      await Promise.all([
        AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokens)),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);

      setTokens(tokens);
      setUser(user);
    } catch (error) {
      console.error("Register error:", error);
      throw new Error("Erreur d'inscription. L'email existe peut-être déjà.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKENS_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      setTokens(null);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        isAuthenticated: !!tokens && !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
