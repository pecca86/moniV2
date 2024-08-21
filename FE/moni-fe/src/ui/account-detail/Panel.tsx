import AddModal from "../cta/AddModal";
import AccountInfoForm from "./AccountInfoForm";

const Panel = () => {
    return (
        <div className='bg-yellow-300'>
            <AddModal
                ctaText="Update Account Info"
                heading='Update Account Info'
                paragraph='Edit the fields below'
                form={<AccountInfoForm />}
            />
            <p>IBAN: NL85 033030 ABNA 3020</p>
            <p>Balance: 300 €</p>
            <p>Account name: Savings</p>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero iste atque enim obcaecati incidunt, quisquam veritatis. Adipisci cumque atque ut officia. Nostrum aspernatur id sequi adipisci eius maxime at deserunt.</p>
        </div>
    );
}

export default Panel;
