"use client";
import { auth } from "@src/utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Home = () => {
    const provider = new GoogleAuthProvider();

    const handleAuthWithGoogle = async () => {
        await signInWithPopup(auth, provider);
    };
    return (
        <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center">
            <h1 className="text-white bg-red-500 px-4 text-2xl italic font-bold">
                Tracklab
            </h1>
            <div className="flex gap-4">
                <button
                    onClick={handleAuthWithGoogle}
                    className="px-4 border border-red-500 text-red-500 italic"
                >
                    Login with google
                </button>
            </div>
        </div>
    );
};

export default Home;
