import OrderDetail from "@/components/client/order";
import Payment from "@/components/client/order/payment";
import { Button, Result, Steps } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import "styles/order.scss";

export default function OrderPage() {

    const [currentStep, setCurrentStep] = useState<number>(0);
    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                    <div className="order-steps">
                        <Steps
                            size="small"
                            current={currentStep}
                            items={[
                                {
                                    title: 'Đơn hàng',
                                },
                                {
                                    title: 'Đặt hàng',
                                },
                                {
                                    title: 'Thanh toán',
                                },
                            ]}
                        />
                    </div>
                    {currentStep === 0 &&
                        <OrderDetail setCurrentStep={setCurrentStep} />
                    }
                    {currentStep === 1 &&
                        <Payment setCurrentStep={setCurrentStep} />
                    }
                    {currentStep === 2 &&
                        <Result
                            status="success"
                            title="Đặt hàng thành công!"
                            subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn!"
                            extra={[
                                <Button key="home">
                                    <Link to={"/"} type="primary">Trang chủ</Link>
                                </Button>,
                                <Button key="history">
                                    <Link to={"/history"} type="primary">Lịch sửa mua hàng</Link>
                                </Button>,
                            ]}
                        />
                    }
                </div>
            </div>

        </>
    )
}