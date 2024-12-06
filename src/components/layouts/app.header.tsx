import { useCurrentApp } from "components/context/app.context"

export default function AppHeader() {
    const { user } = useCurrentApp()
    return (
        <div>
            App Header
            <div>
                {JSON.stringify(user)}
            </div>
        </div>
    )
}