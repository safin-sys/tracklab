"use client";
import { auth } from "@src/utils/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const App = () => {
    const { user } = useSelector((store) => store.auth);

    const router = useRouter();
    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };
    return (
        <>
            <header className="h-[4rem] flex items-center justify-between w-full border-b border-red-500 p-4">
                <h1 className="text-white bg-red-500 px-4 text-2xl italic font-bold">
                    Tracklab
                </h1>
                <section className="flex items-center gap-4">
                    <figcaption className="relative w-10 h-10">
                        <Image
                            priority
                            src={user?.photoURL || "/avatar.jpg"}
                            alt={user?.displayName || ""}
                            fill
                            sizes="100%"
                            className="rounded-full"
                        />
                    </figcaption>
                    <div className="h-11">
                        <h3 className="text-sm font-semibold">
                            {user?.displayName || "Loading..."}
                        </h3>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-white bg-red-500 px-2"
                        >
                            Logout
                        </button>
                    </div>
                </section>
            </header>
        </>
    );
};

export default App;
