import React from 'react'

/*
<Table
    header="Product name,Color,Category,Price"
    items={[
        {
            name:'Apple MacBook Pro 17"',
            color:"Red",
            category:"265 gb",
            price:"2500US"
        }
    ]}
/>


*/

interface iTable {
    header: string,
    items: Array<Object>,
    hideOption?: boolean
    noShadow?: boolean
    onEdit?: (item: Object) => void,
    onDelete?: (item: Object) => void,
}
export default function Table({ header, items, hideOption = false, noShadow = false, onEdit, onDelete }: iTable) {
    return (
        <>
            <div className={`relative overflow-x-auto ${noShadow ? "shadow-sm" : "shadow-md"} sm:rounded-lg`}>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {
                                header.split(",").map((item, indx) => {
                                    return <th key={indx} scope="col" className="px-6 py-3">
                                        {item}
                                    </th>
                                })
                            }
                            {hideOption == false &&
                                <th scope="col" className="px-6 py-3">
                                    <span>Options</span>
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items.map((rowItem, idx) => {
                                return <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    {/* <th scope="row" className="p-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    Apple MacBook Pro 17"
                                </th> */}
                                    {
                                        Object.values(rowItem).map((item, i) => {
                                            if (typeof item == "string") {
                                                return <td key={i} className="p-4">
                                                    {item}
                                                </td>
                                            } else {
                                                return <td key={i} className="p-4">
                                                    {item}
                                                </td>
                                            }
                                        })
                                    }
                                    {hideOption == false && <td className="p-4 ">
                                        <div className='flex space-x-2 justify-start items-center'>
                                            <div onClick={() => {
                                                if (onEdit)
                                                    onEdit(rowItem)
                                            }} className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Edit</div>
                                            <div onClick={() => {
                                                if (onDelete)
                                                    onDelete(rowItem)
                                            }} className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Delete</div>
                                        </div>
                                    </td>}

                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}
