import { useEffect, useState } from 'react'
import Define from '../../../utils/Define'

interface iSelect {
    labelKey?: string
    title: string
    options: any[]
    defaultVal?: string
    multiple?: boolean
    onSelect: (name: string, value: string) => void
}
/**
 * 
 * @param {options:any[]} string[] or any[] with {id} field
 * @returns 
 */
const Select = ({ title, multiple = false, defaultVal = "", options, onSelect, labelKey = "name" }: iSelect) => {

    const [selectVal, setselectVal] = useState("")

    useEffect(() => {
        setselectVal(defaultVal + "")
    }, [defaultVal])


    return (
        <div className='mb-3'>
            <label htmlFor={title} className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">{title}</label>

            <select id={title}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                multiple={multiple}
                value={selectVal}
                onChange={(e: any) => {
                    const title = e.target.selectedOptions[0].label.toLocaleLowerCase().trim()
                    setselectVal(e.target.selectedOptions[0].value)
                    onSelect(title, e.target.selectedOptions[0].value)
                    //geting back the title or id.
                    //setField([].slice.call(e.target.selectedOptions).map(item => item.value))
                }}>

                <option value={Define.DEFAULT_SELECT_OPTION} >Select</option>

                {
                    options.map(item => {
                        if (typeof item === 'string') {
                            return <option key={item} value={item.toString().trim()}>{item}</option>
                        } else {
                            return <option key={item.id} value={item.id.toString().trim()}>{item[labelKey]}</option>
                        }
                    })
                }
            </select>
        </div >
    )
}

export default Select
