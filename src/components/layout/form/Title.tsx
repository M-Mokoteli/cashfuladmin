import React from 'react'

export default function Title({ text, isSubtitle = false }: { text: string, isSubtitle?: boolean }) {
    return (
        <h1 className={`${(isSubtitle == true) ? "text-lg" : "text-2xl"} font-bold`}>{text}</h1>
    )
}
