import { Avatar, Box, Button, Chip, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import AdvancedCommitAnalytics from './AdvancedCommitAnalytics';
import CommitTable from "./CommitTable";
import Loader from "./Loader";

const CommitTracker = ({ onShowDocs }) => {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authors, setAuthors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [authorAvatars, setAuthorAvatars] = useState({});
  
  const resultsRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Add loading state tracking variables
  const [loadingStage, setLoadingStage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTotal, setLoadingTotal] = useState(0);
  const [isIndeterminateLoading, setIsIndeterminateLoading] = useState(true);

  useEffect(() => {
    if (shouldScroll && !loading && commits.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setShouldScroll(false);
    }
  }, [loading, commits.length, shouldScroll]);

  const fetchRepositoryData = async () => {
    if (!owner || !repo || !token) {
      setError("Please enter all fields!");
      return;
    }
    
    setLoading(true);
    setButtonLoading(true);
    setError("");
    setShouldScroll(true);
    
    // Reset loading state
    setLoadingStage("Fetching repository branches...");
    setLoadingProgress(0);
    setLoadingTotal(0);
    setIsIndeterminateLoading(true);

    try {
      // Fetch branches
      const { data: branchesData } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        { headers: { Authorization: `token ${token}` } }
      );

      setBranches(branchesData.map(branch => branch.name));
      
      // Update loading state for commit fetching phase
      setLoadingStage("Fetching commits from branches...");
      setLoadingProgress(0);
      setLoadingTotal(branchesData.length);
      setIsIndeterminateLoading(false);
      
      let allCommits = [];
      const avatarMap = {};
      
      // Fetch commits for each branch
      for (let i = 0; i < branchesData.length; i++) {
        const branch = branchesData[i];
        
        // Update loading message with current branch
        setLoadingStage(`Processing branch: ${branch.name} (${i + 1}/${branchesData.length})`);
        setLoadingProgress(i);
        
        const { data: commits } = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch.name}`,
          { headers: { Authorization: `token ${token}` } }
        );
        
        // Process each commit
        for (const commit of commits) {
          // Get author avatar
          let avatarUrl = null;
          
          // If commit has a GitHub user associated (not just a git commit)
          if (commit.author) {
            avatarUrl = commit.author.avatar_url;
          } else if (commit.committer) {
            avatarUrl = commit.committer.avatar_url;
          }
          
          const authorName = commit.commit.author.name || "Unknown";
          
          // Store avatar URL in our map
          if (avatarUrl && !avatarMap[authorName]) {
            avatarMap[authorName] = avatarUrl;
          }
          
          allCommits.push({
            branch: branch.name,
            author: authorName,
            authorEmail: commit.commit.author.email,
            avatarUrl: avatarUrl,
            message: commit.commit.message,
            date: commit.commit.author.date,
          });
        }
      }
      
      // Final loading stage
      setLoadingStage("Finalizing repository data...");
      setLoadingProgress(branchesData.length);
      
      // Save author avatars to state
      setAuthorAvatars(avatarMap);
      
      // Extract unique authors
      const uniqueAuthors = [...new Set(allCommits.map(commit => commit.author))];
      setAuthors(uniqueAuthors);

      // Sort commits by date
      allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
      setCommits(allCommits);
      
    } catch (err) {
      setError("Failed to fetch data. Please check your inputs.");
    } finally {
      setLoading(false);
      setButtonLoading(false);
    }
  };

  // Filter commits based on selected author and branch
  const filteredCommits = commits.filter(commit => {
    const authorMatch = selectedAuthor === 'all' || commit.author === selectedAuthor;
    const branchMatch = selectedBranch === 'all' || commit.branch === selectedBranch;
    return authorMatch && branchMatch;
  });

  // Function to generate fallback avatar URLs
  const getFallbackAvatar = (author) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random`;
  };
  
  // Function to clear all filters
  const handleReset = () => {
    setSelectedAuthor('all');
    setSelectedBranch('all');
  };
  
  // Function to clear just the author filter
  const clearAuthorFilter = () => {
    setSelectedAuthor('all');
  };
  
  // Function to clear just the branch filter
  const clearBranchFilter = () => {
    setSelectedBranch('all');
  };

  return (
    <Container maxWidth="xl">
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
        <Button
          variant="outlined"
          color="primary"
          onClick={onShowDocs}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            borderRadius: '20px',
            px: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
          size="small"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
          </svg>
          Documentation
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
          GitInsight
        </Typography>
        <Typography 
          variant="h6"
          sx={{ 
            mt: 1, 
            color: 'text.secondary',
            fontWeight: 400
          }}
        >
          Comprehensive Repository Analytics Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side - Input Form */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" mb={3}>Repository Details</Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Tooltip title="Enter the GitHub owner username or organization name.">
                <TextField 
                  label="GitHub Owner" 
                  variant="outlined" 
                  fullWidth 
                  value={owner} 
                  onChange={(e) => setOwner(e.target.value)} 
                />
              </Tooltip>

              <Tooltip title="Enter the name of the GitHub repository. For example: 'my-repo'">
                <TextField 
                  label="Repository" 
                  variant="outlined" 
                  fullWidth 
                  value={repo} 
                  onChange={(e) => setRepo(e.target.value)} 
                />
              </Tooltip>

              <Tooltip title="Enter your GitHub personal access token:: https://github.com/settings/tokens | access token (classic)">
                <TextField 
                  label="GitHub Token" 
                  variant="outlined" 
                  fullWidth 
                  type="password" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)} 
                />
              </Tooltip>

              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={fetchRepositoryData}
                disabled={buttonLoading}
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  minHeight: '48px'
                }}
              >
                {buttonLoading ? (
                  <>
                    <span>Analyze Repository</span>
                    <CircularProgress size={24} color="inherit" />
                  </>
                ) : (
                  <>
                    Analyze Repository
                  </>
                )}
              </Button>
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Right Side - Commit Data */}
        <Grid item xs={12} md={8}>
          {loading ? (
            <Loader 
              current={loadingProgress} 
              total={loadingTotal} 
              stage={loadingStage}
              isIndeterminate={isIndeterminateLoading}
            />
          ) : commits.length > 0 ? (
            <Box 
              ref={resultsRef}
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              {/* Filter section with active filters display */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', color: '#1976d2' }}>
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  <Typography variant="h6">Filters</Typography>
                </Box>
                
                {/* Active filters chips */}
                {(selectedAuthor !== 'all' || selectedBranch !== 'all') && (
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedAuthor !== 'all' && (
                      <Chip
                        avatar={
                          <Avatar 
                            src={authorAvatars[selectedAuthor] || getFallbackAvatar(selectedAuthor)} 
                            alt={selectedAuthor}
                          />
                        }
                        label={`Author: ${selectedAuthor}`}
                        onDelete={clearAuthorFilter}
                        color="primary"
                        variant="outlined"
                        deleteIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        }
                        sx={{ py: 0.5 }}
                      />
                    )}
                    {selectedBranch !== 'all' && (
                      <Chip
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="6" y1="3" x2="6" y2="15"></line>
                            <circle cx="18" cy="6" r="3"></circle>
                            <circle cx="6" cy="18" r="3"></circle>
                            <path d="M18 9a9 9 0 0 1-9 9"></path>
                          </svg>
                        }
                        label={`Branch: ${selectedBranch}`}
                        onDelete={clearBranchFilter}
                        color="secondary"
                        variant="outlined"
                        deleteIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        }
                        sx={{ py: 0.5 }}
                      />
                    )}
                    
                    <Button 
                      size="small" 
                      onClick={handleReset}
                      sx={{ ml: 'auto' }}
                      startIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      }
                    >
                      Clear All
                    </Button>
                  </Box>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Filter by Author</InputLabel>
                      <Select
                        value={selectedAuthor}
                        label="Filter by Author"
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        renderValue={(selected) => {
                          if (selected === 'all') return "All Authors";
                          
                          return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                src={authorAvatars[selected] || getFallbackAvatar(selected)}
                                alt={selected}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography>{selected}</Typography>
                            </Box>
                          );
                        }}
                      >
                        <MenuItem value="all">All Authors</MenuItem>
                        {authors.map((author) => (
                          <MenuItem key={author} value={author}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                src={authorAvatars[author] || getFallbackAvatar(author)}
                                alt={author}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography>{author}</Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Filter by Branch</InputLabel>
                      <Select
                        value={selectedBranch}
                        label="Filter by Branch"
                        onChange={(e) => setSelectedBranch(e.target.value)}
                      >
                        <MenuItem value="all">All Branches</MenuItem>
                        {branches.map((branch) => (
                          <MenuItem key={branch} value={branch}>
                            {branch}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Selected Author Profile - Shows only when an author is selected */}
              {selectedAuthor !== 'all' && (
                <Box 
                  sx={{ 
                    mb: 4, 
                    p: 3, 
                    borderRadius: 2, 
                    bgcolor: 'rgba(25,118,210,0.04)',
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    gap: 3,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background pattern for visual interest */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    opacity: 0.05,
                    background: 'repeating-linear-gradient(45deg, #1976d2, #1976d2 10px, transparent 10px, transparent 20px)'
                  }} />
                  
                  <Avatar
                    src={authorAvatars[selectedAuthor] || getFallbackAvatar(selectedAuthor)}
                    alt={selectedAuthor}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: '3px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                  
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, position: 'relative', zIndex: 1 }}>
                    <Typography variant="h5" fontWeight={500} mb={1}>
                      {selectedAuthor}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
                      {/* Count of commits by this author */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: { xs: 'center', sm: 'flex-start' } 
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Commits
                        </Typography>
                        <Typography variant="h6">
                          {commits.filter(c => c.author === selectedAuthor).length}
                        </Typography>
                      </Box>
                      
                      {/* Count of active branches */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: { xs: 'center', sm: 'flex-start' } 
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Active Branches
                        </Typography>
                        <Typography variant="h6">
                          {new Set(commits.filter(c => c.author === selectedAuthor).map(c => c.branch)).size}
                        </Typography>
              </Box>
                      
                      {/* Most recent commit date */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: { xs: 'center', sm: 'flex-start' } 
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Latest Commit
                        </Typography>
                        <Typography variant="h6">
                          {new Date(
                            Math.max(
                              ...commits
                                .filter(c => c.author === selectedAuthor)
                                .map(c => new Date(c.date).getTime())
                            )
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Advanced Analytics */}
              <AdvancedCommitAnalytics
                commits={commits}
                selectedAuthor={selectedAuthor}
                selectedBranch={selectedBranch}
              />

              {/* Commit Table */}
              <CommitTable commits={filteredCommits} />
            </Box>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column"
              justifyContent="center" 
              alignItems="center" 
              height="100%"
              sx={{
                p: 5,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxWidth: '400px',
                }}
              >
                {/* GitHub icon or Repository icon */}
                <Box
                  sx={{
                    fontSize: '3.5rem',
                    color: 'primary.light',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Box>
                
                <Typography 
                  variant="h5" 
                  color="primary.main"
                  align="center"
                  sx={{ fontWeight: 500, mb: 2 }}
                >
                  Ready to Analyze Your Repository
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 1 }}
                >
                  Complete these quick steps to get started:
                </Typography>
                
                <Box sx={{ mt: 1, width: '100%' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 1
                    }}
                  >
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(25,118,210,0.1)',
                      color: 'primary.main',
                      marginRight: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      1
                    </span>
                    Enter your GitHub repository details
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 1
                    }}
                  >
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(25,118,210,0.1)',
                      color: 'primary.main',
                      marginRight: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      2
                    </span>
                    Click "Analyze Repository" button
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(25,118,210,0.1)',
                      color: 'primary.main',
                      marginRight: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      3
                    </span>
                    Explore your repository insights
              </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommitTracker;
