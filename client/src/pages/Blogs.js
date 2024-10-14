import { useContext } from 'react';
import AdminView from '../components/AdminView';
import UserContext from '../UserContext';

export default function Movies() {
  const { user } = useContext(UserContext);



  return (

    user.isAdmin 
    ? <AdminView />    
    : <AdminView/>
  );
}