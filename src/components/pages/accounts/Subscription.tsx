import { documentId, getDoc, getDocs, limit, orderBy, query, QuerySnapshot, startAfter, where } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { StateContext } from "../../../utils/context/MainContext";
import { toast } from 'react-toastify'
import Define from '../../../utils/Define'
import { Collections } from '../../../utils/firebase/Collections'
import { createCollection, createDoc } from '../../../utils/firebase/config'
import Helper from '../../../utils/Helper'
import { Level, STATUS, User, UserDoc } from '../../../utils/interface/Models'
import Main from '../../layout/dashboard/Main'
import Button from '../../layout/form/Button'
import Spacing from '../../layout/form/Spacing'
import Title from '../../layout/form/Title'
import { BsFillBackspaceFill } from 'react-icons/bs'
import AccountInfo from './AccountInfo'
import SubscriptionList from './SubscriptionList'

export interface iUserInfo {
    id: string,
    firstName?: string,
    lastName?: string,
    dob?: string,
    address?: string,
    mobileNumber?: string,
    gender?: string,
    doc: UserDoc
}

// Page
export default function Subscription() {
    const [info, setInfo] = useState<iUserInfo>({} as iUserInfo)

    const [pendingList, setPendingList] = useState<iUserInfo[]>([])
    const [approvedList, setApprovedList] = useState<iUserInfo[]>([])
    const [lastID, setLastID] = useState<string | undefined>(undefined)

    const [realod, setrealod] = useState(false)
    const [searching, setSearching] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const load = async () => {
            const docColRef = createCollection<UserDoc>(Collections.USER_DOC)
            const q1 = query(docColRef, where("bankStatement.status", "==", "pending"))
            const q2 = query(docColRef, where("idCard.status", "==", "pending"))
            const q3 = query(docColRef, where("proofOfAddress.status", "==", "pending"))

            const q4 = query(docColRef,
                where("bankStatement.status", "==", "approved"),
                where("idCard.status", "==", "approved"),
                where("proofOfAddress.status", "==", "approved"),
                orderBy(documentId()),
                limit(Define.PAGE_SIZE)
            )

            const [d1, d2, d3, d4] = await Promise.all([getDocs(q1), getDocs(q2), getDocs(q3), getDocs(q4)])
            setPendingList(await getPendingUserList(d1, d2, d3));
            const [mylast, approveList] = await getApprovedList(d4);
            if (approveList) {
                setApprovedList(approveList as iUserInfo[])
            } else {
                toast("No Next Page Available")
            }
            if (mylast !== undefined) {
                setLastID(mylast as string)
            } else {
                setLastID(undefined)
            }
        }
        load()
    }, [realod])


    const loadNext = async () => {
        if (lastID == undefined) {
            toast("No Next Page Available")
            return;
        }
        const docColRef = createCollection<UserDoc>(Collections.USER_DOC)

        const q = query(docColRef,
            where("bankStatement.status", "==", "approved"),
            where("idCard.status", "==", "approved"),
            where("proofOfAddress.status", "==", "approved"),
            orderBy(documentId()),
            startAfter(lastID),
            limit(Define.PAGE_SIZE)
        )
        const approveUserData: QuerySnapshot<UserDoc> = await getDocs<UserDoc>(q)

        const [mylast, approveList] = await getApprovedList(approveUserData)
        setLastID(mylast as string)
        if (approveList) {
            setApprovedList(approveList as iUserInfo[])
        } else {
            toast("No Next Page Available")
        }
        if (mylast !== undefined) {
            setLastID(mylast as string)
        } else {
            setLastID(undefined)
        }
    }

    const doSearch1 = async () => {
        if (search.length == 0) {
            return;
        }
        setSearching(true)
        const docColRef = createCollection<UserDoc>(Collections.USER_DOC)
        const sq = query(docColRef,
            where("bankStatement.status", "==", "approved"),
            where("idCard.status", "==", "approved"),
            where("proofOfAddress.status", "==", "approved"),
            orderBy(documentId())
        )
        const sd = await getDocs(sq)
        const [mylast, approveList] = await getApprovedList(sd);
        if (approveList) {
            const list = (approveList as iUserInfo[]).filter(item => {
                if (item.firstName?.toString().toLowerCase().includes(search.trim().toLowerCase())) {
                    return true;
                } else {
                    return false;
                }
            })
            setApprovedList(list)
        } else {
            toast("No Data Available")
        }
    }
    const { setLevels, levels } = useContext(StateContext);

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

    // show that on approve list
    const doSearch = async (event: { key: string }) => {
        if (event.key === 'Enter') {
           
         
        if (search.length == 0) {
            return;
        }
        // get user by user firstname
        const userColRef = createCollection<User>(Collections.USER)
        const usersData = await getDocs(query<User>(userColRef, where("firstName", ">=", search)))
        if (!usersData.empty) {
            setSearching(true)
            // get doc for that user    
            const userData = usersData.docs[0]
            const data = await getDoc<UserDoc>(createDoc<UserDoc>(Collections.USER_DOC, userData.id))
            const docData = data.data()
            const info = {
                id: userData.id,
                firstName: userData.data().firstName,
                lastName: userData.data().lastName,
                dob: userData.data().dob,
                address: userData.data().address,
                gender: userData.data().gender,
                mobileNumber: userData.data().mobileNumber,
                doc: docData,
            } as iUserInfo
            setApprovedList([info])
        } else {
            toast("No Data Available")
        }
    }
    }


    return (
        <Main title='Accounts'>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className='col-span-1'>
                    <div className='flex flex-col md:flex-row gap-2 justify-between items-center'>
                        <Title text='Subscription' />
                        <div className='flex justify-end items-center gap-2'>
                            <input
                                onKeyUp={doSearch}
                                value={search} onChange={(e) => { setSearch(e.target.value) }} type="text" className='px-5 py-1 border border-gray-400 rounded-full' placeholder='Search' />
                            {searching && <BsFillBackspaceFill className='text-3xl cursor-pointer' onClick={() => {
                                setSearch("")
                                setSearching(false)
                                setrealod(old => !old)
                            }} />}
                        </div>
                    </div>
                    <Spacing />
                    <Spacing />
                    <Spacing />
                    <SubscriptionList searching={searching} pendingList={pendingList} reviewedList={approvedList} setInfo={setInfo} searchWord={""} />


                    {searching == false && lastID !== undefined &&
                        <div className='my-4 flex justify-center'>
                            <Button onClick={() => {
                                loadNext()
                            }}>Next</Button>
                        </div>
                    }
                </div>
                <div className='col-span-1'>
                    {/* {
                        JSON.stringify(info.id)
                    } */}
                    
                </div>
            </div>
        </Main>
    )
}



const getPendingUserList = async (
    d1: QuerySnapshot<UserDoc>,
    d2: QuerySnapshot<UserDoc>,
    d3: QuerySnapshot<UserDoc>
): Promise<iUserInfo[]> => {
    const pendingDuplist = [] as iUserInfo[]

    if (!d1.empty) {
        d1.docs.forEach(item => {
            pendingDuplist.push({
                id: item.id,
                doc: item.data()
            })
        })
    }
    if (!d2.empty) {
        d2.docs.forEach(item => {
            pendingDuplist.push({
                id: item.id,
                doc: item.data()
            })
        })
    }
    if (!d3.empty) {
        d3.docs.forEach(item => {
            pendingDuplist.push({
                id: item.id,
                doc: item.data()
            })
        })
    }
    return await getUserData(pendingDuplist);
}


const getApprovedList = async (d4: QuerySnapshot<UserDoc>): Promise<(string | iUserInfo[] | undefined)[]> => {
    const appDuplist = [] as iUserInfo[]
    if (!d4.empty) {
        d4.docs.forEach(item => {
            appDuplist.push({
                id: item.id,
                doc: item.data()
            })
        })
        let lastID = undefined;
        if (appDuplist.length === Define.PAGE_SIZE) {
            lastID = appDuplist[appDuplist.length - 1]?.id;
        }
        const userDataList = await getUserData(appDuplist, false)

        return [lastID, userDataList]
    } else {
        return [undefined, undefined]
    }
}

const getUserData = async (pendingDuplist: iUserInfo[] = [], needUniq = true) => {
    // filter duplicate pending doc list without name
    const pendingUserlist: iUserInfo[] = needUniq ? Helper.uniqueArray(pendingDuplist as any[], "id") : pendingDuplist

    // load first name and last name
    const pendingUserlistWithFL = await Promise.all(pendingUserlist.map(async itm => {
        const userData = await getDoc<User>(createDoc(Collections.USER, itm.id))
        return {
            ...itm,
            firstName: userData.data()?.firstName,
            lastName: userData.data()?.lastName,
            address: userData.data()?.address,
            dob: userData.data()?.dob,
            mobileNumber: userData.data()?.mobileNumber,
            gender: userData.data()?.gender,
        } as iUserInfo
    }))
    return pendingUserlistWithFL
}