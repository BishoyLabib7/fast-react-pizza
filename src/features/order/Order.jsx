// Test ID: IIDSAT

import { useFetcher, useLoaderData } from 'react-router-dom'
import { getOrder } from '../../services/apiRestaurant'
import {
    calcMinutesLeft,
    formatCurrency,
    formatDate,
} from '../../utils/helpers'
import { useEffect } from 'react'
import OrderItem from './OrderItem'

function Order() {
    const order = useLoaderData()

    const fetcher = useFetcher()

    useEffect(
        function () {
            if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu')
        },
        [fetcher]
    )

    // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
    const {
        id,
        status,
        priority,
        priorityPrice,
        orderPrice,
        estimatedDelivery,
        cart,
    } = order
    const deliveryIn = calcMinutesLeft(estimatedDelivery)

    return (
        <div>
            <div>
                <h2>Status</h2>

                <div>
                    {priority && <span>Priority</span>}
                    <span>{status} order</span>
                </div>
            </div>

            <div>
                <p>
                    {deliveryIn >= 0
                        ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
                        : 'Order should have arrived'}
                </p>
                <p>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
            </div>
            <ul>
                {cart.map((item) => (
                    <OrderItem
                        item={item}
                        key={item.pizzaId}
                        isLoadingIngredients={fetcher.state === 'loading'}
                        ingredients={
                            fetcher?.data?.find((el) => el.id === item.pizzaId)
                                .ingredients ?? []
                        }
                    />
                ))}
            </ul>
            <div>
                <p>Price pizza: {formatCurrency(orderPrice)}</p>
                {priority && (
                    <p>Price priority: {formatCurrency(priorityPrice)}</p>
                )}
                <p>
                    To pay on delivery:{' '}
                    {formatCurrency(orderPrice + priorityPrice)}
                </p>
            </div>
        </div>
    )
}
3
export async function loader({ params }) {
    const order = await getOrder(params.orderId)
    return order
}

export default Order
