// Aptitude Quest: Mental Math Gym. Plain <script src> (works on file://).
// Each trick has a short lesson and a generator: make(rng, level 1-3) -> item
// item = {trick, q (display), a (answer), dp? (accept rounding to dp), rel? (accept within rel, for estimates),
//         note? (shown under the question), how:[step strings], expr (independent JS expression for testing)}
(function(){
"use strict";
const mulberry=seed=>{let h=seed>>>0;return()=>{h=h+0x6D2B79F5|0;let t=Math.imul(h^h>>>15,1|h);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const R=(r,a,b)=>a+Math.floor(r()*(b-a+1));
const P=(r,arr)=>arr[Math.floor(r()*arr.length)];
const rnd=(x,dp)=>{const f=10**dp;return Math.round((x+Number.EPSILON*Math.sign(x))*f)/f};
const f=x=>rnd(x,4).toLocaleString("en-US",{maximumFractionDigits:4});       // display with thousands separators
const isInt=x=>Math.abs(x-Math.round(x))<1e-9;
const swap=(r,a,b)=>r()<.5?[a,b]:[b,a];
const sgn=x=>x<0?"−"+f(-x):f(x);

const T=[
// ---------------- Multiplication shortcuts ----------------
{id:"x5",cat:"Multiplication shortcuts",name:"Multiply by 5, 25 and 125",
 lesson:{idea:"5, 25 and 125 are 10, 100 and 1000 divided by 2, 4 and 8. Multiplying by a power of ten is free, so swap the hard multiplication for an easy division.",
  steps:["× 5 → × 10, then ÷ 2","× 25 → × 100, then ÷ 4 (halve twice)","× 125 → × 1000, then ÷ 8 (halve three times)"],
  watch:"Halve carefully: 3,700 ÷ 4 is 925 (halve to 1,850, then to 925)."},
 make(r,lv){const m=[5,25,125][lv-1],n=lv===3?R(r,8,96):R(r,12,98),p=m*({5:2,25:4,125:8})[m],d=p/m,[x,y]=swap(r,n,m),a=n*m;
  return{q:`${f(x)} × ${f(y)}`,a,expr:`${n}*${m}`,how:[`× ${m} is the same as × ${f(p)} ÷ ${d}.`,`${n} × ${f(p)} = ${f(n*p)}`,`${f(n*p)} ÷ ${d} = ${f(a)}`]}}},

{id:"x11",cat:"Multiplication shortcuts",name:"Multiply by 11",
 lesson:{idea:"Multiplying by 11 is the number times 10 plus the number itself, which shows up as adding neighbouring digits.",
  steps:["2-digit number ab: write a, then a + b, then b","If a + b is 10 or more, write the last digit and carry 1 to the front","3-digit numbers: last digit, then each neighbour sum moving left, carrying as you go"],
  watch:"Don't forget the carry: 78 × 11 → 7 | 15 | 8 → 858, not 7158."},
 make(r,lv){let n;
  if(lv===1){do n=R(r,12,98);while(Math.floor(n/10)+n%10>=10||n%10===0)}else if(lv===2){do n=R(r,19,99);while(Math.floor(n/10)+n%10<10)}else n=R(r,102,989);
  const a=n*11,[x,y]=swap(r,n,11);let how;
  if(n<100){const d1=Math.floor(n/10),d2=n%10,s=d1+d2;
   how=s<10?[`Split ${n} into ${d1} … ${d2}.`,`Put ${d1} + ${d2} = ${s} in the middle.`,`${d1} | ${s} | ${d2} → ${f(a)}`]
           :[`Middle: ${d1} + ${d2} = ${s}: write ${s%10}, carry 1.`,`Front: ${d1} + 1 = ${d1+1}.`,`${d1+1} | ${s%10} | ${d2} → ${f(a)}`]}
  else{const A=Math.floor(n/100),B=Math.floor(n/10)%10,C=n%10;
   how=[`Last digit stays: ${C}.`,`Neighbour sums, right to left: ${B} + ${C} = ${B+C}, then ${A} + ${B} = ${A+B} (carry any tens left).`,`Front: ${A} plus any carry.`,`Result: ${f(a)} (check: ${f(n*10)} + ${n}).`]}
  return{q:`${f(x)} × ${f(y)}`,a,expr:`${n}*11`,how}}},

{id:"x9",cat:"Multiplication shortcuts",name:"Multiply by 9, 99 and 999",
 lesson:{idea:"9 is 10 − 1, 99 is 100 − 1 and 999 is 1000 − 1. Multiply by the round number, then take the original number away.",
  steps:["× 9 → × 10, minus the number","× 99 → × 100, minus the number","× 999 → × 1000, minus the number"],
  watch:"Subtract the original number, not 1: 46 × 99 = 4,600 − 46 = 4,554."},
 make(r,lv){const m=[9,99,999][lv-1],n=R(r,12,99),a=n*m,[x,y]=swap(r,n,m);
  return{q:`${f(x)} × ${f(y)}`,a,expr:`${n}*${m}`,how:[`× ${m} = × ${f(m+1)} − × 1.`,`${n} × ${f(m+1)} = ${f(n*(m+1))}`,`${f(n*(m+1))} − ${n} = ${f(a)}`]}}},

{id:"split",cat:"Multiplication shortcuts",name:"Split and multiply",
 lesson:{idea:"Break one number into friendly parts (tens and units), multiply each part, then add. This is how most people do 2-digit multiplication in their head.",
  steps:["Split the harder number: 36 → 30 + 6","Multiply each part by the other number","Add the partial products"],
  watch:"Keep the partial products in mind in order; say them out loud if it helps."},
 make(r,lv){let a,b,how;
  if(lv===1){do a=R(r,12,98);while(a%10===0);b=R(r,3,9);const t=a-a%10,u=a%10;
   how=[`Split ${a} into ${t} + ${u}.`,`${t} × ${b} = ${t*b}`,`${u} × ${b} = ${u*b}`,`${t*b} + ${u*b} = ${a*b}`]}
  else if(lv===2){do a=R(r,13,49);while(a%10===0);b=R(r,11,19);const u=b-10;
   how=[`Split ${b} into 10 + ${u}.`,`${a} × 10 = ${a*10}`,`${a} × ${u} = ${a*u}`,`${a*10} + ${a*u} = ${f(a*b)}`]}
  else{do a=R(r,112,989);while(a%10===0);b=R(r,3,9);const h=a-a%100,t=a%100-a%10,u=a%10;
   how=[`Split ${a} into ${h} + ${t} + ${u}.`,`${h}×${b} = ${f(h*b)}, ${t}×${b} = ${t*b}, ${u}×${b} = ${u*b}`,`${f(h*b)} + ${t*b} + ${u*b} = ${f(a*b)}`]}
  const [x,y]=swap(r,a,b);return{q:`${f(x)} × ${f(y)}`,a:a*b,expr:`${a}*${b}`,how}}},

{id:"halfdouble",cat:"Multiplication shortcuts",name:"Halve and double",
 lesson:{idea:"Halving one number and doubling the other keeps the product the same. Keep going until one number becomes round.",
  steps:["Halve the even number, double the one ending in 5","Repeat if the doubled number still isn't round","Multiply the easy pair"],
  watch:"Only halve a number that is even, or you'll create decimals."},
 make(r,lv){const b=lv===1?P(r,[15,35,45,25]):lv===2?25:125,need=lv===1?2:lv===2?4:8;let a;do a=need*R(r,3,lv===3?9:12);while(a%10===0&&lv===1);
  let x=a,y=b;const how=[];while(x%2===0&&y%100!==0&&y%1000!==0&&(y%10!==0||lv>1&&y%100!==0)){how.push(`${f(x)} × ${f(y)} → halve and double → ${f(x/2)} × ${f(y*2)}`);x/=2;y*=2;if(lv===1&&y%10===0)break}
  how.push(`${f(x)} × ${f(y)} = ${f(a*b)}`);const [p,q]=swap(r,a,b);return{q:`${f(p)} × ${f(q)}`,a:a*b,expr:`${a}*${b}`,how}}},

{id:"near100",cat:"Multiplication shortcuts",name:"Numbers near 100",
 lesson:{idea:"For two numbers close to 100, work with their distances from 100. Cross-adjust one number by the other's distance, then add the product of the distances.",
  steps:["Find each distance from 100 (below = negative, above = positive)","Cross-adjust: one number plus the other's distance, × 100","Add the product of the two distances"],
  watch:"When one is above and one below, the distance product is negative, so subtract it: 104 × 97 = 10,100 − 12 = 10,088."},
 make(r,lv){let a,b;if(lv===1){a=R(r,88,99);b=R(r,88,99)}else if(lv===2){a=R(r,101,115);b=R(r,101,115)}else{a=R(r,101,112);b=R(r,88,99)}
  const da=a-100,db=b-100,ans=a*b,[x,y]=swap(r,a,b);
  return{q:`${x} × ${y}`,a:ans,expr:`${a}*${b}`,how:[`Distances from 100: ${sgn(da)} and ${sgn(db)}.`,`Cross-adjust: ${a} ${db<0?"−":"+"} ${Math.abs(db)} = ${a+db} → ${f((a+db)*100)}`,`Distances multiplied: ${sgn(da)} × ${sgn(db)} = ${sgn(da*db)}`,`${f((a+db)*100)} ${da*db<0?"−":"+"} ${Math.abs(da*db)} = ${f(ans)}`]}}},

{id:"diffsq",cat:"Multiplication shortcuts",name:"Difference of squares",
 lesson:{idea:"When two numbers sit the same distance either side of a round number, (m − d)(m + d) = m² − d².",
  steps:["Find the midpoint m (a round number)","Find the distance d from m to each number","Answer = m² − d²"],
  watch:"It only works when the numbers are equally far from the midpoint: 47 × 53 yes, 47 × 54 no."},
 make(r,lv){const m=lv===1?P(r,[20,30,40,50]):lv===2?P(r,[60,70,80,90]):P(r,[100,200,110,120]),d=R(r,1,lv===1?5:9),[x,y]=swap(r,m-d,m+d),a=m*m-d*d;
  return{q:`${x} × ${y}`,a,expr:`${m-d}*${m+d}`,how:[`${m-d} and ${m+d} are both ${d} away from ${m}.`,`(m − d)(m + d) = m² − d²`,`${m}² − ${d}² = ${f(m*m)} − ${d*d} = ${f(a)}`]}}},

// ---------------- Squares ----------------
{id:"sq5",cat:"Squares",name:"Squaring numbers ending in 5",
 lesson:{idea:"To square a number ending in 5, multiply the front part by the next number up and write 25 after it.",
  steps:["Drop the 5: 65 → 6","Multiply by the next number: 6 × 7 = 42","Write 25 at the end: 4,225","Works for x.5 too: 7.5² = 7 × 8 = 56, then .25 → 56.25"],
  watch:"Use the front part plus one, not plus five: 85² → 8 × 9 = 72 → 7,225."},
 make(r,lv){if(lv===3){const x=R(r,1,15),a=(x+.5)**2;return{q:`${x}.5²`,a,expr:`${x}.5*${x}.5`,how:[`Front part ${x}; next number ${x+1}.`,`${x} × ${x+1} = ${x*(x+1)}`,`Add .25: ${f(a)}`]}}
  const k=lv===1?R(r,1,9):R(r,10,19),n=10*k+5,a=n*n;
  return{q:`${n}²`,a,expr:`${n}*${n}`,how:[`Drop the 5: front part ${k}.`,`${k} × ${k+1} = ${k*(k+1)}`,`Write 25 after it: ${f(a)}`]}}},

{id:"sqnear",cat:"Squares",name:"Squares near a round number",
 lesson:{idea:"n² = (n − d)(n + d) + d². Pick d so that one factor is a round number: 48² = 50 × 46 + 2² = 2,304.",
  steps:["Move n to the nearest multiple of 10 (a shift of d)","Move it the same distance the other way","Multiply those two numbers","Add d²"],
  watch:"Always add d², even when you rounded down: 52² = 50 × 54 + 4 = 2,704."},
 make(r,lv){let n;do n=lv===1?R(r,21,49):lv===2?R(r,51,99):R(r,101,129);while(n%10===0);
  const m=Math.round(n/10)*10,d=m-n,o=n-d,a=n*n;
  return{q:`${n}²`,a,expr:`${n}*${n}`,how:[`Round ${n} to ${m} (a shift of ${Math.abs(d)}).`,`Shift the other way: ${o}.`,`${m} × ${o} = ${f(m*o)}`,`Add ${Math.abs(d)}² = ${d*d}: ${f(a)}`]}}},

{id:"facts",cat:"Squares",name:"Squares and cubes to know by heart",
 lesson:{idea:"Knowing squares to 30 and cubes to 12 lets you spot patterns instantly in DI and number series questions.",
  steps:["(10 + u)² = 100 + 20u + u²: 14² = 100 + 80 + 16 = 196","(20 + u)² = 400 + 40u + u²: 23² = 400 + 120 + 9 = 529","Cubes to learn: 8, 27, 64, 125, 216, 343, 512, 729, 1,000, 1,331, 1,728"],
  watch:"Squares end only in 0, 1, 4, 5, 6 or 9; if your answer ends in 2, 3, 7 or 8, it's wrong."},
 make(r,lv){if(lv===3){const n=R(r,2,12),a=n**3;return{q:`${n}³`,a,expr:`${n}*${n}*${n}`,how:[`${n}³ = ${n} × ${n} × ${n}`,`${n} × ${n} = ${n*n}; ${n*n} × ${n} = ${f(a)}`]}}
  const n=lv===1?R(r,11,20):R(r,21,30),t=n-n%10,u=n%10,a=n*n;
  return{q:`${n}²`,a,expr:`${n}*${n}`,how:[`(${t} + ${u})² = ${t}² + 2×${t}×${u} + ${u}²`,`${t*t} + ${2*t*u} + ${u*u} = ${a}`]}}},

// ---------------- Add & subtract ----------------
{id:"compensate",cat:"Add & subtract",name:"Round and compensate",
 lesson:{idea:"Adding or subtracting numbers like 98, 199 or 1,998 is easier if you use the round number and then correct.",
  steps:["Round the awkward number to the nearest hundred or thousand","Add or subtract the round number","Correct by the amount you rounded"],
  watch:"Correct in the right direction: − 198 = − 200 + 2 (you took away too much, so give 2 back)."},
 make(r,lv){const b=lv===1?P(r,[99,98,97,199,198,298]):lv===2?P(r,[99,98,197,198,299,396]):P(r,[999,998,1998,2997,1999,997]);
  const sub=lv===1?false:lv===2?true:r()<.5,c=Math.ceil(b/100)*100,k=c-b,a0=lv===3?R(r,Math.max(2100,b+600),9899):R(r,b+120,999);
  const ans=sub?a0-b:a0+b;
  return{q:`${f(a0)} ${sub?"−":"+"} ${f(b)}`,a:ans,expr:`${a0}${sub?"-":"+"}${b}`,how:[`${f(b)} = ${f(c)} − ${k}.`,`${f(a0)} ${sub?"−":"+"} ${f(c)} = ${f(sub?a0-c:a0+c)}`,sub?`You took ${k} too many, so add it back: ${f(ans)}`:`You added ${k} too many, so take it off: ${f(ans)}`]}}},

{id:"sub1000",cat:"Add & subtract",name:"Subtract from 100, 1,000, 10,000",
 lesson:{idea:"Take every digit from 9, except the last, which you take from 10. No borrowing needed.",
  steps:["1,000 − 367: 9 − 3 = 6, 9 − 6 = 3, 10 − 7 = 3","Answer: 633","Works for any power of ten (match the number of digits)"],
  watch:"If the number ends in 0, ignore the trailing zeros and apply the rule to the digit before them."},
 make(r,lv){const P10=[100,1000,10000][lv-1];let n;do n=R(r,P10/10+1,P10-1);while(n%10===0);
  const s=String(n),ans=P10-n,steps=s.split("").map((d,i)=>i<s.length-1?`9 − ${d} = ${9-d}`:`10 − ${d} = ${10-d}`).join(", ");
  return{q:`${f(P10)} − ${f(n)}`,a:ans,expr:`${P10}-${n}`,how:["Each digit from 9, the last digit from 10.",steps,`Answer: ${f(ans)}`]}}},

// ---------------- Percentages & fractions ----------------
{id:"pctbuild",cat:"Percentages & fractions",name:"Build any percentage from 10%, 5% and 1%",
 lesson:{idea:"10% is a decimal shift, 5% is half of that, and 1% is another decimal shift. Most percentages are a sum of these.",
  steps:["10% of Y: move the decimal one place left","5% = half of 10%; 1% = 10% ÷ 10; 0.5% = half of 1%","Add the pieces: 35% = 3 × 10% + 5%"],
  watch:"Write each piece down mentally before adding; 17.5% = 10% + 5% + 2.5%."},
 make(r,lv){let p,y,a;
  do{p=lv===1?P(r,[10,20,30,5,15,50]):lv===2?P(r,[12,35,45,65,8,18,24]):P(r,[17.5,12.5,2.5,37.5,22.5,7.5]);y=(lv===3?40:20)*R(r,2,45);a=p*y/100}while(!isInt(a*10));
  const ten=y/10,parts=[];let rem=p;const tens=Math.floor(rem/10);if(tens)parts.push([`${tens} × 10%`,tens*ten]);rem-=tens*10;
  if(rem>=5){parts.push(["5%",ten/2]);rem-=5}const ones=Math.floor(rem+1e-9);if(ones)parts.push([`${ones} × 1%`,ones*y/100]);rem-=ones;if(rem>1e-9)parts.push(["0.5%",y/200]);
  return{q:`${p}% of ${f(y)}`,a,expr:`${p}/100*${y}`,how:[`10% of ${f(y)} = ${f(ten)}; 1% = ${f(y/100)}.`,`${p}% = ${parts.map(x=>x[0]).join(" + ")}`,`${parts.map(x=>f(x[1])).join(" + ")} = ${f(a)}`]}}},

{id:"pctswap",cat:"Percentages & fractions",name:"Swap the percentage",
 lesson:{idea:"x% of y equals y% of x. 8% of 25 looks hard, but 25% of 8 is just a quarter of 8 = 2.",
  steps:["Spot that the second number is a 'friendly' percentage (25, 50, 20, 75, 12.5 …)","Swap: take that percentage of the first number instead","Use the matching fraction: 25% = ¼, 20% = ⅕, 12.5% = ⅛"],
  watch:"The swap works because x/100 × y = y/100 × x; it's always valid, so use it whenever one side is friendlier."},
 make(r,lv){const F={50:["half",2,1],25:["a quarter",4,1],20:["a fifth",5,1],10:["a tenth",10,1],75:["three quarters",4,3],40:["two fifths",5,2],60:["three fifths",5,3],12.5:["an eighth",8,1],37.5:["three eighths",8,3],62.5:["five eighths",8,5]};
  const y=lv===1?P(r,[50,25,20]):lv===2?P(r,[75,40,60,25]):P(r,[12.5,37.5,62.5]),[nm,den,num]=F[y];let x;do x=den*R(r,2,24);while(x>=100||x===y||x%10===0);const a=x*y/100;
  return{q:`${x}% of ${f(y)}`,a,expr:`${x}/100*${y}`,how:[`${x}% of ${f(y)} = ${f(y)}% of ${x}.`,`${f(y)}% is ${nm}.`,`${nm[0].toUpperCase()+nm.slice(1)} of ${x} = ${x} ÷ ${den}${num>1?` × ${num}`:""} = ${f(a)}`]}}},

{id:"fracpct",cat:"Percentages & fractions",name:"Fractions as percentages",
 lesson:{idea:"Memorise the unit fractions, then multiply. 1/8 = 12.5%, so 3/8 = 37.5%.",
  steps:["Halves to tenths: 1/2 = 50%, 1/4 = 25%, 1/5 = 20%, 1/10 = 10%","1/8 = 12.5%, 1/3 ≈ 33.33%, 1/6 ≈ 16.67%, 1/9 ≈ 11.11%","1/7 ≈ 14.29%, 1/11 ≈ 9.09%, 1/12 ≈ 8.33%","Multiply the unit fraction by the numerator"],
  watch:"For repeating decimals, multiply the exact fraction, not a rounded one: 5/6 = 83.33%, not 5 × 16.7 = 83.5%."},
 make(r,lv){const d=lv===1?P(r,[2,4,5,10,20]):lv===2?P(r,[8,3,6,25,40]):P(r,[7,9,11,12,16]);const g=(x,y)=>y?g(y,x%y):x;let n;do n=R(r,1,d-1);while(g(n,d)!==1);
  const base=100/d,a=n*base,rep=!isInt(a*100),dp=rep?1:undefined;
  return{q:`${n}/${d} = ?%`,a,dp,note:rep?"to 1 decimal place":undefined,expr:`${n}/${d}*100`,how:[`1/${d} = ${rep?"≈ ":""}${f(rnd(base,2))}%`,`${n} × 1/${d} = ${n} × 100/${d} = ${rep?"≈ ":""}${f(rnd(a,2))}%`]}}},

{id:"succpct",cat:"Percentages & fractions",name:"Successive percentage changes",
 lesson:{idea:"Two changes in a row don't simply add. Net % change = a + b + (a × b)/100, with falls written as negatives.",
  steps:["Write rises as + and falls as −","Add them: a + b","Add the interaction term (a × b)/100","+20% then −20% → 20 − 20 − 4 = −4% (a 4% fall)"],
  watch:"The interaction term carries the sign of a × b: a rise and a fall always make it negative."},
 make(r,lv){const pool=lv===1?[10,20,30,40,50]:lv===2?[5,10,15,20,25,30]:[4,6,8,12,16,24];
  const a=P(r,pool)*(lv===1&&r()<.3?1:1),b=P(r,pool)*(r()<.65?-1:1),ab=a*b/100,ans=a+b+ab;
  return{q:`+${a}% then ${b<0?"−":"+"}${Math.abs(b)}%`,a:ans,dp:isInt(ans)?undefined:2,note:"net % change (use − for a fall)",expr:`((1+${a}/100)*(1+(${b})/100)-1)*100`,
   how:[`Net = a + b + (a × b)/100`,`${a} + (${sgn(b)}) + (${a} × ${sgn(b)})/100 = ${sgn(a+b)} + (${sgn(ab)})`,`= ${sgn(ans)}%, ${ans<0?"a fall":ans>0?"a rise":"no change"}`]}}},

// ---------------- Division & estimation ----------------
{id:"div5",cat:"Division & estimation",name:"Divide by 5, 25 and 125",
 lesson:{idea:"Dividing by 5, 25 or 125 is the same as multiplying by 2, 4 or 8 and then dividing by 10, 100 or 1000.",
  steps:["÷ 5 → × 2, then ÷ 10","÷ 25 → × 4, then ÷ 100","÷ 125 → × 8, then ÷ 1000"],
  watch:"Move the decimal point the right number of places: 340 ÷ 25 = 1,360 ÷ 100 = 13.6."},
 make(r,lv){const m=[5,25,125][lv-1],k=({5:2,25:4,125:8})[m],p=m*k;let n;do n=R(r,lv===1?23:110,lv===1?499:2999);while(n%m===0);const a=n/m;
  return{q:`${f(n)} ÷ ${m}`,a,expr:`${n}/${m}`,how:[`÷ ${m} = × ${k} ÷ ${f(p)}.`,`${f(n)} × ${k} = ${f(n*k)}`,`${f(n*k)} ÷ ${f(p)} = ${f(a)}`]}}},

{id:"estimate",cat:"Division & estimation",name:"Estimate fast (for DI)",
 lesson:{idea:"In data interpretation you rarely need the exact figure; you need the closest option. Round to 2 significant figures, compute, and judge the direction of the error.",
  steps:["Round each number to 2 significant figures: 4,870 → 4,900; 0.312 → 0.31","Multiply or divide the rounded numbers","If you rounded one up and the other down, the errors partly cancel"],
  watch:"Percentages of big numbers: 23.7% of 8,460 ≈ 24% of 8,500 ≈ ¼ of 8,500 minus a bit ≈ 2,000."},
 make(r,lv){const s2=x=>{const p=10**(Math.floor(Math.log10(Math.abs(x)))-1);return Math.round(x/p)*p};let q,a,expr,how,rel;
  if(lv===1){const x=R(r,23,97),y=R(r,23,97);a=x*y;rel=.1;expr=`${x}*${y}`;q=`${x} × ${y}`;const rx=Math.round(x/10)*10,ry=Math.round(y/10)*10;how=[`Round: ${rx} × ${ry} = ${f(rx*ry)}.`,`Exact: ${f(a)}; anything within 10% counts.`]}
  else if(lv===2){const x=R(r,1200,9800),y=rnd(R(r,12,88)/100+R(r,1,9)/1000,3);a=x*y;rel=.05;expr=`${x}*${y}`;q=`${f(x)} × ${y}`;how=[`Round: ${f(s2(x))} × ${f(s2(y))} = ${f(rnd(s2(x)*s2(y),2))}.`,`Exact: ${f(rnd(a,2))}; anything within 5% counts.`]}
  else{const p=rnd(R(r,110,480)/10,1),y=R(r,2100,9900);a=p*y/100;rel=.05;expr=`${p}/100*${y}`;q=`${p}% of ${f(y)}`;how=[`Round: ${s2(p)}% of ${f(s2(y))} = ${f(rnd(s2(p)*s2(y)/100,1))}.`,`Exact: ${f(rnd(a,1))}; anything within 5% counts.`]}
  return{q,a,rel,note:`estimate: within ${rel*100}%`,expr,how}}}
];

const CATS=[...new Set(T.map(t=>t.cat))];
function make(id,level,seed){const t=T.find(x=>x.id===id);if(!t)return null;const r=seed==null?Math.random:mulberry(seed);
  const it=t.make(r,Math.min(3,Math.max(1,level||1)));it.trick=id;it.level=level||1;return it}
function check(it,raw){const s=String(raw).replace(/,/g,"").replace(/−/g,"-").trim();if(!/^-?\d*\.?\d+$|^-?\d+\.$/.test(s))return false;const v=parseFloat(s);
  if(it.rel)return Math.abs(v-it.a)<=it.rel*Math.abs(it.a)+1e-9;
  if(it.dp!=null)return Math.abs(rnd(v,it.dp)-rnd(it.a,it.dp))<1e-9||Math.abs(v-it.a)<1e-9;
  return Math.abs(v-it.a)<1e-9}
const fmtAns=it=>it.dp!=null&&!isInt(it.a*10**it.dp)?"≈ "+sgn(rnd(it.a,it.dp)):it.rel?"≈ "+sgn(rnd(it.a,1)):sgn(it.a);
const api={tricks:T.map(t=>({id:t.id,name:t.name,cat:t.cat,lesson:t.lesson})),cats:CATS,make,check,fmtAns,
  examples:id=>[make(id,1,7),make(id,2,11)]};
if(typeof window!=="undefined")window.MM=api;
if(typeof module!=="undefined")module.exports=api;
})();
