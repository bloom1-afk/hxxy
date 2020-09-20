class BannerImg{
    constructor(props,parent) {
/*imgSrc,width,height,direction,moveBool=false,speed = 20,autoBool = true,time = 0*/
        this.props = props;
        this.position = this.props.position || 0;
        this.moveBool = this.props.moveBool || false;
        this.speed = this.props.speed || 20;
        this.time = this.props.time || 1;
        this.autoBool = this.props.autoBool || true;
        //this.autoBool = false;
        this.btnList = [];
        this.imgList = [];
        this.fCon = null;
        this.bannerImgCon = this.bannerImg(parent);

    }

    bannerImg(parent){
        if(this.bannerImgCon) return this.bannerImg;
       this.loadImg(parent);
    }
    getImg(src){
        return new Promise((res,rej)=>{
            let img = new Image();
            img.src = src;

            img.onload = ()=>{
                res(img);
            };
            img.onerror = () =>{
                rej('图片加载失败');
            }
        })
    }
    loadImg(parent){
        let imgCopyList = [];
        for(let i = 0; i < this.props.imgSrc.length; i++){
            imgCopyList.push(this.getImg(this.props.imgSrc[i]));
        }
        Promise.all(imgCopyList).then((_imgList)=>{
            this.btnList = _imgList.splice(0,2);
            this.imgList = _imgList.splice(0);
            for(let i  = 0; i < this.imgList.length; i++){
                this.imgList[i].style.width = '100%';
                this.imgList[i].style.height = '100%';
            }
            this.createCon(parent);
            this.createRollImg();
            this.setBtn();
            this.fCon.self = this;
            this.fCon.addEventListener('mouseenter',this.mouseHandler);
            this.fCon.addEventListener('mouseleave',this.mouseHandler);
            this.animation();
        })

    }
    createCon(parent){
        this.fCon = $c('div',parent,{
            width:this.props.width+'px',
            height:this.props.height+'px',
            left:0,
            right:0,
            margin:'auto',
            /* top:'20%',*/
            overflow:'hidden',
            position:'relative',
        });
    }
    createRollImg(){
        this.rollCon = $c('div',this.fCon,{
            width:this.props.width+'px',
            height:this.props.height+'px',
            position: 'relative',
        });
        this.sImg = $c('div',this.rollCon,{
            width:this.props.width+'px',
            height:this.props.height+'px',
            objectFit:'cover',
            top:0,
            left: 0,
            position:'absolute',
            cursor:'pointer'
        });
        this.sImg.appendChild(this.imgList[0]);
        this.sImg.self = this;
        this.sImg.addEventListener('mousedown',this.mouseHandler);
    }
    setBtn(){
        this.leftBtn = this.btnList[0];
        this.rightBtn = this.btnList[1];
        this.rollCon.appendChild(this.leftBtn);
        this.rollCon.appendChild(this.rightBtn);
        Object.assign(this.leftBtn.style,{
            position:'absolute',
            left:0,
            top:(this.props.height-this.leftBtn.offsetHeight)/2+'px',
            cursor:'pointer',
        });
        Object.assign(this.rightBtn.style,{
            position:'absolute',
            right:0,
            top:(this.props.height-this.rightBtn.offsetHeight)/2+'px',
            cursor:'pointer',
        });
        this.leftBtn.self = this.rightBtn.self = this;
        this.leftBtn.addEventListener('click',this.btnClickHandler);
        this.rightBtn.addEventListener('click',this.btnClickHandler);
    }
    mouseHandler(e){
        switch (e.type) {
            case 'mouseenter':
                this.self.autoBool = false;
                this.self.time = 0;
                break;
            case 'mouseleave':
                this.self.autoBool = true;
                 this.self.sImg.removeEventListener('mousemove',this.self.mouseHandler);
                   this.self.sImg.removeEventListener('mouseup',this.self.mouseHandler);
                break;
            case 'mousedown':
                e.preventDefault();
                  this.x = e.offsetX;
                  this.self.sImg.addEventListener('mousemove',this.self.mouseHandler);
                  this.self.sImg.addEventListener('mouseup',this.self.mouseHandler);
                  break;
            case 'mousemove':
                  break;
            case 'mouseup':
                  this.lastX = e.offsetX;
                   this.self.direction = this.lastX- this.x > 0?'right':'left';
                   this.self.sImg.removeEventListener('mousemove',this.self.mouseHandler);
                   this.self.sImg.removeEventListener('mouseup',this.self.mouseHandler);
                if( this.self.direction =='left'){
                    if(++this.self.position > this.self.imgList.length-1){
                        this.self.position = 0;
                    }
                }else{
                    if(--this.self.position < 0){
                    this.self.position = this.self.imgList.length-1;
                    }
                }
                this.self.addImg();
                  break;
        }


    }
    animation(){
        requestAnimationFrame(this.animation.bind(this));
        this.moveImg();
        this.autoMove();
    }
    btnClickHandler(e){
        if(this.self.moveBool)return;
        if(this === this.self.leftBtn){
            this.self.direction ='left';
            if(++this.self.position > this.self.imgList.length-1){
                this.self.position = 0;
            }
        }else if(this === this.self.rightBtn){
            this.self.direction = 'right';
            if(--this.self.position < 0){
                this.self.position = this.self.imgList.length-1;
            }
        }

        this.self.addImg();
        this.self.debounce();
    }
    addImg(){
        console.log('addImg'+this.props.width);
        this.sImg.style.width = this.props.width*2+'px';
        Object.assign(this.imgList[this.position].style,{
            width:this.props.width+'px',
            height:this.props.height+'px',
        });
        if(this.direction === 'left'){
            Object.assign(this.sImg.firstElementChild.style,{
                width:this.props.width+'px',
                height:this.props.height+'px',
            })
            this.sImg.appendChild(this.imgList[this.position]);
        }else if(this.direction === 'right'){
            Object.assign(this.sImg.firstElementChild.style,{
                width:this.props.width+'px',
                height:this.props.height+'px',
            })
            this.sImg.insertBefore(this.imgList[this.position],this.sImg.firstElementChild);
            this.sImg.style.left = -this.props.width+'px';
        }
        this.moveBool = true;
    }
    moveImg(){
        if(!this.moveBool)return;
        if(this.direction === 'left'){
            this.sImg.style.left =this.sImg.offsetLeft-this.speed<=-this.props.width?-parseInt(this.props.width)+'px':Math.ceil(this.sImg.offsetLeft-this.speed)+'px';
          /*  console.log(this.sImg.offsetLeft === -this.props.width);
            console.log('sss'+-this.props.width,this.sImg.offsetLeft);*/
            if(Math.ceil(this.sImg.offsetLeft) === -parseInt(this.props.width)){
               /* console.log(2222);*/
                this.sImg.firstElementChild.remove();
                this.moveBool = false;
                this.sImg.style.left='0px';
            }
        }else if(this.direction === 'right'){
            this.sImg.style.left =this.sImg.offsetLeft+this.speed >=0 ?0+'px':this.sImg.offsetLeft+this.speed+'px';
            if(this.sImg.offsetLeft === 0){
          /*      console.log(5555);*/
                this.moveBool = false;
                this.sImg.lastElementChild.remove();
            }
        }
    }
    autoMove(){

        if(!this.autoBool)return;
        if(this.time++>500){
            this.time = 0;
            this.direction ='left';
            if(++this.position === this.imgList.length){
                this.position = 0;
            }
            this.addImg();
        }
    }

   setData(data){

        Object.assign(this.fCon.style,{
            width:(data.width || this.props.width)+'px',
            height:(data.height || this.props.height)+'px',
        });
         Object.assign(this.rollCon.style,{
            width:(data.width || this.props.width)+'px',
            height:(data.height || this.props.height)+'px',
        });
          Object.assign(this.sImg.style,{
            width:(data.width || this.props.width)+'px',
            height:(data.height || this.props.height)+'px',
        });

       Object.assign(this.sImg.lastElementChild.style,{
           width:(data.width || this.props.width)+'px',
           height:(data.height || this.props.height)+'px',
       });

          Object.assign(this.leftBtn.style,{
            position:'absolute',
            left:0,
            top:'50%',
            transform:'translateY(-50%)',
        });
        Object.assign(this.rightBtn.style,{
            position:'absolute',
            right:0,
            top:'50%',
            transform:'translateY(-50%)',
        });

        this.props.width = data.width;
        this.props.height = data.height;
        this.debounce(data);
    }
    debounce(data){
        this.autoBool = false;
        let timeout = null;
        if(!timeout){
            clearTimeout(timeout);
            setTimeout(()=>{
                this.autoBool = true;
            },1000)
        }
    }

}
function $c(type,parent,style={},text){
    let elem = document.createElement(type);
    if(style){
        for(let props in style){
            elem.style[props] = style[props];
        }
    }
    if(text){
        elem.textContent = text;
    }
    if(parent)parent.appendChild(elem);
    return elem;
}
