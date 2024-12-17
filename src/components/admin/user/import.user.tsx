import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { UploadProps } from "antd/lib";
import * as Excel from "exceljs";
import { useState } from "react";
import { Buffer } from "buffer";
import { bulkCreateUserApi } from "@/services/api";
import templateFile from "@/assets/template/User.xlsx?url"

type IDataImport = {
    fullName: string;
    email: string;
    phone: string;
};
type IProps = {
    isModalUploadOpen: boolean;
    setIsModalUploadOpen: (v: boolean) => void;
    refreshTable: () => void;
}
export default function ImportUser(props: IProps) {
    const { refreshTable } = props;
    const { message, notification } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([])
    const { isModalUploadOpen, setIsModalUploadOpen } = props;
    const [isSubmit, setIsSubmit] = useState<boolean | false>(false)

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',

        // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",

        // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it

        async customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess("Ok")
                }
            }, 1000);
        },
        async onChange(info) {
            const { status } = info.file;

            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    //load file to buffer
                    const workbook = new Excel.Workbook();
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        //read first row as data keys
                        let firstRow = sheet.getRow(1)
                        if (!firstRow.cellCount) {
                            return;
                        }
                        let keys = firstRow.values as any[];

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber === 1) {
                                return;
                            }
                            let values = row.values as any;
                            let obj: any = {}
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                                obj.id = i;
                            }
                            jsonData.push(obj)
                        })
                    })
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData)
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserApi(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Bulk Create Users",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`
            })
        }
        setIsSubmit(false)
        setIsModalUploadOpen(false)
        setDataImport([])
        refreshTable()
    }
    return (
        <>
            <Modal title="Import data user"
                open={isModalUploadOpen}
                width={"50vw"}
                onOk={() => handleImport()}
                onCancel={() => {
                    setIsModalUploadOpen(false);
                    setDataImport([])
                }}
                okText={"Import data"}
                cancelText={"Hủy"}
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                //do not close when click outside
                maskClosable={false}
                destroyOnClose={true}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx. or &nbsp;
                        <a
                            href={templateFile} download
                            onClick={e => e.stopPropagation()} // dùng để chặn input cha nổi lên :v chỉ hiện download file :v
                        >Download Sample File</a>
                    </p>
                </Dragger>
                <div style={{ paddingTop: 20 }}>
                    <Table
                        rowKey={"id"}
                        title={() => <p>Dữ liệu upload:</p>
                        }
                        columns={[
                            { title: 'Tên hiển thị', dataIndex: 'fullName' },
                            { title: 'Email', dataIndex: 'email' },
                            { title: 'Số điện thoại', dataIndex: 'phone' },
                        ]}
                        dataSource={dataImport}
                    />
                </div>
            </Modal>
        </>
    )
}