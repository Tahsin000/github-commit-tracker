import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme
} from "@mui/material";
import { useState } from "react";
  
  // Tab Panel component for tab content
  function TabPanel({ children, value, index, ...other }) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`documentation-tabpanel-${index}`}
        aria-labelledby={`documentation-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  const Documentation = ({ onBack }) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };
    
    return (
      <Container maxWidth="xl">
        {/* Header */}
        <Box 
          sx={{ 
            textAlign: 'center',
            my: 4,
            py: 3,
            borderRadius: 2,
            background: 'linear-gradient(90deg, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0.1) 50%, rgba(25,118,210,0.05) 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            position: 'relative'
          }}
        >
          {/* Back to Dashboard Button */}
          <Button
            variant="outlined"
            color="primary"
            onClick={onBack}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              borderRadius: '20px',
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            size="small"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Back to Dashboard
          </Button>
          
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              letterSpacing: '0.5px'
            }}
          >
            GitInsight Documentation
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              mt: 1, 
              color: 'text.secondary',
              fontWeight: 400
            }}
          >
            Learn how to use and configure the repository analytics dashboard
          </Typography>
        </Box>
        
        {/* Documentation Content */}
        <Grid container spacing={4}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" fontWeight={500} mb={2}>
                Quick Navigation
              </Typography>
              <List>
                <ListItem 
                  button 
                  onClick={() => setActiveTab(0)}
                  selected={activeTab === 0}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: activeTab === 0 ? 'rgba(25,118,210,0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.05)'
                    }
                  }}
                >
                  <Typography>Getting Started</Typography>
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => setActiveTab(1)}
                  selected={activeTab === 1}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: activeTab === 1 ? 'rgba(25,118,210,0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.05)'
                    }
                  }}
                >
                  <Typography>Repository Setup</Typography>
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => setActiveTab(2)}
                  selected={activeTab === 2}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: activeTab === 2 ? 'rgba(25,118,210,0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.05)'
                    }
                  }}
                >
                  <Typography>Analytics Features</Typography>
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => setActiveTab(3)}
                  selected={activeTab === 3}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: activeTab === 3 ? 'rgba(25,118,210,0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.05)'
                    }
                  }}
                >
                  <Typography>GitHub Token Guide</Typography>
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => setActiveTab(4)}
                  selected={activeTab === 4}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: activeTab === 4 ? 'rgba(25,118,210,0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(25,118,210,0.05)'
                    }
                  }}
                >
                  <Typography>FAQs & Troubleshooting</Typography>
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Main Documentation Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ borderRadius: 2, height: '100%' }}>
              
              {/* Getting Started Tab */}
              <TabPanel value={activeTab} index={0}>
                <Box>
                  <Typography variant="h5" fontWeight={500} mb={3}>
                    Getting Started with GitInsight
                  </Typography>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Overview
                    </Typography>
                    <Typography paragraph>
                      GitInsight is a comprehensive analytics dashboard for GitHub repositories that provides 
                      valuable insights into commit activities, contributor patterns, and code changes over time.
                      This guide will help you set up and make the most of GitInsight's features.
                    </Typography>
                    <Box 
                      component="img"
                      src="/public/docs/2.png" 
                      alt="GitInsight Overview"
                      sx={{
                        width: '100%',
                        maxWidth: 800,
                        height: 'auto',
                        borderRadius: 2,
                        mb: 2,
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      System Requirements
                    </Typography>
                    <Typography>GitInsight works with any GitHub repository and requires:</Typography>
                    <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                      <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
                      <li>A valid GitHub personal access token</li>
                      <li>Owner and repository name information</li>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" mb={2}>
                      Quick Start in 3 Steps
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 3,
                      maxWidth: 800,
                      mx: 'auto',
                      p: 3,
                      bgcolor: 'rgba(25,118,210,0.03)',
                      borderRadius: 2
                    }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          1
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Generate a GitHub personal access token
                          </Typography>
                          <Typography color="text.secondary">
                            Visit GitHub Settings → Developer Settings → Personal Access Tokens → 
                            Generate new token (classic) and create a token with 'repo' scope permissions.
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          2
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Enter repository details
                          </Typography>
                          <Typography color="text.secondary">
                            Fill in the GitHub owner (username or organization name), repository name, 
                            and your personal access token in the left sidebar form.
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          3
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Analyze your repository
                          </Typography>
                          <Typography color="text.secondary">
                            Click the "Analyze Repository" button to fetch and visualize your repository data.
                            The dashboard will display commit analytics, contributor insights, and more.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
              
              {/* Repository Setup Tab */}
              <TabPanel value={activeTab} index={1}>
                <Box>
                  <Typography variant="h5" fontWeight={500} mb={3}>
                    Repository Setup
                  </Typography>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Form Fields Explained
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box 
                          component="img"
                          src="/public/docs/1.png" 
                          alt="Repository Form"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                          <Box component="li" sx={{ mb: 2 }}>
                            <Typography fontWeight={500}>GitHub Owner</Typography>
                            <Typography variant="body2" color="text.secondary">
                              The username or organization name that owns the repository.
                              For example, for "https://github.com/facebook/react", the owner is "facebook".
                            </Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 2 }}>
                            <Typography fontWeight={500}>Repository</Typography>
                            <Typography variant="body2" color="text.secondary">
                              The name of the repository you want to analyze.
                              For example, for "https://github.com/facebook/react", the repository is "react".
                            </Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 2 }}>
                            <Typography fontWeight={500}>GitHub Token</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Your personal access token with "repo" permissions.
                              This is required to access the GitHub API and fetch repository data.
                              Your token is never stored on our servers and is only used for API calls.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box>
                    <Typography variant="h6" mb={2}>
                      Using Filters
                    </Typography>
                    <Typography paragraph>
                      After your repository data is loaded, you can use the filters to focus on specific
                      contributors or branches:
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box 
                          component="img"
                          src="/public/docs/3.png" 
                          alt="Filters"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                          <Box component="li" sx={{ mb: 2 }}>
                            <Typography fontWeight={500}>Filter by Author</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Select a specific contributor to view only their commits and statistics.
                              This will update all charts and analytics to focus on the selected author.
                            </Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 2 }}>
                            <Typography fontWeight={500}>Filter by Branch</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Select a specific branch to analyze commit patterns for just that branch.
                              Useful for comparing activity between different features or development branches.
                            </Typography>
                          </Box>
                          <Box component="li" sx={{ mb: 2 }}>
                            <Typography fontWeight={500}>Reset Filters</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Click the "Reset Filters" button to return to viewing all commits across all
                              branches and contributors.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </TabPanel>
              
              {/* Analytics Features Tab */}
              <TabPanel value={activeTab} index={2}>
                <Box>
                  <Typography variant="h5" fontWeight={500} mb={3}>
                    Analytics Features
                  </Typography>
                  
                  <Typography paragraph>
                    GitInsight provides comprehensive analytics through multiple visualizations and metrics.
                    Here's a breakdown of the key features:
                  </Typography>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Time Activity Analysis
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Box 
                          component="img"
                          src="/public/docs/4.png" 
                          alt="Time Activity Charts"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography fontWeight={500}>7-Day Activity Chart</Typography>
                        <Typography paragraph variant="body2">
                          Visualizes commit frequency over the last week with daily totals.
                          Shows total commits, daily average, and most active day.
                        </Typography>
                        
                        <Typography fontWeight={500}>30-Day Activity Chart</Typography>
                        <Typography paragraph variant="body2">
                          Provides a month-long view of commit activity with trend analysis.
                          Shows monthly totals, averages, and week-over-week trend percentage.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Time Pattern Analysis
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Typography fontWeight={500}>Day of Week Patterns</Typography>
                        <Typography paragraph variant="body2">
                          Identifies which days of the week have the highest commit activity.
                          Useful for understanding team workflow patterns and planning code reviews.
                        </Typography>
                        
                        <Typography fontWeight={500}>Hour of Day Analysis</Typography>
                        <Typography paragraph variant="body2">
                          Shows commit distribution across the 24 hours of the day.
                          Helps identify peak productivity hours and global team coverage.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box 
                          component="img"
                          src="/public/docs/5.png" 
                          alt="Time Pattern Charts"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Contributor Analysis
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Box 
                          component="img"
                          src="/public/docs/6.png" 
                          alt="Contributor Charts"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography fontWeight={500}>Contributor Distribution</Typography>
                        <Typography paragraph variant="body2">
                          Visualizes the relative contribution levels of team members.
                          Helps identify key contributors and workload distribution.
                        </Typography>
                        
                        <Typography fontWeight={500}>Contributor Radar Chart</Typography>
                        <Typography paragraph variant="body2">
                          Multi-dimensional analysis of contributor behaviors, including:
                          commit volume, branch activity, message length, feature adds, and bug fixes.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Branch Analysis & Commit Types
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography fontWeight={500}>Branch Distribution</Typography>
                        <Typography paragraph variant="body2">
                          Shows commit distribution across different branches.
                          Helps track feature development and maintenance branch activity.
                        </Typography>
                        
                        <Typography fontWeight={500}>Commit Type Analysis</Typography>
                        <Typography paragraph variant="body2">
                          Categorizes commits based on their messages into types like:
                          features, fixes, refactoring, documentation, tests, and chores.
                          Provides insight into the nature of development work.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box 
                          component="img"
                          src="/public/docs/7.png" 
                          alt="Commit Types Chart"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box>
                    <Typography variant="h6" mb={2}>
                      Commit Details Table
                    </Typography>
                    <Typography paragraph>
                      The commit table provides a detailed list of all commits with filtering capabilities:
                    </Typography>
                    <Box 
                      component="img"
                      src="/public/docs/8.png" 
                      alt="Commit Table"
                      sx={{
                        width: '100%',
                        maxWidth: 800,
                        height: 'auto',
                        borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.1)',
                        mx: 'auto',
                        display: 'block'
                      }}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Click on any commit row or the "View" button to see detailed commit information, 
                        including the full commit message and author details.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
              
              {/* GitHub Token Guide Tab */}
              <TabPanel value={activeTab} index={3}>
                <Box>
                  <Typography variant="h5" fontWeight={500} mb={3}>
                    GitHub Token Guide
                  </Typography>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      What is a GitHub Personal Access Token?
                    </Typography>
                    <Typography paragraph>
                      A GitHub Personal Access Token (PAT) is an alternative to using passwords for authentication
                      to GitHub when using the GitHub API or the command line. GitInsight requires a token to
                      access your repository data through the GitHub API.
                    </Typography>
                  </Box>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      How to Create a Personal Access Token
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 3,
                      maxWidth: 800,
                      mx: 'auto',
                      p: 3,
                      bgcolor: 'rgba(25,118,210,0.03)',
                      borderRadius: 2
                    }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          1
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Go to GitHub Settings
                          </Typography>
                          <Typography color="text.secondary">
                            Log in to your GitHub account, click on your profile picture in the top-right corner,
                            and select "Settings" from the dropdown menu.
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          2
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Navigate to Developer Settings
                          </Typography>
                          <Typography color="text.secondary">
                            Scroll down to the bottom of the sidebar on the left and click on 
                            "Developer settings".
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          3
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Select Personal Access Tokens
                          </Typography>
                          <Typography color="text.secondary">
                            Click on "Personal access tokens" in the sidebar, then choose "Tokens (classic)".
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          4
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Generate New Token
                          </Typography>
                          <Typography color="text.secondary">
                            Click on "Generate new token" and then "Generate new token (classic)".
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          5
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Configure Token Settings
                          </Typography>
                          <Typography color="text.secondary">
                            Enter a description (e.g., "GitInsight Analytics"), set an expiration, 
                            and select the "repo" scope to grant read access to your repositories.
                          </Typography>
                        
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          6
                        </Box>
                        <Box>
                          <Typography fontWeight={500} mb={0.5}>
                            Generate and Copy Token
                          </Typography>
                          <Typography color="text.secondary">
                            Click "Generate token" at the bottom of the page, then copy the token.
                            <strong>Important:</strong> This is the only time you'll be able to see the token,
                            so make sure to copy it immediately.
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Token Security Best Practices
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body1" paragraph>
                        ✓ <strong>Treat tokens like passwords</strong> - Keep them secure and never share them publicly
                      </Typography>
                      <Typography variant="body1" paragraph>
                        ✓ <strong>Set an appropriate expiration date</strong> - Choose the shortest practical lifetime
                      </Typography>
                      <Typography variant="body1" paragraph>
                        ✓ <strong>Use minimal scopes</strong> - Only grant the permissions you actually need
                      </Typography>
                      <Typography variant="body1" paragraph>
                        ✓ <strong>Revoke unused tokens</strong> - Delete tokens you're no longer using
                      </Typography>
                      <Typography variant="body1" paragraph>
                        ✓ <strong>Never commit tokens to source code</strong> - Keep them out of your repositories
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" mb={2}>
                      How GitInsight Uses Your Token
                    </Typography>
                    <Typography paragraph>
                      GitInsight uses your GitHub token to:
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      <Typography variant="body1" paragraph>
                        • Fetch a list of branches in your repository
                      </Typography>
                      <Typography variant="body1" paragraph>
                        • Retrieve commit history for each branch
                      </Typography>
                      <Typography variant="body1" paragraph>
                        • Get author information and commit details
                      </Typography>
                    </Box>
                    <Typography paragraph>
                      <strong>Security Note:</strong> Your token is only used for the current session and is never
                      stored on our servers. All API requests are made directly from your browser to GitHub.
                    </Typography>
                  </Box>
                </Box>
              </TabPanel>
              
              {/* FAQs & Troubleshooting Tab */}
              <TabPanel value={activeTab} index={4}>
                <Box>
                  <Typography variant="h5" fontWeight={500} mb={3}>
                    FAQs & Troubleshooting
                  </Typography>
                  
                  <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                      Frequently Asked Questions
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} mb={1}>
                        Q: How many repositories can I analyze?
                      </Typography>
                      <Typography>
                        A: You can analyze any number of repositories, one at a time. Simply enter the 
                        details for each repository you want to analyze.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} mb={1}>
                        Q: Does GitInsight work with private repositories?
                      </Typography>
                      <Typography>
                        A: Yes, as long as your personal access token has permissions to access the private 
                        repository, GitInsight can analyze it.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} mb={1}>
                        Q: How much data does GitInsight retrieve?
                      </Typography>
                      <Typography>
                        A: GitInsight fetches commit data for all branches in your repository. For very large 
                        repositories with many branches and commits, the initial data load might take a bit longer.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} mb={1}>
                        Q: Is my repository data stored anywhere?
                      </Typography>
                      <Typography>
                        A: No, GitInsight is a client-side application. Your data is processed in your browser 
                        and is not stored on any server. When you refresh the page, all data is cleared.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} mb={1}>
                        Q: Can I export the analytics data?
                      </Typography>
                      <Typography>
                        A: Currently, GitInsight doesn't have a built-in export feature, but you can use 
                        browser screenshot tools to capture the visualizations.
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Box>
                    <Typography variant="h6" mb={2}>
                      Troubleshooting Common Issues
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} color="error.main" mb={1}>
                        "Failed to fetch data. Please check your inputs."
                      </Typography>
                      <Typography variant="body2" paragraph>
                        This error can occur for several reasons:
                      </Typography>
                      <Box component="ul" sx={{ pl: 4 }}>
                        <li>
                          <Typography variant="body2">
                            <strong>Invalid token:</strong> Ensure your GitHub token hasn't expired and has the "repo" scope.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            <strong>Repository doesn't exist:</strong> Double-check the owner and repository name for typos.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            <strong>No access to repository:</strong> Confirm you have access to the repository with your GitHub account.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            <strong>Network issues:</strong> Check your internet connection and try again.
                          </Typography>
                        </li>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} color="error.main" mb={1}>
                        Charts Not Displaying Correctly
                      </Typography>
                      <Typography variant="body2" paragraph>
                        If charts appear empty or display incorrectly:
                      </Typography>
                      <Box component="ul" sx={{ pl: 4 }}>
                        <li>
                          <Typography variant="body2">
                            Try resizing your browser window or switching to a different tab and back.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Check if you've applied filters that might be excluding all commits.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            For repositories with very few commits, some charts might show minimal data.
                          </Typography>
                        </li>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography fontWeight={500} color="error.main" mb={1}>
                        API Rate Limit Exceeded
                      </Typography>
                      <Typography variant="body2" paragraph>
                        GitHub limits the number of API requests you can make within an hour. If you hit this limit:
                      </Typography>
                      <Box component="ul" sx={{ pl: 4 }}>
                        <li>
                          <Typography variant="body2">
                            Wait for approximately one hour before trying again.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Analyze smaller repositories or fewer branches at a time.
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            Consider creating a new token with increased rate limits if you're a GitHub Pro user.
                          </Typography>
                        </li>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: theme.palette.primary.main, 
                      color: 'white',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                      gap: 2,
                      mt: 4
                    }}>
                      <Box>
                        <Typography variant="h6" fontWeight={500}>
                          Need More Help?
                        </Typography>
                        <Typography>
                          If you're still experiencing issues, feel free to reach out for support.
                        </Typography>
                      </Box>
                      <Button 
                        variant="outlined" 
                        sx={{ 
                          color: 'white', 
                          borderColor: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)'
                          },
                          ml: { sm: 'auto' },
                          mt: { xs: 2, sm: 0 }
                        }}
                        onClick={() => window.open('https://www.linkedin.com/in/muhammad-tahsin-abrar-124b2a190/', '_blank')}
                      >
                        Contact Support
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            mt: 8, 
            mb: 4,
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body2">
            GitInsight Documentation © {new Date().getFullYear()}
          </Typography>
          
        </Box>
      </Container>
    );
  };

  export default Documentation;
