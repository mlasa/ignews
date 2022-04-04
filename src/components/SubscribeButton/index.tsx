import { useSession, signIn } from 'next-auth/client';
import { redirect } from 'next/dist/server/api-utils';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripeClient';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession();

    async function handleSubscribe() {
        if (!session) {
            signIn('github');
            return; // código não deve executar após esse ponto, pois usuário não está logado
        }

        try {
            const responseRaw = await api({
                url: '/subscribeStripe',
                method: 'POST',
            });

            const { sessionId } = await responseRaw.json();

            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId });

        } catch (error) {
            console.clear();
            alert(`Parece que algo deu errado =( \n ${error.message}`);
            console.log('Error:\n', error);
        }


        /*  api({
             url: '/subscribeStripe',
             method: 'POST',
         }).then(response => {
             console.log("Response=>", response);
 
 
             const stripe = getStripeJs()
 
             stripe.redirectToCheckout();
 
         }).catch(error => {
             console.log("Ocorreu um erro:", error)
         }); */
    }

    return (
        <button
            onClick={handleSubscribe}
            type="button"
            className={styles.subscribeButton}
        >
            Assinar agora
        </button>
    )
}