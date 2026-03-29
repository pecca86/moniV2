import MoniLineChart from "../../charts/MoniLineChart";
import { useFetchAccountsTransactionStatistics } from "../../../hooks/statistics/useFetchAccountTransactionStatistics";
import { useParams } from "react-router-dom";
import MoniBanner from "../../banners/MoniBanner";
import { CircularProgress } from "@mui/material";
import MoniBarChart from "../../charts/MoniBarChart";
import { useUser } from "../../../hooks/auth/useUser";

const DetailCharts = () => {
    const { accountId } = useParams();
    const { token } = useUser();

    if (!accountId) {
        return <MoniBanner style='warning'>Failed to get account data...</MoniBanner>;
    }

    const { isPending, data, error } = useFetchAccountsTransactionStatistics(accountId, token);

    if (isPending) {
        return (
            <div className="flex justify-center py-12">
                <CircularProgress size={24} sx={{ color: '#635BFF' }} />
            </div>
        );
    }

    if (!isPending && error) {
        return <MoniBanner style='warning'>Failed to get statistics for account!</MoniBanner>;
    }

    if (!data) {
        return <MoniBanner style='warning'>No data available</MoniBanner>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="stripe-card">
                <h2 className="text-sm font-semibold text-[#3C4257] mb-4">Balance over time</h2>
                <MoniLineChart accountStatisticsData={data} />
            </div>
            <div className="stripe-card">
                <h2 className="text-sm font-semibold text-[#3C4257] mb-4">Spending by category</h2>
                <MoniBarChart />
            </div>
        </div>
    );
}

export default DetailCharts;
