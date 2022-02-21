var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
c.width = screen.availWidth;
c.height = screen.availHeight;
var width=c.width;
var height=c.height;
const colors=["#e74c3c","#8e44ad","#3498db","#e67e22","#2ecc71"];
function requestFullScreen(ele) {
    var de = document.querySelector(ele);
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}
document.body.addEventListener('dblclick',function(){
    requestFullScreen("#myCanvas");
},false);
function Cricle(x,y,r,color){
        ctx.beginPath();
        let gradient = ctx.createRadialGradient(x,y,r-0.2*r,x,y,r);//设置渐变颜色
        gradient.addColorStop(0,color);//添加起始颜色
        gradient.addColorStop(1,`rgba(0,0,0,0)`);//添加
        ctx.fillStyle=gradient;
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.fill();
        ctx.closePath()
}
function draw(pos,r,color){
    Cricle(pos[0],pos[1],r,color);
}
function Path(pos1,pos2,color){
        ctx.beginPath();
        ctx.moveTo(pos1[0],pos1[1]);
        ctx.lineTo(pos2[0],pos2[1]);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle=color;
        ctx.stroke();
        ctx.closePath()
}
function drawpath(obj){
        obj.pathss=obj.pathss.length<=200?obj.pathss:(obj.pathss.slice(1,200));
        //console.log(pathss[0])
        if(obj.pathss.length>1){
            for(let i=0;i<obj.pathss.length-1;i++){
                
            Path(obj.pathss[i],obj.pathss[i+1],obj.color);
        }}
}
function move(ob1){
    ob1.pos[0]=ob1.pos[0]+ob1.vel[0];
    ob1.pos[1]=ob1.pos[1]+ob1.vel[1];
    let copy=Object.assign([], ob1.pos);
    ob1.pathss.push(copy);
    ctx.fillStyle="#111"
    ctx.fillText(ob1.id,ob1.pos[0],ob1.pos[1]);

}
function normalize(arr){
    let dis=Math.sqrt(arr[0]*arr[0]+arr[1]*arr[1]);
    return [arr[0]/dis,arr[1]/dis]
}
function rvel(ob1,ob2){
    //两个星球相撞后速度变化情况
    //v=(v1*m1+v2*m2)/(m1+m2)
    let vx=(ob1.vel[0]*ob1.mass+ob2.vel[0]*ob2.mass)/(ob1.mass+ob2.mass);
    let vy=(ob1.vel[1]*ob1.mass+ob2.vel[1]*ob2.mass)/(ob1.mass+ob2.mass);
    return [vx,vy]
}


function Attract(ob1,ob2,arr){
	if (ob1 == ob2){
		return;
	}else{
	    let direction=[ob2.pos[0]-ob1.pos[0],ob2.pos[1]-ob1.pos[1]];
      //console.log("direction:",ob1.id);
        let distance=Math.sqrt(direction[1]*direction[1]+direction[0]*direction[0]);
       // console.log("distance:",distance);
        if(distance<=(ob1.r()+ob2.r())){
            //console.log("发生碰撞：",ob1.id,ob2.id)
    	    if(ob1.mass>=ob2.mass){
    		ob1.mass=ob2.mass+ob1.mass;
    		ob1.r();
    		ob1.vel=rvel(ob1,ob2);
            ob2.id=-9999;
            //del_obj(ob2,arr);
    	   }else{
    		ob2.mass=ob2.mass+ob1.mass;
    		ob2.r();
    		ob2.vel=rvel(ob1,ob2);
            //del_obj(ob1,arr);
            ob1.id=-9999;
    	}
         }
         else{
        let standard=normalize(direction);
        //console.log(`${ob1.id}_${ob2.id}standard:`,standard);
        let force=G*ob1.mass*ob2.mass/distance/distance;
        //console.log("force:",force);
        let forcex=force*standard[0];
        let forcey=force*standard[1];
        let velx=forcex/ob1.mass*1/160;
        let vely=forcey/ob1.mass*1/160;
        //let ve2x=-forcex/ob2.mass*1/16;
        //let ve2y=-forcex/ob2.mass*1/16;
        ob1.vel=[ob1.vel[0]+velx,ob1.vel[1]+vely];
        //ob2.vel=[ob2.vel[0]+ve2x,ob2.vel[1]+ve2y];
        //console.log("ob1vx:",velx,"ob1vy:",vely);
        //console.log("ob2vx:",ve2x,"ob2vy:",ve2y)
         }

	}

}
G=0.6674*10;
function getrandom(min, max) {
  return Math.random() * (max - min + 1)  + min;
}
let A={
    pos:[500,300],
    vel:[0,0],
    mass:1000,
    pathss:[],
    id:999,
    color:colors[0],
    r: function(){
        return Math.pow((3*this.mass)/(4*Math.PI),1/3)
    }
}
let B={
    pos:[300,300],
    vel:[0,0.8],
    mass:8000,
    pathss:[],
    id:2,
    color:colors[1],
    r: function(){
        return Math.pow((3*this.mass)/(4*Math.PI),1/3)
    }
}
let C={
    pos:[700,300],
    vel:[0,-0.8],
    mass:8000,
    pathss:[],
    id:3,
    color:colors[2],
    r: function(){
        return Math.pow((3*this.mass)/(4*Math.PI),1/3)
    }
}
function Body(pos,vel,mass,id,col){
    return {
        pos:pos,
        vel:vel,
        mass:mass,
        pathss:[],
        id:1+id,
        color:col,
        r: function(){
        return Math.pow((3*this.mass)/(4*Math.PI),1/3)
    }
}  
}

let Max=Body([0,0],[0,0],1,-999,"#000");
plants=[A];
N=50;
for(let i=1;i<=N;i++){
    let pos=[getrandom(0,width),getrandom(0,height)];
    let vel=[getrandom(-0.01,0.01),getrandom(-0.01,0.01)];
    let mass=getrandom(100,500);
    //let col=colors[Math.floor(Math.random()*plants.length)];
    let col=`rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
    plants.push(Body(pos,vel,mass,i,col));
}
function del_obj(obj,arr){
    let ind=arr.indexOf(obj);
    arr.splice(ind,1);
    //console.log(obj.id)
    return arr;
}
function Translate(obj,arr){
    for(let i=0;i<plants.length;i++){
        plants[i].pos[0]=plants[i].pos[0]+(width/2-obj.pos[0]);
        plants[i].pos[1]=plants[i].pos[1]+(height/2-obj.pos[1]);
    }

}
function del(){
        for(let i=0;i<plants.length;i++){
            if(plants[i].id==-9999){
                //console.log(plants)
                del_obj(plants[i],plants);
                //console.log(plants);
            }
    }
    
}
function run(){
    for(let i=0;i<plants.length;i++){
        draw(plants[i].pos,plants[i].r(),plants[i].color);
        move(plants[i]);
        drawpath(plants[i]);
        Sign(plants[i],i);
    }
    //console.log("B:","vx=",B.vel[0],"vy=",B.vel[1]);
    //console.log("C:","vx=",C.vel[0],"vy=",C.vel[1]);
}
function Power(){
    run();
    for(let i=0;i<plants.length;i++){  
        if(plants[i].mass>Max.mass){
            Max=plants[i];
        }
        for(let j=0;j<plants.length;j++){
        //console.log("引力",plants[i].id,plants[j].id);
        Attract(plants[i],plants[j],plants);    
        }
        del();
        
    }
        ctx.beginPath();
        //ctx.fillStyle=Max.color;
        ctx.fillStyle="red";
        ctx.fillText(`质量最大的星球： |ID: ${Max.id}  |  质量: ${Max.mass} |`,width-300,20);
        ctx.closePath();

}
let a=0;
function Sign(obj,index){
    //ctx.fontsize="20px";
    ctx.fillStyle="white";
    let posxy=[obj.pos[0].toPrecision(5),obj.pos[1].toPrecision(5)];
    let velxy=[obj.vel[0].toPrecision(5),obj.vel[1].toPrecision(5)];
    let max_dis=Distance(Max,obj);
    ctx.fillText(`ID: ${obj.id}  | 质量: ${obj.mass}  |  位置: x=${posxy[0]} y=${posxy[1]}  |   速度: vx=${velxy[0]} vy=${velxy[1]}   |  距离最大星球: ${Max.id}的距离为：${max_dis}`,10,(index+1)*15);

}
//draw(A.pos,A.r());
//Attract(A,B);
function Arrow_all (){
    for(let i=0;i<plants.length;i++){
        Arrow(ctx,plants[i],Max);
    }
}
function Arrow(ctx,ob1,ob2){
    drawArrow(ctx,ob1.pos[0],ob1.pos[1],ob2.pos[0],ob2.pos[1]);
}
function drawArrow(ctx, fromX, fromY, toX, toY,theta=30,headlen=10,width=0.5,color='black') {
    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
    ctx.save();
    ctx.beginPath();
    var arrowX = fromX - topX,
        arrowY = fromY - topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}
function Distance(ob1,ob2){
    let direction=[ob2.pos[0]-ob1.pos[0],ob2.pos[1]-ob1.pos[1]];
        //console.log("direction:",direction);
    let distance=Math.sqrt(direction[1]*direction[1]+direction[0]*direction[0]).toPrecision(7);
    return distance
    //ctx.fillText(`星体${ob2.id}号与${ob1.id}号距离为:  ${distance}`,10,(ob2.id+3)*30);
    //if(distance>400){
       // ob1.mass=100000;
   // }
    //if(distance<200){
    //    ob1.mass=105;
    //}
}
let frame_id;
function setup(){
    frame_id=requestAnimationFrame(()=>{
    ctx.clearRect(0,0,width,height);
    Power();
    Translate(Max,plants);
    //Arrow_all();
    //Arrow(ctx,B,A);
    //Arrow(ctx,C,A);
    Distance(A,B);
    //Distance(A,C);
    //if(a++<30){
        setup();
    //}
    //if(a++>50){
        //cancelAnimationFrame(frame_id);
    //}
    })
 }
 setup();

