"use client";
import { auth } from "@src/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// export const metadata = {
//     title: "Tracklab App",
// };

const RootLayout = ({ children }) => {
    const router = useRouter();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push("/");
        }
    });
    return <>{children}</>;
};

export default RootLayout;
