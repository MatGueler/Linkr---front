import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HashTagPage from '../pages/HashTagsPostsScreen/HashTagsPostsScreen.jsx';
import GlobalStyle from '../../assets/styles/GlobalStyle';
import LoginScreen from '../pages/LoginScreen/LoginScreen';
import RegisterScreen from '../pages/RegisterScreen/RegisterScreen';
import TimeLine from '../pages/timeline/TimelineScreen';
import UserContext from '../contexts/UserContext.js';
import UserPage from '../pages/UserProfileScreen/UserProfileScreen.jsx';

function App() {

  const [user, setUser] = useState();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <GlobalStyle />

      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<LoginScreen />} />
          <Route path={'/sign-up'} element={<RegisterScreen />} />
          <Route path={'/timeline'} element={<TimeLine />} />
          <Route path={'/hashtag/:hashtag'} element={<HashTagPage/>} />
          <Route path={'/user/:id'} element={<UserPage/>}/>
        </Routes>
      </BrowserRouter >
    </UserContext.Provider>
  )
}

export default App;
