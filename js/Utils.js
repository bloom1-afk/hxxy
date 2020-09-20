var $b = (function () {
    return {
        create(type,parent = document.body,style={},text){
            let elem = document.createElement('type');
            if(style){
                for(let props in style){
                    elem.style[props] = style[props];
                }
            }
            if(text){
                elem.textContent = text;
            }
            if(parent){
                parent.appendChild(elem);
            }
            return elem;
        }
    }
})