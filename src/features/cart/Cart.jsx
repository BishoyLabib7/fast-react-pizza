import { useDispatch, useSelector } from 'react-redux'
import LinkButton from '../../ui/LinkButton'
import CartItem from './CartItem'
import EmptyCart from './EmptyCart'
import { clearCart, getCart } from './cartSlice'
import Button from '../../ui/Button'
/*const fakeCart = [
    {
        pizzaId: 12,
        name: 'Mediterranean',
        quantity: 2,
        unitPrice: 16,
        totalPrice: 32,
    },
    {
        pizzaId: 6,
        name: 'Vegetale',
        quantity: 1,
        unitPrice: 13,
        totalPrice: 13,
    },
    {
        pizzaId: 11,
        name: 'Spinach and Mushroom',
        quantity: 1,
        unitPrice: 15,
        totalPrice: 15,
    },
]*/

function Cart() {
    const username = useSelector((state) => state.user.username)
    const cart = useSelector(getCart)
    const dispatch = useDispatch()

    if (!cart.length) return <EmptyCart />

    return (
        <div>
            <LinkButton to="/menu">&larr; Back to menu</LinkButton>

            <h2>Your cart, {username}</h2>
            <ul>
                {cart.map((item) => (
                    <CartItem item={item} />
                ))}
            </ul>
            <div>
                <Button type="primary" to="/order/new">
                    Order pizzas
                </Button>
                <Button type="secondary" onClick={() => dispatch(clearCart())}>
                    Clear cart
                </Button>
            </div>
        </div>
    )
}

export default Cart
