import { Avatar, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import CommitDetailDialog from "./CommitDetailDialog";

const CommitTable = ({ commits }) => {
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (commits.length === 0) {
    return <Typography textAlign="center" marginTop={3}>No commits found.</Typography>;
  }

  const handleRowClick = (commit) => {
    setSelectedCommit(commit);
    setDialogOpen(true);
  };

  // Generate a fallback avatar for commits without an avatar URL
  const getFallbackAvatar = (author) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random`;
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ marginTop: 3, maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 70 }}><b>Sq</b></TableCell>
              <TableCell sx={{ minWidth: 120 }}><b>Branch</b></TableCell>
              <TableCell sx={{ minWidth: 180 }}><b>Author</b></TableCell>
              <TableCell sx={{ minWidth: 300 }}><b>Message</b></TableCell>
              <TableCell sx={{ minWidth: 180 }}><b>Date</b></TableCell>
              <TableCell sx={{ minWidth: 100 }}><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commits.map((commit, index) => (
              <TableRow 
                key={index}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleRowClick(commit)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{commit.branch}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      src={commit.avatarUrl || getFallbackAvatar(commit.author)}
                      alt={commit.author}
                      sx={{ width: 30, height: 30 }}
                    />
                    <Typography>{commit.author}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {commit.message}
                </TableCell>
                <TableCell>{new Date(commit.date).toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(commit);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CommitDetailDialog 
        open={dialogOpen}
        commit={selectedCommit}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default CommitTable;
