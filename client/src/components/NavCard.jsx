const NavCard = ({ title, description, href, imageSrc, imageAlt }) => {
    return (
        <a
            href={href}
            className="bg-white border border-border rounded-lg flex flex-col items-center shadow-sm group md:flex-row hover:bg-slate-300 hover:scale-105 transition-all"
        >
            <img
                src={imageSrc}
                class="brightness-75 object-cover rounded-t-lg h-40 md:rounded-none md:rounded-s-lg group-hover:brightness-100 transition"
                alt={imageAlt}
            />
            <div class="flex flex-col justify-between p-4 leading-normal">
                <h5 class="text-slate-900 mb-2 text-2xl font-bold tracking-tight group-hover:text-primary-500">
                    {title}
                </h5>
                <p class="text-slate-700 mb-3 font-normal">
                    {description}
                </p>
            </div>
        </a>
    );
};

export default NavCard;