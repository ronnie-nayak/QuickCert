'use client';

import RegionBarChart from '@/components/analytics/RegionBarChart';
import RequestsPieChart from '@/components/analytics/RequestPieChart';
import RequestsHeatmap from '@/components/analytics/RequestsHeatmap';
import TrendOverTimeChart from '@/components/analytics/TrendOverTimeChart';
import { Loading, LoadingIcon } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { capitalize } from '@/lib/utils';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [smallLoading, setSmallLoading] = useState(false);
  const [centerData, setCenterData] = useState<{
    adminCenter: string;
    centers: { assignedCenter: string; count: number }[];
    status: { status: string; count: number }[];
    dates: { date: string; count: number }[];
    concatCentStatus: {
      assignedCenter: string;
      status: string;
      count: number;
    }[];
  }>({
    adminCenter: '',
    centers: [],
    status: [],
    dates: [],
    concatCentStatus: []
  });
  const router = useRouter();

  async function getTotal() {
    try {
      const response = await axios.get('/api/documents/total');
      setCenterData({
        adminCenter: response.data.adminCenter,
        centers: response.data.total.centers,
        status: response.data.total.status,
        dates: response.data.total.dates,
        concatCentStatus: response.data.total.concatCentStatus
      });
    } catch (error: any) {
      console.error(error.message);

      if (error.response?.data.error === 'Unauthorized') {
        router.replace('/login');
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getTotal();
  }, []);

  async function distributeDocuments() {
    setSmallLoading(true);
    try {
      const response = await axios.patch('/api/documents/distribute');
      await getTotal();
    } catch (error: any) {
      console.error(error.message);

      if (error.response?.data.error === 'Unauthorized') {
        router.replace('/login');
      }
    } finally {
      setSmallLoading(false);
    }
  }

  function currentTotal() {
    let total = 0;
    for (let i = 0; i < centerData.centers.length; i++) {
      if (centerData.centers[i].assignedCenter === centerData.adminCenter) {
        total = centerData.centers[i].count;
        return total;
      }
    }
    return total;
  }

  const total = currentTotal();

  if (loading) {
    return (
      <div className="p-20">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="p-10 flex gap-8 items-center font-bold text-2xl w-9/12 mx-auto">
        <h1>Assigned Center: {capitalize(centerData.adminCenter)}</h1>
        <h1>Total Documents: {total}</h1>
        <Button onClick={distributeDocuments}>Distribute Documents</Button>
        {smallLoading && <LoadingIcon />}
      </div>
      <div className="w-10/12 mx-auto flex justify-between">
        <div>
          {centerData?.centers && centerData.centers.length > 0 && (
            <RegionBarChart centers={centerData.centers} />
          )}
          {centerData?.dates && centerData.dates.length > 0 && (
            <TrendOverTimeChart dates={centerData.dates} />
          )}
        </div>
        <div>
          {centerData?.status && centerData.status.length > 0 && (
            <RequestsPieChart status={centerData.status} />
          )}

          {centerData?.concatCentStatus &&
            centerData.concatCentStatus.length > 0 && (
              <RequestsHeatmap concatCentStatus={centerData.concatCentStatus} />
            )}
        </div>
        {/* <RegionBarChart centers={centerData.centers} /> */}
        {/* <RequestsPieChart status={centerData.status} /> */}
        {/* <TrendOverTimeChart dates={centerData.dates} /> */}
      </div>
    </>
  );
}
