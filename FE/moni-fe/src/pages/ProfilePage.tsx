
import AddModal from "../ui/cta/AddModal";
import ProfileForm from "../ui/profile/ProfileForm";
import ProfileBanner from "../ui/profile/ProfileBanner";

const ProfilePage = () => {
    return (
        <section className='mt-2 px-8 flex flex-col gap-2'>
            <AddModal
                ctaText='Edit profile'
                heading='Edit profile'
                paragraph='Fill in the fields you want to change.'
                form={<ProfileForm />}
            />
            <ProfileBanner />
        </section>
    );
}

export default ProfilePage;
