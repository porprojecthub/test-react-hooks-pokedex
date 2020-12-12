import React, {useState, useEffect} from 'react'
import './status.style.css'

export default function Status(props) {

        const [styleParam, setStyleParam] = useState({});

        useEffect(() => {
        let value = props.value;
        let type = props.type;
        let param = {};

        if(type === 'weak'){

            if(parseInt(value) === 0){
                param['--status-param'] = '100%'
              }else{
                param['--status-param'] = '0%'
              }

        }else{
            if(value && value !== undefined){
                param['--status-param'] = `${value}%`
            }else{
                param['--status-param'] = '0%'
            }
        }

        setStyleParam(param);

     },[props.value,props.type]);

    return (
        <div className="status">
        <div id="progress" style={styleParam}></div>
        </div>
    );
}
