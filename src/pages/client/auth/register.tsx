import { useState } from 'react';
import type { FormProps } from 'antd';
import { App, Button, Divider, Form, Input } from 'antd';
import "@/styles/register.scss"
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '@/services/api';

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string;
};
export default function Register() {
    const [isSubmit, setIsSubmit] = useState<boolean | false>(false)
    const { message } = App.useApp();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { fullName, password, email, phone } = values;
        const res = await registerApi(fullName, password, email, phone)
        console.log(res);
        if (res.data) {
            message.success('Đăng ký người dùng thành công!')
            navigate("/login")
        } else {
            message.error(res.message)
        }
        setIsSubmit(false)
    };

    return (
        <>
            <div className="register-page">
                <main className="main">
                    <div className="container">
                        <div className="wrapper">
                            <div className="heading">
                                <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                                <Divider />
                            </div>
                            <Form
                                name='form-group'
                                onFinish={onFinish}
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
                                    labelCol={{ span: 24 }}
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    name="phone"
                                    label="Số điện thoại"
                                    labelCol={{ span: 24 }}
                                    rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                                <Divider>Or</Divider>
                                <p className="text text-normal">
                                    Đã có tài khoản ? <Link to='/login'>Đăng nhập</Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}