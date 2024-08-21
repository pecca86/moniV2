import AccountListItem from "./AccountListItem";

const AccountList = () => {
    return (
        <div className="bg-blue-300">
            AccountList:
            <AccountListItem />
            <AccountListItem />
            <AccountListItem />
            Total: 1000€
        </div>
    );
}

export default AccountList;
