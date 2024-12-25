import { formatCurrency } from '../../utils/helpers'
import DeleteItem from './DeleteItem'
import UpdateItemQuantity from './UpdateItemQuantity'
function CartItem({ item }) {
    const { pizzaId, name, quantity, totalPrice } = item

    return (
        <li>
            <p>
                {quantity}&times; {name}
            </p>
            <div>
                <p>{formatCurrency(totalPrice)}</p>

                <UpdateItemQuantity pizzaId={pizzaId} quantity={quantity} />
                <DeleteItem itemId={pizzaId} />
            </div>
        </li>
    )
}

export default CartItem
