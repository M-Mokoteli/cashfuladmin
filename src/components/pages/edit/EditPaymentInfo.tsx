import { getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Collections } from '../../../utils/firebase/Collections'
import { createDoc } from '../../../utils/firebase/config'
import { iPaymentInfos } from '../../../utils/interface/Models'
import Main from '../../layout/dashboard/Main'
import Button from '../../layout/form/Button'
import Input from '../../layout/form/Input'
import Spacing from '../../layout/form/Spacing'
import Title from '../../layout/form/Title'

export default function EditPaymentInfo() {
    let { id } = useParams();
    const { register, handleSubmit, setValue } = useForm<iPaymentInfos>()
    const [info, setInfo] = useState<iPaymentInfos>({} as iPaymentInfos)

    // load init value
    useEffect(() => {
        const load = async () => {
            if (id) {
                const payRef = createDoc<iPaymentInfos>(Collections.PAYMENT_INFO, id)
                const data = await getDoc<iPaymentInfos>(payRef)
                if (data.exists()) {
                    setInfo(data.data())
                }
            }
        }
        load()
    }, [id])

    useEffect(() => {
        if (info) {
            // console.log("yes info", info);
            setValue("bankDetail", info.bankDetail);
            setValue("mtnDetail", info.mtnDetail);
        } else {
            // console.log("no info", info);
        }
    }, [info])


    const submit = (data: iPaymentInfos) => {
        // console.log(data);
        if (id) {
            const payRef = createDoc<iPaymentInfos>(Collections.PAYMENT_INFO, id)
            updateDoc(payRef, data)
            toast("Data Updated.")
        } else {
            toast("Go back and try again.")
        }
    }

    return (
        <Main>
            {/* {JSON.stringify(info)} */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div className='col-span-1'>
                    <Title text='Bank Detail' />
                    <Spacing />
                    <Input title='Holder Name' register={register("bankDetail.hodlerName")} disable={info.bankDetail == null} />
                    <Input title='Account Number' register={register("bankDetail.accountNumber")} disable={info.bankDetail == null} />
                    <Input title='Account Type' register={register("bankDetail.accountType")} disable={info.bankDetail == null} />
                    <Input title='Bank Name' register={register("bankDetail.bankName")} disable={info.bankDetail == null} />
                    <Input title='Bank Code' register={register("bankDetail.bankCode")} disable={info.bankDetail == null} />
                </div>
                <div className='col-span-1'>
                    <Title text='MTN Detail' />
                    <Spacing />
                    <Input title='Full Name' register={register("mtnDetail.fullName")} disable={info.mtnDetail == null} />
                    <Input title='Account Number' register={register("mtnDetail.accountNumber")} disable={info.mtnDetail == null} />
                </div>
            </div>
            <Spacing />
            <Button onClick={() => {
                handleSubmit(submit)()
            }}>Submit</Button>
        </Main>
    )
}
