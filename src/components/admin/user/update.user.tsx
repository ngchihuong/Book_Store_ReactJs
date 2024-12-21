import {  updateUserApi } from '@/services/api';
import { App, Divider, Form, Input, Modal } from 'antd';
import { FormProps } from 'antd/lib';
import { useEffect, useState } from 'react';

type FieldType = {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
};
interface IProps {
    isModalUpdateOpen: boolean;
    setIsModalUpdateOpen: (v: boolean) => void;
    refreshTable: () => void;
    dataUpdate: IUserTable | null;
    setDataUpdate: (v: IUserTable | null) => void;
}
export default function UpdateUser(props: IProps) {
    const { isModalUpdateOpen, setIsModalUpdateOpen, refreshTable, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean | false>(false)
    const { message, notification } = App.useApp();
    // antd
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            // form.setFieldValue(key, "value") if update any a value
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone
            })
        }
    }, [dataUpdate])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { _id, fullName, phone } = values;
        const res = await updateUserApi(_id, fullName, phone)
        console.log(res);
        if (res.data) {
            message.success('Tạo mới thành công!')
            form.resetFields();
            setIsModalUpdateOpen(false)
            setDataUpdate(null)
            refreshTable();
        } else {
            notification.error({
                message: "Có lỗi xảy ra!",
                description:
                    res.message && Array.isArray(res.message)
                        ? res.message[0]
                        : res.message,
                duration: 5,
                placement: "topRight"
            })
        }
        setIsSubmit(false)
        form.resetFields();
    };
    return (
        <>
            <Modal title="Thêm mới người dùng"
                open={isModalUpdateOpen}
                onOk={form.submit}
                onCancel={() => {
                    setIsModalUpdateOpen(false);
                    setDataUpdate(null)
                    form.resetFields();
                }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
            >
                <Divider />
                <Form
                    name='form-group'
                    onFinish={onFinish}
                    form={form}
                    autoComplete='off'
                >
                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        hidden
                        label="_ID"
                        name="_id"
                        rules={[{ required: true, message: '_ID không được để trống!' }]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="email"
                        label="Email"
                        labelCol={{ span: 24 }}
                        rules={[
                            { required: true, message: 'Email không được để trống!' },
                            { type: "email", message: "Email không được định dạng!" }
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                        className='fullName-label'
                    >
                        <Input className='fullName-input' />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="phone"
                        label="Số điện thoại"
                        labelCol={{ span: 24 }}
                        rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}