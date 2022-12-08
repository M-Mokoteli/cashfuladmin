import { query, where, orderBy, startAfter, limit, getDocs } from 'firebase/firestore'
import Define from '../../../utils/Define'
import { Collections } from '../../../utils/firebase/Collections'
import { createCollection } from '../../../utils/firebase/config'
import { TypeSetState } from '../../../utils/interface/CommonInterface'
import { LoanRequest } from '../../../utils/interface/Models'
import Button from '../form/Button'


interface iPagination {
    page: number,
    current_length: number,
    setPage: TypeSetState<number>,
    next: () => void
    prev: () => void
}

export default function FbPaginate({ page, setPage, current_length, next, prev }: iPagination) {

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
