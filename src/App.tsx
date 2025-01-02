import React, {useEffect, useState} from 'react';
import './styles/App.css';
import axios from "axios";

export default function App() {
  const [hello, setHello] = useState();

  useEffect(() => {
    axios.get('/api/test')
        .then((res) => {
          setHello(res.data);
        })
  }, []);
  return (
      <div className="App">
        백엔드 데이터 : {hello}
      </div>
  );
}


