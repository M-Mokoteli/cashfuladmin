import React, { useState } from 'react'

interface iItem {
    id: number
    value: string
}

interface iAutoComplete {
    options: iItem[]
}

// not used.
export default function AutoComplete({ options }: iAutoComplete) {
    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState<iItem>({
        id: -1,
        value: "Select an option"
    } as iItem)

    return (
        <div className="relative">
            <span className="inline-block w-full rounded-md shadow-sm">
                <button className="relative z-0 w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" onClick={() => setShow(old => !old)}>
                    <span className="block truncate">{selected.value}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </button>
            </span>
            <div className={`absolute top-10 left-0 z-30 w-full mt-1 bg-white rounded-md shadow-lg ${show == false && "hidden"}`}>
                <ul className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5">
                    {
                        options.map((item, key) => {
                            return <li onClick={() => {
                                setShow(false)
                                setSelected(item)
                            }} key={key} className="relative py-2 pl-3 text-gray-900 cursor-default select-none pr-9">
                                <span className="block font-normal truncate">{item.value}</span>
                            </li>
                        })
                    }

                </ul>
            </div>
        </div>

    )
}
