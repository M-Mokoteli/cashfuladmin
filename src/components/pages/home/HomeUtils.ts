import { query, where, orderBy, limit, getDocs, QuerySnapshot, WhereFilterOp, startAfter, endBefore, limitToLast, QueryConstraint, updateDoc, getDoc, doc, addDoc, deleteDoc } from "firebase/firestore"
import React from "react"
import { toast } from "react-toastify"
import Define from "../../../utils/Define"
import { Collections } from "../../../utils/firebase/Collections"
import { createCollection, createDoc, updateChildDoc } from "../../../utils/firebase/config"
import { Level, LoanRequest, STATUS, User } from "../../../utils/interface/Models"

export const initLoadData = async (
    setPage: React.Dispatch<React.SetStateAction<number>>,
    populateData: (data: QuerySnapshot<LoanRequest>) => Promise<void>,
    ...queryConstraints: QueryConstraint[]
) => {
    const lrColRef = createCollection<LoanRequest>(Collections.LOAN_REQUEST)
    const lrQuery = query<LoanRequest>(lrColRef, ...queryConstraints, orderBy("loanDate", "desc"), limit(Define.PAGE_SIZE))
    const data = await getDocs<LoanRequest>(lrQuery)
    // console.log("------", data);
    if (!data.empty) {
        setPage(1)
        populateData(data)
    } else {
        toast("No More Data Available!")
    }
}

export const initUpdateCardList = async (
    setPage: React.Dispatch<React.SetStateAction<number>>,
) => {
    const lrColRef = createCollection<any>(Collections.UPDATE_CARD)
    const lrQuery = query<any>(lrColRef, orderBy("date", "desc"), limit(Define.PAGE_SIZE))
    const data = await getDocs<any>(lrQuery)
    // console.log("------", data);
    if (!data.empty) {
        setPage(1)
        console.log("Update Card list")
        // console.log(data.docs)

        var arr = []
        
        for (let i = 0; i < data.docs.length; i++) {
            var newInput = data.docs[i].data()
            if(newInput.status === STATUS.pending){
                arr.push(newInput)
            }
            
            // console.log("Document Id: ", repayments.docs[i].id)
        }

        return arr
        // return data.docs
    } else {
        toast("No More Data Available!")
    }
}

//return string [] of user id
export const searchUser = async (search: string): Promise<string[]> => {
    //get other info
    const userColRef = createCollection<User>(Collections.USER)
    const usersData = await getDocs(query<User>(userColRef, where("firstName", "==", search)))
    if (!usersData.empty) {
        return usersData.docs.map(item => item.id)
    } else {
        return []
    }
}

export const searchData = async (
    populateData: (data: QuerySnapshot<LoanRequest>) => Promise<void>,
    ...queryConstraints: QueryConstraint[]
) => {
    const lrColRef = createCollection<LoanRequest>(Collections.LOAN_REQUEST)
    const lrQuery = query<LoanRequest>(lrColRef, ...queryConstraints)
    const data = await getDocs<LoanRequest>(lrQuery)
    //console.log("------", data.docs);
    populateData(data)
}


export const paginateNext = async (
    setPage: React.Dispatch<React.SetStateAction<number>>,
    populateData: (data: QuerySnapshot<LoanRequest>) => Promise<void>,
    requests: LoanRequest[],
    ...queryConstraints: QueryConstraint[]
) => {
    const lrColRef = createCollection<LoanRequest>(Collections.LOAN_REQUEST)
    const lrQuery = query<LoanRequest>(lrColRef, ...queryConstraints, orderBy("loanDate", "desc"), startAfter(requests[requests.length - 1].loanDate), limit(Define.PAGE_SIZE))
    const data = await getDocs<LoanRequest>(lrQuery)
    if (!data.empty) {
        setPage(page => page + 1)
        populateData(data)
    } else {
        toast("No More Data Available!")
    }
}
//prev
export const paginatePrev = async (
    setPage: React.Dispatch<React.SetStateAction<number>>,
    populateData: (data: QuerySnapshot<LoanRequest>) => Promise<void>,
    requests: LoanRequest[],
    ...queryConstraints: QueryConstraint[]
) => {
    const lrColRef = createCollection<LoanRequest>(Collections.LOAN_REQUEST)
    const lrQuery = query<LoanRequest>(lrColRef, ...queryConstraints, orderBy("loanDate", "desc"), endBefore(requests[0].loanDate), limitToLast(Define.PAGE_SIZE))
    const data = await getDocs<LoanRequest>(lrQuery)
    if (!data.empty) {
        setPage(page => page - 1)
        populateData(data)
    } else {
        toast("No More Data Available!")
    }
}

// populate date

export const URHpopulateData = async (
    data: QuerySnapshot<LoanRequest>,
    levels: Level[],
    setRequests: React.Dispatch<React.SetStateAction<LoanRequest[]>>
) => {
    setRequests([])
    data.docs.forEach(async (doc) => {
        //get other info
        const userDocRef = createDoc<User>(Collections.USER, doc.data().userId)
        const user = await getDoc(userDocRef)

        const levelArray = levels.filter(item => {
            //const lAmount = parseInt(doc.data().loanAmount)
            // if (item.min <= lAmount && lAmount <= item.max) {
            if (item.id == user.data()?.levelId) {
                return true;
            } else {
                return false;
            }
        })

        const levelData = levelArray[0]

        const obj = {
            ...doc.data(),
            id: doc.id,
            firstName: user.data()?.firstName,
            lastName: user.data()?.lastName,
            level: levelData?.id.trim() + "",
            // interest: levelData?.interest * 100 + "%"
        } as LoanRequest
        setRequests(old => {
            return [...old, obj]
        })
    })
}


// change status

export const onUpdateStatus = async (item: LoanRequest, status: STATUS) => {
    //send to upcoming..
    const yes = confirm("Are you sure you want to change the status to " + status + "?")
    if (yes === true) {
        const lrDocRef = createDoc<LoanRequest>(Collections.LOAN_REQUEST, item.id)
        await updateDoc(lrDocRef, { "loanStatus": status.toString() })
        window.location.reload()
    }
}

export const onUpdateCardStatus = async (userId: string, status: STATUS) => {
    //send to upcoming..
    const yes = confirm("Are you sure you want to change the status to " + status + "?")
    if (yes === true) {
        const lrDocRef = createDoc<any>(Collections.UPDATE_CARD, userId)
        if(status === STATUS.rejected){
            await deleteDoc(lrDocRef)
        }else{
            await updateDoc(lrDocRef, { "status": status.toString() })
            const dataRef = await createDoc(Collections.AUTHORIZATION_CODES, userId);
            await deleteDoc(dataRef);
        }
        window.location.reload()
    }
}

export const onUpdateLevel = async (uid: string, levelId: string) => {
    //send to upcoming..
    const yes = confirm("Are you sure you want to change the level?")
    if (yes === true) {
        const lrDocRef = createDoc<User>(Collections.USER, uid)
        await updateDoc(lrDocRef, { "levelId": levelId })
        
        window.location.reload()
    }
}

export const onLoadAuthorizationCodes = async (
    userId: string,
) => {
    // console.log(queryConstraints);
    const lrColRef = createDoc<any>(Collections.AUTHORIZATION_CODES, userId)
    // const lrQuery = query<any>(lrColRef)
    const authData = await getDoc(lrColRef)
    // const data = await getDocs<any>(lrColRef)
    if (authData.exists()) {
        console.log("---autho---", authData.data().amount);
        return authData.data()
    } else {
        toast("Card is not linked")
    }
}

export const getRepayments = async (
    docId: string,
) => {
    const lrColRef = createCollection<any>(Collections.LOAN_REQUEST+"/"+docId+"/repayments")
    const lrQuery = query<any>(lrColRef, orderBy('repayment', "asc"))
    // const lrQuery = query<any>(lrColRef)
    const repayments = await getDocs(lrQuery)
    // const data = await getDocs<any>(lrColRef)
    if (repayments.size>0) {
        console.log("Repayments-------", repayments.docs);
        var arr = []
        
        for (let i = 0; i < repayments.docs.length; i++) {
            repayments.docs[i].data()["repaymentId"] = repayments.docs[i].id
            var newInput = Object.assign(repayments.docs[i].data(), {["repaymentId"] : repayments.docs[i].id})
            // console.log(newInput)
            arr.push(newInput)
            // console.log("Document Id: ", repayments.docs[i].id)
        }
        
        return arr
    } else {
        toast("0 Repayments")
        return []
        
    }
}


export const updateBalanceRemaining = async (docId: string, paidAmount: string) => {
    const lrDocRef = createDoc<any>(Collections.LOAN_REQUEST, docId);
    const loanRequestRef = await getDoc(lrDocRef);
    const loanRequest = loanRequestRef.data();
    const balanceRemaining = parseInt(loanRequest.totalRepayable) - parseInt(paidAmount);
    await updateDoc(lrDocRef, { "balanceRemaining": balanceRemaining.toFixed(2) });
}

export const updateMinimumCharges = async (docId: string, paidAmount: string, isRepayments: boolean) => {
    const lrDocRef = createDoc<any>(Collections.LOAN_REQUEST, docId);
    const loanRequestRef = await getDoc(lrDocRef);
    const loanRequest = loanRequestRef.data();
    const finalPaidAmount = parseInt(loanRequest.paidAmount ?? '0') + parseInt(paidAmount);
    const minimumCharges = parseInt(loanRequest.totalRepayable) - parseInt(paidAmount);
    await updateDoc(lrDocRef, { "totalRepayable": minimumCharges.toFixed(2), "paidAmount": finalPaidAmount.toFixed(2) });
}

export const updateRepayments = async (reqObj: any) => {
    const {isInstallment, docId, repaymentId, isfinal, reference, message, status, paymentAmount} = reqObj;
    var date = new Date()
    if(isInstallment){
        const lrDocRef = updateChildDoc<any>(Collections.LOAN_REQUEST+"/"+docId+"/repayments", repaymentId)
        await updateDoc(lrDocRef, { "status": status, "paidDate" : date.toISOString(), "reference": reference, message: message });
        if(isfinal){
            const lrDocRef = createDoc<any>(Collections.LOAN_REQUEST, docId)
            await updateDoc(lrDocRef, { "loanStatus": status,  "paymentStatus": status });
        }
    }else{
        const lrDocRef = createDoc<any>(Collections.LOAN_REQUEST, docId)
        if(status == "paid"){
            await updateDoc(lrDocRef, { "loanStatus": status,"paymentStatus": status, "paidDate" : date.toISOString(), "reference": reference, message: message });
        }else{
            await updateDoc(lrDocRef, { "paymentStatus": status, "paidDate" : date.toISOString(), "reference": reference, message: message });
        }
    }
    if(status == "paid"){
        await updateBalanceRemaining(docId, paymentAmount);
    }
    window.location.reload()
}
