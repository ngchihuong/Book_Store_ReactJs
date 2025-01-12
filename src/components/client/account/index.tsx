import { Modal, Tabs } from "antd";
import UserInfo from "components/client/account/user.info";
import ChangePassword from "./change.password";

interface IProps {
    isModalOpen: boolean;
    setModalOpen: (v: boolean) => void;
}
export default function ManageAccount(props: IProps) {
    const { isModalOpen, setModalOpen } = props;

    const items = [
        {
            key: "info",
            label: "Cập nhật thông tin",
            children: <UserInfo />
        },
        {
            key: "password",
            label: "Đổi mật khẩu",
            children: <ChangePassword />
        }
    ]
    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={isModalOpen}
                footer={null}
                onCancel={() => setModalOpen(false)}
                maskClosable={false}
                width={"60vw"}
            >
                <Tabs
                    defaultActiveKey="info"
                    items={items}
                />
            </Modal>
        </>
    )
}