import { Card, Typography, styled, Container, Grid, Box } from '@mui/material';
import Page from 'src/components/Page';
import { getAnswers } from 'src/services/answer.context';
import { useEffect, useState } from 'react';

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));



export function AppTotalRecord() {
  const [recordCount, setRecordCount] = useState([]);

  const loadRecordCount = async () => {
    await getAnswers()
      .then((response) => {
        setRecordCount(response.data.length);
      }); 
  }
  useEffect(() => {
    loadRecordCount();
  }, []);
  return (
    <RootStyle>
      <Typography variant="h3" align="center">{(recordCount)}</Typography>
      <Typography variant="subtitle2" align="center" sx={{ opacity: 0.72 }}>
        Total Record
      </Typography>
    </RootStyle>
  );
}

export default function DashboardApp() {

  return (

    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={12}>
            <AppTotalRecord />
          </Grid>
        </Grid>
      </Container>

    </Page>
  )
}