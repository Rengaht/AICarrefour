const __demo_text="公寓大門外，供桌擺得齊，爸爸在旁邊，看著我燒紙錢。特價傳單，家樂福的獻禮，微涼的晚風，帶走了我們的祈禱。煙火升起，照亮了這晚夜，我們在這裡，為中元節祈福。家樂福特價，供桌上的禮物，希望他們喜歡，這些我們的小心意。微涼的晚風，吹散了煙火，爸爸在旁邊，默默地看著我。供桌擺在公寓大門外，我們在這裡，為中元節祈福。";
const __font="sans-serif";


function loadPixels(img, width, height){

    let _canvas=document.createElement("canvas");
    _canvas.width=width;
    _canvas.height=height;

    let _ctx=_canvas.getContext("2d");
    _ctx.drawImage(img,0,0,img.width/img.height*width,height);

    var imagedata = _ctx.getImageData(0,0,width,height);
    return imagedata.data;


}
function getContour(pixels, width, height, lineHeight){

    let count=Math.floor(height/lineHeight);
    let output=[];
    
    for(var i=0;i<count;++i){
        
        let start=0;
        while(pixels[i*lineHeight*width*4+start*4+3]==0){
            start++;
            if(start>width) break;
        }

        output.push(start);
    }
    // console.log(output);
    return output;
}


function init(){

    // set defulat text
    document.getElementById("_input_text").value=__demo_text;
    
    const _param_keys=['textSize', 'lineHeight','speed', 'color1', 'color2','text', 'direction'];

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

    let id=Math.floor(Math.random()*2)+1;
    image.src = `resources/face${id}.svg`;
    
    
    // get text
    // let queryString = window.location.search;
    // let urlParams = new URLSearchParams(queryString);
    // let text=urlParams.get("you_text");
   

    
    // let lines=text.split("，").join('，,').split("。").join('。,').split(',');
    
    //text=lines.join("，\n");

    
    // let contour;
    let pixels;

    function drawText(){

        // get parameters
        let params={};
        _param_keys.forEach(key=>{
            let val=document.getElementById(`_input_${key}`).value;
            params[key]=parseFloat(val) || val;
        });


        let text=params.text;
        if(!text || text.length==0){
            return;
        }

        if(!pixels){
            pixels = loadPixels(image, canvas.width, canvas.height);
        }
        let contour=getContour(pixels, canvas.width, canvas.height, params.lineHeight);
    
       
        ctx.clearRect(0,0, canvas.width, canvas.height);
        // ctx.drawImage(image,0,0,image.width/image.height*canvas.height, canvas.height);

        ctx.font = `${params.textSize}px ${__font}`;

        let p=(new Date()).getTime()/5000*params.speed;
        let pc=Math.abs(Math.sin(p/2.0));

        var gradient=params.direction=="radial"? ctx.createRadialGradient(0,canvas.height/2,0,0,canvas.height/2,canvas.width): ctx.createLinearGradient(0,0,0,canvas.height+params.lineHeight);
        gradient.addColorStop('0', params.color2);
        gradient.addColorStop(pc, params.color1);
        gradient.addColorStop('1.0', params.color2);

        ctx.fillStyle=gradient;
        
        let start=0;

        for(var index=0; index < contour.length; index++){

            if(start>=text.length) start=0;

            // let line=lines[index%lines.length];
            // let wid=len*1.8;
            let wid=Math.floor((canvas.width-contour[index])/params.textSize/1.2);
            let sub=text.substring(start, start+wid);
            let cut=Math.max(sub.lastIndexOf("，"), sub.lastIndexOf("。"));
            let trim=sub.substring(0,cut+1);
            start+=trim.length;

            for(var i=0;i<trim.length;++i){
                let char=trim.charAt(i);
                let pp=0.4+0.8*Math.abs(Math.sin(index/contour.length*Math.PI+p));
                ctx.fillText(char,contour[index]+i*params.textSize*pp, (index+1)*params.lineHeight); 

                // start++;

                // if(start>text.length) break;
            }
            // if(start>text.length) break;
            // ctx.fillText(line, contour[index], (index+1)*params.lineHeight);
        }
        
        requestAnimationFrame(drawText);
    }

}


window.onload=init;