import React from 'react';

function NormalContainer({users}){
    return (
        <div className="container">
            <EditUsers users={users}/>
        </div>
    )
}
export default NormalContainer;