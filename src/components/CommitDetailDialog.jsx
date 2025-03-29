import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

const CommitDetailDialog = ({ open, commit, onClose }) => {
  if (!commit) return null;

  // Generate a fallback avatar for commits without an avatar URL
  const getFallbackAvatar = (author) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random&size=80`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Commit Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={commit.avatarUrl || getFallbackAvatar(commit.author)}
              alt={commit.author}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h6">{commit.author}</Typography>
              {commit.authorEmail && (
                <Typography variant="body2" color="text.secondary">
                  {commit.authorEmail}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Typography>
            <strong>Branch:</strong> {commit.branch}
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
