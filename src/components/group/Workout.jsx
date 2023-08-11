import Image from "next/image";
import Title from "../common/Title";
import { IoIosAdd } from "react-icons/io";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Workout = () => {
    const [open, setOpen] = useState(false);
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
                    className="h-auto"
                />
                <p className="text-sm text-slate-500">
                    Start a by adding workouts
                </p>
            </section>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setOpen(true)}
                    className="flex gap-1 items-center px-4 border border-red-500 text-red-500 italic"
                >
                    Add workouts
                    <IoIosAdd />
                </button>
            </div>
            <AddWorkoutModal open={open} setOpen={setOpen} />
        </>
    );
};

export default Workout;

const AddWorkoutModal = ({ open, setOpen }) => {
    return (
        <Dialog
            open={open}
            className="relative z-10"
            onClose={() => setOpen(false)}
        >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Payment successful
                        </Dialog.Title>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Your payment has been successfully submitted.
                                We’ve sent you an email with all of the details
                                of your order.
                            </p>
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={() => setOpen(false)}
                            >
                                Got it, thanks!
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
};
