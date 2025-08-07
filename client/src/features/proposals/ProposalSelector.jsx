import NavCard from "../../components/NavCard";

const ProposalSelector = () => {
    return (
        <>
            <h1 className="text-slate-700 text-2xl font-bold">
                Select the type of the technical proposal
            </h1>
            <div className="grid gap-20 lg:grid-cols-2">
                <NavCard
                    title="O&M Offer"
                    href="/create-proposal/om-offer/client-info"
                    description="Comprehensive maintenance and monitoring services for your treatment system."
                    imageSrc="/om-technician-service.png"
                    imageAlt="Technician performing routine maintenance on water treatment system"
                />
                <NavCard
                    title="Rehabilitation"
                    href="#"
                    description="Upgrade and restore aging infrastructure to extend system lifespan and safety."
                    imageSrc="/rehab-construction.png"
                    imageAlt="Water tank under construction during rehabilitation process"
                />
            </div>
        </>
    );
};

export default ProposalSelector;