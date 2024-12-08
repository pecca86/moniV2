
import AddModal from "../ui/cta/AddModal";
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

    return (
        <section className='mt-2 px-8 flex flex-col gap-2'>
            <AddModal 
                ctaText="Change password"
                heading="Change password"
                paragraph="Fill in the fields to change your password."
                form={<PasswordForm />} 
                buttonIcon={''}            
            />
            <ProfileBanner user={userInfo} />
        </section>
    );
}

export default ProfilePage;