
export const showLoading = (isLoading) => {
    if(isLoading){
        return <div className="container alert alert-info">Loading....</div>
    }else {
        return ""
    }
}

export const showSuccess = (success, successMsg) => {
    if(success){
        return <div className="container alert alert-success">{successMsg}</div>
    }else {
        return ""
    }
}

export const showError = (error, errorMsg) => {
    if(error){
        return <div className="container alert alert-danger">{errorMsg} </div>
    }else {
        return ""
    }
}


export const showGeneralMessage = (message) => {
    if(message){
        return <div className="container alert alert-info">{message} </div>
    }else {
        return ""
    }
}

