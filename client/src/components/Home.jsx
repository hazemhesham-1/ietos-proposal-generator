import { ArrowRightIcon } from "lucide-react";

const Home = () => {
    return (
        <section className="bg-background">
            <div className="items-center gap-8 mx-auto px-4 py-8 max-w-screen-xl sm:py-16 md:grid md:grid-cols-2 lg:px-6 xl:gap-16">
                <img
                    src="/ietos-cover-image.png"
                    alt="IETOS Cover Image"
                    className="rounded-lg w-full"
                />
                <div className="mt-4 md:mt-0">
                    <h2 className="text-slate-900 mb-4 text-4xl font-extrabold tracking-tight">
                        Welcome to the IETOS Technical Proposal Generator
                    </h2>
                    <p className="text-slate-500 mb-6 font-light md:text-lg">
                        Create accurate, consistent, and professional water treatment proposals in just a few steps.
                    </p>
                    <a
                        href="/create-proposal/client-info"
                        className="bg-primary-700 text-white rounded-lg inline-flex items-center px-5 py-2.5 text-sm font-medium text-center hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 transition-colors"
                    >
                        Get started
                        <ArrowRightIcon className="size-5 ms-2"/>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Home;