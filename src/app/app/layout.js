"use client";
import { auth } from "@src/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/navigation";

const RootLayout = ({ children }) => {
    const router = useRouter();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push("/");
        }
    });
    return (
        <>
            <Head>
                <title>Tracklab App</title>
            </Head>
            {children}
        </>
    );
};

export default RootLayout;
