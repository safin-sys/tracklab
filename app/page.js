import Link from "next/link";

const Home = () => {
    return (
        <div className="flex gap-4 border h-screen w-screen items-center justify-center">
            <Link href="/login">
                <button className="btn-contained">Login</button>
            </Link>
            <Link href="/join">
                <button className="btn-outlined">Join</button>
            </Link>
        </div>
    );
};

export default Home;
