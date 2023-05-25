"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { Inter } from "next/font/google";
import store from "@src/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@src/utils/firebase";
import { login, logout } from "@src/store/authSlice";
import { useRouter } from "next/navigation";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) => {
    const router = useRouter();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const { displayName, email, photoURL } = user;
            store.dispatch(login({ user: { displayName, email, photoURL } }));
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
