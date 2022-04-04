import { useSession, signIn } from 'next-auth/client';

import { api } from '../../services/api';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession();

    function handleSubscribe() {
        if (!session) {
            signIn('github');
            return; // código não deve executar após esse ponto, pois usuário não está logado
        }
        

        api({
            url: '/subscribeStripe',
            method: 'POST',
        }).then(response => {
            console.log("Response=>", response);
        }).catch(error => {
            console.log("Ocorreu um erro:", error)
        });
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