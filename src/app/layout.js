"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { Inter } from "next/font/google";
import store from "@src/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@src/utils/firebase";
import { login, logout } from "@src/store/authSlice";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { doc, getDoc } from "firebase/firestore";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) => {
    const router = useRouter();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const { displayName, email, photoURL } = user;
            const userRef = doc(db, "users", email);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                store.dispatch(
                    login({
                        user: {
                            ...userSnap.data(),
                            invitations: userSnap
                                .data()
                                ?.invitations?.map((inv) => ({
                                    ...inv,
                                    createdOn: inv?.createdOn?.seconds,
                                })),
                        },
                    })
                );
            } else {
                store.dispatch(
                    login({ user: { displayName, email, photoURL } })
                );
            }
            router.push("/app");
        } else {
            store.dispatch(logout());
        }
    });
    return (
        <html lang="en">
            <Head>
                <title>Tracklab</title>
            </Head>
            <Provider store={store}>
                <body className={inter.className}>{children}</body>
            </Provider>
        </html>
    );
};

export default RootLayout;
