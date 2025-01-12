import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react"
import CountUp from "react-countup";

export default function AdminDashboard() {
    const [databaseDashboard, setDatabaseDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countBook: 0
    });

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashboardAPI();
            if (res && res.data) {
                setDatabaseDashboard({
                    countOrder: res.data.countOrder,
                    countUser: res.data.countUser,
                    countBook: res.data.countBook
                })
            }
        }
        initDashboard()
    }, [])
    const formatter = (value: any) => <CountUp end={value} separator="," />;
    return (
        <>
            <Row gutter={[40, 40]} >
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic
                            title="Tổng Users"
                            value={databaseDashboard.countUser}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic title="Tổng Đơn hàng" value={databaseDashboard.countOrder} precision={2} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic title="Tổng Sách" value={databaseDashboard.countBook} precision={2} formatter={formatter} />
                    </Card>
                </Col>
            </Row>

        </>
    )
}