import { FORMATE_DATE_VN } from "@/services/helper";
import { Badge, Descriptions, Divider, Drawer, Image, Upload, UploadFile, UploadProps } from "antd";
import { GetProp } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type IProps = {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IBookTable | null;
    setDataViewDetail: (v: IBookTable | null) => void;
}
export default function DetailBook(props: IProps) {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = [];
            if (dataViewDetail?.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail?.thumbnail}`
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(img => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: img,
                        status: "done",
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${img}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataViewDetail])
    
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null)
    };
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const urlImageThumbnail = `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail?.thumbnail}`
    const urlImageSlider = `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail?.slider}`

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                onClose={onClose}
                width={"70vw"}
                open={openViewDetail}
            >
                <Descriptions title="Thông tin chi tiết" column={2} bordered>
                    <Descriptions.Item label="Id">
                        {dataViewDetail?._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên sách">
                        {dataViewDetail?.mainText}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tác giả">
                        {dataViewDetail?.author}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">
                        {Intl.NumberFormat
                            ('vi-VN', { style: 'currency', currency: 'VND' })
                            .format(dataViewDetail?.price ?? 0)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataViewDetail?.category} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>

                {/* <div style={{ margin: "20px 20px" }}>
                    <h3>Ảnh sách</h3>
                    <div style={{ display: "flex", marginTop: 20, flexWrap: "wrap", gap: "0px 10px" }}>
                        <div style={{ border: "1px solid #E3DADB", borderRadius: 10, padding: 10 }}>
                            <Image
                                width={100}
                                height={100}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                        </div>
                        <div style={{ border: "1px solid #E3DADB", borderRadius: 10, padding: 10 }}>
                            <Image
                                width={100}
                                height={100}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                        </div>
                        <div style={{ border: "1px solid #E3DADB", borderRadius: 10, padding: 10 }}>
                            <Image
                                width={100}
                                height={100}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                        </div>
                        <div style={{ border: "1px solid #E3DADB", borderRadius: 10, padding: 10 }}>
                            <Image
                                width={100}
                                height={100}
                                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            />
                        </div>
                    </div>
                </div> */}
                <Divider orientation="left">Ảnh sách</Divider>
                <Upload
                    action={`${import.meta.env.VITE_BACKEND_URL}/images/book/}`}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{
                        showRemoveIcon: false
                    }}
                >
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}