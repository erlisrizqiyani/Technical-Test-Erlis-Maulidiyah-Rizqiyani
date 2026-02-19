import React from "react";
import { Box, Typography } from "@mui/material";

export default function PageHeader({ title, subtitle, right }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 5 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      <Box>{right}</Box>
    </Box>
  );
}
