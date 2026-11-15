import {useMemo,useRef,useState} from 'react';
import {X} from 'lucide-react';

type Token=number|string;
const factorial=(n:number)=>{if(!Number.isInteger(n)||n<0||n>170)throw Error('Factorial domain');let v=1;for(let i=2;i<=n;i++)v*=i;return v;};
function evaluate(source:string,deg:boolean):number{
 const input=source.replace(/π/g,'pi').replace(/×/g,'*').replace(/÷/g,'/');
 const tokens:Token[]=[];const re=/\s*(?:(\d+(?:\.\d*)?|\.\d+)(?:[eE]([+-]?\d+))?|([A-Za-z]+)|([+\-*/^()%!,]))/gy;let pos=0;
 while(pos<input.length){re.lastIndex=pos;const m=re.exec(input);if(!m)throw Error('Invalid expression');pos=re.lastIndex;if(m[1])tokens.push(Number(m[1]+(m[2]?'e'+m[2]:'')));else if(m[3])tokens.push(m[3].toLowerCase());else tokens.push(m[4]);}
 let i=0;const peek=()=>tokens[i],take=()=>tokens[i++];
 const angle=(x:number)=>deg?x*Math.PI/180:x,unangle=(x:number)=>deg?x*180/Math.PI:x;
 const funcs:Record<string,(x:number)=>number>={sin:x=>Math.sin(angle(x)),cos:x=>Math.cos(angle(x)),tan:x=>Math.tan(angle(x)),asin:x=>unangle(Math.asin(x)),acos:x=>unangle(Math.acos(x)),atan:x=>unangle(Math.atan(x)),sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,asinh:Math.asinh,acosh:Math.acosh,atanh:Math.atanh,log:Math.log10,ln:Math.log,log2:Math.log2,sqrt:Math.sqrt,cbrt:Math.cbrt,abs:Math.abs,exp:Math.exp,tenx:x=>10**x,inv:x=>1/x,square:x=>x*x,cube:x=>x*x*x,fact:factorial};
 function primary():number{const t=take();if(typeof t==='number')return t;if(t==='+'||t==='-'){const v=primary();return t==='-'?-v:v;}if(t==='('){const v=expression();if(take()!==')')throw Error('Missing )');return v;}if(typeof t==='string'&&['pi','e'].includes(t))return t==='pi'?Math.PI:Math.E;if(typeof t==='string'&&(t==='logy'||t==='yroot')){if(take()!=='(')throw Error('Expected (');const x=expression();if(take()!==',')throw Error('Expected comma');const y=expression();if(take()!==')')throw Error('Missing )');return t==='logy'?Math.log(x)/Math.log(y):x**(1/y);}if(typeof t==='string'&&t in funcs){if(take()!=='(')throw Error('Expected (');const v=expression();if(take()!==')')throw Error('Missing )');return funcs[t](v);}throw Error('Expected value');}
 function postfix():number{let v=primary();while(peek()==='!'){take();v=factorial(v);}return v;}
 function power():number{const a=postfix();if(peek()==='^'){take();return a**unary();}return a;}
 function unary():number{if(peek()==='+'){take();return unary();}if(peek()==='-'){take();return -unary();}return power();}
 function term():number{let v=unary();while(['*','/','mod','%'].includes(String(peek()))){const op=take(),b=unary();v=op==='*'?v*b:op==='/'?v/b:op==='%'?v*b/100:v%b;}return v;}
 function expression():number{let v=term();while(peek()==='+'||peek()==='-'){const op=take(),b=term();v=op==='+'?v+b:v-b;}return v;}
 const value=expression();if(i!==tokens.length||!Number.isFinite(value))throw Error('Math error');return value;
}
const scientific=[['sinh','cosh','tanh','Exp','(',')'],['asinh','acosh','atanh','log2','ln','log'],['pi','e','fact','logy','e^x','10^x'],['sin','cos','tan','x^y','x^3','x^2'],['asin','acos','atan','yroot','cbrt','abs']];
const basic=[['⌫','C','±','sqrt'],['7','8','9','/'],['4','5','6','*'],['1','2','3','-'],['0','.','+','=']];
const label:Record<string,string>={pi:'π','x^y':'xʸ','x^3':'x³','x^2':'x²',asin:'sin⁻¹',acos:'cos⁻¹',atan:'tan⁻¹',asinh:'sinh⁻¹',acosh:'cosh⁻¹',atanh:'tanh⁻¹',log2:'log₂x','10^x':'10ˣ','e^x':'eˣ',cbrt:'∛x',sqrt:'√x',fact:'n!',abs:'|x|',yroot:'ʸ√x',logy:'logᵧx'};
export function GateCalculator({onClose}:{onClose:()=>void}){
 const [expression,setExpression]=useState(''),[deg,setDeg]=useState(true),[memory,setMemory]=useState(0),[position,setPosition]=useState<{x:number;y:number}|null>(null);
 const drag=useRef<{dx:number;dy:number;pointer:number}|null>(null);
 const result=useMemo(()=>{try{return expression.trim()?evaluate(expression,deg):0;}catch{return NaN;}},[expression,deg]);
 const shown=Number.isFinite(result)?Number(result.toPrecision(12)).toString():'';
 const insert=(v:string)=>setExpression(x=>x+v);
 const unary=(fn:string)=>{const v=Number.isFinite(result)?shown:'0';setExpression(fn==='fact'?v+'!':fn==='abs'?'abs('+v+')':fn+'('+v+')');};
 const press=(k:string)=>{
  if(k==='C'){setExpression('');return;}if(k==='±'){if(Number.isFinite(result))setExpression(String(-result));return;}if(k==='⌫'){setExpression(x=>x.slice(0,-1));return;}if(k==='='){if(Number.isFinite(result))setExpression(shown);return;}
  if(k==='MC'){setMemory(0);return;}if(k==='MR'){insert(String(memory));return;}if(k==='MS'){if(Number.isFinite(result))setMemory(result);return;}if(k==='M+'){if(Number.isFinite(result))setMemory(x=>x+result);return;}if(k==='M-'){if(Number.isFinite(result))setMemory(x=>x-result);return;}
  if(['sin','cos','tan','asin','acos','atan','sinh','cosh','tanh','asinh','acosh','atanh','log','ln','log2','sqrt','cbrt','abs','fact','10^x','e^x'].includes(k)){unary(({ '10^x':'tenx','e^x':'exp'} as Record<string,string>)[k]||k);return;}
  if(k==='pi'||k==='e'){insert(k);return;}if(k==='x^2'||k==='x^3'){insert(k==='x^2'?'^2':'^3');return;}if(k==='x^y'){insert('^');return;}
  if(k==='yroot'||k==='logy'){const v=Number.isFinite(result)?shown:'0';setExpression(k+'('+v+',');return;}if(k==='1/x'){setExpression(x=>'1/('+x+')');return;}if(k==='Exp'){insert('*10^');return;}if(k==='mod'){insert('mod');return;}insert(k);
 };
 const down=(e:React.PointerEvent<HTMLElement>)=>{if((e.target as HTMLElement).closest('button'))return;drag.current={dx:e.clientX-(position?.x??Math.max(8,window.innerWidth/2-245)),dy:e.clientY-(position?.y??Math.max(8,window.innerHeight/2-280)),pointer:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId);};
 const move=(e:React.PointerEvent<HTMLElement>)=>{if(!drag.current||drag.current.pointer!==e.pointerId)return;const width=Math.min(490,window.innerWidth-16),height=Math.min(720,window.innerHeight-16);setPosition({x:Math.max(8,Math.min(window.innerWidth-width,e.clientX-drag.current.dx)),y:Math.max(8,Math.min(window.innerHeight-height,e.clientY-drag.current.dy))});};
 const up=(e:React.PointerEvent<HTMLElement>)=>{if(drag.current?.pointer===e.pointerId)drag.current=null;};
 return <div className="gate-scientific-calculator" role="dialog" aria-label="GATE virtual scientific calculator" style={position?{left:position.x,top:position.y,transform:'none'}:undefined}>
  <header onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><div><strong>Scientific Calculator</strong><small>GATE virtual calculator</small></div><button className="adm-icon-btn" aria-label="Close calculator" onClick={onClose}><X size={17}/></button></header>
  <div className="gate-calc-display"><div aria-label="Expression">{expression||'0'}</div><output aria-label="Result">{shown|| (expression?'Error':'0')}</output></div>
  <div className="gate-calc-mode"><button onClick={()=>press('mod')}>mod</button><button className={deg?'selected':''} onClick={()=>setDeg(true)}>Deg</button><button className={!deg?'selected':''} onClick={()=>setDeg(false)}>Rad</button><span>{memory}</span>{['MC','MR','MS','M+','M-'].map(k=><button key={k} onClick={()=>press(k)}>{k}</button>)}</div>
  <div className="gate-calc-layout"><div className="gate-calc-scientific">{scientific.flat().map(k=><button key={k} onClick={()=>press(k)}>{label[k]||k}</button>)}</div><div className="gate-calc-basic">{basic.flat().map(k=><button key={k} className={['=','+','-','*','/'].includes(k)?'operator':''} onClick={()=>press(k)}>{label[k]||k}</button>)}</div></div>
 </div>;
}
