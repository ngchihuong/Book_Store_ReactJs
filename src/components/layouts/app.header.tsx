import { logoutApi } from "@/services/api";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Divider, Drawer, Dropdown, Popover, Space } from "antd";
import { useCurrentApp } from "components/context/app.context"
import { useEffect, useState } from "react"
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import "./app.header.scss"
import ManageAccount from "../client/account";

export default function AppHeader(props: any) {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);

    const { user, setUser, isAuthenticated, setIsAuthenticated, carts } = useCurrentApp()
    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutApi();
        if (res.data) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem("access_token");
        }
    }

    let items = [
        {
            label: <label
                style={{ cursor: "pointer" }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to='/history'>Lịch sử mua hàng</Link>,
            key: "history"
        },
        {
            label: <label
                style={{ cursor: "pointer" }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: "logout"
        }
    ]
    if (user?.role === "ADMIN") {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin'
        })
    }

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`
    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                                </div>
                                {book.quantity}
                            </div>
                        )
                    })}
                </div>
                <div className='pop-cart-footer' onClick={() => {
                    navigate("/order")
                }} >
                    <button>Xem giỏ hàng</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <FaReact className='rotate icon-react' /> Hỏi Dân IT
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                    arrow={true}>
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
                            </li>

                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <img style={{ display: "flex", width: "2rem", height: "2rem" }}
                                                    src={urlAvatar} alt="" />
                                                Welcome {user?.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>

            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />
                <p onClick={() => handleLogout()}>Đăng xuất</p>
                <Divider />
            </Drawer>
            <ManageAccount
                isModalOpen={openManageAccount}
                setModalOpen={setOpenManageAccount}
            />
        </>

    )
}