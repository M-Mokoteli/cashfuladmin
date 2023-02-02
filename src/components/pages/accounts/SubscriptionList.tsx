import React, { useContext, useEffect, useState } from "react";
import MyCard from "../../layout/common/MyCard";
import Spacing from "../../layout/form/Spacing";
import Table from "../../layout/form/Table";
import Button from "../../layout/form/Button";
import Title from "../../layout/form/Title";
import { iUserInfo } from "./Accounts";
import { Modal } from "@milon27/react-modal";
import { LoanRequest, STATUS } from "../../../utils/interface/Models";
import { StateContext } from "../../../utils/context/MainContext";
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
  updateMinimumCharges,
} from "../home/HomeUtils";
import { QuerySnapshot, Timestamp, where } from "firebase/firestore";
import Define from "../../../utils/Define";
import MySelect from "../../layout/form/MySelect";
import FbPaginate from "../../layout/common/FbPaginate";
import axios from "axios";
import { toast } from "react-toastify";
import ShowBalance from "./Balance";

interface iAccountList {
  searching: boolean;
  pendingList: iUserInfo[];
  reviewedList: iUserInfo[];
  setInfo: React.Dispatch<React.SetStateAction<iUserInfo>>;
  searchWord: string;
}

export default function SubscriptionList({
  searching = false,
  pendingList = [],
  setInfo,
  reviewedList = [],
  searchWord = "",
}: iAccountList) {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const { levels } = useContext(StateContext);
  const [page, setPage] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [item, setItem] = useState(null as any);
  const [chargeCard, setchargeCard] = useState("" as any);
  const [defaultSelected, setdefaultSelected] = useState(null as any);
  const [authCodes, setAuthCodes] = useState(null as any);
  const [repayments, setRepayments] = useState(null as any);
  const [nextInstallmentDate, setNextInstallmentDate] = useState(null as any);
  const [nextInstallment, setInstallment] = useState(null as any);
  const [isPaidInstallments, setIsPaidInstallments] = useState(null as any);
  const [updateCardList, setUpdateCardList] = useState(null as any);

  const onDetailsClick = (item: any) => {
    setItem(item);
    setShowDetails(true);
    const repayments = getRepayments(item.id);
    repayments.then((res) => {
      setRepayments(res);
    });
    const authCodes = onLoadAuthorizationCodes(item.userId);
    authCodes.then((res) => {
      setAuthCodes(res);
    });
  };

  useEffect(() => {
    if (repayments) {
      for (var i = 0; i < repayments?.length; i++) {
        if (repayments[i].status === "upcoming") {
          console.log("Setting next installment");
          console.log(repayments[i]?.status.toString());
          setIsPaidInstallments(repayments[i]?.status.toString());
          setNextInstallmentDate(
            repayments[i]?.dueDate.toDate().toDateString()
          );
          setInstallment(parseFloat(repayments[i]?.amount).toFixed(2));
          break;
        } else {
          setIsPaidInstallments("paid");
        }
      }
      if (repayments.length === 0) {
        setIsPaidInstallments(item.loanStatus.toString());
        setNextInstallmentDate(
          addDays(
            new Date(item.loanDate),
            parseInt(item.paymentTime.toString())
          )
            .toISOString()
            .split("T")[0]
        );
        setInstallment(parseFloat(item.totalRepayable).toFixed(2));
      }
    }
  }, [authCodes, repayments]);

  function addDays(date: any, number: any) {
    const newDate = new Date(date);
    return new Date(newDate.setDate(newDate.getDate() + number));
  }

  useEffect(() => {
    if (levels.length > 0)
      initLoadData(
        setPage,
        populateData,
        where("loanStatus", "==", STATUS.approved)
      );
  }, [levels.length]);

  useEffect(() => {
    initLoadData(setPage, populateData, where("firstName", "==", searchWord));
  }, [reviewedList]);

  //next
  const next = async () => {
    paginateNext(
      setPage,
      populateData,
      requests,
      where("loanStatus", "==", STATUS.approved)
    );
  };
  //prev
  const prev = async () => {
    paginatePrev(
      setPage,
      populateData,
      requests,
      where("loanStatus", "==", STATUS.approved)
    );
  };

  const populateData = async (data: QuerySnapshot<LoanRequest>) => {
    setRepayments(null);
    initUpdateCardList(setPage).then((value) => {
      setUpdateCardList(value);
      console.log(value);
    });
    URHpopulateData(data, levels, setRequests);
  };

  const getIsFinal = (index: number, repayments: any) => {
    let count = 0;
    repayments.forEach((data: { status: any }) => {
      if (data.status && data.status == "paid") {
        count++;
      }
    });
    return index == count && index == repayments.length;
  };

  const apiCall = async (
    docId: string,
    repaymentId: string,
    paymentAmount: string,
    index: number
  ) => {
    if (authCodes) {
      if (isPaidInstallments === "paid") {
        toast("Already paid");
      } else {
        const yes = confirm("Are you sure you want to charge card?");
        if (yes === true) {
          const article = {
            authorization_code: authCodes.authorization.authorization_code,
            email: authCodes.customer.email,
            amount: parseInt(paymentAmount) * 100,
            currency: "ZAR",
          };
          axios
            .post(
              "https://api.paystack.co/transaction/charge_authorization",
              article,
              //sk_test_f2eb250bf2baba6606992b64ed0fb0a61fe48655
              //sk_live_ad543dd59a6282b947f04ae2910723fefa1a3d30
              {
                headers: {
                  Authorization: `Bearer sk_live_ad543dd59a6282b947f04ae2910723fefa1a3d30`,
                },
              }
            )
            .then(async (response) => {
              let resObj = {
                docId,
                repaymentId,
                isInstallment: null as any,
                reference: response.data.data.reference.toString(),
                message:
                  response.data.message +
                  " | " +
                  response.data.data.gateway_response,
                status:
                  response.data.data.status === "success" ? "paid" : "failed",
                isfinal: false,
                paymentAmount,
              };
              if (repaymentId != "") {
                resObj.isInstallment = true;
                resObj.isfinal = getIsFinal(index, repayments);
                await updateRepayments(resObj);
              } else {
                resObj.isInstallment = false;
                await updateRepayments(resObj);
              }
              if (response.data.data.status !== "success") {
                toast(
                  "Some error occurred : " + response.data.data.gateway_response
                );
              }
            })
            .catch((error) => {
              toast("Error in paystack : " + JSON.stringify(error));
              console.log(error);
            });
        }
      }
    }
  };

  useEffect(() => {
    if (requests.length > 0) {
      requests.forEach((item: LoanRequest) => {
        if (chargeCard != "" && item.id == defaultSelected) {
          setdefaultSelected(null);
          setchargeCard("");
          onDetailsClick(item);
          return;
        }
      });
    }
  }, [requests]);

  const transactAMinimumValue = async () => {
    if (authCodes) {
      const yes = confirm("Are you sure you want to charge card?");
      if (yes === true) {
        const article = {
          authorization_code: authCodes.authorization.authorization_code,
          email: authCodes.customer.email,
          amount: parseInt(chargeCard) * 100,
          currency: "ZAR",
        };
        axios
          .post(
            "https://api.paystack.co/transaction/charge_authorization",
            article,
            {
              headers: {
                Authorization: `Bearer sk_live_ad543dd59a6282b947f04ae2910723fefa1a3d30`,
              },
            }
          )
          .then(async (response) => {
            if (response.data.data.status == "success") {
              setdefaultSelected(item.id);
              // if(repayments && repayments.length > 0){
              //   for await (const repayment of repayments) {
              //     if(repayment.status == "upcoming"){
              //       parseInt(repayment.amount) - parseInt(chargeCard);
              //       break;
              //     }
              //   }
              //   await updateMinimumCharges(item.id, chargeCard, true, re);
              // }else{
              await updateMinimumCharges(item.id, chargeCard, false);
              // }
              await initLoadData(
                setPage,
                populateData,
                where("loanStatus", "==", STATUS.approved)
              );
              toast(
                "Card Charged Status : " + response.data.data.gateway_response
              );
            } else {
              setdefaultSelected(null);
              setchargeCard("");
              toast(
                "Card Charged Status : " + response.data.data.gateway_response
              );
            }
          })
          .catch((error) => {
            toast("Error in paystack : " + JSON.stringify(error));
            console.log(error);
          });
      }
    }
  };

  return (
    <MyCard>
      <div className="Subsmain">
        <Title text="Search Result" isSubtitle />
        <Spacing />
        <Table
          noShadow={true}
          header="Loan Date,First Name,Last Name,Term,Account,Interest,Total Repayable, Action"
          items={[
            ...requests.map((item, i) => {
              // console.log(item);
              return {
                date: item?.loanDate.split(" ")[0],
                fname: item?.firstName,
                lname: item?.lastName,
                // level: item?.level,

                term: item.paymentTime + "days",
                amount: Define.CURRENCY + item.loanAmount,
                interest: parseFloat(item.interest) * 100 + "%",
                total: Define.CURRENCY + item.totalRepayable,
                Action: (
                  <Button
                    onClick={() => {
                      onDetailsClick(item);
                    }}
                  >
                    Get Auth
                  </Button>
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
      <div className="Subsmain">
        <Title text="Update Card Requests" isSubtitle />
        <Spacing />
        {updateCardList && (
          <Table
            header="Date,First Name,Last Name,Status,Options"
            items={[
              ...updateCardList.map(
                (
                  item: {
                    firstName: string;
                    date: string;
                    lastName: string;
                    status: string;
                    userId: string;
                  },
                  i: any
                ) => {
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
                            onUpdateCardStatus(item.userId, STATUS.approved);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          seconday
                          onClick={() => {
                            onUpdateCardStatus(item.userId, STATUS.rejected);
                            // onUpdateStatus(item, STATUS.rejected);
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    ),
                  };
                }
              ),
            ]}
            hideOption={true}
          />
        )}
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
      <div className="modeName">
        <Modal
          title=""
          onClose={() => {
            setShowContent(false);
          }}
          show={showDetails}
          setShow={setShowDetails}
          footer={<></>}
        >
          <>
            <div className="model-header">
              <div className="modal-title">
                {item?.firstName + " " + item?.lastName}
              </div>
              <div className="closeBtn2" onClick={() => setShowDetails(false)}>
                X
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="col-span-1 p-4 border rounded-md circleDataMain">
                <div className="center-elements">
                  <p className="title-text">Loan Date</p>
                  <p className="title-output">{item?.loanDate.split(" ")[0]}</p>
                  <div className="spacing"></div>
                  <p className="title-text">Remaining Balance: </p>
                  <p className="title-output">
                    R{" "}
                    {item?.balanceRemaining == ""
                      ? parseFloat(item?.totalRepayable).toFixed(2).toString()
                      : parseFloat(item?.balanceRemaining)
                          .toFixed(2)
                          .toString()}
                  </p>
                </div>
              </div>
              <div className="col-span-1 p-4 border rounded-md circleDataMain">
                <div>
                  <p className="title-text">Next Instalment</p>
                  <p className="title-output">R{nextInstallment}</p>
                  <div className="spacing"></div>
                  <p className="title-text">Next Instalment Date</p>
                  <p className="title-output">{nextInstallmentDate}</p>
                </div>
              </div>
              {authCodes && (
                <div className="col-span-1 p-4 border rounded-md">
                  <p className="paraM">
                    Status: true
                    <br></br>
                    Message: Bin resolved<br></br>
                    Bin: {authCodes.authorization.bin}
                    <br></br>
                    Brand: {authCodes.authorization.brand}
                    <br></br>
                    last4: {authCodes.authorization.last4}
                    <br></br>
                    Card Type: {authCodes.authorization.card_type}
                    <br></br>
                    Bank: {authCodes.authorization.bank}
                    <br></br>
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1 fullwidth">
              <div
                className="col-span-1  rounded-md"
                style={{ paddingTop: "12px" }}
              >
                <br></br>
                {repayments !== null && repayments.length > 0 && (
                  <Table
                    noShadow={true}
                    header="Repayment,Due Date,Amount,Status,Message,Paid Date,Action"
                    items={[
                      ...repayments.map(
                        (
                          rep: {
                            repayment: string;
                            dueDate: any;
                            amount: string;
                            status: string;
                            paidDate: any;
                            repaymentId: string;
                            message: string;
                          },
                          i: any
                        ) => {
                          // console.log(repayments);
                          if (rep?.status !== "paid") {
                            return {
                              repayment: rep?.repayment.toString(),
                              dueDate: rep?.dueDate.toDate().toDateString(),
                              amount:
                                "R " +
                                parseFloat(rep?.amount.toString())
                                  .toFixed(2)
                                  .toString(),
                              status: rep?.status.toString(),
                              message: rep.message,
                              // paidDate: {rep?.paidDate},
                              paidDate: "N/A",
                              action: (
                                <Button
                                  onClick={() =>
                                    apiCall(
                                      item.id,
                                      rep.repaymentId,
                                      rep?.amount.toString(),
                                      i + 1
                                    )
                                  }
                                >
                                  Charge card
                                </Button>
                              ),
                            };
                          } else {
                            console.log("Paid Date", rep?.paidDate);
                            return {
                              repayment: rep?.repayment.toString(),
                              dueDate: rep?.dueDate.toDate().toDateString(),
                              amount:
                                "R " +
                                parseFloat(rep?.amount.toString())
                                  .toFixed(2)
                                  .toString(),
                              status: rep?.status.toString(),
                              message: rep.message,
                              paidDate: rep?.paidDate.toString().split("T")[0],
                              action: "",
                            };
                          }
                        }
                      ),
                    ]}
                    hideOption={true}
                  />
                )}

                {repayments !== null && repayments.length === 0 && (
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 tableData ">
                    <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-6 py-3">Repayment</th>
                        <th className="px-6 py-3">Due Date</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Message</th>
                        <th className="px-6 py-3">Paid Date</th>
                        <th className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        style={{ textAlign: "center" }}
                      >
                        <td>{item.repayment}</td>
                        <td>{nextInstallmentDate}</td>
                        <td>R {parseFloat(item.totalRepayable).toFixed(2)}</td>
                        <td>
                          {item.paymentStatus ??
                            (item.loanStatus == "approved"
                              ? "upcoming"
                              : item.loanStatus)}
                        </td>
                        <td>{item.message ?? "N/A"}</td>
                        <td>
                          {item.paidDate &&
                            item.paidDate.toString().split("T")[0]}
                        </td>
                        <td>
                          <Button
                            onClick={() =>
                              apiCall(item.id, "", item.totalRepayable, 1)
                            }
                          >
                            Charge card
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              <div className="charge-input-container">
                <input
                  type="number"
                  className="charge-input"
                  placeholder="Charge a minimum value"
                  value={chargeCard}
                  onChange={(e) => setchargeCard(e.target.value)}
                />
                <input
                  type="submit"
                  className="charge-input"
                  onClick={() => transactAMinimumValue()}
                />
              </div>
            </div>
            {item != null && <ShowBalance item={item} />}
          </>
        </Modal>
      </div>
    </MyCard>
  );
}
