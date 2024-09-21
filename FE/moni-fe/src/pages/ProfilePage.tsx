
import AddModal from "../ui/cta/AddModal";
import ProfileForm from "../ui/profile/ProfileForm";
import ProfileBanner from "../ui/profile/ProfileBanner";
import { useUserDetails } from "../hooks/auth/useUserDetails";
import { useUser } from "../hooks/auth/useUser";
import MoniBanner from "../ui/banners/MoniBanner";
import { CircularProgress } from "@mui/material";
import PasswordForm from "../ui/auth/PasswordForm";

const ProfilePage = () => {
    const { token } = useUser();
    let userInfo;
    let loading;

    if (token) {
        const { isPending, userDetails } = useUserDetails(token);
        userInfo = userDetails;
        loading = isPending;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='info'>Fetching user details...</MoniBanner>
                <CircularProgress />
            </div>
        )
    }

    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    return (
        <section className='mt-2 px-8 flex flex-col gap-2'>
            {/* <AddModal
                ctaText='Edit profile'
                heading='Edit profile'
                paragraph='Fill in the fields you want to change.'
                form={<ProfileForm user={userInfo} />}
            /> */}
            <AddModal 
                ctaText="Change password"
                heading="Change password"
                paragraph="Fill in the fields to change your password."
                form={<PasswordForm/>}
            />
            <ProfileBanner user={userInfo} />
        </section>
    );
}

export default ProfilePage;