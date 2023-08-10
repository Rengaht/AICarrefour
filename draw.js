const __demo_text="公寓大門外，供桌擺得齊，爸爸在旁邊，看著我燒紙錢。特價傳單，家樂福的獻禮，微涼的晚風，帶走了我們的祈禱。煙火升起，照亮了這晚夜，我們在這裡，為中元節祈福。家樂福特價，供桌上的禮物，希望他們喜歡，這些我們的小心意。微涼的晚風，吹散了煙火，爸爸在旁邊，默默地看著我。供桌擺在公寓大門外，我們在這裡，為中元節祈福。";
const __font="sans-serif";
const __seperator=["，","。",",","."];
const __face_files=[
    "",
    "head_shape-10.png",
    "head_shape-11.png",
    "head_shape-12.png",
    "head_shape-13.png",
    "head_shape-14.png",
    "head_shape-15.png",
];

const __color_sets=[
    [],
    ["#FFD804","#FFFF00",'#FF7600'],
    ["#F73963","#FFFFFF",'#42F763'],
    ["#FFB2FF","#FF3677",'#FBFF00'],
    ["#FF5F00","#FFFFFF",'#FF00FC'],
    ["#9bd5be","#e63cf6",'#e63323'],
    ["#5E49D0","#5D88EA",'#232C6A'],
];

function loadPixels(img, width, height){

    let _canvas=document.createElement("canvas");
    _canvas.width=width;
    _canvas.height=height;

    let _ctx=_canvas.getContext("2d");
    _ctx.drawImage(img,0,0,img.width/img.height*width,height);

    var imagedata = _ctx.getImageData(0,0,width,height);
    return imagedata.data;


}
function getContour(pixels, width, height, count){

    let lineHeight=Math.floor(height/count);
    // let count=Math.floor(height/lineHeight);
    let output=[];
    
    for(var i=0;i<count;++i){
        
        let start=0;
        while(pixels[i*lineHeight*width*4+start*4+3]==0){
            start++;
            if(start>width) break;
        }

        output.push(start);
    }
    console.log(output);
    return output;
}

function seperate(text){
    let output=text;
    __seperator.forEach(el=>{
        output=output.split(el).join(`${el}|`);
    })
    return output.split("|");
}


function intControl(){

    // set defulat text
    document.getElementById("_input_text").value=__demo_text;
    
    // window._input_image=null;
    // let imageinput=document.getElementById("_input_image");
    // imageinput?.addEventListener('change', (event)=>{

    //     const file = event.target.files[0]; // 0 = get the first file
    //     console.log('new image', file);

    //     let url = window.URL.createObjectURL(file);
    //     image = url;
        
    // //     if(_animation_id) cancelAnimationFrame(_animation_id);

    // //     pixels=null;
    // //     contour=null;
    // //     prev_params=null;

    // //     image.onload = drawText;
    // });

    let colorset=document.getElementById("_input_colorset");
    let _input_colors=[1,2,3].map(id=>document.getElementById(`_input_color${id}`));
    colorset?.addEventListener("change",(event)=>{
        let val=parseInt(event.target.value);
        for(var i=0;i<3;++i) _input_colors[i].value=__color_sets[val][i];
    });

    // let faceset=document.getElementById("_input_faceset");
    // faceset?.addEventListener("change",(event)=>{
    //     let val=parseInt(event.target.value);
    //     image.src=`resources/${__face_files[val]}`;
    //     if(_animation_id) cancelAnimationFrame(_animation_id);

    //     pixels=null;
    //     contour=null;
    //     prev_params=null;

    //     image.onload = drawText;
    // });

   
}

function getParameters(){

    const _param_keys=['spacing','speed', 'color1', 'color2', 'color3','text', 'direction', "faceset"];

    let params={};
    _param_keys.forEach(key=>{
        let val=document.getElementById(`_input_${key}`).value;
        if(val=="checked"){
            params[key]=document.getElementById(`_input_${key}`).checked;
        }else{
            params[key]=parseFloat(val) || val;
        }
    });

    let val_params=document.getElementById("_val_params");
    if(val_params){
        val_params.innerHTML=Object.keys(params).map(key=>`${key} = ${params[key]}`).join('\n');
    }
    console.log(params);

    return params;
}

function onGoClick(){

    if(window.__canvas_draw) 
        cancelAnimationFrame(window.__canvas_draw._animation_id);

    let p=getParameters();
    window.__canvas_draw=init(p);

}
function onSnapshotClick(){
    let data_url=window.__canvas_draw?.getSnapshot();

    let snapshot=document.getElementById("_img_snapshot");
    if(snapshot){
        snapshot.src=data_url;
    }


}

function lerpColor(a, b, amount) { 

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

function init(params){

    
    let canvas=document.getElementById("_canvas_head");
    if(!canvas){
        console.error("Can't find element with id _canvas_head");
        return;
    }

    let text=params.text;
    if(!text || text.length==0){
        return;
    }

    // let canvas=find[0];
    let ctx=canvas.getContext("2d");

    // load image
    let image = new Image();
    image.onload = drawText;
    image.src = `resources/${window._input_image || __face_files[params.faceset]}`;

    let _animation_id;

    let start_time=new Date().getTime();

    let lines=seperate(text);
        
    let contour;
    let textSize;
    let lineHeight;
        
    let pixels;


    function drawText(){
        
        

        
        if(!contour){
            if(!pixels){
                pixels = loadPixels(image, canvas.width, canvas.height);
            }
            
            contour=getContour(pixels, canvas.width, canvas.height, lines.length);            
            lineHeight=canvas.height/lines.length;
            textSize=lineHeight-params.spacing*2;
            
            pixels=null;
            image = null;
        }

        
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        // ctx.drawImage(image,0,0,image.width/image.height*canvas.height, canvas.height);
        
        ctx.font = `${textSize}px ${__font}`;

        let p=((new Date()).getTime()-start_time)/5000*params.speed;
        let pc=Math.abs(Math.sin(p/2.0));

        

        // var gradient=params.direction=="radial"? ctx.createRadialGradient(0,canvas.height/2,0,0,canvas.height/2,canvas.width): ctx.createLinearGradient(0,0,0,canvas.height+lineHeight);
        // gradient.addColorStop('0', params.color1);
        // // gradient.addColorStop(pc, params.color2);
        // gradient.addColorStop(1-pc, params.color3);
        // // gradient.addColorStop('1.0', params.color3);
        // // console.log(gradient)
        
        // ctx.fillStyle=gradient;
        

        for(var index=0; index < contour.length; index++){

            // if(params.direction=='radial'){
            //     ctx.fillStyle=params.color1;
            // }else{
            
            if(params.direction!='radial'){
                let lerp=index/contour.length;            
                if(lerp<1-pc){
                    ctx.fillStyle=lerpColor(params.color1, params.color2,lerp/(1-pc));
                }else{
                    ctx.fillStyle=lerpColor(params.color2, params.color3,(lerp-1+pc)/(pc))
                }
            }

            let trim="";

            if(index>=lines.length) break;
            trim=lines[index];
            let spacing=Math.min((canvas.width-contour[index]-textSize*4)/(trim.length+2), textSize*2.0);
            
            let pp=0.2+(0.9)*Math.min(1.0, Math.abs(1.7*Math.sin((2.0-index/contour.length)*Math.PI*0.5+p)));
            // let span=params.staytime+5.0/params.speed+index*0.2;
                

            for(var i=0;i<trim.length;++i){
                let x=contour[index]+i*spacing*pp;
                let y=(index+1)*lineHeight;

                if(params.direction=='radial'){
                    let lerp=Math.pow(x,2)+Math.pow(y-canvas.height/2.0,2);
                    lerp=Math.sqrt(lerp)/canvas.width;
                    // lerp/=Math.pow(canvas.height/2.0,2);
                    
                    if(lerp<1-pc){
                        ctx.fillStyle=lerpColor(params.color1, params.color2,lerp/(1-pc));
                    }else{
                        ctx.fillStyle=lerpColor(params.color2, params.color3,(lerp-1+pc)/(pc))
                    }
                }


                let char=trim.charAt(i);
                ctx.fillText(char,x,y); 

            }
        }
        
        _animation_id=requestAnimationFrame(drawText);
    }

    function getSnapshot(){
        
        if(!contour){
            console.error("contour not loaded!");
            return;
        }

        let tmp_canvas=document.createElement("canvas");
        tmp_canvas.width=canvas.width;
        tmp_canvas.height=canvas.height;

        let tmp_ctx=tmp_canvas.getContext("2d");

        tmp_ctx.clearRect(0,0, tmp_canvas.width, tmp_canvas.height);
        
        tmp_ctx.font = `${textSize}px ${__font}`;

        let p=((new Date()).getTime()-start_time)/5000*params.speed;
        let pc=Math.abs(Math.sin(p/2.0));

        

        var gradient=params.direction=="radial"? tmp_ctx.createRadialGradient(0,tmp_canvas.height/2,0,0,tmp_canvas.height/2,tmp_canvas.width): ctx.createLinearGradient(0,0,0,tmp_canvas.height+lineHeight);
        gradient.addColorStop('0', params.color1);
        gradient.addColorStop(pc, params.color2);
        // gradient.addColorStop(1-pc, params.color3);
        gradient.addColorStop('1.0', params.color3);

        tmp_ctx.fillStyle=gradient;
        

        for(var index=0; index < contour.length; index++){

            let trim="";

            if(index>=lines.length) break;
            trim=lines[index];
            let spacing=Math.min((tmp_canvas.width-contour[index]-textSize*4)/(trim.length+2), textSize*2.0);
            
            // let pp=1;//*Math.min(1.0, Math.abs(1.7*Math.sin(Math.PI*0.5+0.5*Math.PI)));
            // let span=params.staytime+5.0/params.speed+index*0.2;
                

            for(var i=0;i<trim.length;++i){
                let char=trim.charAt(i);
                tmp_ctx.fillText(char,contour[index]+i*spacing, (index+1)*lineHeight); 

            }
        }

        var dataURL=tmp_canvas.toDataURL();
        
        return dataURL;
    }
    

    let output={
        getSnapshot: getSnapshot,
        animation_id: _animation_id,
    }
    window.__canvas_draw=output;
    
    return output;

}




window.onload=()=>{
    
    intControl();

    // init({
    //     spacing : 5,
    //     speed: 5,
    //     color1: "#ffd804",
    //     color2: "#ffff00",
    //     color3: "#ff7600",
    //     text: "公寓大門外，供桌擺得齊，爸爸在旁邊，看著我燒紙錢。特價傳單，家樂福的獻禮，微涼的晚風，帶走了我們的祈禱。煙火升起，照亮了這晚夜，我們在這裡，為中元節祈福。家樂福特價，供桌上的禮物，希望他們喜歡，這些我們的小心意。微涼的晚風，吹散了煙火，爸爸在旁邊，默默地看著我。供桌擺在公寓大門外，我們在這裡，為中元節祈福。",
    //     direction: "linear",
    //     faceset: 1,
    // });

};