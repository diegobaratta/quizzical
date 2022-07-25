import React from "react"

export default function Blob(props) {
    
    const classToUse = props.position === 'top' ? 'blob-top' : props.position === 'bottom' ? 'blob-bottom' : ''

    return ( 
        <div className={classToUse}></div>
    )
}