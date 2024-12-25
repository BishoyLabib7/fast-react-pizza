import { formatCurrency } from '../../utils/helpers'
import Button from '../../ui/Button'
import DeleteItem from '../cart/DeleteItem'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, getCurrentQuantityById } from '../cart/cartSlice'
import UpdateItemQuantity from '../cart/UpdateItemQuantity'

function MenuItem({ pizza }) {
    const dispatch = useDispatch()
    const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza
    const currentQuantity = useSelector(getCurrentQuantityById(id))
    const isInCart = currentQuantity > 0

    function handleAddItem() {
        const newItem = {
            pizzaId: id,
            name,
            quantity: 1,
            unitPrice,
            totalPrice: unitPrice * 1,
        }
        dispatch(addItem(newItem))
    }
    return (
        <li>
            <img src={imageUrl} alt={name} />
            <div>
                <p>{name}</p>
                <p>{ingredients.join(', ')}</p>
                <div>
                    {!soldOut ? (
                        <p>{formatCurrency(unitPrice)}</p>
                    ) : (
                        <p>Sold out</p>
                    )}

                    {isInCart && (
                        <div className="flex item-center gap-3 sm:gap-8">
                            <UpdateItemQuantity
                                pizzaId={id}
                                quantity={currentQuantity}
                            />{' '}
                            <DeleteItem itemId={id} />
                        </div>
                    )}

                    {!soldOut && !isInCart && (
                        <Button type="small" onClick={handleAddItem}>
                            Add to cart
                        </Button>
                    )}
                </div>
            </div>
        </li>
    )
}

export default MenuItem
