import MoniLineChart from "../../charts/MoniLineChart";
import { useFetchAccountsTransactionStatistics } from "../../../hooks/statistics/useFetchAccountTransactionStatistics";
import { useParams } from "react-router-dom";
import MoniBanner from "../../banners/MoniBanner";
import { CircularProgress } from "@mui/material";
import { Divider } from "@mui/material";
import MoniBarChart from "../../charts/MoniBarChart";

const DetailCharts = () => {
    const { accountId } = useParams();
    if (!accountId) {
        return (
            <div className="flex justify-center items-center">
                <MoniBanner style='warning'>Failed to get account data...</MoniBanner>
            </div>
        )

    }
    const { isPending, data, error } = useFetchAccountsTransactionStatistics(accountId);

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
            <MoniLineChart accountStatisticsData={data} />
            <Divider sx={{ 'margin': '10px' }} />
            <MoniBarChart />
        </div>
    );
}

export default DetailCharts;
