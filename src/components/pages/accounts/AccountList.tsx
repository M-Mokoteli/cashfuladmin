import React, { useEffect, useState } from 'react'
import MyCard from '../../layout/common/MyCard'
import Button from '../../layout/form/Button'
import Spacing from '../../layout/form/Spacing'
import Table from '../../layout/form/Table'
import Title from '../../layout/form/Title'
import { iUserInfo } from './Accounts'

interface iAccountList {
    searching: boolean
    pendingList: iUserInfo[]
    reviewedList: iUserInfo[]
    setInfo: React.Dispatch<React.SetStateAction<iUserInfo>>
}

export default function AccountList({ searching = false, pendingList = [], setInfo, reviewedList = [] }: iAccountList) {

    return (
        <MyCard>
            <div>
                <Title text='Pending Review' isSubtitle />
                <Spacing />
                <Table
                    noShadow={true}
                    header="First Name,Last Name,Account Status,View"
                    items={[
                        ...pendingList.map(item => {
                            return {
                                fname: item.firstName + "",
                                lname: item.lastName,
                                status: "Pending",
                                btn: <><Button onClick={() => {
                                    setInfo(item)
                                }}>View</Button></>
                            }
                        })
                    ]}
                    hideOption={true}
                />
            </div>
            <Spacing />
            <Spacing />
            <div>
                <Title text={searching ? 'Search Results' : 'Reviewed'} isSubtitle />
                <Spacing />
                <Table
                    noShadow={true}
                    header="First Name,Last Name,Account Status,View"
                    items={[
                        ...reviewedList.map(item => {
                            return {
                                fname: item.firstName + "",
                                lname: item.lastName,
                                status: "Reviewed",
                                btn: <><Button onClick={() => {
                                    setInfo(item)
                                }}>View</Button></>
                            }
                        })
                    ]}
                    hideOption={true}
                />
                <Spacing />
            </div>
        </MyCard>
    )
}
