// Aptitude Quest: Quant question generator. Loaded with a plain <script src> (works on file://).
// Each template draws fresh numbers, computes the answer in code, and builds three distractors from
// specific common mistakes, with a reason for every option (why[i] matches o[i]).
// Generated items: {id, lkey:"gen:<template>", gen:true, topic:"Quant", difficulty, q, o, a, e, tip, why, p}
(function(){
"use strict";
const mulberry=seed=>{let h=seed>>>0;return()=>{h=h+0x6D2B79F5|0;let t=Math.imul(h^h>>>15,1|h);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const R=(r,a,b)=>a+Math.floor(r()*(b-a+1));             // integer in [a,b]
const P=(r,arr)=>arr[Math.floor(r()*arr.length)];
const rnd=(x,dp)=>{const f=10**dp;return Math.round((x+Number.EPSILON)*f)/f};
const num=(x,dp=2)=>rnd(x,dp).toLocaleString("en-US",{maximumFractionDigits:dp});
const money=x=>{const v=rnd(x,2);return"$"+(Number.isInteger(v)?v.toLocaleString("en-US"):v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}))};
const pct=(x,dp=1)=>num(x,dp)+"%";
const pct2=x=>rnd(x,2).toFixed(2)+"%";
const change=x=>{const v=rnd(x,2);return v===0?"No change":num(Math.abs(v),2)+"% "+(v>0?"increase":"decrease")};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const ratio=(x,y)=>{const g=gcd(x,y);return`${x/g}:${y/g}`};
const isInt=x=>Math.abs(x-Math.round(x))<1e-9;
// Pairs (a,b) with ab/(a+b) = c exactly: (a−c)(b−c) = c², so pick a divisor d of c².
const pairFor=(r,c)=>{const ds=[];for(let d=1;d<=c*c;d++)if(c*c%d===0)ds.push(d);const d=P(r,ds);return[c+d,c+c*c/d]};
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

// Each make(r) returns {difficulty,q,ans:[text,why],wrong:[[text,why]x3],e,tip,p} or null to redraw.
const T=[
{id:"pct-of",name:"Percentage of a value",d:1,make(r){
  const x=P(r,[12,15,18,24,35,45,65,75,85]),y=R(r,6,48)*20,c=x*y/100;if(!isInt(c))return null;
  return{q:`What is ${x}% of ${money(y)}?`,ans:[money(c),`Correct: ${x}/100 × ${money(y)} = ${money(c)}.`],
  wrong:[[money(c*10),`Decimal slip: treating ${x}% as ${x}/10 instead of ${x}/100.`],
         [money(c/10),`Decimal slip the other way: dividing by 1,000 instead of 100.`],
         [money(y-c),`That is the remaining ${100-x}%, not the ${x}% asked for.`]],
  e:`${x}% of ${money(y)} = ${y} × ${x} / 100 = ${money(c)}.`,tip:`Find 10% (move the decimal one place), then scale: ${x}% = ${x/10} × 10%.`,p:{x,y}}}},

{id:"pct-change",name:"Percentage change (base value)",d:1,make(r){
  const a=R(r,2,20)*20,p=P(r,[5,10,12.5,15,20,25,30,35,40,50,60,75]),b=a*(1+p/100);if(!isInt(b))return null;
  return{q:`Quarterly revenue rose from $${a} thousand to $${b} thousand. What was the percentage increase?`,
  ans:[pct(p),`Correct: (${b} − ${a}) / ${a} × 100 = ${pct(p)}; the change is measured against the original value.`],
  wrong:[[pct((b-a)/b*100),`Wrong base: dividing the change by the new value (${b}) instead of the original (${a}).`],
         [pct(b-a,0),`Reports the absolute change ($${b-a} thousand) as if it were a percentage.`],
         [pct(b/a*100),`New value as a percentage of the old (${pct(b/a*100)}); subtract 100% to get the increase.`]],
  e:`Increase = ${b} − ${a} = ${b-a}. Percentage increase = ${b-a} / ${a} × 100 = ${pct(p)}.`,tip:`% change = change ÷ ORIGINAL × 100. Always divide by the starting value.`,p:{a,b}}}},

{id:"successive",name:"Successive percentage changes",d:2,make(r){
  const a=P(r,[5,10,12,15,20,25,30,40,50]),b=P(r,[5,10,12,15,20,25,30,40,50]),net=((1+a/100)*(1-b/100)-1)*100;
  return{q:`A product's price is increased by ${a}% and the new price is then reduced by ${b}%. What is the net change in price?`,
  ans:[change(net),`Correct: multiply the factors: ${1+a/100} × ${rnd(1-b/100,2)} = ${rnd(1+net/100,4)}, i.e. ${change(net)}.`],
  wrong:[[change(a-b),`Simply adding the percentages (${a} − ${b}) ignores that the ${b}% cut applies to a larger price.`],
         [change(-a*b/100),`Only the cross term (${a} × ${b} / 100); the ${a}% and ${b}% parts don't cancel unless they are equal.`],
         [change(-net),`Right size, wrong direction: check whether the final factor is above or below 1.`]],
  e:`Net factor = (1 + ${a}/100) × (1 − ${b}/100) = ${rnd(1+net/100,4)}, which is ${/^No/.test(change(net))?"no change":"a "+change(net)}.`,tip:`Successive changes multiply: net % = a + b + ab/100 (use −b for a decrease).`,p:{a,b}}}},

{id:"reverse-pct",name:"Reverse percentage",d:2,make(r){
  const o=R(r,20,90)*1000,p=P(r,[5,8,10,12,15,20,25]),n=o*(1+p/100);if(!isInt(n))return null;
  return{q:`After ${/^(8|11|18|80)/.test(String(p))?"an":"a"} ${p}% pay rise, an employee's annual salary is ${money(n)}. What was the salary before the rise?`,
  ans:[money(o),`Correct: ${money(n)} ÷ ${1+p/100} = ${money(o)}.`],
  wrong:[[money(n*(1-p/100)),`Takes ${p}% off the NEW salary; the rise was ${p}% of the old salary, so the base is wrong.`],
         [money(n/(1-p/100)),`Divides by (1 − ${p}%) as if undoing a cut, which moves the figure the wrong way.`],
         [money(n*(1+p/100)),`Applies the ${p}% rise a second time instead of reversing it.`]],
  e:`New = old × ${1+p/100}, so old = ${money(n)} ÷ ${1+p/100} = ${money(o)}.`,tip:`To undo an x% increase, divide by (1 + x/100); never subtract x% of the new figure.`,p:{n,p}}}},

{id:"pp-vs-pct",name:"Percentage points vs percent",d:2,make(r){
  const r1=P(r,[12,15,16,20,24,25,30,32,40,45,48,50,60,64,75]),d=P(r,[2,3,4,5,6,8,9,10,12,15]),r2=r1+d,c=d/r1*100;
  return{q:`The share of clients who renew their contract rose from ${r1}% to ${r2}%. By what percent did the renewal rate increase relative to its original level?`,
  ans:[pct(c),`Correct: the rate rose ${d} percentage points, and ${d} / ${r1} × 100 = ${pct(c)}.`],
  wrong:[[pct(d,0),`That is the change in percentage POINTS (${r2} − ${r1}), not the percent change.`],
         [pct(d/r2*100),`Wrong base: dividing by the new rate (${r2}%) instead of the original (${r1}%).`],
         [pct(r2/r1*100),`New rate as a percentage of the old; subtract 100% to get the increase.`]],
  e:`Change = ${r2} − ${r1} = ${d} percentage points. Relative increase = ${d} / ${r1} × 100 = ${pct(c)}.`,tip:`Difference of two percentages = percentage points; divide by the starting percentage to get percent change.`,p:{r1,r2}}}},

{id:"ratio-share",name:"Dividing in a ratio",d:1,make(r){
  const a=R(r,1,7),b=R(r,1,7),c=R(r,1,7);if(new Set([a,b,c]).size<3)return null;
  const s=a+b+c,u=R(r,2,30)*100,t=s*u,mx=Math.max(a,b,c),mn=Math.min(a,b,c);
  return{q:`A bonus pool of ${money(t)} is shared among three teams in the ratio ${a}:${b}:${c}. How much does the team with the largest share receive?`,
  ans:[money(mx*u),`Correct: ${s} parts in total, each worth ${money(u)}; the largest share is ${mx} parts = ${money(mx*u)}.`],
  wrong:[[money(t/3),`Splits the pool equally; the ratio means the shares are unequal.`],
         [money(t*mx/(s-mx)),`Divides by the OTHER parts (${s-mx}) instead of the total number of parts (${s}).`],
         [money(mn*u),`That is the smallest share (${mn} parts); misreads which team is asked for.`]],
  e:`Total parts = ${a} + ${b} + ${c} = ${s}; one part = ${money(t)} ÷ ${s} = ${money(u)}; largest = ${mx} × ${money(u)} = ${money(mx*u)}.`,tip:`Share = total × (its parts ÷ sum of all parts).`,p:{t,a,b,c}}}},

{id:"ratio-chain",name:"Combining ratios",d:2,make(r){
  const a=R(r,1,9),b=R(r,2,9),c=R(r,2,9),d=R(r,1,9);if(b===c||gcd(a,b)!==1||gcd(c,d)!==1)return null;
  const ans=ratio(a*c,b*d);
  return{q:`In a company, the ratio of analysts to managers is ${a}:${b}, and the ratio of managers to directors is ${c}:${d}. What is the ratio of analysts to directors?`,
  ans:[ans,`Correct: scale both ratios to a common number of managers (${b*c}): analysts ${a*c}, directors ${b*d}, so ${ans}.`],
  wrong:[[ratio(a,d),`Links the outer terms directly (${a}:${d}) without matching the managers term first.`],
         [ratio(a*d,b*c),`Cross-multiplies the wrong way (${a}×${d} : ${b}×${c}).`],
         [ratio(a+c,b+d),`Adds the ratio terms; ratios combine by scaling, not by addition.`]],
  e:`Make managers equal: A:M = ${a*c}:${b*c} and M:D = ${b*c}:${b*d}. So A:D = ${a*c}:${b*d}${ans===`${a*c}:${b*d}`?"":" = "+ans}.`,tip:`Chain ratios by making the shared term equal (multiply each ratio by the other's shared term).`,p:{a,b,c,d}}}},

{id:"sdt-units",name:"Distance with hours and minutes",d:1,make(r){
  const s=P(r,[36,40,45,48,54,60,72,75,80,90]),h=R(r,1,4),m=P(r,[12,15,20,24,30,36,40,45,48]),dist=s*(h+m/60);if(!isInt(dist*10))return null;
  return{q:`A delivery van travels at a constant ${s} km/h for ${h} hours ${m} minutes. How far does it travel?`,
  ans:[num(dist,1)+" km",`Correct: ${h} h ${m} min = ${num(h+m/60,3)} h, and ${s} × ${num(h+m/60,3)} = ${num(dist,1)} km.`],
  wrong:[[num(s*(h+m/100),1)+" km",`Unit error: treating ${h} h ${m} min as ${h}.${m} hours (minutes are sixtieths, not hundredths).`],
         [num(s*h,1)+" km",`Ignores the extra ${m} minutes.`],
         [num(s*h+m,1)+" km",`Adds the minutes straight onto the distance instead of converting them to hours.`]],
  e:`Time = ${h} + ${m}/60 = ${num(h+m/60,3)} h. Distance = ${s} × ${num(h+m/60,3)} = ${num(dist,1)} km.`,tip:`Convert minutes to hours by dividing by 60 before multiplying by a km/h speed.`,p:{s,h,m}}}},

{id:"avg-speed",name:"Average speed for a round trip",d:2,make(r){
  const pr=pairFor(r,R(r,10,40)),u=Math.min(...pr)*2,v=Math.max(...pr)*2,c=2*u*v/(u+v);if(u===v||u<20||v>130)return null;
  return{q:`A manager drives to a client site at ${u} km/h and returns along the same route at ${v} km/h. What is the average speed for the whole round trip?`,
  ans:[num(c,1)+" km/h",`Correct: total distance ÷ total time = 2 × ${u} × ${v} / (${u} + ${v}) = ${num(c,1)} km/h.`],
  wrong:[[num((u+v)/2,1)+" km/h",`Averages the two speeds; more time is spent at the slower speed, so the true average is lower.`],
         [num(u*v/(u+v),1)+" km/h",`Forgets the factor of 2 for the two legs of the trip.`],
         [num(Math.sqrt(u*v),1)+" km/h",`Geometric mean: sounds rigorous, but average speed is total distance over total time.`]],
  e:`For equal distances, average speed = 2uv/(u + v) = 2 × ${u} × ${v} / ${u+v} = ${num(c,1)} km/h.`,tip:`Equal distances at two speeds: use the harmonic mean 2uv/(u+v), never (u+v)/2.`,p:{u,v}}}},

{id:"trains",name:"Trains crossing (relative speed)",d:3,make(r){
  const v=P(r,[10,15,20,25,30]),tsec=R(r,6,24),tot=v*tsec;if(tot%20)return null;
  const sum=v*3.6,s1=R(r,Math.ceil(sum*0.3),Math.floor(sum*0.7)),s2=sum-s1;if(s1===s2||!isInt(s1)||Math.min(s1,s2)<30)return null;
  const l1=R(r,6,tot/10-6)*10,l2=tot-l1;if(l1<60||l2<60)return null;
  return{q:`Two trains, ${l1} m and ${l2} m long, run on parallel tracks in opposite directions at ${s1} km/h and ${s2} km/h. How many seconds do they take to cross each other completely?`,
  ans:[num(tsec,1)+" s",`Correct: relative speed ${sum} km/h = ${v} m/s; distance ${tot} m; time ${tot}/${v} = ${tsec} s.`],
  wrong:[[num(tot/(Math.abs(s1-s2)/3.6),1)+" s",`Subtracts the speeds; that is for trains moving in the SAME direction.`],
         [num(tot/sum,1)+" s",`Unit error: uses ${sum} km/h as if it were m/s (multiply km/h by 5/18 first).`],
         [num(l1/v,1)+" s",`Uses only one train's length; crossing completely covers both lengths.`]],
  e:`Opposite directions: speeds add, ${s1} + ${s2} = ${sum} km/h = ${sum} × 5/18 = ${v} m/s. Distance = ${l1} + ${l2} = ${tot} m. Time = ${tot} / ${v} = ${tsec} s.`,tip:`Opposite directions: add speeds; same direction: subtract. Convert km/h to m/s with × 5/18.`,p:{l1,l2,s1,s2}}}},

{id:"work-together",name:"Working together",d:1,make(r){
  const [a,b]=pairFor(r,R(r,3,24)),c=a*b/(a+b);if(a===b||Math.max(a,b)>90)return null;
  return{q:`Analyst A can complete a report in ${a} days and analyst B in ${b} days. Working together at the same rates, how many days will they take?`,
  ans:[num(c,2)+" days",`Correct: combined rate 1/${a} + 1/${b} = 1/${num(c,2)} of the report per day.`],
  wrong:[[num((a+b)/2,2)+" days",`Averages the two times; working together must be faster than either person alone.`],
         [num(a+b,2)+" days",`Adds the times, which would make teamwork slower than working alone.`],
         [num(Math.abs(a-b),2)+" days",`Subtracts the times; rates add, not times.`]],
  e:`Rates add: 1/${a} + 1/${b} = ${a+b}/${a*b} per day, so time = ${a*b}/${a+b} = ${num(c,2)} days.`,tip:`Together time = (a × b) / (a + b); it is always less than the faster person's time.`,p:{a,b}}}},

{id:"work-leave",name:"Working together, then one leaves",d:3,make(r){
  const a=P(r,[10,12,15,18,20,24,30]),b=P(r,[12,15,20,24,30,36,40]),k=R(r,2,6);if(a===b)return null;
  const rem=1-k*(1/a+1/b),days=rem*b;if(rem<=0.15||!isInt(days*10))return null;
  const w1=b-k,w2=rem*a,w3=b*(1-k/a);if([w1,w2,w3].some(x=>x<=0))return null;
  return{q:`A can finish a project in ${a} days and B in ${b} days. They work together for ${k} days, then A leaves. How many more days does B need to finish the project alone?`,
  ans:[num(days,1)+" days",`Correct: in ${k} days they finish ${k}(1/${a} + 1/${b}) of the work; B does the remaining ${num(rem,3)} at 1/${b} per day.`],
  wrong:[[num(w1,1)+" days",`Subtracts the ${k} shared days from B's time, ignoring the work A did.`],
         [num(w2,1)+" days",`Uses A's rate for the remaining work, but A has left.`],
         [num(w3,1)+" days",`Counts only A's work during the first ${k} days and forgets B was working too.`]],
  e:`Work done together = ${k} × (1/${a} + 1/${b}) = ${num(1-rem,3)}. Remaining = ${num(rem,3)}. B's time = ${num(rem,3)} × ${b} = ${num(days,1)} days.`,tip:`Track fractions of the job: work = rate × time, and rates add when people work together.`,p:{a,b,k}}}},

{id:"simple-interest",name:"Simple interest",d:1,make(r){
  const p=R(r,4,40)*500,rt=P(r,[4,5,6,7.5,8,10,12]),t=R(r,2,5),si=p*rt*t/100,ci=p*((1+rt/100)**t-1);
  return{q:`What is the simple interest on ${money(p)} at ${rt}% per year for ${t} years?`,
  ans:[money(si),`Correct: ${money(p)} × ${rt} × ${t} / 100 = ${money(si)}.`],
  wrong:[[money(p+si),`That is the total amount (principal + interest), not the interest.`],
         [money(ci),`Compound interest; the question asks for simple interest.`],
         [money(p*rt/100),`Interest for one year only; multiply by ${t} years.`]],
  e:`SI = P × R × T / 100 = ${p} × ${rt} × ${t} / 100 = ${money(si)}.`,tip:`Simple interest is the same every year: one year's interest × number of years.`,p:{p,rt,t}}}},

{id:"compound-interest",name:"Compound interest",d:2,make(r){
  const p=R(r,2,20)*1000,rt=P(r,[5,8,10,12,15,20]),t=P(r,[2,3]),ci=p*((1+rt/100)**t-1);
  return{q:`What is the compound interest on ${money(p)} at ${rt}% per year, compounded annually, for ${t} years?`,
  ans:[money(ci),`Correct: ${money(p)} × (1.${String(rt).padStart(2,"0")})^${t} − ${money(p)} = ${money(ci)}.`],
  wrong:[[money(p*rt*t/100),`Simple interest; with compounding, interest also earns interest.`],
         [money(p+ci),`Total amount after ${t} years, not the interest earned.`],
         [money(p*((1+rt/100)**(t-1)-1)),`Off by one period: compounds for ${t-1} years instead of ${t}.`]],
  e:`Amount = ${p} × (1 + ${rt}/100)^${t} = ${money(p+ci)}; interest = ${money(p+ci)} − ${money(p)} = ${money(ci)}.`,tip:`CI = P[(1 + r/100)^n − 1]. Count the periods carefully.`,p:{p,rt,t}}}},

{id:"ci-si-diff",name:"Compound minus simple interest (2 years)",d:3,make(r){
  const p=R(r,2,40)*500,rt=P(r,[4,5,6,8,10,12,15]),d=p*(rt/100)**2,ci=p*((1+rt/100)**2-1);
  return{q:`For ${money(p)} invested for 2 years at ${rt}% per year, what is the difference between compound interest (compounded annually) and simple interest?`,
  ans:[money(d),`Correct: for 2 years the difference is P(r/100)² = ${p} × ${rnd((rt/100)**2,6)} = ${money(d)}.`],
  wrong:[[money(p*rt/100),`One year's simple interest; the difference is only the interest earned on the first year's interest.`],
         [money(2*d),`Doubles the difference; for 2 years it arises only once (in year 2).`],
         [money(ci),`That is the compound interest itself, not the difference from simple interest.`]],
  e:`CI − SI over 2 years = P(r/100)² = ${p} × (${rt}/100)² = ${money(d)}.`,tip:`2-year CI − SI = P(r/100)²: it is just interest on the first year's interest.`,p:{p,rt}}}},

{id:"avg-new-member",name:"Average after someone joins",d:2,make(r){
  const n=R(r,5,30),av=R(r,24,40),d=P(r,[1,2]),x=av+d*(n+1);if(x>65)return null;
  return{q:`The average age of a team of ${n} people is ${av} years. When a new manager joins, the average age rises by ${d} year${d>1?"s":""}. How old is the new manager?`,
  ans:[`${x} years`,`Correct: new total ${(n+1)*(av+d)} − old total ${n*av} = ${x}.`],
  wrong:[[`${av+d*n} years`,`Off by one: multiplies the rise by ${n} instead of ${n+1} people (the manager is counted too).`],
         [`${av+d} years`,`That is the new average, not the manager's age.`],
         [`${av+d*(n-1)} years`,`Off by one in the other direction (${n-1} people).`]],
  e:`Old total = ${n} × ${av} = ${n*av}. New total = ${n+1} × ${av+d} = ${(n+1)*(av+d)}. Manager = ${(n+1)*(av+d)} − ${n*av} = ${x}.`,tip:`New member = new average + (rise × old count) = ${av+d} + ${d} × ${n}.`,p:{n,av,d}}}},

{id:"weighted-avg",name:"Weighted average of two groups",d:2,make(r){
  const n1=R(r,3,20),n2=R(r,3,20),m1=R(r,5,25),m2=R(r,5,25);if(n1===n2||m1===m2)return null;
  const c=(n1*m1+n2*m2)/(n1+n2);if(!isInt(c*10))return null;
  return{q:`A sales team has ${n1} junior staff averaging ${m1} deals per quarter and ${n2} senior staff averaging ${m2} deals per quarter. What is the average for the whole team?`,
  ans:[num(c,1)+" deals",`Correct: total deals ${n1*m1+n2*m2} ÷ ${n1+n2} people = ${num(c,1)}.`],
  wrong:[[num((m1+m2)/2,1)+" deals",`Averages the two averages; the groups are different sizes, so they need weighting.`],
         [num((n2*m1+n1*m2)/(n1+n2),1)+" deals",`Swaps the weights (applies ${n2} to the juniors and ${n1} to the seniors).`],
         [num(n1*m1+n2*m2,1)+" deals",`That is the team's total, not the average per person.`]],
  e:`Total = ${n1}×${m1} + ${n2}×${m2} = ${n1*m1+n2*m2}. Average = ${n1*m1+n2*m2} / ${n1+n2} = ${num(c,1)}.`,tip:`Combined average = total ÷ total count; the overall figure sits closer to the bigger group.`,p:{n1,m1,n2,m2}}}},

{id:"markup-discount",name:"Mark-up then discount",d:2,make(r){
  const m=P(r,[10,15,20,25,30,35,40,50,60,80]),d=P(r,[5,10,12,15,20,25,30]),pr=((1+m/100)*(1-d/100)-1)*100;if(pr<=0)return null;
  return{q:`A retailer marks goods ${m}% above cost and then offers a ${d}% discount on the marked price. What is the profit as a percentage of cost?`,
  ans:[pct2(pr),`Correct: ${1+m/100} × ${rnd(1-d/100,2)} = ${rnd(1+pr/100,4)}, so profit = ${pct2(pr)} of cost.`],
  wrong:[[pct2(m-d),`Subtracts the percentages; the discount applies to the higher marked price.`],
         [pct2(pr/(1+m/100)),`Wrong base: expresses the profit as a percentage of the marked price instead of the cost.`],
         [pct2(m),`Ignores the discount entirely.`]],
  e:`Selling price = cost × ${1+m/100} × ${rnd(1-d/100,2)} = cost × ${rnd(1+pr/100,4)}. Profit = ${pct2(pr)} of cost.`,tip:`Profit % is on COST: multiply the factors (1 + m%)(1 − d%) and subtract 1.`,p:{m,d}}}},

{id:"inclusive-days",name:"Counting days inclusively",d:1,make(r){
  const mo=P(r,MONTHS),s=R(r,1,12),e=s+R(r,8,16);
  return{q:`A daily stand-up meeting is held every day from ${s} ${mo} to ${e} ${mo}, both dates inclusive. On how many days is it held?`,
  ans:[String(e-s+1),`Correct: ${e} − ${s} + 1 = ${e-s+1}; both end dates count.`],
  wrong:[[String(e-s),`Off by one: ${e} − ${s} counts the gaps between days, not the days themselves.`],
         [String(e-s-1),`Excludes both end dates, but the range is inclusive.`],
         [String(e-s+2),`Adds one too many.`]],
  e:`Inclusive count = last − first + 1 = ${e} − ${s} + 1 = ${e-s+1}.`,tip:`Inclusive ranges: last − first + 1 (fence-post rule).`,p:{s,e}}}},

{id:"every-k-days",name:"Recurring events (fence posts)",d:2,make(r){
  const k=P(r,[2,3,4,5,6,7]),n=R(r,4,9),s=R(r,1,6),e=s+k*(n-1)+R(r,0,k-1);if(e>28)return null;
  const c=Math.floor((e-s)/k)+1,mo=P(r,MONTHS);
  return{q:`A supplier audit takes place every ${k} days, starting on ${s} ${mo}. How many audits take place up to and including ${e} ${mo}?`,
  ans:[String(c),`Correct: audits fall on day ${s}, ${s+k}, ${s+2*k}, …; that is floor((${e} − ${s}) / ${k}) + 1 = ${c}.`],
  wrong:[[String(c-1),`Off by one: counts the ${k}-day intervals but not the first audit on ${s} ${mo}.`],
         [String(c+1),`Adds an extra audit, as if one also fell on or after ${e} ${mo}; the next one is actually on day ${s+c*k}.`],
         [String(e-s+1),`Counts every day in the range instead of every ${k}th day.`]],
  e:`Audit days: ${s}, ${s+k}, ${s+2*k}, … up to ${s+(c-1)*k}. Count = floor((${e} − ${s}) / ${k}) + 1 = ${c}.`,tip:`Events every k days from day s to day e: floor((e − s)/k) + 1. Don't forget the first one.`,p:{k,s,e}}}}
];

function build(t,s,r){
  const opts=[[s.ans[0],s.ans[1],true],...s.wrong.map(w=>[w[0],w[1],false])];
  if(new Set(opts.map(o=>o[0])).size!==4)return null;          // all four must be distinct
  if(opts.some(o=>/NaN|Infinity|-\$|^-/.test(o[0])))return null;
  for(let i=3;i>0;i--){const j=Math.floor(r()*(i+1));[opts[i],opts[j]]=[opts[j],opts[i]]}
  const a=opts.findIndex(o=>o[2]);
  return{id:"gen-"+t.id+"-"+Math.floor(r()*1e9).toString(36),lkey:"gen:"+t.id,gen:true,template:t.id,topic:"Quant",difficulty:t.d,
    q:s.q,o:opts.map(o=>o[0]),a,e:s.e,tip:s.tip,why:opts.map(o=>o[1]),p:s.p};
}
function generate(id,seed){
  const r=seed==null?Math.random:mulberry(seed);
  const list=id?T.filter(t=>t.id===id):T;if(!list.length)return null;
  for(let i=0;i<200;i++){const t=list[Math.floor(r()*list.length)],s=t.make(r);const q=s&&build(t,s,r);if(q)return q}
  return null;
}
const api={templates:T.map(t=>({id:t.id,name:t.name,difficulty:t.d})),generate,
  byDifficulty:d=>T.filter(t=>t.d===d).map(t=>t.id)};
if(typeof window!=="undefined")window.QGEN=api;
if(typeof module!=="undefined")module.exports=api;
})();
