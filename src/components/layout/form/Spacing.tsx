import React from 'react'

export default function Spacing({ vertical = true }: { vertical?: boolean }) {
    const _class = (vertical == true) ? `py-[6px]` : `px-[6px]`
    return (
        <div className={_class}></div>
    )
}
