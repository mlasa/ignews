import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { query } from 'faunadb';

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
        async signIn(params) {
            try {
                const { user, account, profile, email, credentials } = params;
                console.log(user, account, profile, email, credentials);

                const resultado_banco = await fauna.query(
                    query.Create(
                        query.Collection('users'),
                        { data: email }
                    )
                );

                console.log(resultado_banco)
                return true
            } catch (error) {
                console.log("Ocorreu um erro:\n", error)
            }
        },
    }
});
