"use client";
import { login } from "@src/store/authSlice";
import { auth, db } from "@src/utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";

const Home = () => {
    const provider = new GoogleAuthProvider();
    const dispatch = useDispatch();

    const handleAuthWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        const { displayName, email, photoURL } = result?.user;
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            dispatch(
                login({
                    user: userSnap.data(),
                })
            );
        } else {
            await setDoc(
                doc(db, "users", email),
                { displayName, email, photoURL },
                { merge: true }
            );
        }
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
