export function setBtnText(
    btn, 
    isLoading, 
    defaultText = "Save", 
    loadingText = "Saving...") {
        if(isLoading) {
            btn.textContent = loadingText;
        } else {
            btn.textContent = defaultText;
        }
    }

    export function setDeleteBtnText(
    btn, 
    isLoading, 
    defaultText = "Delete", 
    loadingText = "Deleting...") {
        if(isLoading) {
            btn.textContent = loadingText;
        } else {
            btn.textContent = defaultText;
        }
    }