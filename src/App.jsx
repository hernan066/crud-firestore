import React, { useEffect, useState } from 'react';
import './App.css';

import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";
import db from './firebase';

function App() {
  
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [id, setId] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  
  useEffect(() => {
      const obtenerDatos = async ()=>{
          const datos = await getDocs(collection(db, 'tareas'));
          datos.forEach((documento)=>{
            const arrayData = datos.docs.map(doc => ({id: doc.id, ...doc.data()}))
            console.log(arrayData);
            setTareas(arrayData);
          })
      }
      obtenerDatos();
  }, []);

  const agregar = async(e)=>{
    e.preventDefault();
    
    if(!nuevaTarea.trim()){
      console.log('Esta vacio');
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

  const eliminar = async (id)=>{
    try {
      await deleteDoc(doc(db, "tareas", id));
      
      const arrayFiltrado = tareas.filter(item=> item.id !== id);
      setTareas(arrayFiltrado);


    } catch (error) {
      console.log(error)
      
    }
  }

  const activarEdicion = (item)=>{
    setModoEdicion(true);
    setNuevaTarea(item.name);
    setId(item.id);

  }
  const editar = async (e)=>{
    e.preventDefault();
  }
  
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
        <h3>Lista de tareas</h3>
          <ul className="list-group">
            {
              tareas.map(item=>(
                <li className="list-group-item" key={item.id}>
                  {item.name}
                
                    <button 
                        className="btn btn-danger btn-sm float-end"
                        onClick={()=> eliminar(item.id)}
                    >Eliminar
                    </button>
                    <button 
                        className="btn btn-warning btn-sm float-end mx-3"
                        onClick={()=> activarEdicion(item)}
                    >Editar
                    </button>
                </li>
              ))
            }

          </ul>
        </div>
        <div className="col-md-6">
          <h3>
              {
                modoEdicion ? 'Editar tarea' : 'Agregar tarea'
              }
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
            <input 
                type="text" 
                placeholder="Ingresar tarea"
                className="form-control mb-2"
                onChange={e => setNuevaTarea(e.target.value)}
                value={nuevaTarea}
            />
            <button
              className={ modoEdicion ? "btn btn-warning btn-block" : "btn btn-dark btn-block"}
              type="submit"
            >
              {
                modoEdicion ? 'Editar' : 'Agregar'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
