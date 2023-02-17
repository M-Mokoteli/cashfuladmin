import { getDocs, QuerySnapshot, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { StateContext } from "../../../utils/context/MainContext";
import { Collections } from "../../../utils/firebase/Collections";
import { createCollection } from "../../../utils/firebase/config";
import { Level, LoanRequest, STATUS } from "../../../utils/interface/Models";
import Main from "../../layout/dashboard/Main";
import Title from "../../layout/form/Title";
import RequestSection from "./RequestSection";
import UpcomingOrHistory from "./UpcomingOrHistory";
import { Modal, Button } from "@milon27/react-modal";
import UpcomingOrHistorySection from "./UpcomingOrHistory";
import { searchUser, searchData, URHpopulateData, onLoadAuthorizationCodes } from "./HomeUtils";
// Page
const AdminHome = () => {
  const { setLevels, levels } = useContext(StateContext);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [item, setItem] = useState(null as any);
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [authCodes, setAuthCodes] = useState(null as any);

  useEffect(() => {
    const load = async () => {
      const levelColRef = createCollection<Level>(Collections.LEVEL);
      const data = await getDocs(levelColRef);
      const tst = data.docs.map((item) => {
        return {
          ...item.data(),
          id: item.id,
        };
      });
      tst.sort(function (a, b) {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      setLevels(tst);
    };
    load();
  }, []);

  const doSearch = async () => {
    if (search.length == 0) {
      return;
    }
    setSearching(true);
    // get the user first
    const userIdArr = await searchUser(search);
    searchData(
      searchPopulateData,
      where("userId", "in", userIdArr),
      where("loanStatus", "!=", STATUS.pending)
    );
  };

  const searchPopulateData = async (data: QuerySnapshot<LoanRequest>) => {
    URHpopulateData(data, levels, setRequests);
  };
  const viewDetailsClicked = (item: any) => {
    setItem(item);
    onLoadAuthorizationCodes(item.userId).then((value)=>{
      setAuthCodes(value)
    })
    
    setShowDetails(true);
  };

  return (
    <Main title="Dashaboard">
      <div className="flex flex-row  justify-between items-center gap-2">
        <Title text="Overview" />
        <input
          onKeyUp={(e) => {
            e.preventDefault();
            if (e.key === "Enter") {
              doSearch();
            }
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value.trim())}
          type="text"
          className="px-3 py-2 border border-gray-400 rounded-full"
          placeholder="Search Users"
        />
      </div>
      <RequestSection onDetailsClick={viewDetailsClicked} />
      <UpcomingOrHistory onDetailsClick={viewDetailsClicked} upComing />
      <UpcomingOrHistory onDetailsClick={viewDetailsClicked} upComing={false} />
      {/* serch modal */}

      <Modal
        title={`searching for ${search}`}
        show={searching}
        setShow={setSearching}
        footer={
          <>
            <Button onClick={() => setSearching(false)} title="Close" />
          </>
        }
      >
        <UpcomingOrHistorySection
          searching={true}
          upComing={false}
          initList={requests}
          onDetailsClick={viewDetailsClicked}
        />
      </Modal>
      <Modal
        title={`Loan Details`}
        show={showDetails}
        setShow={setShowDetails}
        footer={
          <>
          </>
        }
      >
        <div id="wrapper" style={{ display: "flex", justifyItems: 'space-between' }}>
          <div style={{flex: '1'}}>
            <div>
              <div>
                <strong>First Name: </strong> <br />{item?.firstName}
              </div>
              <div>
                <strong>Last Name: </strong> <br />{item?.lastName}
              </div>
              <div>
                <strong>Details: </strong> <br />{item?.loanDetail}
              </div>
              <div>
                <strong>Type: </strong> <br />{item?.loanType}
              </div>
            </div>
            {authCodes && 
              <div >
                <div>
                  <strong>Bank: </strong> <br />{authCodes.authorization != undefined ? authCodes.authorization.bank : authCodes.data.card.issuer}
                </div>
                <div>
                  <strong>Bin: </strong> <br />{authCodes.authorization != undefined ? authCodes.authorization.bin : authCodes.data.card.first_6digits}
                </div>
                <div>
                  <strong>Card Type: </strong> <br />{authCodes.authorization != undefined ? authCodes.authorization.card_type : authCodes.data.card.type}
                </div>
                <div>
                {authCodes.authorization != undefined ? (<><strong>Brand: </strong><br /> {authCodes.authorization.brand}</>) : (<><strong>Country: </strong><br />{authCodes.data.card.country}</>)}  
                </div>
                <div>
                  <strong>Expiry: </strong> <br />{authCodes.authorization != undefined ? authCodes.authorization.exp_year : authCodes.data.card.expiry}
                </div>
                <div>
                  <strong>last4: </strong> <br />{authCodes.authorization != undefined ? authCodes.authorization.last4 : authCodes.data.card.last_4digits}
                </div>
              </div>
            }
          </div>
          {item?.oftenPaid != undefined && (
            <div style={{paddingLeft: '12px', flex: '1'}}>
                <div><strong>Pay frequency: </strong> <br />{item?.oftenPaid}</div>
                <div><strong>Pay days in a Month: </strong> <br />{item?.payDay}</div>
            </div>
          )}
        </div>
      </Modal>
    </Main>
  );
};

export default AdminHome;
