import { Dropdown, Layout, Menu, MenuProps, Space } from "antd"
import React, { useState } from "react";
import { useCurrentApp } from "components/context/app.context";
import { Link, Outlet } from "react-router-dom";
import { AppstoreOutlined, DollarCircleOutlined, DownOutlined, ExceptionOutlined, HeartTwoTone, MenuFoldOutlined, MenuUnfoldOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import "./app.header.scss"
import { logoutApi } from "@/services/api";

type MenuItem = Required<MenuProps>['items'][number]
const { Content, Footer, Sider } = Layout;
export default function LayoutAdmin() {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState('dashboard')
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useCurrentApp();


    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: 'dashboard',
            icon: <AppstoreOutlined />
        },
        {
            label: <span>Manage Users</span>,
            key: 'user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to='/admin/user'>CRUD</Link>,
                    key: 'crud',
                    icon: <TeamOutlined />,
                },
                // {
                //     label: 'Files1',
                //     key: 'file1',
                //     icon: <TeamOutlined />,
                // }
            ]
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: 'book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: 'order',
            icon: <DollarCircleOutlined />
        },

    ];

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: "pointer" }}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: "pointer" }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: "logout"
        },

    ];

    const handleLogout = async () => {
        const res = await logoutApi();
        if (res.data) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem("access_token");
        }
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
    // console.log(urlAvatar);

    if (isAuthenticated === false) {
        return (
            <Outlet />
        )
    }
    const isAdminRoute = location.pathname.includes("admin")
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Outlet
                />
            )
        }
    }
    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        defaultSelectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header'>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown
                            menu={{ items: itemsDropdown }}
                            trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <img style={{ display: "flex", width: "2rem", height: "2rem" }}
                                        src={urlAvatar} alt="" />
                                    Welcome {user?.fullName}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <Content>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        React Test Fresher &copy; Hỏi Dân IT - Made with <HeartTwoTone />
                    </Footer>
                </Layout>
            </Layout>

        </>
    )
}