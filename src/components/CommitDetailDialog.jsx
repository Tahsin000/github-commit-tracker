import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

const CommitDetailDialog = ({ open, commit, onClose }) => {
  if (!commit) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Commit Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, py: 2 }}>
          <Typography>
            <strong>Branch:</strong> {commit.branch}
          </Typography>
          <Typography>
            <strong>Author:</strong> {commit.author}
          </Typography>
          <Typography>
            <strong>Date:</strong> {new Date(commit.date).toLocaleString()}
          </Typography>
          <Typography>
            <strong>Message:</strong>
            <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              {commit.message}
            </Box>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommitDetailDialog; 
