import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />

                <nav>
                    <a href="/home" className={styles.active}>Início</a>
                    <a href="/posts">Publicações</a>
                </nav>

                <SignInButton />
            </div>
        </header>
    );
}