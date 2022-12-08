import Define from '../../../utils/Define'
import { TypeSetState } from '../../../utils/interface/CommonInterface'
import Button from '../form/Button'


interface iPagination {
    page: number,
    current_length: number,
    setPage: TypeSetState<number>
}

export default function MyPagination({ page, setPage, current_length }: iPagination) {

    //pagination handle
    const prev = () => {
        if (page > 1) {
            setPage(page => page - 1)
        } else {
            //alert("no prev")
        }
    }
    const next = () => {
        if (current_length < (Define.PAGE_SIZE)) {
            //next page not availble
            //alert("no next")
        } else {
            setPage(page => page + 1)
        }
    }


    return <>
        <div>
            <div className="flex justify-center mb-3 gap-4">
                <Button onClick={prev} disabled={page > 1 ? false : true}>Prev</Button>
                <Button disabled onClick={() => { }}>{page}</Button>
                <Button onClick={next} disabled={current_length < (Define.PAGE_SIZE) ? true : false}>Next</Button>
            </div>
        </div>
    </>


}
