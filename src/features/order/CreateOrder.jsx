import { useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../ui/Button'
import { formatCurrency } from '../../utils/helpers'
import { fetchAddress } from '../user/userSlice'
import { createOrder } from '../../services/apiRestaurant'
import { getCart, getTotalCartPrice } from '../cart/cartSlice'

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    )

const fakeCart = [
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
]

const inputStyle =
    'rounded-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300 focus:outline-none focus:ring focus:ring-yellow-400 w-full md:px-6 md:py-3'

function CreateOrder() {
    const [withPriority, setWithPriority] = useState(false)
    const {
        username,
        status: addressStatus,
        position,
        address,
        error: erroeAddress,
    } = useSelector((state) => state.user)

    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'
    const dispatch = useDispatch()
    const formError = useActionData()

    const cart = useSelector(getCart)
    const isLoadingAddess = addressStatus === 'loading'
    const totalCartPrice = useSelector(getTotalCartPrice)
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
    const totalPrice = totalCartPrice + priorityPrice

    return (
        <div>
            <h2>Ready to order? Let's go!</h2>

            <Form method="POST">
                <div>
                    <label>First Name</label>
                    <input
                        className={inputStyle}
                        type="text"
                        name="customer"
                        defaultValue={username}
                        required
                    />
                </div>

                <div>
                    <label>Phone number</label>
                    <div>
                        <input
                            className={inputStyle}
                            type="tel"
                            name="phone"
                            required
                        />
                    </div>
                    {formError?.phone && <p>{formError.phone}</p>}
                </div>

                <div className="relative">
                    <label>Address</label>
                    <div>
                        <input
                            className={inputStyle}
                            type="text"
                            name="address"
                            defaultValue={address}
                            disabled={isLoadingAddess}
                            required
                        />
                    </div>
                    {addressStatus === 'error' && <p>{erroeAddress}</p>}
                    {!position.latitude && !position.longitude && (
                        <span className="absolute right-[3px] top-[3px] md:right-[5px] md:top-[5px] z-50">
                            <Button
                                disabled={isLoadingAddess}
                                type="small"
                                onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(fetchAddress())
                                }}
                            >
                                Get Location
                            </Button>
                        </span>
                    )}
                </div>

                <div>
                    <input
                        type="checkbox"
                        name="priority"
                        id="priority"
                        className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                        // value={withPriority}
                        // onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label htmlFor="priority">
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    <input
                        type="hidden"
                        name="cart"
                        value={JSON.stringify(cart)}
                    />
                    <input
                        type="hidden"
                        name="positions"
                        value={
                            position.latitude && position.longitude
                                ? `${position.latitude} ,${position.longitude}`
                                : ''
                        }
                    />
                    <Button
                        disabled={isSubmitting || isLoadingAddess}
                        type="primary"
                    >
                        {isSubmitting
                            ? 'Placing order...'
                            : `Order now from ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export async function action({ request }) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === 'on',
    }

    const error = {}
    if (!isValidPhone(order.phone))
        error.phone =
            'Please give us your correct phone number. We might need it to contact you.'
    if (Object.keys(error).length > 0) return error

    // If everything is okay, create order and redirect
    const newOrder = await createOrder(order)

    return redirect(`/order/${newOrder.id}`)
}
export default CreateOrder
