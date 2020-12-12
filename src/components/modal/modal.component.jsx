import React, {useState, useEffect, useRef} from 'react'
import './modal.style.css'
import axios from 'axios'
import Status from './../status/status.component'

export default function Modal(props) {

    const myModal = useRef(null);
    const [dataList, setDataList] = useState([]);
    const [criteria, setCriteria] = useState({name:'',type:'',limit:'20'});

    useEffect(() => {

       const initData = async() => {

       let response = await axios.get('http://localhost:3030/api/cards').then(resp => resp.data.cards.map(pokemon => {
         return getStatus(pokemon);
       }))
        
       let list = response;

         if(props.selectedList.length && list.length){
           for(let i = 0; i < list.length; i++){
             let mId = list[i].id
             for(let j = 0; j < props.selectedList.length; j++){
               let sId = props.selectedList[j].id
               if(mId.trim().toUpperCase() === sId.trim().toUpperCase()){
                 list.splice(i, 1);
                 i = i-1
                 continue;
               }
             }
           }
         } 

         setDataList(list);
         
     }

     const clearData = () => {
       setDataList([]);
       setCriteria({name:'',type:'',limit:'20'});
     }

        if (props.modalStatus === 'open') {
            myModal.current.style.display = "block";
            initData();
          }else{
            myModal.current.style.display = "none";
            clearData();
          }

     },[props.modalStatus, props.selectedList]);
     

     function handleCriteriaChange(e){
       let obj = {...criteria,[e.target.name]: e.target.value}
       setCriteria(obj)
     };

     function handleMouse(index,active){
       let list = [...dataList];
       list[index] = {...list[index], active: active};
       setDataList(list);
     }

     async function searchPokemon() {

       let limit = criteria.limit || '';
       let name = criteria.name || '';
       let type = criteria.type || '';
 
        let response = await axios.get(`http://localhost:3030/api/cards?limit=${limit}&name=${name}&type=${type}`).then(resp => resp.data.cards.map(pokemon => {
           return getStatus(pokemon);
         }));

         let list = response;   
 
         if(props.selectedList.length){
           for(let i = 0; i < list.length; i++){
             let mId = list[i].id;
             for(let j = 0; j < props.selectedList.length; j++){
               let sId = props.selectedList[j].id;
               if(mId.trim().toUpperCase() === sId.trim().toUpperCase()){
                 list.splice(i, 1);
                 i = i-1;
                 continue;
               }
             }
           }
         }
         
       setDataList(list);
 
     }

     function closeModal(e){
       if(e.target.id === "myModal"){
         props.onCloseModal();  
       }
     }

     function selectPokemon(pokemon){
       if(pokemon){
         props.onAddPokemon(pokemon);
         setCriteria({name:'',type:'',limit:'20'});
       }
     }

     function getStatus(pokemon){
 
         if(pokemon){
 
             let {hp, attacks, weaknesses } = pokemon;
 
             if(hp){
               if(parseInt(hp) > 100){
                   hp = 100;
               }else if (isNaN(hp)){
                   hp = 0;
               }
             }
 
             pokemon.hpStatus = hp || 0;
 
             let str = 0
             if(attacks && attacks.length){
               str = attacks.length * 50
               if(str > 100){
                   str = 100;
               }else if (str === 1){
                   str = 50;
               }else if (str === 2){
                   str = 100;
               }
             }
 
             pokemon.strStatus = str;
 
             let weakness = 0;
             if(weaknesses && weaknesses.length){
               weakness = weaknesses.length * 100
               if((weakness > 100) || (weakness === 1)){
                   weakness = 100;
               }else{
                 weakness = 0;
               }
             }
 
             pokemon.weakStatus = weakness;
 
             let damage = 0;
             if(attacks && attacks.length){
                 let dmg = 0;
                 for(let i = 0; i < attacks.length; i++){
                     let atk = attacks[i];
                     if(atk.damage && !isNaN(atk.damage)){
                         dmg += parseInt(atk.damage.replace(/[^0-9]/gi, ""));
                     }
                 }
                 damage = dmg;
             }
 
 
             let happy = (((parseInt(hp) / 10) + (damage /10 ) + 10 - (weakness)) / 5) || 0;
 
             pokemon.happyStatus = Math.ceil(happy);
             
 
         }
 
         pokemon.active = false;
 
         return pokemon;
 
       }

    return (
        <div id="myModal" className="modal" ref={myModal}  onClick={closeModal}>
  <div className="modal-content">
    <div className="container">
  <div className="content-modal">
    <div className="form-input">
      <div className="input-container" style={{paddingLeft:'30px'}}>
      <input className="input-field" style={{fontSize:'20px'}} type="text" placeholder="Pokemon Name" name="name" value={criteria.name} onChange={handleCriteriaChange}/>
        <input className="input-field" style={{fontSize:'20px'}} type="text" placeholder="Pokemon Type" name="type" value={criteria.type} onChange={handleCriteriaChange}/>
        <select className="input-field" style={{fontSize:'20px'}} name="limit" value={criteria.limit}  onChange={handleCriteriaChange}>
           <option value="20">Show 20</option>
           <option value="50">Show 50</option>
           <option value="100">Show 100</option>
         </select>
      <i className="fa fa-search icon" style={{color:'#e44c4c',fontSize:'40px',cursor:'pointer'}} onClick={searchPokemon}/> 
      </div>
    </div>
    {dataList.map((pokemon,index) => (
    <div className="cards-modal" key={pokemon.id}
    onMouseOver={()=> {handleMouse(index,true)}}
    onMouseLeave={()=> {handleMouse(index,false)}}>
       <div className="card-item">
          <div className="image"><img src={pokemon.imageUrl} alt={pokemon.name} style={{height:'250px',paddingTop:'10px'}}/></div>
           <div className="data">
             {pokemon.active && <div style={{color:'#e44c4c',cursor:'pointer',float:'right',paddingRight:'20px'}} onClick={() => selectPokemon(pokemon)}>Add</div>}
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
  </div>
</div>
    );
}
