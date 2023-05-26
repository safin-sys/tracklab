"use client";
import { updateInvitations } from "@src/store/authSlice";
import { db } from "@src/utils/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
    const { user } = useSelector((store) => store.auth);
    const [email, setEmail] = useState("");
    const [info, setInfo] = useState("");

    const handleSendInvite = async () => {
        if (!email) {
            setInfo("Error: Enter an email address");
            return;
        }
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            if (user?.email === userData?.email) {
                setInfo("Error: You can't use your own email lol noob");
            } else {
                await updateDoc(userRef, {
                    invitations: arrayUnion({
                        email: user?.email,
                        status: "pending",
                        createdOn: new Date(),
                    }),
                });
                setInfo("Success: Invitation sent");
            }
        } else {
            setInfo("Error: Email not found");
        }
    };

    const dispatch = useDispatch();
    const handleAccept = async (email) => {
        const userRef = doc(db, "users", user?.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists) {
            const data = userSnap.data();
            const newData = data.invitations.map((inv) =>
                inv?.email === email ? { ...inv, status: "accepted" } : inv
            );
            await updateDoc(userRef, {
                invitations: newData,
            });
            dispatch(
                updateInvitations(
                    newData.map((d) => ({
                        ...d,
                        createdOn: d?.createdOn?.seconds,
                    }))
                )
            );
        }
    };
    const handleDecline = async (email) => {
        const userRef = doc(db, "users", user?.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists) {
            const data = userSnap.data();
            const newData = data.invitations.map((inv) =>
                inv?.email === email ? { ...inv, status: "declined" } : inv
            );
            await updateDoc(userRef, {
                invitations: newData,
            });
            dispatch(
                updateInvitations(
                    newData.map((d) => ({
                        ...d,
                        createdOn: d?.createdOn?.seconds,
                    }))
                )
            );
        }
    };

    const invitation = user?.invitations?.[0];

    const activeCompetition =
        Array.isArray(user?.invitations) &&
        user?.invitations?.filter((inv) => inv.status === "accepted");
    return (
        <>
            {invitation && invitation?.status === "pending" && (
                <section className="text-red-500 p-4 flex flex-col md:flew-row bg-red-100 border-b border-red-500">
                    <p>New Invitation from {invitation?.email}</p>
                    <div className="flex gap-4 ml-auto items-center mt-[1rem] md:mt-0">
                        <button
                            onClick={() => handleAccept(invitation?.email)}
                            className="px-2 bg-red-400 text-white"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleDecline(invitation?.email)}
                            className="px-2 bg-white text-red-500"
                        >
                            Decline
                        </button>
                    </div>
                </section>
            )}
            <main className="mt-[2rem] flex flex-col items-center px-[32px]">
                <div className="flex flex-col md:flex-row items-start gap-4 w-full">
                    <div className="w-full">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            className="border p-2 border-red-300 focus:outline-red-500 placeholder:text-red-300 text-red-500 w-full"
                            placeholder="Enter enemy email"
                        />
                        <p
                            className={`text-sm ml-1 text-blue-500 ${
                                !info && "invisible"
                            }`}
                        >
                            {info}
                        </p>
                    </div>

                    <button
                        onClick={handleSendInvite}
                        className="bg-red-500 text-white p-2 w-full md:max-w-[160px] h-[42px]"
                    >
                        Send Invite
                    </button>
                </div>
                <section className="mt-[32px] flex flex-col items-center gap-4">
                    <Image
                        src="/app/start_illustration.svg"
                        alt="Start Illustration"
                        sizes="100%"
                        priority
                        width="272"
                        height="200"
                    />
                    <p className="text-sm text-slate-500">
                        {activeCompetition
                            ? `Active competition against ${activeCompetition[0]?.email}`
                            : "Start a competition by entering the email of your competitor"}
                    </p>
                </section>
            </main>
        </>
    );
};

export default App;
