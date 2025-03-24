import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import CommitGraph from './CommitGraph';
import CommitTable from "./CommitTable";
import Loader from "./Loader";

const CommitTracker = () => {
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

  const fetchBranches = async () => {
    if (!owner || !repo || !token) {
      setError("Please enter all fields!");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { data: branchesData } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        { headers: { Authorization: `token ${token}` } }
      );

      setBranches(branchesData.map(branch => branch.name));
      let allCommits = [];
      for (const branch of branchesData) {
        const { data: commits } = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch.name}`,
          { headers: { Authorization: `token ${token}` } }
        );
        
        commits.forEach(commit => {
          allCommits.push({
            branch: branch.name,
            author: commit.commit.author.name || "Unknown",
            message: commit.commit.message,
            date: commit.commit.author.date,
          });
        });
      }

      // Extract unique authors
      const uniqueAuthors = [...new Set(allCommits.map(commit => commit.author))];
      setAuthors(uniqueAuthors);

      allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
      setCommits(allCommits);
    } catch (err) {
      setError("Failed to fetch data. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  // Filter commits based on selected author and branch
  const filteredCommits = commits.filter(commit => {
    const authorMatch = selectedAuthor === 'all' || commit.author === selectedAuthor;
    const branchMatch = selectedBranch === 'all' || commit.branch === selectedBranch;
    return authorMatch && branchMatch;
  });

  const handleReset = () => {
    setSelectedAuthor('all');
    setSelectedBranch('all');
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" textAlign="center" marginY={3}>
        GitHub Commit Tracker
      </Typography>

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
                onClick={fetchBranches}
                sx={{ mt: 2 }}
              >
                Fetch Commits
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
            <Loader />
          ) : commits.length > 0 ? (
            <Box 
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              {/* Filters */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" mb={2}>Filters</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Filter by Author</InputLabel>
                      <Select
                        value={selectedAuthor}
                        label="Filter by Author"
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                      >
                        <MenuItem value="all">All Authors</MenuItem>
                        {authors.map((author) => (
                          <MenuItem key={author} value={author}>
                            {author}
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
                <Button 
                  variant="outlined" 
                  onClick={handleReset}
                  sx={{ mt: 2 }}
                >
                  Reset Filters
                </Button>
              </Box>

              {/* Graph Analysis */}
              <CommitGraph 
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
              justifyContent="center" 
              alignItems="center" 
              height="100%"
              sx={{
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Enter repository details and click "Fetch Commits" to view data
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommitTracker;
