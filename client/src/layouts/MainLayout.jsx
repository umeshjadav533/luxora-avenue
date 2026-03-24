import { useDispatch } from 'react-redux'
import NavigationBar from '../components/NavigationBar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import OfferTitle from '../components/OfferTitle';

const MainLayout = () => {
    const dispatch = useDispatch();

    
  return (
    <>
      <OfferTitle />
      <NavigationBar />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
