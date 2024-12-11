import { createUserApi, getUsersApi } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Divider, Form, Input, Modal } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import { FormProps } from 'antd/lib';
import CreateUser from './create.user';

// 006 #47




type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    })
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false);


    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
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
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,

        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                        />
                        <DeleteTwoTone
                            twoToneColor="#ff4d4f"
                            style={{ cursor: "pointer" }}
                        />
                    </>
                )
            },
        },
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, TSearch>
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
                        if (params.fullName) {
                            query += `&fullName=/${params?.fullName}/i`
                        }
                        if (params.email) {
                            query += `&email=/${params?.email}/i`
                        }
                        const createdDateRange = dateRangeValidate(params.createdAtRange)
                        if (createdDateRange) {
                            query += `&createdAt>=/${createdDateRange[0]}&createdAt<=${createdDateRange[1]}`
                        }

                    }
                    //default - new to old
                    query += `&sort=-createdAt`;
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : "-createdAt"}`
                    }

                    const res = await getUsersApi(query);
                    if (res.data) {
                        setMeta(res.data.meta)
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
                headerTitle="Table User"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setIsModalOpen(true)
                        }}
                        type="primary"
                    >
                        Add New
                    </Button>,
                ]}
            />
         
            <DetailUser
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateUser
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            refreshTable={refreshTable}
            />
        </>

    );
};

export default TableUser;