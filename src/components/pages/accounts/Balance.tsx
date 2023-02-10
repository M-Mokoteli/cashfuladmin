import { getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Collections } from "../../../utils/firebase/Collections";
import { createDoc } from "../../../utils/firebase/config";
import Button from "../../layout/form/Button";

function ShowBalance(props: any) {
  const [balance, setBalance] = useState<String | null>(null);
  const [income, setIncome] = useState<any>(null);

  useEffect(() => {
    if (props.item != null) {
      const docColRef = createDoc<any>(Collections.USER, props.item.userId);
      getDoc(docColRef)
        .then((doc) => {
          const response = doc.data();
          if (response.balance != null) {
            setBalance("R " + response.balance);
          } else {
            setBalance("No Balance Found");
          }
          if (response.income != null) {
            setIncome({ data: response.income });
          } else {
            setIncome({ message: "No Income Found" });
          }
        })
        .catch((error) => {});
    }
    return () => {
        setBalance(null);
        setIncome(null);
    };
  }, [props.item]);

  const getLatestBalance = () => {
    setBalance(null);
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };
    let id = toast.loading("Please wait getting balance for you..");
    fetch(
      "https://us-central1-cashful-9f540.cloudfunctions.net/users/fetchData/" +
        props.item.userId +
        "?type=balance",
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result: any) => {
        if(result.status == "Mono Account is not linked!"){
            toast.update(id, { render: result.status, type: "info", isLoading: false, autoClose: 3000 });
            setBalance(result.status);
            return;
        }
        let bal = result.balance.balance / 100;
        setBalance("R " + bal);
        const docColRef = createDoc<any>(Collections.USER, props.item.userId);
        await updateDoc(docColRef, { balance: bal });
      })
      .catch((error) => {
        console.log("error", error);
        setBalance("Error Occured while fetching balance");
      });
  };

  const getLatestIcome = () => {
    setIncome(null);
    let id = toast.loading("Please wait getting income for you..");
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };
    fetch(
      "https://us-central1-cashful-9f540.cloudfunctions.net/users/fetchData/" +
        props.item.userId +
        "?type=income",
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result: any) => {
        if(result.status == "Mono Account is not linked!"){
            toast.update(id, { render: result.status, type: "info", isLoading: false, autoClose: 3000 });
            setIncome({ message: result.status });
            return;
        }
        console.log("result", result.income);
        setIncome({
          data: result.income,
        });
        const docColRef = createDoc<any>(Collections.USER, props.item.userId);
        await updateDoc(docColRef, { income: result.income });
      })
      .catch((error) => {
        console.log("error", error);
        setBalance("Error Occured while fetching balance");
      });
  };

  function toTitleCase(str:string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="col-span-1 p-3 border rounded-md circleDataMain">
        <div>
          <p className="title-text">Last Fetched Balance:</p>
          <div className="spacing"></div>

          {balance == null ? (
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <>
              <p className="title-output">{balance}</p>
              <div className="spacing"></div>
              {/* <p className="title-text">
                <Button
                  style={{ fontSize: "16px" }}
                  fullWidth
                  onClick={() => getLatestBalance()}
                >
                  Fetch Latest Balance
                </Button>
              </p> */}
            </>
          )}
        </div>
      </div>
      <div className="col-span-1 p-3 border rounded-md circleDataMain">
        <div>
          <p className="title-text">Last Fetched Income:</p>
          <div className="spacing"></div>

          {income == null ? (
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <>
              <p className="title-output">{income.message}</p>
              {income.data != null &&
                Object.keys(income.data).map((value: any) => {
                  return (
                    <div className="custom-flex">
                      <div style={{fontSize: '16px'}} className="title-output">{toTitleCase(value.split("_").join(" "))}</div>{" "}
                      <div style={{fontSize: '16px'}} className="title-output">
                        {income.data[value]}
                      </div>
                    </div>
                  );
                })}

              <div className="spacing"></div>
              {/* <p className="title-text">
                <Button
                  style={{ fontSize: "16px" }}
                  fullWidth
                  onClick={() => getLatestIcome()}
                >
                  Fetch Latest Income
                </Button>
              </p> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowBalance;
