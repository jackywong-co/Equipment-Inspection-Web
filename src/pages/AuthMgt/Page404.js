// material
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Page from '../../components/Page';

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

function Page404() {
  return (
    <RootStyle title="404 Page Not Fount">
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center'  }}>
        <Box
          component="img"
          src="/static/notFoundImage.jpg"
          sx={{ height: 'auto', mx: 'auto', my: { xs: 5, sm: 10 } }}
        />
      </Box>
    </RootStyle>
  );
}

export default Page404;
