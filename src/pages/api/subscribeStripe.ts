import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client';
import { fauna } from "../../services/fauna";
import { query } from 'faunadb';

import { stripe } from "../../services/stripe";

type IUser = {
    ref: { id: string; };
    ts: any;
    data: {
        email: string;
        stripe_customer_id?: string;
    };
}

const subscribeStripe = async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        const session = await getSession({ req: request });

        const user = await fauna.query<IUser>(
            query.Get(
                query.Match(
                    query.Index('find_user_by_email'),
                    query.Casefold(session.user.email)
                )
            )
        );

        let customerIdFromStripe = user.data.stripe_customer_id;

        if (!customerIdFromStripe) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                /* metadata:  */
            });

            await fauna.query(
                query.Update(
                    query.Ref(query.Collection('users'), user.ref.id),
                    {
                        data: { stripe_customer_id: stripeCustomer.id }
                    }
                )
            );

            customerIdFromStripe = stripeCustomer.id;
        }


        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerIdFromStripe,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{
                price: "price_1KZvU2F7F75IlTrFYHOGmgZR",
                quantity: 1
            }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            /* customer: {} */
        });

        response.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
        response.setHeader("Allow", "POST");
        response.status(405).end("Method not allowed")
    }
}

export default subscribeStripe;