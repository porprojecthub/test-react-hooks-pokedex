import React, { useState } from 'react'
import './pokedex.style.css'
import Modal from './../modal/modal.component'
import Status from './../status/status.component'

export default function Pokedex(props) {

    const [myList, setMyList] = useState([]);
    const [openModal, setOpenModal] = useState('');

    function selectPokemon(){
        setOpenModal('open');
      }

    function handleMouse(index,active){
        let list = [...myList];
        list[index] = {...list[index], active: active};
        setMyList(list);
    }

      function addPokemon(pokemon){
        pokemon.active = false;
        setMyList([...myList, pokemon]);
      }

      function removePokemon(id){
        let list = [...myList];
        for(let i = 0; i < myList.length; i++){
          let pokemonId = myList[i].id;
          if(id.trim().toUpperCase() === pokemonId.trim().toUpperCase()){
            list.splice(i, 1);
            break;
          }
        }
        setMyList(list);
      }

      function closeModal(){
        setOpenModal('');
      }

    return (
        <div className="pokedex">
        <div className="header">
            <h1 style={{fontSize:'40px',margin:'8px'}}>My Pokedex</h1>
        </div>
        
        <div className="container">
          <div className="content">
          {myList.map((pokemon,index) => (
            <div className="cards" key={pokemon.id}
            onMouseOver={()=> {handleMouse(index,true)}}
            onMouseLeave={()=> {handleMouse(index,false)}}>
               <div className="card-item">
                  <div className="image"><img src={pokemon.imageUrl} alt={pokemon.name} style={{height:'250px',paddingTop:'10px'}}/></div>
                  <div className="data">
                    { pokemon.active && <div style={{color:'#e44c4c',cursor:'pointer',float:'right',paddingRight:'20px'}} onClick={() => removePokemon(pokemon.id)}>X</div>}
                     <div className="name" style={{paddingTop:'8px',paddingLeft:'10px'}}>
                       <span style={{fontSize:'30px',fontWeight:'400',fontFamily:'Gaegu'}}>{pokemon.name}</span>
                     </div>
                     <div className="status" style={{paddingLeft:'12px'}}>
                        <div className="hp" style={{paddingBottom:'8px'}}>
                          <span>HP</span>
                          <Status value={pokemon.hpStatus} type={'hp'} />
                        </div>
                        <div className="str" style={{paddingBottom:'10px'}}>
                          <span>STR</span>
                          <Status value={pokemon.strStatus} type={'str'} />
                        </div>
                        <div className="weak" style={{paddingBottom:'18px'}}>
                          <span>WEAK</span>
                          <Status value={pokemon.weakStatus} type={'weak'}/>
                        </div>
                     </div>
                     <div className="happy" style={{paddingLeft:'12px'}}>
                       {Array.from(Array(parseInt(pokemon.happyStatus)), (e, i) => {
                        return <img key={i} height="30px" alt={pokemon.happyStatus} src={'./image/omyim.png'}/>
                      })}
                      </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
        <Modal modalStatus={openModal} selectedList={myList} onAddPokemon={addPokemon} onCloseModal={closeModal}/>
        <div id="add-button" onClick={selectPokemon}>+</div>
        <div id="footer-button-panel"/>
        <div className="footer"></div>
        </div>
                );
}

