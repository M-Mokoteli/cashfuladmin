import React from 'react'

interface iUserBasicInfo {
    title1: string
    value1: string
    title2: string
    value2: string
}

export default function UserBasicInfo({ title1, title2, value1, value2 }: iUserBasicInfo) {
    return (
        <div className='grid grid-cols-2 gap-1 my-2 text-sm'>
            <div className='col-span-1'>
                <b className='text-gray-700'>{title1}</b> <br />
                {value1}
            </div>
            <div className='col-span-1'>
                <b className='text-gray-700'>{title2}</b> <br />
                {value2}
            </div>
        </div>
    )
}
