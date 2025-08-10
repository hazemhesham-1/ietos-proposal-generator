const NavCard = ({ title, description, href, imageSrc, imageAlt }) => {
    return (
        <a
            href={href}
            className="bg-white border border-border rounded-lg grid items-center shadow-sm group md:grid-cols-2 hover:bg-slate-300 hover:scale-105 transition-all"
        >
            <img
                src={imageSrc}
                className="brightness-75 object-cover rounded-t-lg size-full md:rounded-none md:rounded-s-lg group-hover:brightness-100 transition"
                alt={imageAlt}
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="text-slate-900 mb-2 text-2xl font-bold tracking-tight group-hover:text-primary-500">
                    {title}
                </h5>
                <p className="text-slate-700 mb-3 font-normal">
                    {description}
                </p>
            </div>
        </a>
    );
};

export default NavCard;