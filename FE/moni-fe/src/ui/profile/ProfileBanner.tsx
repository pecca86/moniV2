const ProfileBanner = ({ user }: { user: any }) => {
    return (
        <div className="stripe-card">
            <h2 className="text-sm font-semibold text-[#1A1F36] mb-5">Personal information</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <dt className="text-[#697386]">First name</dt>
                <dd className="text-[#1A1F36] font-medium">{user?.first_name}</dd>

                <dt className="text-[#697386]">Last name</dt>
                <dd className="text-[#1A1F36] font-medium">{user?.last_name}</dd>

                <dt className="text-[#697386]">Email</dt>
                <dd className="text-[#1A1F36] font-medium">{user?.email}</dd>
            </dl>
        </div>
    );
}

export default ProfileBanner;
