import Image from "next/image";
import Title from "../common/Title";
import { IoIosAdd } from "react-icons/io";

const Workout = () => {
    return (
        <>
            <Title title="Workout Plan" />
            <section className="mt-32 flex flex-col items-center gap-4">
                <Image
                    src="/app/workout/add_workout_illustration.svg"
                    alt="Start Illustration"
                    sizes="100%"
                    priority
                    width="200"
                    height="180"
                />
                <p className="text-sm text-slate-500">
                    Start a by adding workouts
                </p>
            </section>
            <div className="flex justify-center mt-4">
                <button className="flex gap-1 items-center px-4 border border-red-500 text-red-500 italic">
                    Add workouts
                    <IoIosAdd />
                </button>
            </div>
        </>
    );
};

export default Workout;
