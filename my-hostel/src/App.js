// import logo from './logo.svg';
import './App.css';
import Login from './Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Home';
import RoomInfo from './RoomInfo';
import NoticeBoard from './NoticeBoardPage';
import Complaints from './Complaints';
import ShareResource from './ShareResource';
import MessFeedback from './MessFeedback';
import LaundryService from './LaundryService';
import MissingItem from './MissingItem';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/room-info" element={<RoomInfo />} />
        <Route path="/notice-board" element={<NoticeBoard />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/share-resource" element={<ShareResource />} />
        <Route path="/mess-feedback" element={<MessFeedback />} />
        <Route path="/laundry-service" element={<LaundryService />} />
        <Route path="/missing-item" element={<MissingItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
