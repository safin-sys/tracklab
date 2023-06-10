"use client";
import { removeInvite } from "@src/store/authSlice";
import { db } from "@src/utils/firebase";
import randomId from "@src/utils/randomId";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Invites from "./components/Invites";
import Link from "next/link";

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
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (Array.isArray(user?.invites)) {
            setUserInvites(user?.invites);
        }
    }, [user?.invites]);

    useEffect(() => {
        if (Array.isArray(user?.groups)) {
            setGroups(user?.groups);
        }
    }, [user?.groups]);
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
                {userInvites.length > 0 && <Invites invites={userInvites} />}
                {groups.length > 0 && <Groups groups={groups} />}
                {userInvites.length === 0 && groups.length === 0 && (
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

const Groups = ({ groups }) => {
    const [groupsInfo, setGroupsInfo] = useState([]);

    useEffect(() => {
        if (groupsInfo.length != 0) return;
        groups.forEach(async (group) => {
            const groupSnap = await getDoc(doc(db, "groups", group));
            if (groupSnap.exists) {
                setGroupsInfo((p) => [
                    ...p,
                    { ...groupSnap.data(), id: group },
                ]);
            }
        });
    }, [groups, groupsInfo.length]);
    return (
        <section className="mt-[32px] w-full">
            {groupsInfo.map((group, i) => (
                <GroupCard key={i} index={i} group={group} />
            ))}
        </section>
    );
};

const GroupCard = ({ group, index }) => {
    return (
        <article className="border border-red-500 p-4 w-full">
            <div className="flex flex-wrap justify-between">
                <h1 className="font-semibold text-red-500">Group #{index}</h1>
                <p>{group?.members?.length ?? 0} members</p>
            </div>
            <Link
                href={`/app/${group.id}`}
                className="mt-[16px] border border-red-500 text-red-500 px-4 py-1 w-full md:max-w-[160px] flex items-center disabled:opacity-50 justify-between"
            >
                Enter Group
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 1024 1024"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                </svg>
            </Link>
        </article>
    );
};
