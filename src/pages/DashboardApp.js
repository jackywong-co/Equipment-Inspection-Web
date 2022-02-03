

import { useNavigate } from "react-router-dom";

import Page from '../components/Page';

export default function DashboardApp() {

  const navigate = useNavigate();
  // useEffect(() => {
  //     localStorage.removeItem('access_token')
  //     navigate('/login')


  // })

  return (
    <Page title="Dashboard | Minimal-UI">



      <h1>Dashboard</h1>


    </Page>


  );
};