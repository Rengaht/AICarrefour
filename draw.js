const __demo_text="公寓大門外，供桌擺得齊，爸爸在旁邊，看著我燒紙錢。特價傳單，家樂福的獻禮，微涼的晚風，帶走了我們的祈禱。煙火升起，照亮了這晚夜，我們在這裡，為中元節祈福。家樂福特價，供桌上的禮物，希望他們喜歡，這些我們的小心意。微涼的晚風，吹散了煙火，爸爸在旁邊，默默地看著我。供桌擺在公寓大門外，我們在這裡，為中元節祈福。";
const __demo_text2="Yo yo yo, 老爸就在廟門前的廣場，供品上插香，祈求平安保佑我們的家族，家樂福促銷型錄在手，節省錢的好幫手，55667788-，快來買一個，讓你享受無憂。Walking through the temple gates, feeling the vibe,The square is packed, people gather side by side,In front of the altar, we pay our respects,Burning incense, hoping for blessings and protects.";
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

        if(start<width) output.push(start);
    }
    console.log(output);
    return output;
}

function getTextLength(text){
    let count=0;
    for(var i=0;i<text.length;++i){
        let str=text.substring(i,i+1);
        if(str.match(/[\u0000-\u00ff]/g)) count+=0.5;
        else count+=1;
    }
    return count;
}

function seperate(text, perline){
    let output=text;
    __seperator.forEach(el=>{
        output=output.split(el).join(`${el}|`);
    })

    // let lines=output.split("|");
    let lines=[text];
    let tmp=[];
    // let perLine=8;
    lines.forEach(line=>{
        let len=getTextLength(line);
        if(len<perline*2){
            tmp.push(line);
            return;
        }
        // let count=Math.ceil(len/perline);

        // for(var i=0;i<count;++i){
        //     let s=i*perline;
        //     let e= Math.min((i+1)*perline,len);
        //     // console.log(s,e);
        //     tmp.push(line.substring(s,e));
        // }
        let start=0;
        let count=0;
        for(var i=0;i<line.length;++i){
            let str=line.charAt(i);
            if(str.match(/[\u0000-\u00ff]/g)) count+=1;
            else count+=2;
            // console.log(str.match(/[!,.?]/g));

            if(count>=perline*2){
                
                // if end
                let next=line.charAt(i+1);
                console.log(next);
                if(next.match(/[!,.?]/g)){
                    let k=line.substring(start, i+1);
                    tmp.push(k);
                 
                    i++;
                    start=i;
                    count=0;    
                }else{

                    let k=line.substring(start, i+1);
                    if(next.match(/^[a-zA-Z]*$/g) && str.match(/^[a-zA-Z]*$/g)) k+='-';

                    tmp.push(k);
                    start=i+1;
                    count=0;
                }
            }else{
                if(i==line.length-1) tmp.push(line.substring(start, line.length));
            }
            
        }
        
    });
    // console.log(tmp);

    return tmp;
}


function intControl(){

    // set defulat text
    document.getElementById("_input_text").value=__demo_text2;
    
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

    const _param_keys=['spacing','speed', 'color1', 'color2', 'color3','text', 'direction', "faceset", "boundary","timebreak"];

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
    // console.log(params);

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

    let lines=seperate(text, params.perline);
        
    let contour;
    let textSize;
    let lineHeight;
        
    let pixels;

    let boundary=params.boundary || canvas.width*0.1;

    function drawText(){
        
        

        
        if(!contour){
            if(!pixels){
                pixels = loadPixels(image, canvas.width-boundary*2, canvas.height-boundary*2);
            }
            
            contour=getContour(pixels, canvas.width-boundary*2, canvas.height-boundary*2, lines.length);            
            lineHeight=(canvas.height-boundary*2)/lines.length;
            textSize=Math.min(lineHeight-params.spacing*2, canvas.width/params.perline/2.0);
            
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
            let spacing=Math.min((canvas.width-boundary*2-contour[index]-textSize*4)/(trim.length+2), textSize*2.0);
            
            let pp;
            if(params.timebreak){
                pp=0.2+(0.9)*Math.min(1.0, Math.abs(1.7*Math.sin((2.0-index/contour.length)*Math.PI*0.5+p)));
            }else{
                pp=0.2+(0.9)*Math.abs(1.7*Math.sin((2.0-index/contour.length)*Math.PI*0.5+p));
            }
            // let span=params.staytime+5.0/params.speed+index*0.2;
                

            for(var i=0;i<trim.length;++i){
                let x=contour[index]+i*spacing*pp+boundary;
                let y=(index+1)*lineHeight+boundary;

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

        
        let boundary=params.boundary || canvas.width*0.1;


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
            let spacing=Math.min((tmp_canvas.width-boundary*2.0-contour[index]-textSize*4)/(trim.length+2), textSize*2.0);
            
            // let pp=1;//*Math.min(1.0, Math.abs(1.7*Math.sin(Math.PI*0.5+0.5*Math.PI)));
            // let span=params.staytime+5.0/params.speed+index*0.2;
                

            for(var i=0;i<trim.length;++i){
                let char=trim.charAt(i);
                tmp_ctx.fillText(char,contour[index]+i*spacing+boundary, (index+1)*lineHeight+boundary); 

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


function onRecord(){
    if(window.__animation_recorder){
        window.__animation_recorder.stop();
    }
    let canvas=document.getElementById('_canvas_head');
    let recorder = new CanvasRecorder(canvas);    
    recorder.start();
    window.__animation_recorder=recorder;
}

function onStopRecord(){
    if(window.__animation_recorder) window.__animation_recorder.stop();
}

function onDownload(){
    if(window.__animation_recorder) window.__animation_recorder.save();
}