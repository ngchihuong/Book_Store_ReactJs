import { FORMATE_DATE } from "@/services/helper";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;
}
export default function DetailUser(props: IProps) {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null)
    };
    return (
        <>
            :
            <Drawer
                title="Chức năng xem chi tiết"
                onClose={onClose}
                width={"50vw"}
                open={openViewDetail}
            >
                <Descriptions title="Thông tin chi tiết" column={2} bordered>
                    <Descriptions.Item label="Id">
                        {dataViewDetail?._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">
                        {dataViewDetail?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {dataViewDetail?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        {dataViewDetail?.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.role} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                    {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}