import { createUserApi } from '@/services/api';
import { App, Button, Divider, Form, Input, Modal } from 'antd';
import { FormProps } from 'antd/lib';
import { useState } from 'react';

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
};
interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    refreshTable: () => void;
}
export default function CreateUser(props: IProps) {
    const { isModalOpen, setIsModalOpen, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean | false>(false)
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, password, email, phone } = values;
        const res = await createUserApi(fullName, password, email, phone)
        console.log(res);
        if (res.data) {
            message.success('Tạo mới thành công!')
            form.resetFields();
            setIsModalOpen(false)
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
            <Modal title="Thêm mới người dùng" open={isModalOpen} onOk={form.submit}
                onCancel={() => {
                    setIsModalOpen(false);
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
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                        className='fullName-label'
                    >
                        <Input className='fullName-input' />
                    </Form.Item>

                    <Form.Item<FieldType>
                        labelCol={{ span: 24 }}
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                    >
                        <Input.Password />
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
                        <Input />
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