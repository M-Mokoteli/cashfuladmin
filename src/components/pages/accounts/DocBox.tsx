import React, { useContext, useEffect, useState } from 'react'
import Button from '../../layout/form/Button'
import { LoanRequest, STATUS, UserDoc } from '../../../utils/interface/Models'
import { QuerySnapshot, updateDoc, where } from 'firebase/firestore'
import { Collections } from '../../../utils/firebase/Collections'
import { createDoc } from '../../../utils/firebase/config'
import { StateContext } from "../../../utils/context/MainContext";
import { initLoadData, URHpopulateData } from '../home/HomeUtils';

interface iDocBox {
    id: string
    status: string
    url: string
    infoKey: string
    isPdf?: boolean
    getUpdatedDocs: Function
}
export default function DocBox({ id, status, url, infoKey, isPdf = false,  getUpdatedDocs }: iDocBox) {
    const { levels } = useContext(StateContext);
    const [requests, setRequests] = useState<LoanRequest[]>([]);
    const [isLoader, setIsLoader] = useState(false);

      const populateData = async (data: QuerySnapshot<LoanRequest>) => {
        URHpopulateData(data, levels, setRequests);
      };
    const onUpdateStatus = async (_status: "rejected" | "approved") => {
        //send to upcoming..
        const yes = confirm("Are you sure you want to change the status to " + _status + "?")
        if (yes === true) {
            setIsLoader(true);
            console.log(Collections.USER_DOC, id);
            const docRef = createDoc<UserDoc>(Collections.USER_DOC, id)
            await updateDoc(docRef, { [`${infoKey}.status`]: _status.toString() })
            getUpdatedDocs(id,setIsLoader);
        }
    }

    return (
        <div className='flex gap-8 justify-start items-center mb-8'>
            <div className='p-2 bg-gray-200 rounded-md'>
                {isPdf ? <img onClick={() => {
                    window.open(url, '_blank');
                }} src={'https://cdn1.iconfinder.com/data/icons/hawcons/32/699581-icon-70-document-file-pdf-256.png'} alt="" width={120} height={120} className='object-cover rounded-md cursor-pointer' /> : <img src={url} alt="" onClick={() => {
                    window.open(url, '_blank');
                }} width={120} height={120} className='object-cover rounded-md' />}
            </div>
            <div className='flex flex-col gap-2'>
                {isLoader ? 
                    <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                 : 
                    <>
                        <Button onClick={() => { onUpdateStatus("approved") }}>Approve</Button>
                        <Button seconday onClick={() => { onUpdateStatus("rejected") }}>Reject</Button>
                        <p className='text-sm text-gray-700'><b>Status</b>: {status}</p>
                    </>
                }
            </div>
           
        </div>
        
    )
}
