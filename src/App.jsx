import React, { useEffect, useState } from 'react';
import './App.css';

import { collection, getDocs, addDoc } from "firebase/firestore";
import db from './firebase';

function App() {
  
  const [tareas, setTareas] = useState([])
  const [nuevaTarea, setNuevaTarea] = useState("")
  
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

  const agregar = async(e)=>{
    e.preventDefault()
    
    if(!nuevaTarea.trim()){
      console.log('Esta vacio')
      return
    }
    
    try {
      const guardarTarea = await addDoc(collection(db, "tareas"), {
        name: nuevaTarea,
        fecha: Date.now()
      });
      
      setTareas([
        ...tareas,
        {...guardarTarea, id: guardarTarea.id}
      ])
      
      setNuevaTarea('');

    } catch (error) {
      console.log(error)
    }
    
    console.log(nuevaTarea)
  }
  
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
          <h3>Formulario</h3>
          <form onSubmit={agregar}>
            <input 
                type="text" 
                placeholder="Ingresar tarea"
                className="form-control mb-2"
                onChange={e => setNuevaTarea(e.target.value)}
                value={nuevaTarea}
            />
            <button
              className="btn btn-dark btn-block"
              type="submit"
            >
              Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
