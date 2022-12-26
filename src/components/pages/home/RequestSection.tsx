import { useContext, useEffect, useState } from "react";
import Define from "../../../utils/Define";
import { LoanRequest, STATUS, User } from "../../../utils/interface/Models";
import Button from "../../layout/form/Button";
import Spacing from "../../layout/form/Spacing";
import Table from "../../layout/form/Table";
import Title from "../../layout/form/Title";
import { createDoc } from "../../../utils/firebase/config";
import { Collections } from "../../../utils/firebase/Collections";
import { getDoc, where, QuerySnapshot, updateDoc } from "firebase/firestore";
import { StateContext } from "../../../utils/context/MainContext";
import FbPaginate from "../../layout/common/FbPaginate";
import {
  initLoadData,
  onUpdateLevel,
  onUpdateStatus,
  paginateNext,
  paginatePrev,
  URHpopulateData,
} from "./HomeUtils";
import MySelect from "../../layout/form/MySelect";
interface iRS {
  onDetailsClick: any;
}
export default function RequestSection({ onDetailsClick }: iRS) {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const { levels } = useContext(StateContext);
  const [page, setPage] = useState(0);

  // init
  useEffect(() => {
    if (levels.length > 0)
      initLoadData(
        setPage,
        populateData,
        where("loanStatus", "==", STATUS.pending)
      );
  }, [levels.length]);

  //next
  const next = async () => {
    paginateNext(
      setPage,
      populateData,
      requests,
      where("loanStatus", "==", STATUS.pending)
    );
  };
  //prev
  const prev = async () => {
    paginatePrev(
      setPage,
      populateData,
      requests,
      where("loanStatus", "==", STATUS.pending)
    );
  };

  const populateData = async (data: QuerySnapshot<LoanRequest>) => {
    URHpopulateData(data, levels, setRequests);
  };

  return (
    <div className="my-4">
      <Title text="Requests" isSubtitle />
      <Spacing />
      <Table
        header="Date,First Name,Last Name,Level,Term,Amount,Interest,Instant Payout,Details,Total,Options"
        items={[
          ...requests.map((item, i) => {
            return {
              date: item?.loanDate.split(" ")[0],
              fname: item?.firstName,
              lname: item?.lastName,
              // level: item?.level,
              level: (
                <MySelect
                  label="Select Level"
                  labelAsFirst
                  name=""
                  defaultValue={item?.level}
                  options={[
                    ...levels.map((item) => {
                      return { title: item.name, value: item.id };
                    }),
                  ]}
                  hideLabel
                  full_width={true}
                  onChange={(value) => {
                    // console.log(item.userId, "-----", value);
                    onUpdateLevel(item.userId, value);
                  }}
                />
              ),
              term: item.paymentTime + "days",
              amount: Define.CURRENCY + item.loanAmount,
              interest: parseFloat(item.interest) * 100 + "%",
              instantPayout: item.instantPayout == true ? 'Yes' : 'No',
              details: (
                <Button
                  onClick={() => {
                    onDetailsClick(item);
                  }}
                >
                  {" "}
                  View details{" "}
                </Button>
              ),
              total: Define.CURRENCY + item.totalRepayable,
              option: (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      onUpdateStatus(item, STATUS.approved);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    seconday
                    onClick={() => {
                      onUpdateStatus(item, STATUS.rejected);
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
  );
}
