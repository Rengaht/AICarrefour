const __demo_text="公寓大門外，供桌擺得齊，爸爸在旁邊，看著我燒紙錢。特價傳單，家樂福的獻禮，微涼的晚風，帶走了我們的祈禱。煙火升起，照亮了這晚夜，我們在這裡，為中元節祈福。家樂福特價，供桌上的禮物，希望他們喜歡，這些我們的小心意。微涼的晚風，吹散了煙火，爸爸在旁邊，默默地看著我。供桌擺在公寓大門外，我們在這裡，為中元節祈福。";
const __font="sans-serif";
const __seperator=["，","。",",","."];


const __color_sets=[
    [],
    ["#FFD804","#FFFF00",'#FF7600'],
    ["#F73963","#FFFFFF",'#42F763'],
    ["#FFB2FF","#FF3677",'#FBFF00'],
    ["#FF5F00","#FFFFFF",'#FF00FC'],
    ["#FF5F00","#CB25F0",'#FF00FC'],
    ["#00FFFF","#F7FFB0",'#C3FFFF'],
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

function init(){

    // set defulat text
    document.getElementById("_input_text").value=__demo_text;
    
    const _param_keys=['spacing','speed', 'color1', 'color2', 'color3','text', 'direction'];

    let find=document.getElementsByTagName("canvas");
    if(find.length==0){
        console.error("Can't find canvas element");
        return;
    }

    let canvas=find[0];
    let ctx=canvas.getContext("2d");

    // load image
    const image = new Image();
    image.onload = drawText;

    let id=2;//Math.floor(Math.random()*2)+1;
    image.src = `resources/face${id}.svg`;

    let _animation_id;

    let imageinput=document.getElementById("_input_image");
    imageinput.addEventListener('change', (event)=>{
        
        const file = event.target.files[0]; // 0 = get the first file
        console.log('new image', file);

        let url = window.URL.createObjectURL(file);
        image.src = url;
        
        if(_animation_id) cancelAnimationFrame(_animation_id);

        pixels=null;
        contour=null;
        prev_params=null;

        image.onload = drawText;
    });

    let colorset=document.getElementById("_input_colorset");
    let _input_colors=[1,2,3].map(id=>document.getElementById(`_input_color${id}`));
    colorset.addEventListener("change",(event)=>{
        let val=parseInt(event.target.value);
        for(var i=0;i<3;++i) _input_colors[i].value=__color_sets[val][i];
    });

    
    // get text
    // let queryString = window.location.search;
    // let urlParams = new URLSearchParams(queryString);
    // let text=urlParams.get("you_text");
   

    
    // let lines=text.split("，").join('，,').split("。").join('。,').split(',');
    
    //text=lines.join("，\n");

    
    let contour;
    let textSize;
    let lineHeight;
        
    let pixels;
    let prev_params;
    let prev_text;

    function drawText(){

        // get parameters
        let params={};
        _param_keys.forEach(key=>{
            let val=document.getElementById(`_input_${key}`).value;
            if(val=="checked"){
                params[key]=document.getElementById(`_input_${key}`).checked;
            }else{
                params[key]=parseFloat(val) || val;
            }
        });


        let text=params.text;
        if(!text || text.length==0){
            return;
        }

        if(!pixels){
            pixels = loadPixels(image, canvas.width, canvas.height);
        }

        let lines=seperate(text);
        
        if(!prev_params || prev_params.spacing!=params.spacing || prev_params.text != params.text){
            contour=getContour(pixels, canvas.width, canvas.height, lines.length);            
            lineHeight=canvas.height/lines.length;
            textSize=lineHeight-params.spacing*2;
        }
        prev_params=JSON.parse(JSON.stringify(params));
        
        
        
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        // ctx.drawImage(image,0,0,image.width/image.height*canvas.height, canvas.height);
        
        ctx.font = `${textSize}px ${__font}`;

        let p=(new Date()).getTime()/5000*params.speed;
        let pc=Math.abs(Math.sin(p/2.0));

        var gradient=params.direction=="radial"? ctx.createRadialGradient(0,canvas.height/2,0,0,canvas.height/2,canvas.width): ctx.createLinearGradient(0,0,0,canvas.height+lineHeight);
        gradient.addColorStop('0', params.color1);
        gradient.addColorStop(pc, params.color2);
        // gradient.addColorStop(1-pc, params.color3);
        gradient.addColorStop('1.0', params.color3);

        ctx.fillStyle=gradient;
        
        let start=0;
        // let lines;
        // let breakline=(params.breakline);

        // if(breakline){
        // }

        for(var index=0; index < contour.length; index++){

            let trim="";
            // if(!breakline){
            //     if(start>=text.length) start=0;

            //     // let line=lines[index%lines.length];
            //     // let wid=len*1.8;
            //     let wid=Math.floor((canvas.width-contour[index])/textSize/1.2);
            //     let sub=text.substring(start, start+wid);
            //     let cut=Math.max(sub.lastIndexOf("，"), sub.lastIndexOf("。"));
            //     trim=sub.substring(0,cut+1);
            //     start+=trim.length;

            // }else{
                if(index>=lines.length) break;
                trim=lines[index];
            // }
            let spacing=Math.min((canvas.width-contour[index])/trim.length, textSize*2.0);
            for(var i=0;i<trim.length;++i){
                let char=trim.charAt(i);
                let pp=0.4+(0.8)*Math.abs(Math.sin(index/contour.length*Math.PI+p));
                ctx.fillText(char,contour[index]+i*spacing*pp, (index+1)*lineHeight); 

                // start++;

                // if(start>text.length) break;
            }
            // if(start>text.length) break;
            // ctx.fillText(line, contour[index], (index+1)*params.lineHeight);
        }
        
        _animation_id=requestAnimationFrame(drawText);
    }

}


window.onload=init;