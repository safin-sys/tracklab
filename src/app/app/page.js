"use client";
import { removeInvite } from "@src/store/authSlice";
import { db } from "@src/utils/firebase";
import randomId from "@src/utils/randomId";
import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
    const { user } = useSelector((store) => store.auth);
    const [email, setEmail] = useState("");
    const [info, setInfo] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);

    const handleSendInvite = async () => {
        if (!email) {
            setInfo("Error: Enter an email address");
            return;
        }
        setInviteLoading(true);
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            if (user?.email === userData?.email) {
                setInfo("Error: You can't use your own email lol noob");
            } else {
                const id = randomId();
                const groupRef = doc(db, "groups", id);
                await setDoc(groupRef, {
                    members: arrayUnion(user?.email),
                    invited: arrayUnion(email),
                    createdOn: new Date(),
                });
                await updateDoc(userRef, {
                    invites: arrayUnion(id),
                });
                await updateDoc(doc(db, "users", user?.email), {
                    groups: arrayUnion(id),
                });
                setInfo("Success: Invitation sent");
            }
        } else {
            setInfo("Error: Email not found");
        }
        setTimeout(() => {
            setInviteLoading(false);
        }, 500);
    };

    const [userInvites, setUserInvites] = useState([]);

    useEffect(() => {
        if (Array.isArray(user?.invites)) {
            setUserInvites(user?.invites);
        }
    }, [user?.invites]);
    return (
        <>
            <main className="mt-[2rem] flex flex-col items-center px-[1rem]">
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
                        disabled={inviteLoading}
                        className="bg-red-500 text-white py-2 px-4 w-full md:max-w-[160px] h-[42px] flex items-center disabled:opacity-50"
                    >
                        {inviteLoading && (
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        )}
                        Send Invite
                    </button>
                </div>
                {userInvites.length > 0 ? (
                    <Groups invites={user?.invites} />
                ) : (
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
                            Start a group by inviting members
                        </p>
                    </section>
                )}
            </main>
        </>
    );
};

export default App;

const Groups = ({ invites }) => {
    const [invitesInfo, setInvitesInfo] = useState([]);

    useEffect(() => {
        if (invitesInfo.length != 0) return;
        invites.forEach(async (invite) => {
            const groupSnap = await getDoc(doc(db, "groups", invite));
            if (groupSnap.exists) {
                setInvitesInfo((p) => [
                    ...p,
                    { ...groupSnap.data(), id: invite },
                ]);
            }
        });
    }, [invites, invitesInfo.length]);
    return (
        <section className="mt-[32px] w-full">
            {invitesInfo.map((invite, i) => (
                <InviteCard key={i} invite={invite} />
            ))}
        </section>
    );
};

const InviteCard = ({ invite }) => {
    const { user } = useSelector((store) => store.auth);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [declineLoading, setDeclineLoading] = useState(false);

    const dispatch = useDispatch();
    const handleAccept = async () => {
        setAcceptLoading(true);
        // groups, invited -> members
        const groupRef = doc(db, "groups", invite.id);
        await updateDoc(groupRef, {
            invited: arrayRemove(user.email),
            members: arrayUnion(user.email),
        });
        // users, invites -> groups
        const userRef = doc(db, "users", user.email);
        await updateDoc(userRef, {
            invites: arrayRemove(invite.id),
            groups: arrayUnion(invite.id),
        });
        //ui update
        dispatch(removeInvite(invite.id));
        setTimeout(() => {
            setAcceptLoading(false);
        }, 500);
    };
    const handleDecline = async () => {
        setDeclineLoading(true);
        // remove from groups
        const groupRef = doc(db, "groups", invite.id);
        await updateDoc(groupRef, {
            invited: arrayRemove(user.email),
        });
        // remove from user
        const userRef = doc(db, "users", user.email);
        await updateDoc(userRef, {
            invites: arrayRemove(invite.id),
        });
        // ui update
        dispatch(removeInvite(invite.id));
        setTimeout(() => {
            setDeclineLoading(false);
        }, 500);
    };
    return (
        <article className="flex flex-wrap border border-red-500 p-4 w-full">
            <p>New Invitation from {invite?.members?.[0]}</p>
            <div className="flex gap-4 ml-auto items-center mt-[1rem] md:mt-0">
                <button
                    onClick={handleAccept}
                    className="flex items-center gap-2 px-2 bg-red-400 text-white"
                >
                    {acceptLoading && (
                        <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    )}
                    Accept
                </button>
                <button
                    onClick={handleDecline}
                    className="flex items-center gap-2 px-2 border border-red-500 text-red-500"
                >
                    {declineLoading && (
                        <svg
                            className="animate-spin h-4 w-4 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    )}
                    Decline
                </button>
            </div>
        </article>
    );
};
