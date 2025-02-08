import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Tooltip } from "@mui/material";
import axios from "axios";
import CommitTable from "./CommitTable";
import Loader from "./Loader";

const CommitTracker = () => {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [token, setToken] = useState("");
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBranches = async () => {
    if (!owner || !repo || !token) {
      setError("Please enter all fields!");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { data: branches } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        { headers: { Authorization: `token ${token}` } }
      );

      let allCommits = [];
      for (const branch of branches) {
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

      allCommits.sort((a, b) => new Date(b.date) - new Date(a.date));
      setCommits(allCommits);
    } catch (err) {
      setError("Failed to fetch data. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" textAlign="center" marginY={3}>
        GitHub Commit Tracker
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} marginBottom={5}>
        {/* Tooltip for Owner Input */}
        <Tooltip title="Enter the GitHub owner username or organization name.">
          <TextField 
            label="GitHub Owner" 
            variant="outlined" 
            fullWidth 
            value={owner} 
            onChange={(e) => setOwner(e.target.value)} 
          />
        </Tooltip>

        {/* Tooltip for Repository Input */}
        <Tooltip title="Enter the name of the GitHub repository. For example: 'my-repo'">
          <TextField 
            label="Repository" 
            variant="outlined" 
            fullWidth 
            value={repo} 
            onChange={(e) => setRepo(e.target.value)} 
          />
        </Tooltip>

        {/* Tooltip for Token Input */}
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
      </Box>

      {/* Tooltip for Button */}
      <Tooltip title="Fetch the latest commits from this repository">
        <Button variant="contained" color="primary" fullWidth onClick={fetchBranches}>
          Fetch Commits
        </Button>
      </Tooltip>

      {loading && <Loader />}
      {error && <Typography color="error">{error}</Typography>}
      <CommitTable commits={commits} />
    </Container>
  );
};

export default CommitTracker;
