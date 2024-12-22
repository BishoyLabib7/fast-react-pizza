import { Link } from 'react-router-dom'
import SearchOrder from '../features/order/SearchOrder'
import Username from '../features/user/Username'

function Header() {
    return (
        <header className="flex item-center justify-between bg-yellow-400 uppercase px-3 py-2 border-b-8 border-stone-200 sm:px-6">
            <Link to="/" className="tracking-widest">
                Fast Pizza Co.
            </Link>
            <SearchOrder />
            <Username />
        </header>
    )
}

export default Header
