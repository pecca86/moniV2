import MoniLineChart from "../../charts/MoniLineChart";
import { useFetchAccountsTransactionStatistics } from "../../../hooks/statistics/useFetchAccountTransactionStatistics";
import { useParams } from "react-router-dom";
import MoniBanner from "../../banners/MoniBanner";
import { CircularProgress } from "@mui/material";
import { Divider } from "@mui/material";
import MoniBarChart from "../../charts/MoniBarChart";
import { useUser } from "../../../hooks/auth/useUser";

const DetailCharts = () => {
    const { accountId } = useParams();
    const { token } = useUser();

    if (!accountId) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='warning'>Failed to get account data...</MoniBanner>
            </div>
        )

    }
    const { isPending, data, error } = useFetchAccountsTransactionStatistics(accountId, token);

    if (isPending) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='info'>Fetching account statistics...</MoniBanner>
                <CircularProgress />
            </div>
        )
    }

    if (!isPending && error) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='warning'>Failed to get statistics for account!</MoniBanner>
            </div>
        )
    }

    return (
        <div className="w-full">
            {data ? (
                <>
                    <MoniLineChart accountStatisticsData={data} />
                    <Divider sx={{ 'margin': '10px' }} />
                    <MoniBarChart />
                </>
            ) : (
                <MoniBanner style='warning'>No data available</MoniBanner>
            )}
        </div>
    );
}

export default DetailCharts;
