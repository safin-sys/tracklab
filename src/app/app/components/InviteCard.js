import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
        <article className="flex flex-wrap border border-red-500 p-4 w-full mb-4">
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

export default InviteCard;
