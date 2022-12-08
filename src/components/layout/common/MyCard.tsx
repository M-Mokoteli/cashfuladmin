import React from 'react'

interface iMyCard {
    title?: string
    children: React.ReactNode
    style?: React.CSSProperties
}

export default function MyCard({ title = undefined, children, style, className }: iMyCard & React.ComponentProps<"div">) {
    return (
        <div className="shadow-md rounded-lg">
            {
                title && <div className=" rounded-tl-lg  rounded-tr-lg px-6 py-3 text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                    <b>{title}</b>
                </div>
            }
            <div className={'px-6 py-3 ' + className} style={style}>
                {children}
            </div>
        </div>
    )
}
