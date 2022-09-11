class removeElementHelper{
    removedElements = new Map();
    elementCount = 0;
    removeElement(element){
        element.outerHTML = `<!-- ${element.outerHTML} -->`;
    }

}