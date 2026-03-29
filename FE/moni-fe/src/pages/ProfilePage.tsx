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
            <div className="flex justify-center py-12">
                <CircularProgress size={24} sx={{ color: '#635BFF' }} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1A1F36]">Profile</h1>
                    <p className="text-sm text-[#697386] mt-0.5">Manage your account settings</p>
                </div>
                <AddModal
                    ctaText="Change password"
                    heading="Change password"
                    paragraph="Fill in the fields to change your password."
                    form={<PasswordForm />}
                    buttonIcon={''}
                    ctaStyle="secondary"
                />
            </div>
            {!userInfo && <MoniBanner style="info">Loading user details...</MoniBanner>}
            <ProfileBanner user={userInfo} />
        </div>
    );
}

export default ProfilePage;
