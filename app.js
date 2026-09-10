const $ = id => document.getElementById(id);
let peer=null, conn=null, isHost=false, meId="", meName="", room="", state=null;

const suits=["♠","♥","♦","♣"], ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function toast(t){$("toast").textContent=t;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",2200)}
function roomCode(){return Math.random().toString(36).slice(2,7).toUpperCase()}
function makeDeck(){let d=[];for(const s of suits)for(const r of ranks)d.push({s,r});return d.sort(()=>Math.random()-.5)}
function points(hand){let total=0,aces=0;for(const c of hand){if(c.r==="A"){total+=11;aces++}else total+=["10","J","Q","K"].includes(c.r)?10:+c.r}while(total>21&&aces){total-=10;aces--}return total}
function type(hand){
 if(hand.length===2&&hand.some(c=>c.r==="A")&&hand.some(c=>["10","J","Q","K"].includes(c.r)))return "Xì Dách";
 if(hand.length===2&&hand[0].r==="A"&&hand[1].r==="A")return "Xì Bàng";
 if(hand.length===5&&points(hand)<=21)return "Ngũ Linh";
 const p=points(hand);return p>21?"Quắc":`${p} điểm`
}
function resultFor(p,d){
 const pt=points(p),dt=points(d),ptp=type(p),dpt=type(d);
 if(pt>21)return"Thua (Quắc)";if(dt>21)return"Thắng (Cái Quắc)";
 if(ptp==="Xì Bàng")return dpt==="Xì Bàng"?"Hòa":"Thắng";
 if(ptp==="Xì Dách")return dpt==="Xì Bàng"?"Thua":dpt==="Xì Dách"?"Hòa":"Thắng";
 if(ptp==="Ngũ Linh"&&dpt!=="Ngũ Linh")return"Thắng";
 if(dpt==="Xì Bàng"||dpt==="Xì Dách")return"Thua";
 if(dpt==="Ngũ Linh"&&ptp!=="Ngũ Linh")return"Thua";
 return pt>dt?"Thắng":pt<dt?"Thua":"Hòa";
}
function cardHtml(c,back=false){return `<div class="cardx ${back?"back":((c.s==="♥"||c.s==="♦")?"red":"")}">${back?"🂠":c.r+c.s}</div>`}
function safeState(){return JSON.parse(JSON.stringify({...state,players:state.players.map(p=>({...p,conn:undefined}))}))}
function broadcast(){if(!isHost)return;for(const p of state.players)if(p.conn?.open)p.conn.send({type:"state",state:safeState()})}
function showGame(){$("home").classList.add("hidden");$("game").classList.remove("hidden");$("code").textContent=room}
function setupPeer(id,host){
  peer=new Peer(id,{
    debug:2,
    config:{
      iceServers:[
        {urls:"stun:stun.l.google.com:19302"},
        {urls:"stun:stun1.l.google.com:19302"}
      ]
    }
  });

  peer.on("open",()=>{
    meId=peer.id;
    if(host){
      state={
        phase:"lobby",deck:[],dealer:[],
        players:[{id:meId,name:meName,host:true,hand:[],stand:false,conn:null}],
        log:[]
      };
      showGame(); render();
      $("status").textContent="Đã tạo phòng. Hãy gửi LINK hoặc MÃ PHÒNG cho bạn bè.";
    }else{
      $("status").textContent="Đã kết nối máy chủ, đang vào phòng...";
      conn=peer.connect("xidach-"+room,{reliable:true,serialization:"json"});
      wireGuest(conn);
      setTimeout(()=>{
        if(!conn || !conn.open) toast("Không kết nối được chủ phòng. Hãy kiểm tra mã/link và thử lại.");
      },8000);
    }
  });

  peer.on("connection",c=>{
    if(isHost) wireHost(c);
  });

  peer.on("disconnected",()=>{
    if(!isHost) $("status").textContent="Mất kết nối máy chủ PeerJS. Đang thử kết nối lại...";
    try{peer.reconnect()}catch(e){}
  });

  peer.on("error",e=>{
    console.error("PeerJS:",e);
    const msg={
      "peer-unavailable":"Không tìm thấy phòng. Chủ phòng có thể đã đóng trình duyệt.",
      "network":"Lỗi mạng. Hãy kiểm tra Internet.",
      "server-error":"Máy chủ kết nối đang gặp lỗi. Thử tải lại trang.",
      "unavailable-id":"Mã phòng đang bị trùng. Hãy tạo phòng mới."
    }[e.type]||("Lỗi kết nối: "+e.type);
    toast(msg);
  });
}

function wireHost(c){
  let joined=false;
  c.on("open",()=>{
    c
