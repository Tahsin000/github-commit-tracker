import { Box, Card, CardContent, Grid, Tab, Tabs, Typography } from '@mui/material';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip
} from 'chart.js';
import { useState } from 'react';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

const AdvancedCommitAnalytics = ({ commits, selectedAuthor, selectedBranch }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Filter commits based on selected filters
  const filteredCommits = commits.filter(commit => {
    const authorMatch = selectedAuthor === 'all' || commit.author === selectedAuthor;
    const branchMatch = selectedBranch === 'all' || commit.branch === selectedBranch;
    return authorMatch && branchMatch;
  });

  // ===== METRICS CALCULATIONS =====

  // 1. Commit frequency by day of week
  const getDayOfWeekStats = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats = days.map(day => ({
      day,
      count: 0
    }));
    
    filteredCommits.forEach(commit => {
      const dayOfWeek = new Date(commit.date).getDay();
      dayStats[dayOfWeek].count++;
    });
    
    return dayStats;
  };

  // 2. Commit distribution by author
  const getAuthorDistribution = () => {
    const authorData = {};
    
    filteredCommits.forEach(commit => {
      if (authorData[commit.author]) {
        authorData[commit.author]++;
      } else {
        authorData[commit.author] = 1;
      }
    });
    
    return Object.entries(authorData)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Limit to top 8 contributors
  };

  // 3. Commit distribution by branch
  const getBranchDistribution = () => {
    const branchData = {};
    
    filteredCommits.forEach(commit => {
      if (branchData[commit.branch]) {
        branchData[commit.branch]++;
      } else {
        branchData[commit.branch] = 1;
      }
    });
    
    return Object.entries(branchData)
      .map(([branch, count]) => ({ branch, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Limit to top 8 branches
  };

  // 4. Commit activity by hour of day
  const getHourlyActivityData = () => {
    const hourlyData = Array(24).fill(0).map((_, i) => ({
      hour: i,
      count: 0
    }));
    
    filteredCommits.forEach(commit => {
      const hour = new Date(commit.date).getHours();
      hourlyData[hour].count++;
    });
    
    return hourlyData;
  };

  // 5. Commit message sentiment analysis (simulated)
  const getCommitTypesData = () => {
    const typeDetectors = {
      "feature": commit => /feat|feature|add|implement/i.test(commit.message),
      "fix": commit => /fix|bug|issue|resolve|solved/i.test(commit.message),
      "refactor": commit => /refactor|clean|improve|optimize/i.test(commit.message),
      "docs": commit => /doc|readme|comment/i.test(commit.message),
      "test": commit => /test|spec|assert/i.test(commit.message),
      "chore": commit => /chore|build|ci|config/i.test(commit.message)
    };
    
    const commitTypes = {
      "feature": 0,
      "fix": 0,
      "refactor": 0,
      "docs": 0,
      "test": 0,
      "chore": 0,
      "other": 0
    };
    
    filteredCommits.forEach(commit => {
      let categorized = false;
      
      for (const [type, detector] of Object.entries(typeDetectors)) {
        if (detector(commit)) {
          commitTypes[type]++;
          categorized = true;
          break;
        }
      }
      
      if (!categorized) {
        commitTypes.other++;
      }
    });
    
    return commitTypes;
  };

  // 6. Author activity radar (active branches, commit volume, etc)
  const getAuthorActivityRadarData = () => {
    if (selectedAuthor === 'all') {
      // Get top 3 contributors if no specific author is selected
      const topAuthors = getAuthorDistribution().slice(0, 3);
      
      return {
        labels: ['Commit Count', 'Active Branches', 'Avg Message Length', 'Feature Adds', 'Bug Fixes'],
        datasets: topAuthors.map((author, index) => {
          const authorCommits = commits.filter(c => c.author === author.author);
          const activeBranches = new Set(authorCommits.map(c => c.branch)).size;
          const avgMessageLength = authorCommits.reduce((sum, c) => sum + c.message.length, 0) / authorCommits.length;
          const featureCommits = authorCommits.filter(c => /feat|feature|add|implement/i.test(c.message)).length;
          const fixCommits = authorCommits.filter(c => /fix|bug|issue|resolve|solved/i.test(c.message)).length;
          
          // Generate consistently different colors for each author
          const hue = (index * 137) % 360;
          
          return {
            label: author.author,
            data: [
              authorCommits.length / 10, // Scale down for visual balance
              activeBranches,
              avgMessageLength / 20, // Scale down for visual balance
              featureCommits,
              fixCommits
            ],
            backgroundColor: `hsla(${hue}, 70%, 60%, 0.2)`,
            borderColor: `hsla(${hue}, 70%, 60%, 0.8)`,
            borderWidth: 2,
            pointBackgroundColor: `hsla(${hue}, 70%, 60%, 0.8)`,
          };
        })
      };
    } else {
      // Detailed analysis for the selected author
      const authorCommits = commits.filter(c => c.author === selectedAuthor);
      const activeBranches = new Set(authorCommits.map(c => c.branch)).size;
      const avgMessageLength = authorCommits.reduce((sum, c) => sum + c.message.length, 0) / authorCommits.length;
      const featureCommits = authorCommits.filter(c => /feat|feature|add|implement/i.test(c.message)).length;
      const fixCommits = authorCommits.filter(c => /fix|bug|issue|resolve|solved/i.test(c.message)).length;
      
      return {
        labels: ['Commit Count', 'Active Branches', 'Avg Message Length', 'Feature Adds', 'Bug Fixes'],
        datasets: [{
          label: selectedAuthor,
          data: [
            authorCommits.length / 10, // Scale down for visual balance
            activeBranches,
            avgMessageLength / 20, // Scale down for visual balance
            featureCommits,
            fixCommits
          ],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(75, 192, 192, 0.8)',
        }]
      };
    }
  };

  // === CHART DATA ===
  
  const dayOfWeekData = {
    labels: getDayOfWeekStats().map(d => d.day),
    datasets: [{
      label: 'Commits by Day of Week',
      data: getDayOfWeekStats().map(d => d.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const authorDistributionData = {
    labels: getAuthorDistribution().map(d => d.author),
    datasets: [{
      label: 'Commits by Author',
      data: getAuthorDistribution().map(d => d.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)',
        'rgba(83, 102, 255, 0.6)',
      ],
      borderWidth: 1
    }]
  };
  
  const branchDistributionData = {
    labels: getBranchDistribution().map(d => d.branch),
    datasets: [{
      label: 'Commits by Branch',
      data: getBranchDistribution().map(d => d.count),
      backgroundColor: [
        'rgba(255, 159, 64, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)', 
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(199, 199, 199, 0.6)',
        'rgba(83, 102, 255, 0.6)',
      ],
      borderWidth: 1
    }]
  };
  
  const hourlyActivityData = {
    labels: getHourlyActivityData().map(d => `${d.hour}:00`),
    datasets: [{
      label: 'Commits by Hour of Day',
      data: getHourlyActivityData().map(d => d.count),
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]
  };
  
  const commitTypesData = {
    labels: Object.keys(getCommitTypesData()),
    datasets: [{
      label: 'Commit Types',
      data: Object.values(getCommitTypesData()),
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(199, 199, 199, 0.6)',
      ],
      borderWidth: 1
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
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  // Calculate metrics for summary cards
  const totalCommits = filteredCommits.length;
  const uniqueAuthors = new Set(filteredCommits.map(c => c.author)).size;
  const uniqueBranches = new Set(filteredCommits.map(c => c.branch)).size;
  const avgCommitsPerDay = totalCommits / (new Set(filteredCommits.map(c => new Date(c.date).toISOString().split('T')[0])).size || 1);
  
  // Add new function to calculate commits by date for time-based analytics
  const getCommitsByDate = (days) => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    
    // Create array of dates for the period
    const dateLabels = [];
    const dateCounts = {};
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      dateLabels.push(dateString);
      dateCounts[dateString] = 0;
    }
    
    // Count commits for each date
    filteredCommits.forEach(commit => {
      const commitDate = new Date(commit.date).toISOString().split('T')[0];
      if (dateCounts[commitDate] !== undefined) {
        dateCounts[commitDate]++;
      }
    });
    
    return {
      labels: dateLabels.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      counts: dateLabels.map(date => dateCounts[date])
    };
  };

  // Calculate weekly and monthly commit activity
  const weeklyCommitData = getCommitsByDate(7);
  const monthlyCommitData = getCommitsByDate(30);

  // Create chart data for time-based analytics
  const weeklyActivityData = {
    labels: weeklyCommitData.labels,
    datasets: [{
      label: 'Commits in Last 7 Days',
      data: weeklyCommitData.counts,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true
    }]
  };

  const monthlyActivityData = {
    labels: monthlyCommitData.labels,
    datasets: [{
      label: 'Commits in Last 30 Days',
      data: monthlyCommitData.counts,
      borderColor: 'rgba(153, 102, 255, 1)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      tension: 0.1,
      fill: true
    }]
  };

  // Chart options for time-based data
  const timeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} commits`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        },
        title: {
          display: true,
          text: 'Number of Commits'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  // Calculate summary stats for time-based activity
  const last7DaysTotal = weeklyCommitData.counts.reduce((sum, count) => sum + count, 0);
  const last30DaysTotal = monthlyCommitData.counts.reduce((sum, count) => sum + count, 0);
  const weeklyAvg = (last7DaysTotal / 7).toFixed(1);
  const monthlyAvg = (last30DaysTotal / 30).toFixed(1);
  
  // Find most active day in last 7 days
  const mostActiveDayIndex = weeklyCommitData.counts.indexOf(Math.max(...weeklyCommitData.counts));
  const mostActiveDay = mostActiveDayIndex !== -1 ? weeklyCommitData.labels[mostActiveDayIndex] : 'None';
  const mostActiveDayCount = mostActiveDayIndex !== -1 ? weeklyCommitData.counts[mostActiveDayIndex] : 0;
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" mb={2}>Advanced Commit Analytics</Typography>
      
      {/* Summary Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Commits</Typography>
              <Typography variant="h4">{totalCommits}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Contributors</Typography>
              <Typography variant="h4">{uniqueAuthors}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Active Branches</Typography>
              <Typography variant="h4">{uniqueBranches}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Avg. Commits/Day</Typography>
              <Typography variant="h4">{avgCommitsPerDay.toFixed(1)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different chart views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Time Activity" />
          <Tab label="Time Patterns" />
          <Tab label="Contributors" />
          <Tab label="Branches" />
          <Tab label="Commit Types" />
        </Tabs>
      </Box>
      
      {/* Tab Panels */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Weekly Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Last 7 Days</Typography>
                <Box sx={{ height: 250 }}>
                  <Line data={weeklyActivityData} options={timeChartOptions} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">Total Commits</Typography>
                      <Typography variant="h6">{last7DaysTotal}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">Daily Average</Typography>
                      <Typography variant="h6">{weeklyAvg}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">Most Active</Typography>
                      <Typography variant="h6">{mostActiveDay}</Typography>
                      <Typography variant="caption">{mostActiveDayCount} commits</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Monthly Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Last 30 Days</Typography>
                <Box sx={{ height: 250 }}>
                  <Line data={monthlyActivityData} options={timeChartOptions} />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">Total Commits</Typography>
                      <Typography variant="h6">{last30DaysTotal}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">Daily Average</Typography>
                      <Typography variant="h6">{monthlyAvg}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2" color="text.secondary">Weekly Trend</Typography>
                      <Typography variant="h6">
                        {last7DaysTotal > (last30DaysTotal / 4.3) ? '↑' : '↓'}
                        {Math.abs(((last7DaysTotal / (last30DaysTotal / 4.3)) - 1) * 100).toFixed(0)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Bar data={dayOfWeekData} options={chartOptions} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Bar data={hourlyActivityData} options={chartOptions} />
            </Box>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Doughnut data={authorDistributionData} options={doughnutOptions} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Radar data={getAuthorActivityRadarData()} options={radarOptions} />
            </Box>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Doughnut data={branchDistributionData} options={doughnutOptions} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box height={300} display="flex" flexDirection="column" justifyContent="center">
              <Typography variant="h6" align="center" gutterBottom>
                Branch Activity Insights
              </Typography>
              {getBranchDistribution().slice(0, 5).map((branch, i) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>{branch.branch}</strong>: {branch.count} commits 
                    ({((branch.count / totalCommits) * 100).toFixed(1)}% of total)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 300 }}>
              <Doughnut data={commitTypesData} options={doughnutOptions} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box height={300} display="flex" flexDirection="column" justifyContent="center">
              <Typography variant="h6" align="center" gutterBottom>
                Commit Type Analysis
              </Typography>
              <Typography variant="body2" paragraph>
                This analysis categorizes commits based on their message content, helping identify 
                the distribution of different types of work.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Features:</strong> New functionality additions<br />
                <strong>Fixes:</strong> Bug fixes and issue resolutions<br />
                <strong>Refactor:</strong> Code improvements without changing functionality<br />
                <strong>Docs:</strong> Documentation updates<br />
                <strong>Tests:</strong> Test-related changes<br />
                <strong>Chore:</strong> Maintenance, CI/CD, configs<br />
                <strong>Other:</strong> Uncategorized commits
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AdvancedCommitAnalytics; 
