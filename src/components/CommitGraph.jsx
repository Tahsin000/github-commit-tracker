import { Box, Grid, Typography } from '@mui/material';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CommitGraph = ({ commits, selectedAuthor, selectedBranch }) => {
  // Process commits data for last 7 days
  const getLast7DaysData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const filteredCommits = commits.filter(commit => {
      const commitDate = new Date(commit.date).toISOString().split('T')[0];
      const authorMatch = selectedAuthor === 'all' || commit.author === selectedAuthor;
      const branchMatch = selectedBranch === 'all' || commit.branch === selectedBranch;
      return authorMatch && branchMatch && last7Days.includes(commitDate);
    });

    const commitCounts = last7Days.map(date => ({
      date,
      count: filteredCommits.filter(commit => 
        new Date(commit.date).toISOString().split('T')[0] === date
      ).length
    }));

    return commitCounts;
  };

  // Process commits data for last 30 days
  const getLast30DaysData = () => {
    const last30Days = [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const filteredCommits = commits.filter(commit => {
      const commitDate = new Date(commit.date).toISOString().split('T')[0];
      const authorMatch = selectedAuthor === 'all' || commit.author === selectedAuthor;
      const branchMatch = selectedBranch === 'all' || commit.branch === selectedBranch;
      return authorMatch && branchMatch && last30Days.includes(commitDate);
    });

    const commitCounts = last30Days.map(date => ({
      date,
      count: filteredCommits.filter(commit => 
        new Date(commit.date).toISOString().split('T')[0] === date
      ).length
    }));

    return commitCounts;
  };

  const weekly = getLast7DaysData();
  const monthly = getLast30DaysData();

  const weeklyChartData = {
    labels: weekly.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Commits in Last 7 Days',
      data: weekly.map(d => d.count),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      tension: 0.1
    }]
  };

  const monthlyChartData = {
    labels: monthly.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Commits in Last 30 Days',
      data: monthly.map(d => d.count),
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return `Date: ${context[0].label}`;
          },
          label: (context) => {
            return `Commits: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" mb={3}>Commit Activity Analysis</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <Line data={weeklyChartData} options={chartOptions} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 300 }}>
            <Line data={monthlyChartData} options={chartOptions} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CommitGraph; 
