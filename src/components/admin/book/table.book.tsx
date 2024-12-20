import { getBooksApi } from "@/services/api";
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";
import CreateBook from "./create.book";

type TSearch = {
    mainText: string;
    author: string;
}
export default function TableBook() {

    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    })

    // const { message, notification } = App.useApp();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null)

    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

    const [dataExport, setDataExport] = useState<IBookTable[]>([])

    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);

    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const columns: ProColumns<IBookTable>[] = [
        {
            title: '_id',
            dataIndex: "_id",
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <a href="#"
                            onClick={() => {
                                setOpenViewDetail(true)
                                setDataViewDetail(entity)
                            }}
                        >{entity._id}</a>
                    </>
                )
            },
            key: "_id",
            hideInSearch: true
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            hideInSearch: true,
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {
                            Intl.NumberFormat
                                ('vi-VN', { style: 'currency', currency: 'VND' })
                                .format(entity.price)
                        }
                    </>
                )
            },
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <div style={{ display: "flex" }}>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 5 }}
                            onClick={() => {
                                setDataUpdate(entity)
                                setIsModalUpdateOpen(true)
                            }}
                        />
                        <Popconfirm
                            title="Xác nhận xóa user!"
                            description="Bạn có chắc muốn xóa người dùng này?"
                            // onConfirm={() => handleDeleteUser(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            placement='leftTop'
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: 0 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>

                        </Popconfirm>
                    </div>
                )
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IBookTable, TSearch>
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
                        if (params.mainText) {
                            query += `&mainText=/${params?.mainText}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params?.author}/i`
                        }
                    }
                    //default - new to old
                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : "-mainText"}`
                    }
                    if (sort && sort.author) {
                        query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : "-mainText"}`
                    }
                    if (sort && sort.price) {
                        query += `&sort=${sort.price === 'ascend' ? 'price' : "-price"}`
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : "-createdAt"}`
                    } else {
                        query += `&sort=-createdAt`;
                    }

                    const res = await getBooksApi(query);
                    if (res.data) {
                        setMeta(res.data.meta)
                        setDataExport(res.data?.result ?? [])
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
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >
                        <CSVLink
                            data={dataExport}
                            filename={"data.csv"}
                            {...(dataExport as any)}
                        >Export</CSVLink>
                    </Button>,
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
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalCreateOpen(true)
                        }}
                        type="primary"
                    >
                        Add New
                    </Button>,
                ]}
            />
            <CreateBook
                isModalCreateOpen={isModalCreateOpen}
                setIsModalCreateOpen={setIsModalCreateOpen}
                refreshTable={refreshTable}
            />
            <DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </>
    )
}