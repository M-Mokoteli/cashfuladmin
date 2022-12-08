import { getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Collections } from '../../../utils/firebase/Collections';
import { createDoc } from '../../../utils/firebase/config';
import { iBackgroundInfo } from '../../../utils/interface/Models';
import Main from '../../layout/dashboard/Main';
import Button from '../../layout/form/Button';
import Input from '../../layout/form/Input';
import Spacing from '../../layout/form/Spacing';
import Title from '../../layout/form/Title';
import Toggle from '../../layout/form/Toggle';

export default function EditBackground() {
    let { id } = useParams();
    const { register, handleSubmit, setValue } = useForm<iBackgroundInfo>()
    const [info, setInfo] = useState<iBackgroundInfo>({} as iBackgroundInfo)

    // load init value
    useEffect(() => {
        const load = async () => {
            if (id) {
                const backRef = createDoc<iBackgroundInfo>(Collections.BACK_INFO, id)
                const data = await getDoc<iBackgroundInfo>(backRef)
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
            setValue("creditScore", info.creditScore || "")
            setValue("creditScoreValue", info.creditScoreValue || "")
            setValue("isSmallBusinessOwner", info.isSmallBusinessOwner || false)
            setValue("businessOffering", info.businessOffering || "")
            setValue("lengthOfOperation", info.lengthOfOperation || "")
            setValue("sourceOfFinancing", info.sourceOfFinancing || "")
            setValue("investmentToDate", info.investmentToDate || "")
            setValue("monthlyIncome", info.monthlyIncome || "")
            setValue("monthlyExpense", info.monthlyExpense || "")
            setValue("highestLevelOfEducation", info.highestLevelOfEducation || "")
            setValue("savingMonthly", info.savingMonthly || "")
            setValue("isPartOfStockvel", info.isPartOfStockvel || false)
            setValue("stockvelContribution", info.stockvelContribution || "")
        } else {
            // console.log("no info", info);
        }
    }, [info])

    const submit = (data: iBackgroundInfo) => {
        //console.log(data);
        //return;
        if (id) {
            const backRef = createDoc<iBackgroundInfo>(Collections.BACK_INFO, id)
            updateDoc(backRef, data)
            toast("Data Updated.")
        } else {
            toast("Go back and try again.")
        }
    }

    return (
        <Main>
            {/* {JSON.stringify(info)} */}
            <Title text='Bank Detail' />
            <Spacing />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                <div className='col-span-1'>
                    <Input title='Credit Score' register={register("creditScore")} />
                    <Input title='Credit Score Value' register={register("creditScoreValue")} />
                    <Toggle title="Is Small Business Owner" register={register("isSmallBusinessOwner")} />
                    <Input title='Business Offering' register={register("businessOffering")} />

                    <Input title='Length of Operations' register={register("lengthOfOperation")} />
                    <Input title='Initial Business Financing' register={register("sourceOfFinancing")} />
                    <Input title='Business Investment To-Date' register={register("investmentToDate")} />
                </div>
                <div className='col-span-1'>
                    <Input title='Business Income Per Month' register={register("monthlyIncome")} />
                    <Input title='Business Expenses Per Month' register={register("monthlyExpense")} />
                    <Input title='Highest Level of Education' register={register("highestLevelOfEducation")} />
                    <Input title='Monthly Savings' register={register("savingMonthly")} />
                    <Toggle title="Stokvel Participation" register={register("isPartOfStockvel")} />
                    <Input title='Stokvel Contribution' register={register("stockvelContribution")} />
                </div>
            </div>
            <Spacing />
            <Button onClick={() => {
                handleSubmit(submit)()
            }}>Submit</Button>
        </Main>
    )
}
