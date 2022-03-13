import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, useSession, signOut } from 'next-auth/client';

import styles from './styles.module.scss';

export function SignInButton() {
    const [session] = useSession();

    return session ?
        (
            <button
                className={styles.signInButton}
                type="button"
            >
                {/* <img src={session.user.image} alt={session.user.name} height={25} style={{
                    borderRadius: '100%',
                    marginRight: '1rem'
                }} /> */}
                <FaGithub size={30} color="#04d361" />
                {session.user.name}
                <FiX color="#737380" className={styles.closeIcon}
                    onClick={() => signOut()}
                />
            </button>
        )
        :
        (
            <button
                className={styles.signInButton}
                type="button"
                onClick={() => signIn('github')}
            >
                <FaGithub size={30} color="#eba417" />
                Sign in with Github  
            </button>
        )
}