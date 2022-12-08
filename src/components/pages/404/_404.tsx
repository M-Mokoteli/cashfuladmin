import { Link } from 'react-router-dom'

export default function _404() {
    return (
        <div className='h-screen w-screen flex flex-col gap-2 justify-center items-center'>
            <h2 className='text-2xl '>😭 page not found.</h2>
            <h3 className='text-xl '><Link to="/">Go Back 👈</Link></h3>
        </div>
    )
}
