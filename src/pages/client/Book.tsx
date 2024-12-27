import BookDetail from "@/components/client/book/book.detail";
import BookLoader from "@/components/client/book/book.loader";
import { getBookByIdApi } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookPage() {
    const { id } = useParams();
    const { notification } = App.useApp();
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            //do something
            const fetchBookById = async () => {
                setIsLoading(true);
                const res = await getBookByIdApi(id)
                if (res && res.data) {
                    setCurrentBook(res.data)
                } else {
                    notification.error({
                        message: "Đã có lỗi xảy ra!",
                        description: res.message
                    })
                }
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000);
            }
            fetchBookById()
        }
    }, [id])

    return (
        <div>
            {
                isLoading
                    ? <BookLoader />
                    :
                    <BookDetail currentBook={currentBook} />
            }
        </div>
    )
}