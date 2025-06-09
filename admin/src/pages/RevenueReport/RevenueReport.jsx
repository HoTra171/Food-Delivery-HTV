import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function RevenueReport({ url }) {
  const [startDate, setStartDate] = useState('2025-05-01');
  const [endDate, setEndDate] = useState('2025-05-31');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(url + '/api/order/reports', {
          params: { startDate, endDate }
        });

        const data = response.data;

        if (!data || data.length === 0) {
          setData(null);
          return;
        }

        const formatter = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' });
        const labels = data.map(item => formatter.format(new Date(item._id)));
        const revenue = data.map(item => item.totalRevenue);

        setData({
          labels,
          datasets: [
            {
              label: 'Doanh thu (VNĐ)',
              data: revenue,
              fill: true,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu báo cáo.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [startDate, endDate]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${value.toLocaleString()} VNĐ`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value.toLocaleString() + ' VNĐ';
          }
        }
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Báo cáo doanh thu</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          Ngày bắt đầu:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginLeft: 10, marginRight: 20 }}
          />
        </label>

        <label>
          Ngày kết thúc:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        </label>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data ? <Line data={data} options={chartOptions} /> : !loading && <p>Không có dữ liệu.</p>}
    </div>
  );
}

export default RevenueReport;
