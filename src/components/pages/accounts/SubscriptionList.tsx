import React, { useContext, useEffect, useState } from 'react';
import MyCard from '../../layout/common/MyCard';
import Spacing from '../../layout/form/Spacing';
import Table from '../../layout/form/Table';
import Button from "../../layout/form/Button";
import Title from '../../layout/form/Title';
import { iUserInfo } from './Accounts';
import { Modal } from '@milon27/react-modal';
import { LoanRequest, STATUS } from '../../../utils/interface/Models';
import { StateContext } from '../../../utils/context/MainContext';
import {
  initLoadData,
  onLoadAuthorizationCodes,
  onUpdateLevel,
  paginateNext,
  paginatePrev,
  URHpopulateData,
  getRepayments,
  updateRepayments,
  initUpdateCardList,
  onUpdateCardStatus,
} from '../home/HomeUtils';
import { QuerySnapshot, Timestamp, where } from 'firebase/firestore';
import Define from '../../../utils/Define';
import MySelect from '../../layout/form/MySelect';
import FbPaginate from '../../layout/common/FbPaginate';
import axios from 'axios';
import { toast } from 'react-toastify';

interface iAccountList {
  searching: boolean;
  pendingList: iUserInfo[];
  reviewedList: iUserInfo[];
  setInfo: React.Dispatch<React.SetStateAction<iUserInfo>>;
  searchWord: string;
}
// var data = [
//     { "Load": "asdadada",
//     "First": "Jill Dupre",
//     "Last": "Jill Duprse",
//     "Term": "rt",
//     "Account":"yh",
//     "Intrest":"xc",
//     "Total":"2022",
//     }];

export default function SubscriptionList({
  searching = false,
  pendingList = [],
  setInfo,
  reviewedList = [],
  searchWord = '',
}: iAccountList) {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const { levels } = useContext(StateContext);
  const [page, setPage] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [item, setItem] = useState(null as any);
  const [authCodes, setAuthCodes] = useState(null as any);
  const [repayments, setRepayments] = useState(null as any);
  const [nextInstallmentDate, setNextInstallmentDate] = useState(null as any);
  const [nextInstallment, setInstallment] = useState(null as any);
  const [isPaidInstallments, setIsPaidInstallments] = useState(null as any);
  const [updateCardList, setUpdateCardList] = useState(null as any);

  const onDetailsClick = (item: any) => {
    console.log(item);
    setItem(item);
    setShowDetails(true);
    const repayments=getRepayments(item.id)
    repayments.then((res)=>{
      setRepayments(res)
      
    })
    const authCodes=onLoadAuthorizationCodes(item.userId)
    authCodes.then((res)=>{
      setAuthCodes(res)
    })
  };

  useEffect(() => {
    console.log("Repayments",repayments)
    console.log("Auth codes",authCodes)
    if(repayments){
      for(var i=0;i <repayments?.length;i++){
        if(repayments[i].status==="upcoming"){
          console.log("Setting next installment")
          console.log(repayments[i]?.status.toString())
          setIsPaidInstallments(repayments[i]?.status.toString())
          setNextInstallmentDate(repayments[i]?.dueDate.toDate().toDateString())
          setInstallment(parseFloat(repayments[i]?.amount.toString()).toFixed(0))
          break
        }else{
          setIsPaidInstallments("paid")
        }
      }
      if(repayments.length===0){
        
        setIsPaidInstallments(item.paymentStatus.toString())
        setNextInstallmentDate(addDays(new Date(item.loanDate), parseInt(item.paymentTime.toString())).toISOString().split('T')[0])
        setInstallment(parseFloat(item.totalRepayable.toString()).toFixed(0))
      }
    }
  }, [authCodes, repayments]);

  function addDays(date : any, number : any) {
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + number));
  }

  useEffect(() => {
    if (levels.length > 0)
      initLoadData(
        setPage,
        populateData,
        where('loanStatus', '==', STATUS.approved)
      );
  }, [levels.length]);

  useEffect(() => {
    initLoadData(setPage, populateData, where('firstName', '==', searchWord));
  }, [reviewedList]);


  //next
  const next = async () => {
    paginateNext(
      setPage,
      populateData,
      requests,
      where('loanStatus', '==', STATUS.approved)
    );
  };
  //prev
  const prev = async () => {
    paginatePrev(
      setPage,
      populateData,
      requests,
      where('loanStatus', '==', STATUS.approved)
    );
  };

  const populateData = async (data: QuerySnapshot<LoanRequest>) => {
    setRepayments(null)
    initUpdateCardList(setPage).then((value)=>{
      setUpdateCardList(value)
      console.log(value)
    });
    URHpopulateData(data, levels, setRequests);
  };

  const loadPayment = async (uid:string) => {
  //  console.log( onLoadPaymentInfo(setPage));;
  };
  const apiCall = async (docId: string) => {
    if(authCodes){
      if(isPaidInstallments==="paid"){
        toast("Already paid")
      }else{
        const yes = confirm("Are you sure you want to charge card?")
        if(yes===true){
          const article = {
            authorization_code: authCodes.authorization.authorization_code,
            email:authCodes.customer.email,
            amount: parseInt(nextInstallment) * 100,
            currency: 'ZAR',
          };
          axios
            .post(
              'https://api.paystack.co/transaction/charge_authorization',
              article,
              //sk_test_f2eb250bf2baba6606992b64ed0fb0a61fe48655
              //sk_live_ad543dd59a6282b947f04ae2910723fefa1a3d30
              { headers: { Authorization: `Bearer sk_live_ad543dd59a6282b947f04ae2910723fefa1a3d30` } }
            )
            .then(async (response) => {
              console.log('=======Charge Card Response======', response.data.data.status);
              console.log(response.data)
              if(response.data.data.status==="success"){
                if(repayments){
                  if(repayments.length>0){
                    for(var i=0; i<repayments.length;i++){
                      if(repayments[i].status==="upcoming"){
                        await updateRepayments(docId, repayments[i].repaymentId, true, response.data.data.reference.toString())
                        break
                      }
                    }
                  }else{
                    await updateRepayments(docId, '', false, response.data.data.reference.toString())
                  }
                }
              }else{
                toast("Some error occurred")
              }
            });
        }
      }
    }
  };

  
function onChangeInstallment(value: string) {
  const re = /^[0-9\b]+$/;
  if (value === '' || re.test(value)) {
    if(parseInt(value) <= parseInt(item.totalRepayable.toString())){
      setInstallment(value)
    }
 }
}
  
  return (
    
    <MyCard>
      <div className='Subsmain'>
        <Title text='Search Result' isSubtitle />
        <Spacing />
        <Table
          noShadow={true}
          header='Loan Date,First Name,Last Name,Term,Account,Intrest,Total Repayble, Action'
          items={[
            ...requests.map((item, i) => {
              // console.log(item);
              return {
                date: item?.loanDate.split(' ')[0],
                fname: item?.firstName,
                lname: item?.lastName,
                // level: item?.level,

                term: item.paymentTime + 'days',
                amount: Define.CURRENCY + item.loanAmount,
                interest: item.interest,
                total: Define.CURRENCY + item.totalRepayable,
                Action: (
                  <Button
                    onClick={() => {
                      onDetailsClick(item);
                    }}
                    
                  >Get Auth</Button>
                ),
              };
            }),
          ]}
          hideOption={true}
        />
        <Spacing />
        {/* paginate here */}
        <FbPaginate
          page={page}
          setPage={setPage}
          current_length={requests.length}
          next={next}
          prev={prev}
        />
      </div>
      <div className='Subsmain'>
        <Title text='Update Card Requests' isSubtitle />
        <Spacing />
        {updateCardList && <Table
        header="Date,First Name,Last Name,Status,Options"
        items={[
          ...updateCardList.map((item:{firstName: string, date: string, lastName: string, status: string, userId: string }, i: any) => {
            return {
              date: item.date.split("T")[0],
              fname: item.firstName,
              lname: item.lastName,
              status: item.status,
              option: (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      // onUpdateStatus(item, STATUS.approved);
                      onUpdateCardStatus(item.userId, STATUS.approved)
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    seconday
                    onClick={() => {
                      
                      onUpdateCardStatus(item.userId, STATUS.rejected)
                      // onUpdateStatus(item, STATUS.rejected);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ),
            };
          }),
        ]}
        hideOption={true}
      />}
        <Spacing />
        {/* paginate here */}
        {/* <FbPaginate
          page={page}
          setPage={setPage}
          current_length={requests.length}
          next={next}
          prev={prev}
        /> */}
      </div>
      <Spacing />
      <Spacing />
      <div className='modeName'>
        <Modal
          title={item?.firstName + ' ' + item?.lastName}
          onClose={() => {
            setShowContent(false);
          }}
          show={showDetails}
          setShow={setShowDetails}
          footer={
            <>
              <Button onClick={() => apiCall(item.id)}>Charge card</Button>
            </>
          }
        >
          <>
            <div className='closeBtn2' onClick={() => setShowDetails(false)}>
              x
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='col-span-1 p-4 border rounded-md circleDataMain'>
                <p className='paraM'>Loan Details</p>
                <p className='paraM'>Date: {item?.loanDate.split(' ')[0]}</p>
                <p className='paraM'>Outstanding Amount: R {item?.totalRepayable}</p>
                <p className='paraM'>Status: {item?.paymentStatus}</p>
                <p className='paraM'>Remaining Balance: R {item?.balanceRemaining.length == 0 ? item?.totalRepayable:item?.balanceRemaining }</p>
                {/* <div className='flex items-center justify-between gap-2 circleData'>
                  <input value={item?.totalRepayable} />
                </div> */}
                {/* <Button onClick={() => setShowDetails(false)} title='Submit' /> */}
              </div>
              <div className='col-span-1 p-4 border rounded-md'>
              
                <h6 className='fontSizes'>Next Instalment</h6>
                <div className='fontSizes paraMs'>
                  {nextInstallment}
                </div>
                <br></br>
                <h5 className='fontSizes paraMs' >Next Instalment Date</h5>
                <h5 className='fontSizes paraMs'>R {nextInstallmentDate}</h5>
              </div>
              {authCodes && <div className='col-span-1 p-4 border rounded-md'>
                <p className='paraM'>
                  Status: true
                  <br></br>
                  Message: Bin resolved<br></br>
                  Bin: {authCodes.authorization.bin}<br></br>
                  Brand: {authCodes.authorization.brand}<br></br>
                  last4: {authCodes.authorization.last4}<br></br>
                  Card Type: {authCodes.authorization.card_type}<br></br>
                  Bank: {authCodes.authorization.bank}<br></br>
                </p>
              </div>}
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-1 fullwidt'>
              <div className='col-span-1 border rounded-md'>
                <h5 className='fontSizes paraMs'>Repayment Schedule</h5>
                <br></br>
                
                {(repayments!==null && repayments.length>0) && <Table
                  noShadow={true}
                  header='Repayment,Due Date,Amount,Status,Paid Date'
                  items={[
                    ...repayments.map((rep: { repayment: string, dueDate: any, amount: string, status: string, paidDate: any}, i: any) => {
                      // console.log(repayments);
                      if(rep?.status!=="paid"){
                        return {
                          repayment: rep?.repayment.toString(),
                          dueDate: rep?.dueDate.toDate().toDateString(),
                          amount: "R " + parseFloat(rep?.amount.toString()).toFixed(2).toString(),
                          status: rep?.status.toString(),
                          // paidDate: {rep?.paidDate},
                        };
                      } else{
                        console.log("Paid Date",rep?.paidDate)
                        return {
                          repayment: rep?.repayment.toString(),
                          dueDate: rep?.dueDate.toDate().toDateString(),
                          amount: "R " + parseFloat(rep?.amount.toString()).toFixed(2).toString(),
                          status: rep?.status.toString(),
                          paidDate: rep?.paidDate.toString().split("T")[0],
                        };
                      }
                    }),
                  ]}
                  hideOption={true}
                />}

                {(repayments!==null && repayments.length===0) && 

                <table className='tableData'>
                  <thead>
                    <tr>
                      <th>Repayment</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Paid Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{item.repayment}</td>
                      <td>{nextInstallmentDate}</td>
                      <td>R {item.totalRepayable}</td>
                      <td>{item.paymentStatus}</td>
                      <td>{item.paidDate && item.paidDate.toString().split("T")[0]}</td>
                    </tr>
                    </tbody>
                </table>
                // <Table
                //   noShadow={true}
                //   header='Repayment,Due Date,Amount,Status,Paid Date'
                //   items={[
                //     ...repayments.map((rep: { repayment: string, dueDate: any, amount: string, status: string, paidDate: any}, i: any) => {
                //       // console.log(repayments);
                //       if(rep?.status==="upcoming"){
                //         return {
                //           repayment: rep?.repayment.toString(),
                //           dueDate: rep?.dueDate.toDate().toDateString(),
                //           amount: parseFloat(rep?.amount.toString()).toFixed(2).toString(),
                //           status: rep?.status.toString(),
                //           // paidDate: {rep?.paidDate},
                //         };
                //       } else{
                //         return {
                //           repayment: rep?.repayment.toString(),
                //           dueDate: rep?.dueDate.toDate().toDateString(),
                //           amount: parseFloat(rep?.amount.toString()).toFixed(2).toString(),
                //           status: rep?.status.toString(),
                //           paidDate: rep?.paidDate.toString(),
                //         };
                //       }
                //     }),
                //   ]}
                //   hideOption={true}
                // />
                }
              </div>

              <div className='flex items-center justify-between gap-2 circleData bottomInput'>
                <input value={nextInstallment} onChange={val => onChangeInstallment(val.target.value)} type="number" />
              </div>
            </div>
          </>
        </Modal>
      </div>
    </MyCard>
  );
}



