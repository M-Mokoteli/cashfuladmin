import React from 'react'

interface iEditDeleteOption {
    onEdit: () => void
    onDelete: () => void
}

export default function EditDeleteOption({ onEdit, onDelete }: iEditDeleteOption) {
    return (
        <div className="d-flex justify-content-around cursor-pointer">
            <i className="fa fa-pencil" aria-hidden="true"
                onClick={onEdit}
            ></i>

            <i onClick={onDelete} className="fa fa-trash" aria-hidden="true"></i>
        </div>
    )
}
