import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getGroup = async (id) => {
    const campaignRef = doc(db, "groups", id);
    const campaignSnap = await getDoc(campaignRef);

    if (campaignSnap.exists()) {
        return campaignSnap.data();
    } else {
        console.log("No such document!");
        return;
    }
};

export const getUser = async (id) => {
    const usersRef = doc(db, "users", id);
    const usersSnap = await getDoc(usersRef);

    if (usersSnap.exists()) {
        return usersSnap.data();
    } else {
        console.log("No such document!");
        return;
    }
};
