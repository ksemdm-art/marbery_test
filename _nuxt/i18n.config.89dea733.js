const u=(t,n)=>{if(t===0)return 0;const r=t>10&&t<20,e=t%10===1;return!r&&e?1:!r&&t%10>=2&&t%10<=4||n<4?2:3},i=()=>({fallbackLocale:"ru",pluralRules:{ru:u},datetimeFormats:{ru:{long:{dateStyle:"short",timeStyle:"short"},short:{dateStyle:"short"},day:{day:"2-digit"},dayWithMonth:{day:"2-digit",month:"2-digit"}}},numberFormats:{ru:{currency:{minimumFractionDigits:2},"currency-short":{minimumFractionDigits:0,currency:"RUB",style:"currency"}}}});export{i as default};
