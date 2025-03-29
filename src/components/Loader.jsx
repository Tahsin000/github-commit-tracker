import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Loader = ({ 
  current = 0, 
  total = 0, 
  stage = "", 
  isIndeterminate = false 
}) => {
  // Calculate percentage
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  
  // For smoother UI experience, we'll animate the percentage with a small delay
  const [displayPercentage, setDisplayPercentage] = useState(0);
  
  useEffect(() => {
    // Small delay to make the progress updates appear smoother
    const timer = setTimeout(() => {
      setDisplayPercentage(percentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        height: "100%",
        minHeight: 300,
      }}
    >
      <Box sx={{ position: "relative", mb: 3 }}>
        <CircularProgress
          variant={isIndeterminate ? "indeterminate" : "determinate"}
          value={displayPercentage}
          size={80}
          thickness={4}
          sx={{ color: "primary.main" }}
        />
        {!isIndeterminate && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" fontWeight="bold" color="text.secondary">
              {displayPercentage}%
            </Typography>
          </Box>
        )}
      </Box>

      <Typography variant="body1" color="text.secondary">
        {stage || "Initializing..."}
      </Typography>
      
    </Box>
  );
};

export default Loader;
