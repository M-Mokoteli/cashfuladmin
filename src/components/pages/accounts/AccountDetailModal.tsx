import React, { useEffect, useState } from 'react'
import { Modal, Button } from '@milon27/react-modal'
import Title from '../../layout/form/Title'
import UserBasicInfo from './UserBasicInfo'
import { useNavigate } from 'react-router-dom'
import URL from '../../../utils/URL'
import { getDoc } from 'firebase/firestore'
import { createDoc } from '../../../utils/firebase/config'
import { Collections } from '../../../utils/firebase/Collections'
import { iBackgroundInfo, iPaymentInfos } from '../../../utils/interface/Models'
import { iUserInfo } from './Accounts'

interface iModal {
    info: iUserInfo
    show: boolean
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}


export default function AccountDetailModal({ info, show, setShow }: iModal) {
    const nav = useNavigate()
    const [pay, setPay] = useState<iPaymentInfos>({} as iPaymentInfos)
    const [back, setBack] = useState<iBackgroundInfo>({} as iBackgroundInfo)
    const [authData, setAuthData] = useState<any>(undefined);

    useEffect(() => {
        setAuthData(undefined);
        const load = async (id: string) => {
            if (id == "") {
                return;
            }
            const backgroundDoc = getDoc<iBackgroundInfo>(createDoc(Collections.BACK_INFO, id))
            const bankMtnDoc = getDoc<iPaymentInfos>(createDoc(Collections.PAYMENT_INFO, id))
            const authCodes = getDoc<iPaymentInfos>(createDoc(Collections.AUTHORIZATION_CODES, id))
            const [backData, payData, authData] = await Promise.all([backgroundDoc, bankMtnDoc, authCodes])
            //console.log(backData, payData);
            if(authData.exists()){
                setAuthData(authData.data()!);
            }
            if (payData.exists())
                setPay(payData.data()!)
            if (backData.exists()) {
                setBack(backData.data()!)
            }
        }
        load(info.id)
    }, [info.id])
    return (
        <Modal
            title='Account Information'
            show={show}
            setShow={setShow}
            footer={<>
                <Button title='Close' onClick={() => { setShow(false) }} />
            </>}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='col-span-1 border rounded-md p-4'>
                    <div className='flex justify-between items-center gap-2'>
                        <Title isSubtitle text='Background information' />
                        <Button title='Edit' onClick={() => {
                            nav(`${URL.BACKGROUND}/${info.id}`)
                        }} />
                    </div>
                    <UserBasicInfo title1='First Name' value1={info.firstName || "-"} title2='Last Name' value2={info.lastName || "-"} />
                    <UserBasicInfo title1='Date of Birth' value1={info.dob || "-"} title2='Gender' value2={info.gender || "-"} />
                    <UserBasicInfo title1='Mobile Number' value1={info.mobileNumber || "-"} title2='Address' value2={info.address || "-"} />
                    <UserBasicInfo title1='Email-Id' value1={authData ? (authData.customer != undefined ? authData.customer.email : authData.data.customer.email) : ''} title2='' value2={''} />

                    <UserBasicInfo title1='Credit Score' value1={back.creditScore || "-"} title2='Credit Score Value' value2={back.creditScoreValue || "-"} />
                    <UserBasicInfo title1='Small Business Owner' value1={back.isSmallBusinessOwner ? "Yes" : "No"} title2='Business Offering' value2={back.businessOffering || "-"} />

                    <UserBasicInfo title1='Length of Operations' value1={back.lengthOfOperation || "-"} title2='Initial Business Financing' value2={back.sourceOfFinancing || "-"} />
                    <UserBasicInfo title1='Business Investment To-Date' value1={back.investmentToDate || "-"} title2='Business Revenue Monthly' value2={back.businessrevenueMonthly || "-"} />
                    <UserBasicInfo title1='Business Expenses Monthly' value1={back.businessExpenceMonthly || "-"} title2='Income Per Month' value2={back.monthlyIncome || "-"} />
                    <UserBasicInfo title1='Expenses Per Month' value1={back.monthlyExpense || "-"} title2='Highest Level of Education' value2={back.highestLevelOfEducation || "-"} />
                    <UserBasicInfo title1='Monthly Savings' value1={back.savingMonthly || "-"} title2='Stokvel Participation' value2={back.isPartOfStockvel ? "Yes" : "No"} />

                    <UserBasicInfo title1='First Reference' value1={back.firstReferenceName || "-"} title2='Second Reference' value2={back.secondReferenceName || "-"} />
                    <UserBasicInfo title1='Additional Source of Income' value1={back.additionalSourceIncome || "-"} title2='Additional Income' value2={back.additionalIncome || "-"} />
                    <UserBasicInfo title2='Source of Income' value2={back.sourceOfIncome || "-"} title1='Additional Income Frequency' value1={back.incomeFrequency || "-"} />
                    <UserBasicInfo title1='Stokvel Contribution' value1={back.stockvelContribution || "-"} title2='' value2='' />
                </div>
                <div className='col-span-1 border rounded-md p-4'>  
                    <div className='flex justify-between items-center gap-2'>
                        <Title isSubtitle text={`${pay.bankDetail ? "Bank" : "MTN"} Account Details`} />
                        <Button title='Edit' onClick={() => {
                            nav(`${URL.PAY_INFO}/${info.id}`)
                        }} />
                    </div>
                    {
                        pay.bankDetail ? <>
                            <UserBasicInfo title1='Account Holder' value1={pay.bankDetail?.hodlerName!} title2='Account Number' value2={pay.bankDetail?.accountNumber!} />
                            <UserBasicInfo title1='Account Type' value1={pay.bankDetail?.accountType!} title2='Bank' value2={pay.bankDetail?.bankName!} />
                            <UserBasicInfo title1='Branch Code' value1={pay.bankDetail?.bankCode!} title2='' value2={''} />
                        </> : <>
                            <UserBasicInfo title1='Account Holder' value1={pay.mtnDetail?.fullName!} title2='Account Number' value2={pay.mtnDetail?.accountNumber!} />
                        </>
                    }

                    <UserBasicInfo title1='Reference' value1={pay?.reference_number!} title2='' value2={''} />
                </div>
            </div>
        </Modal>
    )
}
