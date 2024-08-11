// src/components/Payment.js
import React, { useEffect, useRef, useState } from 'react';
import Feedback from './Feedback';

const Payment = () => {
    const [paymentStatus, setPaymentStatus] = useState('Pending');
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const paypalRef = useRef(null);

    useEffect(() => {
        const loadPayPalScript = () => {
            return new Promise((resolve, reject) => {
                if (document.querySelector('#paypal-script')) {
                    resolve(); // Script is already loaded
                    return;
                }

                const script = document.createElement('script');
                script.src = "https://www.paypal.com/sdk/js?client-id=AeicR5LkSagPdkrZjGcb8qfe906vgpvIGABn1mrLIITccWI4hdUTBEhIpXMbAI7XwyglJTmZQJwcQlag";
                script.id = 'paypal-script';
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        const renderPayPalButton = () => {
            if (window.paypal && paypalRef.current) {
                const orderDetails = {
                    customer: {
                        name: "John Doe",
                        phone: "1234567890"
                    },
                    items: [
                        { name: "Cheese Pizza", category: "Pizza", price: 10.00, quantity: 2 },
                        { name: "Black Coffee", category: "Beverage", price: 10.00, quantity: 1 }
                    ],
                    paymentStatus: "Pending"
                };

                const totalAmount = orderDetails.items.reduce((total, item) => total + (item.quantity * item.price), 0);

                window.paypal.Buttons({
                    createOrder: function (data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    currency_code: 'USD',
                                    value: totalAmount
                                }
                            }]
                        });
                    },
                    onApprove: function (data, actions) {
                        return actions.order.capture().then(function (details) {
                            setTimeout(() => window.focus(), 1000);
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            orderDetails.paymentStatus = "Completed";
                            fetch('http://localhost:5000/orders', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(orderDetails)
                            }).then(response => response.json())
                                .then(data => {
                                    console.log('Order saved:', data);
                                    setPaymentStatus("Completed");
                                    setPaymentCompleted(true);
                                    setShowFeedbackForm(true); // Show feedback form after payment
                                })
                                .catch(error => console.error('Error saving order:', error));
                        });
                    },
                    onError: function (err) {
                        console.error('PayPal error:', err);
                    }
                }).render(paypalRef.current);
            }
        };

        loadPayPalScript()
            .then(renderPayPalButton)
            .catch(error => console.error('Error loading PayPal script:', error));

        return () => {
            if (paypalRef.current) {
                paypalRef.current.innerHTML = ''; // Clean up the PayPal button if the component unmounts
            }
        };
    }, []);

    return (
        <div>
            {!paymentCompleted ? (
                <div>
                    <h1>PayPal Payment Demo</h1>
                    <div ref={paypalRef}></div>
                </div>
            ) : (
                <Feedback onClose={() => setShowFeedbackForm(false)} />
            )}
        </div>
    );
};

export default Payment;
