import React, { createContext, useContext, useState } from "react";

interface CurrentUserContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser) => void;
    user: IUser | null;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
}
const CurrentAppContext = createContext<CurrentUserContextType | null>(null)

type TProps = {
    children: React.ReactNode;
}
export const AppProvider = ({ children }: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

    return (
        <CurrentAppContext.Provider value={{
            isAuthenticated, user, setIsAuthenticated, setUser, isAppLoading, setIsAppLoading
        }}>
            {children}
        </CurrentAppContext.Provider>
    )
}
export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);
    if (!currentAppContext) {
        throw new Error("useCurrentApp has not to be within <CurrentAppContext.Provider>")
    }
    return currentAppContext;
}