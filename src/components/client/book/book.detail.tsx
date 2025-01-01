import { App, Col, Divider, Rate, Row } from "antd";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import "styles/book.scss";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BsCartPlus } from "react-icons/bs";
import ModalGallery from "./modal.gallery";
import { useCurrentApp } from "@/components/context/app.context";

interface IProps {
    currentBook: IBookTable | null;
}
type UserAction = "MINUS" | "PLUS";

export default function BookDetail(props: IProps) {

    const { currentBook } = props;
    const { carts, setCarts } = useCurrentApp();

    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originClass: string;
        thumbnailClass: string;
    }[]>([]);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1)

    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const { message } = App.useApp();

    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (currentBook) {
            const images = [];
            if (currentBook?.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        originClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    }
                )
            }
            if (currentBook?.slider && currentBook?.slider.length > 0) {
                currentBook.slider.map((item) => {
                    images.push({
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    })
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])

    const handleOnClickImage = () => {
        //get current index onClick
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    }

    const handleChangeButton = (type: UserAction) => {
        if (type === "MINUS") {
            if (currentQuantity - 1 <= 0) {
                return;
            }
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === "PLUS" && currentBook) {
            if (currentQuantity === +currentBook?.quantity) { //+currentBook?.quantity is convert string to number
                return; //return if max quantity
            }
            setCurrentQuantity(currentQuantity + 1)
        }
    }
    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value);
                console.log(value);
            }
        }
    }

    const handleAddToCart = () => {
        //update localStorage
        const cartStorage = localStorage.getItem("carts")
        if (cartStorage && currentBook) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];
            //check exists
            let isExistIndex = carts.findIndex(c => c._id === currentBook?._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook._id,
                    detail: currentBook
                })
            }

            localStorage.setItem("carts", JSON.stringify(carts));

            //sync React Context
            setCarts(carts)
            message.success("Thêm vào giỏ hàng thành công!")
        } else {
            //create
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuantity,
                detail: currentBook!
            }]
            localStorage.setItem("carts", JSON.stringify(data))

            //sync React Context
            setCarts(data)
            message.success("Thêm vào giỏ hàng thành công!")
        }
    }

    console.log(carts.length)

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="view-detail-book" style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                    <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                        <Row gutter={[20, 20]} style={{ borderRadius: 5, background: "#fff", margin: "5px 25px" }}>
                            <Col md={10} sm={0} xs={0} >
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showFullscreenButton={false}
                                    showNav={false}
                                    showPlayButton={false}
                                    // renderLeftNav={() => <></>}
                                    // renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        // renderLeftNav={() => <></>} //left arrow === <> </>
                                        // renderRightNav={() => <></>}//right arrow === <> </>
                                        showNav={false}
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className='author'>Tác giả: <a href='#'>{currentBook?.author}</a> </div>
                                    <div className='title'>{currentBook?.mainText}</div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" />
                                            Đã bán {currentBook?.sold}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}
                                        </span>
                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left'>Vận chuyển</span>
                                            <span className='right'>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left'>Số lượng</span>
                                        <span className='right'>
                                            <button onClick={() => handleChangeButton("MINUS")}><MinusOutlined /></button>
                                            <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                            <button onClick={() => handleChangeButton("PLUS")}><PlusOutlined /></button>
                                        </span>
                                    </div>
                                    <div className='buy'>
                                        <button className='cart' onClick={() => handleAddToCart()}>
                                            <BsCartPlus className='icon-cart' />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button className='now'>Mua ngay</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
                <ModalGallery
                    isOpen={isOpenModalGallery}
                    setIsOpen={setIsOpenModalGallery}
                    currentIndex={currentIndex}
                    items={imageGallery}
                    title={"hardcode"}
                />
            </div>
        </>
    )

}