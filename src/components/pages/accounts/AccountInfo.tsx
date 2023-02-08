import { id } from 'date-fns/locale'
import { getDoc, QuerySnapshot, where } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { StateContext } from '../../../utils/context/MainContext'
import { Collections } from '../../../utils/firebase/Collections'
import { createDoc } from '../../../utils/firebase/config'
import { LoanRequest, STATUS, UserDoc } from '../../../utils/interface/Models'
import MyCard from '../../layout/common/MyCard'
import Button from '../../layout/form/Button'
import MySelect from '../../layout/form/MySelect'
import Spacing from '../../layout/form/Spacing'
import Title from '../../layout/form/Title'
import { initLoadData, onUpdateLevel, URHpopulateData } from '../home/HomeUtils'
import AccountDetailModal from './AccountDetailModal'
import { iUserInfo } from './Accounts'
import DocBox from './DocBox'
import UserBasicInfo from './UserBasicInfo'
interface iAccountInfo {
    info: iUserInfo
    id: string
    status: string
    url: string
    infoKey: string
    isPdf?: boolean
    load: Function
    setInfo: React.Dispatch<React.SetStateAction<iUserInfo>>
}

export default function AccountInfo({ info, load }: iAccountInfo) {
    const { levels } = useContext(StateContext);
    const [page, setPage] = useState(0);
    const [requests, setRequests] = useState<LoanRequest[]>([]);
    const [bankStatement, setBankStatement] = useState(null);
    const [idCard, setIdCard] = useState(null);
    const [proofOfAddress, setProofOfAddress] = useState(null);
    const [bankStatementV2, setBankStatementV2] = useState(null);

    useEffect(() => {
        if (levels.length > 0)
          initLoadData(
            setPage,
            populateData,
            where("loanStatus", "==", STATUS.pending)
          );
      }, [levels.length]);

      useEffect(() => {
        if(bankStatement != null){
          setBankStatement(null);
          setIdCard(null);
          setProofOfAddress(null);
        }
      },[info.id])

      const populateData = async (data: QuerySnapshot<LoanRequest>) => {
        URHpopulateData(data, levels, setRequests);
      };
    const [show, setShow] = useState(false)
    //const [_id, setId] = useState("")
    if (info.firstName == undefined) {
        return <></>
    }
    const onUpdateStatus = async (_status: "rejected" | "approved") => {
        //send to upcoming..
        const yes = confirm("Are you sure you want to change the status to " + _status + "?")
        if (yes === true) {
            // console.log(Collections.USER_DOC, id);

            // const docRef = createDoc<UserDoc>(Collections.USER_DOC, id)
            // await updateDoc(docRef, { [`${infoKey}.status`]: _status.toString() })
            window.location.reload()
        }
    }

    const getUpdatedDocs = async (docId:string, setIsLoader:Function) => {
      const docColRef = createDoc<any>(Collections.USER_DOC, docId);
      const docData = await getDoc(docColRef);
      if(docData.data().bankStatementV2 != null){
        setBankStatementV2(docData.data().bankStatementV2);
      }else{
        setBankStatement(docData.data().bankStatement);
      }
      setIdCard(docData.data().idCard);
      setProofOfAddress(docData.data().proofOfAddress);
      setIsLoader(false);
      load();
    }

    const getUpdatedBankStatement = async (docId:string) => {
      const docColRef = createDoc<any>(Collections.USER_DOC, docId);
      const docData = await getDoc(docColRef);
      setBankStatementV2(docData.data().bankStatementV2);
    }

    const fetchSignedUrl = async () => {
        let id = toast.loading("Please wait getting statement for you..");
        const response = await fetch("https://us-central1-cashful-9f540.cloudfunctions.net/users/getSignedUrl/"+info.id, {
            method: 'GET',
        }).then((res) => res.json());
        toast.update(id, { render: "All is good", type: "success", isLoading: false, autoClose: 3000 });
        window.open(
          response.url,
          '_blank' 
        );
    }

    const fetchNewStatement = async () => {
      let id = toast.loading("Please wait generating new statement..");
      await fetch("https://us-central1-cashful-9f540.cloudfunctions.net/users/newStatement/"+info.id, {
          method: 'GET',
      });
      toast.update(id, { render: "New Statement generated! Click on View Statement to view.", type: "success", isLoading: false, autoClose: 5000 });
    } 

    const requestNewMonoAccount = async () => {
      let id = toast.loading("Please wait sending request..");
      await fetch("https://us-central1-cashful-9f540.cloudfunctions.net/users/newAccountLink/"+info.id, {
          method: 'GET',
      });
      await getUpdatedBankStatement(info.id);
      toast.update(id, { render: "Request Sent!", type: "success", isLoading: false, autoClose: 3000 });
    } 
    return (
        <MyCard>
            <Title text='Account Information' />
            <Spacing />
            <UserBasicInfo title1='First Name' value1={info.firstName || "-"} title2='Last Name' value2={info.lastName || "-"} />
            <UserBasicInfo title1='Date of Birth' value1={info.dob || "-"} title2='Gender' value2={info.gender || "-"} />
            <UserBasicInfo title1='Mobile Number' value1={info.mobileNumber || "-"} title2='Address' value2={info.address || "-"} />
            <Spacing />
            <Button fullWidth onClick={() => {
                setShow(true)
                //setId(info.id)
            }}>View Account Information</Button>
            <AccountDetailModal info={info} show={show} setShow={setShow} />
            <Spacing />
            <Title text='User documents' />
            <Spacing />
            {info?.doc?.bankStatementV2 != null && (
              <>
                <Button seconday={true} onClick={() => {
                  fetchNewStatement()
                }}>Fetch New Bank Statement</Button>
                <div style={{ height: '12px' }}></div>
                <Button seconday={true} onClick={() => {
                    requestNewMonoAccount()
                }}>Ask User to Link New Account With Mono</Button>
                <Spacing />
                <Spacing />
                <DocBox getUpdatedDocs={getUpdatedDocs} id={info?.id || ""} getUrl={fetchSignedUrl} isBankStatementV2={true}  status={bankStatementV2 ? bankStatementV2['status'] :info?.doc?.bankStatementV2?.status || ""} infoKey="bankStatementV2"/>
              </>
              )}
              <DocBox getUpdatedDocs={getUpdatedDocs} id={info?.id || ""} url={bankStatement ? bankStatement['url'] : info?.doc?.bankStatement?.url || ""} status={bankStatement ? bankStatement['status'] :info?.doc?.bankStatement?.status || ""} infoKey="bankStatement" isPdf={true} />
            <DocBox getUpdatedDocs={getUpdatedDocs} id={info?.id || ""} url={idCard ? idCard['url'] : info?.doc?.idCard?.url || ""} status={idCard ? idCard['status'] : info?.doc?.idCard?.status || ""} infoKey="idCard" />
            <DocBox getUpdatedDocs={getUpdatedDocs} id={info?.id || ""} url={proofOfAddress ? proofOfAddress['url'] : info?.doc?.proofOfAddress?.url || ""} status={proofOfAddress ? proofOfAddress['status'] : info?.doc?.proofOfAddress?.status} infoKey="proofOfAddress" />
            {/* <div className='submitButtin'>
            <MySelect
                   label="Select Level"
                  labelAsFirst
                  name=""
                  options={[
                    ...levels.map((item) => {
                      return { title: item.name, value: item.id };
                    }),
                  ]}
                  hideLabel
                  full_width={true}
                  onChange={(value) => {
                    // console.log(item.userId, "-----", value);
                    onUpdateLevel('1', value);
                  }}
                />
            <Button onClick={() => { onUpdateStatus("approved") }}>Submit</Button>
                                </div> */}
        </MyCard>
    )
}
