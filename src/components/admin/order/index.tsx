import { getOrdersAPI } from "@/services/api";
import { dateRangeValidate, FORMATE_DATE } from "@/services/helper";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";

type TSearch = {
    name: string;
    createdAt: string;
    creaatedAtRange: string;
}
export default function TableOrder() {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        // setDataViewDetail(record);
                        // setOpenViewDetail(true);
                    }}>{record._id}</a>
                )
            }
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: true,
        },
        // {
        //     title: 'Số điện thoại',
        //     dataIndex: 'phone',
        //     sorter: true
        // },
        {
            title: 'Giá tiền',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</>

                )
            },
            sorter: true
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{dayjs(record?.createdAt).format(FORMATE_DATE)}</>
                )
            }

        },

    ];

    return (
        <>
            <ProTable<IOrderTable, TSearch>
                style={{ padding: "10px 20px" }}
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    // ?current=${current}&pageSize=${pageSize}
                    if (params) {
                        query += `?current=${params.current}&pageSize=${params.pageSize}`
                        if (params.name) {
                            query += `&name=/${params?.name}/i`
                        }
                        const createdDateRange = dateRangeValidate(params.creaatedAtRange)
                        if (createdDateRange) {
                            query += `&createdAt>=/${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`
                        }
                    }
                    //default - new to old
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : "-createdAt"}`
                    } else {
                        query += `&sort=-createdAt`;
                    }

                    const res = await getOrdersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        // setDataExport(res.data?.result ?? [])
                    }

                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total,
                    }
                }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal: (total, range) => (
                        <div>{`${range[0]}-${range[1]} trên ${total} rows`}</div>
                    ),
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50', '100']
                }}
                rowKey="_id"
                headerTitle="Table Book"
                toolBarRender={() => [
                    // <CSVLink
                    //     data={dataExport}
                    //     filename={"data.csv"}
                    //     {...(dataExport as any)}
                    // >
                    //     <Button
                    //         icon={<ExportOutlined />}
                    //         type="primary"
                    //     >
                    //         Export
                    //     </Button>,
                    // </CSVLink>,
                    // <Button
                    //     key="button"
                    //     icon={<CloudUploadOutlined />}
                    //     onClick={() => {
                    //         setIsModalUploadOpen(true)
                    //     }}
                    //     type="primary"
                    // >
                    //     Import
                    // </Button>,
                    // <Button
                    //     key="button"
                    //     icon={<PlusOutlined />}
                    //     onClick={() => {
                    //         setIsModalCreateOpen(true)
                    //     }}
                    //     type="primary"
                    // >
                    //     Add New
                    // </Button>,
                ]}
            />
        </>
    )
}