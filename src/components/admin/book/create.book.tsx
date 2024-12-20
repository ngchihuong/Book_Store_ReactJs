import { createBookAPI, getCategoryAPI, uploadFileAPI } from '@/services/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Col, Divider, Form, GetProp, Image, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import { FormProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type UserUploadType = "thumbnail" | "slider";

type FieldType = {
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    thumbnail: any;
    slider: any;
};
interface IProps {
    isModalCreateOpen: boolean;
    setIsModalCreateOpen: (v: boolean) => void;
    refreshTable: () => void;
}
export default function CreateBook(props: IProps) {
    const { isModalCreateOpen, setIsModalCreateOpen, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean | false>(false)

    const [listCategory, setListCategory] = useState<{
        label: string,
        value: string
    }[]>([]);

    const [isLoadingThumbnail, setIsLoadingThumbnail] = useState<boolean>(false);
    const [isLoadingSlider, setIsLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryAPI()
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d)
            }
        }
        fetchCategory()
    }, [])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { mainText, author, category, price, sold = 0, quantity } = values;

        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];

        const res = await createBookAPI(
            mainText,
            author,
            price,
            sold,
            quantity,
            category,
            thumbnail,
            slider
        );
        if (res && res.data) {
            message.success("Tạo mới sách thành công!")
            form.resetFields();
            setFileListThumbnail([]);
            setFileListSlider([]);
            setIsModalCreateOpen(false);
            refreshTable()
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false)
    };
    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE; //Upload.LIST_IGNORE need if upload failed then will not displayed
    };


    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    const handleRemove = async (file: UploadFile, type: UserUploadType) => {
        if (type === "thumbnail") {
            setFileListThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    }
    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            type === 'slider' ? setIsLoadingSlider(true) : setIsLoadingThumbnail(true)
            return;
        }
        if (info.file.status === 'done') {
            //get the url from  repsonse in real world
            type === "slider" ? setIsLoadingSlider(false) : setIsLoadingThumbnail(false)
        }
    }
    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "book");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileUploaded,
                status: 'loading',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
            }
            if (type === 'thumbnail') {
                setFileListThumbnail([{ ...uploadedFile }])
            } else {
                setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
            }
            if (onSuccess) {
                onSuccess("OK!")
            }
        } else {
            message.error(res.message)
        }
    }
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }


    return (
        <>
            <Modal title="Thêm mới sách"
                open={isModalCreateOpen}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setFileListThumbnail([])
                    setFileListSlider([])
                    setIsModalCreateOpen(false);
                }}
                width={"50vw"}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                okButtonProps={
                    // { autoFocus: true, htmlType: 'submit' }
                    { loading: isSubmit }
                }
                maskClosable={false}
                destroyOnClose={true}
            >
                <Divider />
                <Form
                    name='form-group'
                    onFinish={onFinish}
                    form={form}
                    autoComplete='off'
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainText"
                                rules={[{ required: true, message: 'Tên sách không được để trống!' }]}
                                className='fullName-label'
                            >
                                <Input className='fullName-input' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Tác giả không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[{ required: true, message: 'Giá tiền không được để trống!' }]}
                            >
                                <InputNumber
                                    addonAfter=" đ"
                                    min={1}
                                    style={{ width: "100%" }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: 'Thể loại không được để trống!' }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true, message: 'Số lượng không được để trống!' }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                                rules={[{ required: true, message: 'Thumbnail không được để trống!' }]}

                                valuePropName='fileList'
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className='avatar-uploader'
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, "thumbnail")}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onRemove={(file) => handleRemove(file, "thumbnail")}
                                    onPreview={handlePreview}
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {isLoadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                    </div>
                                </Upload>
                                {/* {previewImage && (
                                    <Image
                                        wrapperStyle={{ display: 'none' }}
                                        preview={{
                                            visible: previewOpen,
                                            onVisibleChange: (visible) => setPreviewOpen(visible),
                                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                        }}
                                        src={previewImage}
                                    />
                                )} */}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                                rules={[{ required: true, message: 'Slider không được để trống!' }]}
                                //convert value from Upload => form
                                valuePropName='fileList'
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    className='avatar-uploader'
                                    customRequest={(options) => handleUploadFile(options, "slider")}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file, "slider")}
                                    fileList={fileListSlider}
                                >
                                    <div>
                                        {isLoadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>

                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

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
        </>
    )
}