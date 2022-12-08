import { FC } from 'react';
import { TypeOnChangeHandler } from '../../../utils/interface/CommonInterface';
import { UseFormRegisterReturn } from 'react-hook-form'
interface iInput {
    title: string,
    value?: string,
    name?: string,
    onChange?: TypeOnChangeHandler,
    disable?: boolean,
    type?: 'text' | 'textarea' | "email" | "password" | "date" | "number",
    show_title?: boolean,
    min?: string,
    max?: string,
    row?: number,
    register?: UseFormRegisterReturn,
}

const Input: FC<iInput> = ({ title = "Enter A Value", value, name = undefined, onChange, row = 4, register, disable = false, type = "text", show_title = true, min = "", max = "", ...other }) => {
    return (
        <>
            <div className='mb-3'>
                {show_title === true ? <label className='block text-gray-700 text-sm font-bold mb-2 ml-1'>{title}</label> : <></>}

                {
                    type === 'textarea' ? <>
                        <textarea
                            className='bg-gray-50 appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-primary-500'
                            name={name}
                            placeholder={title}
                            value={value}
                            rows={row}
                            disabled={disable}
                            onChange={onChange}
                            {...other}
                            // style={{ height: '100px' }}
                            {...register}
                        />
                    </> : <>
                        <input
                            className='bg-gray-50 appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-primary-500'
                            name={name}
                            type={type}
                            placeholder={title}
                            value={value}
                            disabled={disable}
                            min={min}
                            max={max}
                            onChange={onChange}
                            required={true}
                            {...register}
                            {...other}
                        />
                    </>
                }

            </div>
        </>
    )
}


export default Input