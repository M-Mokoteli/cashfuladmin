import React, { useEffect } from 'react'
import CheckBox from './CheckBox'

interface iCheckBoxGroup {
    title?: string
    ck_list: { id: number | string, title: string }[],
    selected: number[]
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
    onChange: () => void
    onAddItem?: (id: number) => void
    onRemoveItem?: (id: number) => void
    style?: React.CSSProperties
}
export default function CheckBoxGroup({ title = undefined, ck_list, selected, setSelected, onChange, onAddItem = () => { }, onRemoveItem = () => { }, style }: iCheckBoxGroup) {
    //const [selected, setSelected] = useState<any[]>([])
    useEffect(() => {
        onChange()
    }, [selected.length])

    return (
        <>
            {title && <label className='text-sm  font-bold text-gray-900 dark:text-gray-300 mb-2 ml-1 block'>{title}</label>}

            <div style={style} className='rounded-lg bg-gradient-to-r border border-gray-300 p-4 pb-0'>
                {
                    ck_list.map((item) => {
                        return <CheckBox label={item.title} value={item.id} key={item.id}
                            checked={
                                selected.includes(parseInt(item.id + ""))
                            }
                            onChange={(_val, isChecked) => {
                                const val = parseInt(_val)
                                //check if removed
                                if (!isChecked) {
                                    onRemoveItem(val)
                                } else {
                                    onAddItem(val)
                                }

                                if (selected.includes(val)) {
                                    const newarr = selected.filter(item => {
                                        return item !== val
                                    })
                                    setSelected([...newarr])
                                } else {
                                    setSelected([...selected, val])
                                }
                            }}
                        />
                    })
                }</div>
        </>
    )
}
