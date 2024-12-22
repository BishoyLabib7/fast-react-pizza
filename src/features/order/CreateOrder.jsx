import { useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { createOrder } from '../../services/apiRestaurant'
import { useSelector } from 'react-redux'

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

function CreateOrder() {
    const username = useSelector((state) => state.user.username)
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    const formError = useActionData()
    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart

    return (
        <div>
            <h2>Ready to order? Let's go!</h2>

            <Form method="POST">
                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="customer"
                        defaultValue={username}
                        required
                    />
                </div>

                <div>
                    <label>Phone number</label>
                    <div>
                        <input type="tel" name="phone" required />
                    </div>
                    {formError?.phone && <p>{formError.phone}</p>}
                </div>

                <div>
                    <label>Address</label>
                    <div>
                        <input type="text" name="address" required />
                    </div>
                </div>

                <div>
                    <input
                        type="checkbox"
                        name="priority"
                        id="priority"
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
                    <button
                        disabled={isSubmitting}
                        className="bg-yellow-400 px-3 py-4 inline-block rounded-full font-semibold text-stone-800 uppercase tracking-wide hover:bg-yellow-300 transition-colors duration-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:bg-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'placing order...' : 'Order now'}
                    </button>
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