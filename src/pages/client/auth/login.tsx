import { useCurrentApp } from "@/components/context/app.context";
import { loginApi } from "@/services/api";
import { App, Button, Divider, Form, FormProps, Input } from 'antd';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/login.scss"

type FieldType = {
    username: string;
    password: string;
};
export default function Login() {
    const [isSubmit, setIsSubmit] = useState<boolean | false>(false)
    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const {setIsAuthenticated, setUser} = useCurrentApp()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;
        const res = await loginApi(username, password)
        console.log(res);
        if (res.data) {
            setIsAuthenticated(true)
            setUser(res.data.user)
            localStorage.setItem('access_token', res.data.access_token)
            message.success('Đăng nhập tài khoản thành công!')
            navigate("/")
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
    };
    return (
        <>
            <div className="login-page">
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
                                    label="Email"
                                    name="username"
                                    rules={[
                                        { required: true, message: 'Email không được để trống!' },
                                        { type: "email", message: "Email không được định dạng!" }
                                    ]}
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

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <Divider>Or</Divider>
                                <p className="text text-normal">
                                    Chưa có tài khoản ? <Link to='/register'>Đăng ký</Link>
                                </p>
                            </Form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}