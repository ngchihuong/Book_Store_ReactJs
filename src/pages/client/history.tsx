import { getHistoryAPI } from "@/services/api";
import { FORMATE_DATE } from "@/services/helper";
import { App, Divider, Drawer, Table, TableProps, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function HistoryPage() {

    const columns: TableProps<IHistory>['columns'] = [
        {
            title: 'STT',
            dataIndex: "index",
            key: "index",
            render: (item, record, index) => {
                return (
                    <>
                        {index + 1}
                    </>
                )
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return (
                    dayjs(item).format(FORMATE_DATE)
                )
            },
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item ?? 0)
            },
        },
        {
            title: 'Trạng thái',
            render: (item, record, index) => {
                return (
                    <>
                        <Tag color="green">
                            Thành công
                        </Tag>
                    </>
                )
            },
        },
        {
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <a onClick={() => {
                    setOpenDetail(true);
                    setDataDetail(record)
                }} href="#">Xem chi tiết</a>
            ),
        },
    ];

    const [dataHistory, setDataHistory] = useState<IHistory[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);

    const { notification } = App.useApp();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHistoryAPI();
            if (res && res.data) {
                setDataHistory(res.data)
            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra!",
                    description: res.message
                })
            }
            setLoading(false)
        }
        fetchData()
    }, [])
    return (
        <>
            <div style={{ margin: 50 }}>
                <div>Lịch sử mua hàng</div>
                <Divider />
                <Table
                    bordered
                    columns={columns}
                    dataSource={dataHistory}
                    rowKey={"_id"}
                    loading={loading}
                />
                <Drawer
                    title="Chi tiết đơn hàng"
                    onClose={() => {
                        setOpenDetail(false)
                        setDataDetail(null)
                    }}
                    open={openDetail}
                >
                    {dataDetail?.detail?.map((item, index) => (
                        <ul key={index}>
                            <li>Tên sách: {item.bookName}</li>
                            <li>Số lượng: {item.quantity}</li>
                        </ul>
                    ))}
                </Drawer>
            </div>
        </>
    )
}