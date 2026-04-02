import { useDispatch } from 'react-redux'
import NavigationBar from '../components/NavigationBar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import OfferTitle from '../components/OfferTitle';
import Cart from '../pages/Cart';

const MainLayout = () => {
    const dispatch = useDispatch();

    
  return (
    <>
      <OfferTitle />
      <NavigationBar />
      <Cart />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
