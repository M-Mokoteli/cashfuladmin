import { useEffect, useState } from 'react'

interface MyChip {
    id?: number,
    label: string
}

interface iMyChipInput {
    options?: MyChip[]
    initValue: MyChip[]
    onValueChange: (list: MyChip[]) => void
    onRemoveItem?: (item: MyChip) => void
    onAddeditem?: (item: MyChip) => void
}
export default function MyChipInput({ options = [] as MyChip[], initValue, onValueChange, onRemoveItem = () => { }, onAddeditem = () => { } }: iMyChipInput) {
    const [state, setState] = useState("")
    const [selected, setSelected] = useState([] as MyChip[])
    const [show, setShow] = useState(false)
    const [pick, setPick] = useState(0)

    // const options = [
    //     { id: 1, label: "One" },
    //     { id: 6, label: "One2" },
    //     { id: 2, label: "two" },
    //     { id: 3, label: "three" },
    //     { id: 4, label: "four" },
    //     { id: 5, label: "five" },
    // ] as MyChip[]

    useEffect(() => {
        setSelected(initValue)
    }, [initValue.length])

    useEffect(() => {
        onValueChange(selected)
    }, [selected])

    return (
        <label htmlFor="chips-input" className="border rounded-lg p-3 flex gap-1 w-full relative flex-wrap">
            {
                selected.map((item, key) => {
                    return <div key={key} className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 rounded-full py-1">
                        <span className='text-sm pl-3 min-w-max' style={{ lineHeight: '0.875rem' }} >{item.label}</span>
                        <svg onClick={
                            () => {
                                setSelected(old => {
                                    return [...old].filter((_item, idx) => key !== idx)
                                })
                                onRemoveItem(item)
                            }
                        } className='pr-2 cursor-pointer min-w-6 min-h-6' enableBackground="new 0 0 128 128" height="24px" id="Layer_1" version="1.1" viewBox="0 0 128 128" width="24px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g><g><path d="M84.815,43.399c-0.781-0.782-2.047-0.782-2.828,0L64.032,61.356L46.077,43.399c-0.781-0.782-2.047-0.782-2.828,0    c-0.781,0.781-0.781,2.047,0,2.828l17.955,17.957L43.249,82.141c-0.781,0.78-0.781,2.047,0,2.828    c0.391,0.39,0.902,0.585,1.414,0.585s1.023-0.195,1.414-0.585l17.955-17.956l17.955,17.956c0.391,0.39,0.902,0.585,1.414,0.585    s1.023-0.195,1.414-0.585c0.781-0.781,0.781-2.048,0-2.828L66.86,64.184l17.955-17.957C85.597,45.447,85.597,44.18,84.815,43.399z     M64.032,14.054c-27.642,0-50.129,22.487-50.129,50.127c0.002,27.643,22.491,50.131,50.133,50.131    c27.639,0,50.125-22.489,50.125-50.131C114.161,36.541,91.674,14.054,64.032,14.054z M64.036,110.313h-0.002    c-25.435,0-46.129-20.695-46.131-46.131c0-25.435,20.693-46.127,46.129-46.127s46.129,20.693,46.129,46.127    C110.161,89.617,89.47,110.313,64.036,110.313z" /></g></g></svg>
                    </div>
                })
            }
            <input type="text" id="chips-input" value={state}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const list = options.filter(item => item.label.toLowerCase().startsWith(state.toLowerCase()))

                        setShow(false)
                        setState("")
                        if (list.length == 0) {
                            setSelected(old => {
                                return [...old, {
                                    id: undefined,
                                    label: state
                                }]
                            })
                        } else {
                            const newItem = list[pick]
                            const old = selected.find(_item => _item.id == newItem.id)
                            if (old == undefined) {
                                setSelected(old => {
                                    return [...old, newItem]
                                })
                            }
                        }
                    } else {
                        setShow(true)
                        if (e.key == 'ArrowDown') {
                            setPick(old => {
                                const length = options.filter(item => item.label.toLowerCase().startsWith(state.toLowerCase())).length - 1
                                let p = old + 1 > length ? 0 : old + 1
                                return p;
                            })
                        } else if (e.key == 'ArrowUp') {
                            setPick(old => {
                                let p = old - 1 < 0 ? 0 : old - 1
                                return p;
                            })
                        }
                    }
                }}
                onChange={(e) => {
                    setState(e.target.value)
                }}
                className="border-0 appearance-none max-w-max focus:outline-none bg-transparent" />

            <div className={`absolute top-12 left-0 z-10 w-full mt-1 bg-white rounded-md shadow-lg ${show == false && "hidden"}`}>

                <div onClick={() => {
                    setShow(false)
                }} className="w-full flex justify-end pr-2 pt-2">
                    <svg className='cursor-pointer ' enableBackground="new 0 0 128 128" height="24px" id="Layer_1" version="1.1" viewBox="0 0 128 128" width="24px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g><g><path d="M84.815,43.399c-0.781-0.782-2.047-0.782-2.828,0L64.032,61.356L46.077,43.399c-0.781-0.782-2.047-0.782-2.828,0    c-0.781,0.781-0.781,2.047,0,2.828l17.955,17.957L43.249,82.141c-0.781,0.78-0.781,2.047,0,2.828    c0.391,0.39,0.902,0.585,1.414,0.585s1.023-0.195,1.414-0.585l17.955-17.956l17.955,17.956c0.391,0.39,0.902,0.585,1.414,0.585    s1.023-0.195,1.414-0.585c0.781-0.781,0.781-2.048,0-2.828L66.86,64.184l17.955-17.957C85.597,45.447,85.597,44.18,84.815,43.399z     M64.032,14.054c-27.642,0-50.129,22.487-50.129,50.127c0.002,27.643,22.491,50.131,50.133,50.131    c27.639,0,50.125-22.489,50.125-50.131C114.161,36.541,91.674,14.054,64.032,14.054z M64.036,110.313h-0.002    c-25.435,0-46.129-20.695-46.131-46.131c0-25.435,20.693-46.127,46.129-46.127s46.129,20.693,46.129,46.127    C110.161,89.617,89.47,110.313,64.036,110.313z" /></g></g></svg>
                </div>

                <ul className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5">
                    {
                        options.filter(item => item.label.toLowerCase().startsWith(state.toLowerCase())).map((item, key) => {
                            return <li onClick={() => {
                                const old = selected.find(_item => _item.id == item.id)

                                setShow(false)
                                setState("")
                                if (old == undefined) {
                                    onAddeditem(item)
                                    setSelected(old => {
                                        return [...old, item]
                                    })
                                }

                            }} key={key} className={`${pick == key ? "bg-gray-300" : ""} cursor-pointer relative py-2 pl-3 text-gray-900 select-none pr-9`}>
                                <span className="block font-normal truncate">{item.label}</span>
                            </li>
                        })
                    }

                </ul>
            </div>
        </label>
    )
}
