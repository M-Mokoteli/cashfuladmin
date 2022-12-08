import axios from 'axios'
import React, { createContext, FC, useState } from 'react'
import { iUser, Level } from '../interface/Models'

interface iState {
    user?: iUser | null
    setUser: React.Dispatch<React.SetStateAction<iUser | undefined | null>>,
    levels: Level[]
    setLevels: React.Dispatch<React.SetStateAction<Level[]>>
}

export const StateContext = createContext<iState>({} as iState)


const MainContext: FC = (props) => {
    const [user, setUser] = useState<iUser | undefined | null>(undefined) //undefined means loading | null means not logged in
    const [levels, setLevels] = useState<Level[]>([])

    const global_state: iState = {
        user, setUser, levels, setLevels
    }

    return (
        <StateContext.Provider value={global_state}>
            {props.children}
        </StateContext.Provider>
    )
}

export default MainContext
