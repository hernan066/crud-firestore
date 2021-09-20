import React, { useEffect, useState } from 'react';
import './App.css';

import { collection, getDocs } from "firebase/firestore";
import db from './firebase';

function App() {
  
  const [tareas, setTareas] = useState([])
  
  useEffect(() => {
      const obtenerDatos = async ()=>{
          const datos = await getDocs(collection(db, 'tareas'));
          datos.forEach((documento)=>{
            const arrayData = datos.docs.map(doc => ({id: doc.id, ...doc.data()}))
            console.log(arrayData)
            setTareas(arrayData)
          })
      }
      obtenerDatos();
  }, []);
  
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {
              tareas.map(item=>(
                <li className="list-group-item" key={item.id}>
                  {item.name}
                </li>
              ))
            }

          </ul>
        </div>
        <div className="col-md-6">
          formulario
        </div>
      </div>
    </div>
  );
}

export default App;
