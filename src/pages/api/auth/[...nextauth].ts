import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user, user:email'
                }
            },
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            try {
                console.log("Dados recebidos na função signIn: \n", user, account, profile, email, credentials);

                await fauna.query(
                    q.Create(
                        q.Collection('users'),
                        { data: { email } }
                    )
                );

                return true
            } catch (error) {
                console.log("Ocorreu um erro:\n", error)
            }
        },
    }
});
