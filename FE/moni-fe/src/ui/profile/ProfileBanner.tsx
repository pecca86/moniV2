import { Divider } from "@mui/material"

const ProfileBanner = ({ user }: { user: any }) => {
    return (
        <div className='bg-white flex flex-col px-2 rounded-lg shadow-lg p-2'>
            {/* <p>First name: {user.first_name}</p>
            <p>Last name: {user.last_name}</p>
            <p>Username / email: {user.email}</p> */}
            <div className="grid grid-cols-[auto_1fr] gap-2">
                <div className="col-1">
                    <p className="pt-1 font-semibold">First name</p>
                    <Divider />
                    <p className="pt-1 font-semibold">Last name</p>
                    <Divider />
                    <p className="pt-1 font-semibold">Username</p>
                    <Divider />
                </div>
                <div className="col-2">
                    <p className="pt-1">{user?.first_name}</p>
                    <Divider />
                    <p className="pt-1">{user?.last_name}</p>
                    <Divider />
                    <p className="pt-1">{user?.email}</p>
                    <Divider />
                </div>
            </div>
        </div>
    );
}

export default ProfileBanner;
