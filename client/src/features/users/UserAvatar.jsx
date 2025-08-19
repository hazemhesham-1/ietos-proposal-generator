const UserAvatar = ({ name }) => {
    return (
        <div className="flex items-center gap-4">
            <img
                className="rounded-full size-10"
                src="/avatar-placeholder.png"
                alt={`${name} user avatar`}
            />
            <div className="capitalize font-medium">
                {name}
            </div>
        </div>
    );
};

export default UserAvatar;