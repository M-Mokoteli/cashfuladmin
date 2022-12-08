
export default function CheckBox({ label, value, checked = false, onChange }: { label: string, value: any, checked?: boolean, onChange: (val: string, isChecked: boolean) => void }) {
    return (<>
        <div className="flex items-center mb-4">
            <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                id={value} value={value} checked={checked}
                onChange={(e) => {
                    //console.log(e.target.value);
                    const value = e.target.value
                    const chked = e.target.checked
                    onChange(value, chked)
                }}
            />
            <label htmlFor={value} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
        </div>

        {/* <span className="flex gap-1">
            <label htmlFor={value}>{label}</label>
            <input type="checkbox" id={value} value={value} checked={checked} onChange={(e) => {
                //console.log(e.target.value);
                const value = e.target.value
                const chked = e.target.checked
                onChange(value, chked)
            }} />
        </span> */}
    </>)
}


{/* <input type="checkbox/>
        <Form.Check
            inline
            label={label}
            id={label}
            value={value}
            checked={checked}
            type='checkbox'
            onChange={(e) => {
                //console.log(e.target.value);
                const value = e.target.value
                const chked = e.target.checked
                onChange(value, chked)
            }}
        /> */}
