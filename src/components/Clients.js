import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';

const Clients = () => {
  // This is a placeholder. You'll want to fetch actual client data in a real application.
  const clients = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // Add more mock clients as needed
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Clients
      </Typography>
      <Grid container spacing={3}>
        {clients.map((client) => (
          <Grid item xs={12} sm={6} md={4} key={client.id}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6">{client.name}</Typography>
              <Typography variant="body1">{client.email}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Clients;
