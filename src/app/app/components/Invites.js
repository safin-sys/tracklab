import { useEffect, useState } from "react";
import InviteCard from "./InviteCard";
import { doc, getDoc } from "firebase/firestore";

const Invites = ({ invites }) => {
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

export default Invites;
