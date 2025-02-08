import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const CommitTable = ({ commits }) => {
  if (commits.length === 0) {
    return <Typography textAlign="center" marginTop={3}>No commits found.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Branch</b></TableCell>
            <TableCell><b>Author</b></TableCell>
            <TableCell><b>Message</b></TableCell>
            <TableCell><b>Date</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {commits.map((commit, index) => (
            <TableRow key={index}>
              <TableCell>{commit.branch}</TableCell>
              <TableCell>{commit.author}</TableCell>
              <TableCell>{commit.message}</TableCell>
              <TableCell>{new Date(commit.date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommitTable;
