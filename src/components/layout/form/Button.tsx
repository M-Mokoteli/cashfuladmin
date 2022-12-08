import React from 'react'

interface iButton {
    onClick: () => void
    children: React.ReactNode
    disabled?: boolean
    seconday?: boolean
    fullWidth?: boolean
}

export default function Button({ onClick, children, disabled = false, seconday = false, fullWidth = false }: iButton) {
    return (
        //px-5 py-2.5 rounded-md text-sm text-gray-700 border hover:bg-gray-50
        //px-5 py-2.5 rounded-md text-sm text-white bg-gray-700 hover:bg-gray-800
        <button disabled={disabled}
            className={`${fullWidth == true ? "w-full" : ""} px-5 py-2.5 rounded-md text-sm text-white ${seconday ? "bg-gray-800" : "bg-primary"} hover:bg-gray-800 hover:-translate-y-1 transition-all disabled:hover:bg-gray-600 disabled:hover:translate-y-0 disabled:text-gray-100 disabled:bg-gray-600`}
            onClick={(e) => {
                e.preventDefault()
                onClick()
            }} >
            {children}
        </button>
    )
}
