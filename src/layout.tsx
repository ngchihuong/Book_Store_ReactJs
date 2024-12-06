import { Outlet } from "react-router-dom"
import AppHeader from "./components/layouts/app.header"
import { useEffect } from "react"
import { fetchAccountApi } from "./services/api"
import { useCurrentApp } from "components/context/app.context"

//0014 #37
function Layout() {
  const {setUser, isAppLoading, setIsAppLoading} = useCurrentApp()
  useEffect(() => {
    const fetchAccount = async() => {
      const res = await fetchAccountApi()
      if (res.data) {
        setUser(res.data.user)
        
      }
      setIsAppLoading(false)
    }
    fetchAccount();
  }, [])
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  )
}

export default Layout
