import { fetchAccountApi } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";

interface CurrentUserContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    user: IUser | null;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;

    carts: ICart[];
    setCarts: (v: ICart[]) => void;
}
const CurrentAppContext = createContext<CurrentUserContextType | null>(null)

type TProps = {
    children: React.ReactNode;
}
export const AppProvider = ({ children }: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [carts, setCarts] = useState<ICart[]>([])

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountApi()
            const carts = localStorage.getItem("carts")
            if (res.data) {
                setUser(res.data.user)
                setIsAuthenticated(true)
                if (carts) {
                    setCarts(JSON.parse(carts))
                }
            }
            setIsAppLoading(false)
        }
        fetchAccount();
    }, [])

    return (
        <>
            {isAppLoading === false
                ?
                <>
                    <CurrentAppContext.Provider value={{
                        isAuthenticated, user, setIsAuthenticated, setUser, isAppLoading, setIsAppLoading,
                        carts, setCarts
                    }}>
                        {children}
                    </CurrentAppContext.Provider>
                </>
                :
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <PacmanLoader
                        size={30}
                        color="#36d6b4"
                    />
                </div>
            }
        </>
    )
}
export const useCurrentApp = () => {
    const currentAppContext = useContext(CurrentAppContext);
    if (!currentAppContext) {
        throw new Error("useCurrentApp has not to be within <CurrentAppContext.Provider>")
    }
    return currentAppContext;
}