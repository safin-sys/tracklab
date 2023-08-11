"use client";
import Title from "@src/components/common/Title";
import Workout from "@src/components/group/Workout";
import { getGroup, getUser } from "@src/utils/db_utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiDumbbell, BiStats } from "react-icons/bi";

const Group = ({ params }) => {
    const [tab, setTab] = useState(0);
    return (
        <>
            <main className={tab != 0 ? "hidden" : ""}>
                <Workout />
            </main>
            <main className={tab != 1 ? "hidden" : ""}>
                <Stats id={params.id} />{" "}
            </main>
            <nav className="flex justify-around fixed bottom-0 w-full">
                <button
                    onClick={() => setTab(0)}
                    className={`flex items-center justify-center flex-col w-full p-4 border-t-2 ${
                        tab === 0
                            ? "text-red-500 border-red-500"
                            : "border-slate-200"
                    }`}
                >
                    <BiDumbbell className="h-6 w-6" />
                    <p className="text-xs">Workout</p>
                </button>
                <button
                    onClick={() => setTab(1)}
                    className={`flex items-center justify-center flex-col w-full p-4 border-t-2 ${
                        tab === 1
                            ? "text-red-500 border-red-500"
                            : "border-slate-200"
                    }`}
                >
                    <BiStats className="h-6 w-6" />
                    <p className="text-xs">Stats</p>
                </button>
            </nav>
        </>
    );
};

export default Group;

const Stats = ({ id }) => {
    const [active, setActive] = useState();
    const [group, setGroup] = useState();
    useEffect(() => {
        const fetchData = async () => {
            const groupData = await getGroup(id);
            const membersData = await Promise.all(
                groupData.members.map(async (email) => getUser(email))
            );

            setGroup({ ...groupData, members: [...membersData] });
            setActive(membersData[0].email);
        };
        fetchData();
    }, [id]);
    return (
        <>
            <Title title="Stats" />
            <header className="flex p-4 w-full">
                {Array.isArray(group?.members) &&
                    group.members.map((member) => {
                        const isActive = member.email === active;
                        return (
                            <button
                                onClick={() => setActive(member.email)}
                                className={`flex w-full items-center justify-center gap-2 py-2 ${
                                    isActive
                                        ? "border-b-2 border-red-500"
                                        : "border-b-2 border-slate-200"
                                }`}
                                key={member.email}
                            >
                                <Image
                                    src={member.photoURL}
                                    alt={member.email}
                                    width="32"
                                    height="32"
                                    className="rounded-full"
                                />
                                <h4
                                    className={
                                        isActive
                                            ? "text-red-500"
                                            : "text-slate-500"
                                    }
                                >
                                    {member.displayName}
                                </h4>
                            </button>
                        );
                    })}
            </header>
        </>
    );
};
