import React from 'react'
import { TypeOnChange } from '../../../utils/interface/CommonInterface'

interface iMySelect {
    label: string,
    hideLabel?: boolean,
    labelAsFirst?: boolean,
    name: string,
    defaultValue?: string,
    full_width?: boolean,
    options: { title: string, value: string }[],
    onChange: (value: string) => void
}
export default function MySelect(
    { label, hideLabel = false, labelAsFirst = false, defaultValue = undefined, name, full_width = true, onChange, options }: iMySelect) {
    return (
        //px-3
        <div className={full_width === true ? "w-full " : "w-full md:w-1/3 "}>
            {
                hideLabel ? <></> : <>
                    <label className="block uppercase tracking-wide text-gray-700 text-xs  mb-2" htmlFor={name}>
                        {label}
                    </label>
                </>
            }

            <div className="relative">
                <select className="block appearance-none w-full  border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none bg-white focus:border-primary" id={name}
                    name={name}
                    defaultValue={defaultValue || "none"}
                    onChange={(e) => {
                        if (e.target.value !== "none")
                            onChange(e.target.value)
                    }}
                >
                    <option value={"none"} disabled={false}>{labelAsFirst ? label : "Choose Option"}</option>
                    {options.map((item, i) => {
                        return <option key={i} value={item.value}>{item.title}</option>
                    })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
            </div>
        </div>

    )
}