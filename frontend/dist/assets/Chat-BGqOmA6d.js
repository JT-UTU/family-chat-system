import{h as Xe,_ as Ye,c as d,a as t,b as c,t as y,n as S,w as v,d as U,i as k,F as I,r as q,j as He,k as L,v as Ke,l as Qe,m as Ze,e as C,f as x,g as E,p as R,q as re,s as $e,E as _,u as et,o as r,x as ce,y as de}from"./index-CfLhrfcW.js";import{a as H,u as tt}from"./user-YmuPi-ZC.js";const ot=Xe("chat",{state:()=>({messages:[],isLoading:!1,error:null}),getters:{getMessages:h=>h.messages},actions:{async fetchMessages(){this.isLoading=!0;try{const h=await H.get("/api/messages");this.messages=h.data,this.error=null}catch(h){this.error=h.response&&h.response.data&&h.response.data.message||"获取消息失败"}finally{this.isLoading=!1}},async sendMessage(h){try{console.log("store收到消息:",h);let e={};if(typeof h=="string")e={type:"text",content:h};else if(typeof h=="object"&&h!==null){if(e=h,e.type||(e.type="text"),!e.content)throw new Error("消息内容不能为空")}else throw new Error("无效的消息格式");console.log("准备发送到服务器的数据:",e);try{const G=await H.post("/api/messages",e);return console.log("服务器响应:",G.data),this.messages.push(G.data),{success:!0}}catch(G){return console.error("API请求错误:",G),{success:!1,message:G.response&&G.response.data&&G.response.data.message||"发送消息失败"}}}catch(e){return console.error("发送消息处理错误:",e),{success:!1,message:e.message||"发送消息失败"}}},addMessage(h){this.messages.push(h)}}}),st={name:"Chat",setup(){const h=et(),e=tt(),G=ot(),o=x(null),D=x(""),O=x(!1),p=x(!1),N=x("chat"),T=x("list"),J=x("guesser"),M=E({word:"",hint:"",guess:""}),g=E({playerChoice:"",computerChoice:"",result:""}),P=E({word:""}),l=E({question:"",options:["",""],myVote:-1,activeVote:null}),F=E({color:"#000",size:10}),K=["#000","#409eff","#67c23a","#e6a23c","#f56c6c","#909399"],Q=R(()=>{const s=document.querySelector(".drawing-canvas");if(!s)return!0;const u=s.getContext("2d").getImageData(0,0,s.width,s.height).data;for(let f=0;f<u.length;f+=4)if(u[f]!==255||u[f+1]!==255||u[f+2]!==255)return!1;return!0}),W=R(()=>l.question.trim()!==""&&l.options.every(s=>s.trim()!=="")),n=R(()=>{var s;return l.activeVote?l.activeVote.creator===((s=m.value)==null?void 0:s.username):!1}),V=R(()=>({guess:{title:"猜词游戏"},rps:{title:"石头剪刀布"},vote:{title:"家庭投票"},draw:{title:"你画我猜"}})[T.value]||{}),m=R(()=>e.getUser),B=R(()=>G.getMessages),X=["😊","😂","❤️","👍","😍","🎉","🔥","😎","🤔","😢","😴","🙏","👋","🌹","🎂","☕","🌞","🌙","🍕","🏠"],oe=R(()=>{const s={};return B.value.forEach(a=>{const i=new Date(a.createdAt).toLocaleDateString();s[i]||(s[i]=[]),s[i].push(a)}),s}),me=s=>{N.value=s,T.value&&s!=="games"&&(T.value=null)},ue=s=>{T.value=s,s==="guess"&&(J.value=Math.random()>.5?"creator":"guesser"),s==="rps"&&se()},ve=()=>{T.value=null},ge=()=>{if(!M.word||!M.hint){_.warning("请输入词语和提示");return}_.success("已出题，等待他人猜测")},fe=()=>{if(!M.guess){_.warning("请输入你的猜测");return}setTimeout(()=>{Math.random()>.5?_.success("恭喜你，猜对了！"):_.error("猜错了，继续加油！"),M.guess=""},500)},pe=s=>{g.playerChoice=s;const a=["rock","scissors","paper"];g.computerChoice=a[Math.floor(Math.random()*a.length)],g.playerChoice===g.computerChoice?g.result="draw":g.playerChoice==="rock"&&g.computerChoice==="scissors"||g.playerChoice==="scissors"&&g.computerChoice==="paper"||g.playerChoice==="paper"&&g.computerChoice==="rock"?g.result="win":g.result="lose"},se=()=>{g.playerChoice="",g.computerChoice="",g.result=""},ye=s=>{const a=new Date().toLocaleDateString(),i=new Date(Date.now()-864e5).toLocaleDateString();return s===a?"今天":s===i?"昨天":s},he=s=>{const a=new Date(s);return`${a.getHours().toString().padStart(2,"0")}:${a.getMinutes().toString().padStart(2,"0")}`},we=s=>{typeof D.value!="string"&&(D.value=""),D.value+=s,p.value=!1};re(()=>B.value.length,async()=>{await de(),o.value&&(o.value.scrollTop=o.value.scrollHeight)});const j=async()=>{if(!(!D.value.trim()&&!w.show)){O.value=!0;try{if(w.show)await ke();else if(typeof D.value=="string"){const s={type:"text",content:D.value};console.log("准备发送文本消息:",s);const a=await G.sendMessage(s);console.log("发送文本消息结果:",a),a.success?D.value="":_.error(a.message||"消息发送失败")}else{const s=D.value;console.log("准备发送特殊消息:",s);const a=await G.sendMessage(s);console.log("发送特殊消息结果:",a),a.success?D.value="":_.error(a.message||"消息发送失败")}}catch(s){console.error("发送消息时发生错误:",s),_.error("发送消息失败: "+(s.message||"未知错误"))}finally{O.value=!1,p.value=!1}}},ke=async()=>{var s,a;if(w.file)try{const i=new FormData;i.append("file",w.file);let u=D.value.trim()||w.name;i.append("caption",u);const f=await H.post("/api/upload",i,{headers:{"Content-Type":"multipart/form-data"}});if(f.data&&f.data.fileUrl){const b={type:w.type==="image"?"image":"file",content:u,fileUrl:f.data.fileUrl,fileName:w.name,fileSize:w.file.size},A=await G.sendMessage(b);A.success?(D.value="",ae(),_.success("文件发送成功")):_.error(A.message||"文件消息发送失败")}}catch(i){console.error("文件上传错误:",i),_.error("文件上传失败: "+(((a=(s=i.response)==null?void 0:s.data)==null?void 0:a.message)||i.message||"未知错误"))}},Ce=async()=>{try{await G.fetchMessages(),_.success("已更新最新消息")}catch{_.error("获取消息失败")}},Ve=()=>{e.logout(),h.push("/")},_e=s=>{const a=s.target,i=a.getContext("2d"),u=a.getBoundingClientRect(),f=s.clientX-u.left,b=s.clientY-u.top;i.beginPath(),i.moveTo(f,b),a.isDrawing=!0},Ge=s=>{const a=s.target;if(!a.isDrawing)return;const i=a.getContext("2d"),u=a.getBoundingClientRect(),f=s.clientX-u.left,b=s.clientY-u.top;i.lineTo(f,b),i.strokeStyle=F.color,i.lineWidth=F.size,i.lineCap="round",i.lineJoin="round",i.stroke()},be=()=>{const s=document.querySelector(".drawing-canvas");s&&(s.isDrawing=!1)},Me=s=>{s.preventDefault();const a=s.target,i=a.getContext("2d"),u=a.getBoundingClientRect(),f=s.touches[0].clientX-u.left,b=s.touches[0].clientY-u.top;i.beginPath(),i.moveTo(f,b),a.isDrawing=!0},De=s=>{s.preventDefault();const a=s.target;if(!a.isDrawing)return;const i=a.getContext("2d"),u=a.getBoundingClientRect(),f=s.touches[0].clientX-u.left,b=s.touches[0].clientY-u.top;i.lineTo(f,b),i.strokeStyle=F.color,i.lineWidth=F.size,i.lineCap="round",i.lineJoin="round",i.stroke()},Z=()=>{const s=document.querySelector(".drawing-canvas");if(s){const a=s.getContext("2d");a.fillStyle="white",a.fillRect(0,0,s.width,s.height)}},Te=()=>{const s=document.querySelector(".drawing-canvas");s&&(s.toDataURL("image/png"),P.word.trim()&&`${P.word}`,j(),Z(),P.word="")},xe=()=>{const s=document.querySelector(".drawing-canvas");s&&(s.width=s.offsetWidth,s.height=s.offsetHeight,Z())};re(()=>T.value,s=>{s==="draw"&&de(()=>{xe()})});const Se=()=>{l.options.push("")},Ue=s=>{l.options.length>2&&l.options.splice(s,1)},Pe=()=>{var s;l.activeVote={id:Date.now().toString(),question:l.question,options:l.options.filter(a=>a.trim()!=="").map(a=>({text:a,votes:0,voters:[]})),creator:(s=m.value)==null?void 0:s.username,createdAt:new Date,totalVotes:0},j({content:`创建了一个投票: "${l.question}"`,voteData:l.activeVote}),l.question="",l.options=["",""],l.myVote=-1},Fe=s=>{var i,u;if(!l.activeVote)return;if(l.myVote!==-1){const f=l.activeVote.options[l.myVote];f.votes--;const b=f.voters.indexOf((i=m.value)==null?void 0:i.username);b!==-1&&f.voters.splice(b,1),l.activeVote.totalVotes--}const a=l.activeVote.options[s];a.votes++,a.voters.push((u=m.value)==null?void 0:u.username),l.activeVote.totalVotes++,l.myVote=s,j({content:`投票选择了: "${a.text}"`,voteId:l.activeVote.id})},Re=()=>{if(!l.activeVote)return;let s=-1,a=[];l.activeVote.options.forEach((u,f)=>{u.votes>s?(s=u.votes,a=[f]):u.votes===s&&a.push(f)});let i=`投票结果: "${l.activeVote.question}"
`;l.activeVote.totalVotes===0?i+="没有人投票":a.length===1?i+=`获胜选项: "${l.activeVote.options[a[0]].text}" (${l.activeVote.options[a[0]].votes}票)`:i+=`平局! 选项: ${a.map(u=>`"${l.activeVote.options[u].text}"`).join(", ")} 各获得 ${s} 票`,j({voteId:l.activeVote.id,results:{totalVotes:l.activeVote.totalVotes}}),l.activeVote=null,l.myVote=-1},Ee=()=>{l.question="",l.options=["",""]},ze=()=>{T.value="list",l.activeVote=null,l.myVote=-1},Ae=s=>{s&&(T.value="vote",l.activeVote=s,l.myVote=-1,s.options.forEach((a,i)=>{var u;a.voters.includes((u=m.value)==null?void 0:u.username)&&(l.myVote=i)}))},Ie=s=>{if(l.activeVote&&s.voteId===l.activeVote.id){const a=l.activeVote.options[s.optionIndex];a.votes++,a.voters.push(s.sender),l.activeVote.totalVotes++}},qe=s=>{l.activeVote&&s.voteId===l.activeVote.id&&(l.activeVote=null,l.myVote=-1)},Be=s=>!l.activeVote||l.activeVote.totalVotes===0?0:Math.round(s/l.activeVote.totalVotes*100),w=E({show:!1,type:"",url:"",file:null,name:""}),je=s=>{const a=s.raw.type.startsWith("image/");w.file=s.raw,w.name=s.name,w.type=a?"image":"file",w.show=!0,a&&(w.url=URL.createObjectURL(s.raw))},ae=()=>{w.show=!1,w.file=null,w.url="",w.name="",w.type="",$.value&&$.value.clearFiles()},$=x(null),Le=s=>{if(!s||s===0)return"0 B";const a=1024,i=["B","KB","MB","GB"],u=Math.floor(Math.log(s)/Math.log(a));return parseFloat((s/Math.pow(a,u)).toFixed(2))+" "+i[u]},ne=x(!1),z=E({username:"",nickname:"",theme:localStorage.getItem("theme")||"light"}),ee=x(!1),le=x(""),Y=x(null),Oe=R(()=>{var s,a;return(s=m.value)!=null&&s.avatar?m.value.avatar:`https://ui-avatars.com/api/?name=${((a=m.value)==null?void 0:a.username)||"U"}&background=random`}),te=s=>{document.documentElement.setAttribute("data-theme",s),localStorage.setItem("theme",s)},ie=()=>{const s=localStorage.getItem("theme")||"light";te(s),z.theme=s},Ne=()=>{const s=document.createElement("input");s.type="file",s.accept="image/*",s.onchange=a=>{const i=a.target.files[0];if(i){Y.value=i;const u=new FileReader;u.onload=f=>{le.value=f.target.result},u.readAsDataURL(i)}},s.click()},Je=async()=>{var s,a,i;if(!z.username.trim()){_.warning("用户名不能为空");return}ee.value=!0;try{let u=(s=m.value)==null?void 0:s.avatar;if(Y.value){const b=new FormData;b.append("file",Y.value);const A=await H.post("/api/upload",b,{headers:{"Content-Type":"multipart/form-data"}});A.data&&A.data.fileUrl&&(u=A.data.fileUrl)}const f={username:z.username,nickname:z.nickname,avatar:u};te(z.theme),ne.value=!1,_.success("个人资料保存成功")}catch(u){console.error("保存资料错误:",u),_.error("保存个人资料失败: "+(((i=(a=u.response)==null?void 0:a.data)==null?void 0:i.message)||u.message))}finally{ee.value=!1}},We=()=>{};return $e(async()=>{await G.fetchMessages(),ie()}),{chatContentRef:o,messageContent:D,sending:O,currentUser:m,messages:B,showEmojiPicker:p,emojis:X,groupedMessages:oe,activeTab:N,currentGame:T,gameInfo:V,gameRole:J,guessGame:M,rpsGame:g,drawGame:P,drawingTool:F,drawingColors:K,canvasIsEmpty:Q,formatDate:ye,formatTime:he,insertEmoji:we,sendMessage:j,fetchMessages:Ce,handleLogout:Ve,switchTab:me,startGame:ue,closeGame:ve,submitGuessGame:ge,submitGuess:fe,makeRPSChoice:pe,resetRPSGame:se,startDrawing:_e,draw:Ge,stopDrawing:be,handleTouchStart:Me,handleTouchMove:De,clearCanvas:Z,shareDrawing:Te,canCreateVote:W,isVoteCreator:n,voteGame:l,addVoteOption:Se,removeVoteOption:Ue,createVote:Pe,castVote:Fe,endVote:Re,cancelVote:Ee,exitVoteResults:ze,handleJoinVote:Ae,handleVoteReceived:Ie,handleVoteEnded:qe,calculateVotePercentage:Be,filePreview:w,handleFileChange:je,cancelFileUpload:ae,upload:$,formatFileSize:Le,showProfileModal:ne,profileForm:z,savingProfile:ee,previewAvatar:le,avatarFile:Y,triggerAvatarUpload:Ne,handleAvatarChange:We,saveProfile:Je,initTheme:ie,applyTheme:te,userAvatar:Oe}}},at={class:"chat-container"},nt={class:"chat-sidebar"},lt={class:"user-info"},it=["src"],rt={class:"username"},ct={class:"menu"},dt={class:"logout-btn"},mt={class:"chat-main"},ut={key:0},vt={class:"chat-header"},gt={class:"header-actions"},ft={class:"chat-content",ref:"chatContentRef"},pt={key:0,class:"empty-message"},yt={key:1,class:"messages-timeline"},ht={class:"date-divider"},wt={class:"message-avatar"},kt={class:"message-body"},Ct={class:"message-info"},Vt={class:"username"},_t={class:"time"},Gt={key:0,class:"message-content"},bt={key:1,class:"system-message"},Mt={key:2,class:"game-message"},Dt={key:3,class:"drawing-message"},Tt={class:"drawing-message-header"},xt={class:"drawing-image"},St=["src"],Ut={key:4,class:"vote-message"},Pt={class:"vote-message-header"},Ft={class:"vote-message-action"},Rt={key:5,class:"vote-cast-message"},Et={key:6,class:"vote-result-message"},zt={class:"vote-result-content"},At={key:7,class:"file-message"},It={class:"file-message-header"},qt={class:"file-message-body"},Bt={class:"file-info"},jt={class:"file-name"},Lt={class:"file-size"},Ot=["href"],Nt={key:8,class:"image-message"},Jt={class:"image-message-header"},Wt={class:"image-container"},Xt={class:"chat-input-container"},Yt={class:"input-container"},Ht={class:"emoji-container"},Kt={key:0,class:"emoji-picker"},Qt={class:"emoji-list"},Zt=["onClick"],$t={class:"file-upload-container"},eo={key:1,class:"file-info-preview"},to={key:1,class:"games-container"},oo={class:"games-grid"},so={key:0,class:"game-playground"},ao={class:"game-header"},no={key:0,class:"guess-game"},lo={key:0,class:"game-creator-panel"},io={key:1,class:"game-guesser-panel"},ro={class:"hint-box"},co={key:1,class:"rps-game"},mo={class:"rps-choices"},uo={key:0,class:"rps-result"},vo={class:"computer-choice"},go={key:0},fo={key:1},po={key:2},yo={key:0},ho={key:1},wo={key:2},ko={key:2,class:"draw-game"},Co={class:"drawing-area"},Vo={class:"drawing-tools"},_o={class:"tool-group"},Go={class:"color-picker"},bo=["onClick"],Mo={class:"tool-group"},Do={class:"drawing-hint"},To={key:3,class:"vote-game"},xo={key:0},So={class:"vote-header"},Uo={class:"vote-creator"},Po={class:"vote-options"},Fo=["onClick"],Ro={class:"option-content"},Eo={class:"option-text"},zo={class:"vote-progress"},Ao={class:"vote-count"},Io={class:"vote-actions"},qo={key:1,class:"create-vote"},Bo={class:"option-input"},jo={class:"form-actions"},Lo={key:2,class:"users-container"},Oo={key:3,class:"settings-container"},No={class:"profile-settings"},Jo={class:"avatar-settings"},Wo=["src"],Xo={class:"profile-form"},Yo={slot:"footer",class:"dialog-footer"};function Ho(h,e,G,o,D,O){var W;const p=U("el-button"),N=U("el-empty"),T=U("el-image"),J=U("el-upload"),M=U("el-input"),g=U("el-form-item"),P=U("el-form"),l=U("el-slider"),F=U("el-radio"),K=U("el-radio-group"),Q=U("el-dialog");return r(),d("div",at,[t("div",nt,[e[40]||(e[40]=t("div",{class:"logo"},[t("h2",null,"家庭聊天")],-1)),t("div",lt,[t("div",{class:"avatar",onClick:e[0]||(e[0]=n=>o.showProfileModal=!0)},[t("img",{src:o.userAvatar,alt:"用户头像"},null,8,it),e[34]||(e[34]=t("div",{class:"avatar-edit-hint"},[t("i",{class:"el-icon-edit"})],-1))]),t("div",rt,y((W=o.currentUser)==null?void 0:W.username),1)]),t("div",ct,[t("div",{class:S(["menu-item",{active:o.activeTab==="chat"}]),onClick:e[1]||(e[1]=n=>o.switchTab("chat"))},e[35]||(e[35]=[t("i",{class:"el-icon-chat-dot-round"},null,-1),t("span",null,"聊天室",-1)]),2),t("div",{class:S(["menu-item",{active:o.activeTab==="games"}]),onClick:e[2]||(e[2]=n=>o.switchTab("games"))},e[36]||(e[36]=[t("i",{class:"el-icon-trophy"},null,-1),t("span",null,"游戏中心",-1)]),2),t("div",{class:S(["menu-item",{active:o.activeTab==="users"}]),onClick:e[3]||(e[3]=n=>o.switchTab("users"))},e[37]||(e[37]=[t("i",{class:"el-icon-user"},null,-1),t("span",null,"用户列表",-1)]),2),t("div",{class:S(["menu-item",{active:o.activeTab==="settings"}]),onClick:e[4]||(e[4]=n=>o.switchTab("settings"))},e[38]||(e[38]=[t("i",{class:"el-icon-setting"},null,-1),t("span",null,"设置",-1)]),2)]),t("div",dt,[c(p,{type:"danger",onClick:o.handleLogout,plain:""},{default:v(()=>e[39]||(e[39]=[C("退出登录")])),_:1},8,["onClick"])])]),t("div",mt,[o.activeTab==="chat"?(r(),d("div",ut,[t("div",vt,[e[42]||(e[42]=t("h3",null,"家庭聊天室",-1)),t("div",gt,[e[41]||(e[41]=t("span",{class:"online-count"},"在线人数: 1",-1)),c(p,{type:"primary",size:"small",icon:"el-icon-refresh-right",circle:"",onClick:o.fetchMessages},null,8,["onClick"])])]),t("div",ft,[o.messages.length===0?(r(),d("div",pt,[c(N,{description:"暂无消息，开始聊天吧！"})])):(r(),d("div",yt,[(r(!0),d(I,null,q(o.groupedMessages,(n,V)=>(r(),d("div",{key:V},[t("div",ht,[t("span",null,y(o.formatDate(V)),1)]),(r(!0),d(I,null,q(n,(m,B)=>{var X;return r(),d("div",{key:m.id||B,class:S(["message-item",{"my-message":m.userId===((X=o.currentUser)==null?void 0:X.id)}])},[t("div",wt,y(m.username.charAt(0).toUpperCase()),1),t("div",kt,[t("div",Ct,[t("span",Vt,y(m.username),1),t("span",_t,y(o.formatTime(m.createdAt)),1)]),m.type==="text"?(r(),d("div",Gt,y(m.content),1)):m.type==="system"?(r(),d("div",bt,y(m.content),1)):m.type==="game"?(r(),d("div",Mt,[e[43]||(e[43]=t("i",{class:"el-icon-data-analysis"},null,-1)),t("span",null,y(m.content),1)])):m.type==="drawing"?(r(),d("div",Dt,[t("div",Tt,[e[44]||(e[44]=t("i",{class:"el-icon-picture-outline"},null,-1)),t("span",null,y(m.content),1)]),t("div",xt,[t("img",{src:m.drawingData,alt:"用户绘画"},null,8,St)])])):m.type==="vote"?(r(),d("div",Ut,[t("div",Pt,[e[45]||(e[45]=t("i",{class:"el-icon-s-check"},null,-1)),t("span",null,y(m.content),1)]),t("div",Ft,[c(p,{size:"small",type:"primary",onClick:oe=>o.handleJoinVote(m.voteData)},{default:v(()=>e[46]||(e[46]=[C("参与投票")])),_:2},1032,["onClick"])])])):m.type==="vote-cast"?(r(),d("div",Rt,[e[47]||(e[47]=t("i",{class:"el-icon-check"},null,-1)),t("span",null,y(m.content),1)])):m.type==="vote-end"?(r(),d("div",Et,[e[48]||(e[48]=t("div",{class:"vote-result-header"},[t("i",{class:"el-icon-trophy"}),t("span",null,"投票结束")],-1)),t("div",zt,[t("pre",null,y(m.content),1)])])):m.type==="file"?(r(),d("div",At,[t("div",It,[e[49]||(e[49]=t("i",{class:"el-icon-document"},null,-1)),t("span",null,y(m.content),1)]),t("div",qt,[e[51]||(e[51]=t("i",{class:"el-icon-document file-icon"},null,-1)),t("div",Bt,[t("div",jt,y(m.fileName),1),t("div",Lt,y(o.formatFileSize(m.fileSize)),1)]),t("a",{href:m.fileUrl,target:"_blank",class:"file-download"},[c(p,{size:"mini",type:"primary",icon:"el-icon-download"},{default:v(()=>e[50]||(e[50]=[C("下载")])),_:1})],8,Ot)])])):m.type==="image"?(r(),d("div",Nt,[t("div",Jt,[e[52]||(e[52]=t("i",{class:"el-icon-picture-outline"},null,-1)),t("span",null,y(m.content),1)]),t("div",Wt,[c(T,{src:m.fileUrl,"preview-src-list":[m.fileUrl],fit:"cover",class:"chat-image"},{default:v(()=>e[53]||(e[53]=[t("div",{slot:"error",class:"image-error"},[t("i",{class:"el-icon-picture-outline"})],-1)])),_:2},1032,["src","preview-src-list"])])])):k("",!0)])],2)}),128))]))),128))]))],512),t("div",Xt,[t("div",Yt,[t("div",Ht,[c(p,{class:"emoji-btn",icon:"el-icon-smile",circle:"",onClick:e[5]||(e[5]=n=>o.showEmojiPicker=!o.showEmojiPicker)}),o.showEmojiPicker?(r(),d("div",Kt,[t("div",Qt,[(r(!0),d(I,null,q(o.emojis,n=>(r(),d("span",{key:n,onClick:V=>o.insertEmoji(n)},y(n),9,Zt))),128))])])):k("",!0)]),t("div",$t,[c(J,{ref:"upload",action:"#","auto-upload":!1,"show-file-list":!1,"on-change":o.handleFileChange,limit:1},{default:v(()=>[c(p,{icon:"el-icon-paperclip",circle:""})]),_:1},8,["on-change"]),o.filePreview.show&&o.filePreview.type==="image"?(r(),L(T,{key:0,src:o.filePreview.url,class:"file-preview",fit:"contain"},{default:v(()=>e[54]||(e[54]=[t("div",{slot:"error",class:"image-error"},[t("i",{class:"el-icon-picture-outline"})],-1)])),_:1},8,["src"])):k("",!0),o.filePreview.show&&o.filePreview.type==="file"?(r(),d("div",eo,[e[55]||(e[55]=t("i",{class:"el-icon-document"},null,-1)),t("span",null,y(o.filePreview.name),1),c(p,{type:"text",icon:"el-icon-close",onClick:o.cancelFileUpload},null,8,["onClick"])])):k("",!0)]),He(t("textarea",{"onUpdate:modelValue":e[6]||(e[6]=n=>o.messageContent=n),placeholder:"输入消息...",onKeydown:e[7]||(e[7]=Qe(Ze((...n)=>o.sendMessage&&o.sendMessage(...n),["ctrl"]),["enter"]))},null,544),[[Ke,o.messageContent]]),c(p,{type:"primary",circle:"",icon:"el-icon-s-promotion",onClick:o.sendMessage,loading:o.sending,disabled:!o.messageContent.trim()&&!o.filePreview.show},null,8,["onClick","loading","disabled"])]),e[56]||(e[56]=t("div",{class:"input-tip"},"按 Ctrl + Enter 发送消息",-1))])])):k("",!0),o.activeTab==="games"?(r(),d("div",to,[e[84]||(e[84]=t("div",{class:"section-header"},[t("h3",null,"家庭游戏中心"),t("p",{class:"section-desc"},"和家人一起玩游戏，增进感情")],-1)),t("div",oo,[t("div",{class:"game-card",onClick:e[8]||(e[8]=n=>o.startGame("guess"))},e[57]||(e[57]=[t("div",{class:"game-icon"},"🎮",-1),t("div",{class:"game-title"},"猜词游戏",-1),t("div",{class:"game-desc"},"猜猜我在想什么？考验你们之间的默契",-1)])),t("div",{class:"game-card",onClick:e[9]||(e[9]=n=>o.startGame("rps"))},e[58]||(e[58]=[t("div",{class:"game-icon"},"✂️",-1),t("div",{class:"game-title"},"石头剪刀布",-1),t("div",{class:"game-desc"},"经典游戏，线上对决",-1)])),t("div",{class:"game-card",onClick:e[10]||(e[10]=n=>o.startGame("vote"))},e[59]||(e[59]=[t("div",{class:"game-icon"},"📊",-1),t("div",{class:"game-title"},"家庭投票",-1),t("div",{class:"game-desc"},"今天吃什么？去哪里玩？一起决定",-1)])),t("div",{class:"game-card",onClick:e[11]||(e[11]=n=>o.startGame("draw"))},e[60]||(e[60]=[t("div",{class:"game-icon"},"🎨",-1),t("div",{class:"game-title"},"你画我猜",-1),t("div",{class:"game-desc"},"发挥你的艺术天赋，看谁猜得快",-1)]))]),o.currentGame?(r(),d("div",so,[t("div",ao,[t("h4",null,y(o.gameInfo.title),1),c(p,{size:"small",onClick:o.closeGame,type:"text"},{default:v(()=>e[61]||(e[61]=[C("返回游戏列表")])),_:1},8,["onClick"])]),o.currentGame==="guess"?(r(),d("div",no,[e[67]||(e[67]=t("div",{class:"game-rules"},[t("p",null,"游戏规则：一人选择一个词，给出提示，其他人猜这个词是什么。")],-1)),o.gameRole==="creator"?(r(),d("div",lo,[e[63]||(e[63]=t("h5",null,"你是出题者",-1)),c(P,null,{default:v(()=>[c(g,{label:"选择一个词"},{default:v(()=>[c(M,{modelValue:o.guessGame.word,"onUpdate:modelValue":e[12]||(e[12]=n=>o.guessGame.word=n),placeholder:"输入一个词"},null,8,["modelValue"])]),_:1}),c(g,{label:"给出提示"},{default:v(()=>[c(M,{modelValue:o.guessGame.hint,"onUpdate:modelValue":e[13]||(e[13]=n=>o.guessGame.hint=n),placeholder:"给其他人一些提示"},null,8,["modelValue"])]),_:1}),c(g,null,{default:v(()=>[c(p,{type:"primary",onClick:o.submitGuessGame},{default:v(()=>e[62]||(e[62]=[C("开始游戏")])),_:1},8,["onClick"])]),_:1})]),_:1})])):(r(),d("div",io,[e[66]||(e[66]=t("h5",null,"你是猜词者",-1)),t("div",ro,[e[64]||(e[64]=t("h6",null,"提示：",-1)),t("p",null,y(o.guessGame.hint||"等待出题者给出提示..."),1)]),o.guessGame.hint?(r(),L(P,{key:0},{default:v(()=>[c(g,{label:"你的猜测"},{default:v(()=>[c(M,{modelValue:o.guessGame.guess,"onUpdate:modelValue":e[14]||(e[14]=n=>o.guessGame.guess=n),placeholder:"猜一猜是什么词"},null,8,["modelValue"])]),_:1}),c(g,null,{default:v(()=>[c(p,{type:"primary",onClick:o.submitGuess},{default:v(()=>e[65]||(e[65]=[C("提交猜测")])),_:1},8,["onClick"])]),_:1})]),_:1})):k("",!0)]))])):k("",!0),o.currentGame==="rps"?(r(),d("div",co,[e[73]||(e[73]=t("div",{class:"game-rules"},[t("p",null,"游戏规则：选择石头、剪刀或布，看看谁是赢家！")],-1)),t("div",mo,[t("div",{class:S(["rps-choice",{selected:o.rpsGame.playerChoice==="rock"}]),onClick:e[15]||(e[15]=n=>o.makeRPSChoice("rock"))},e[68]||(e[68]=[t("div",{class:"choice-icon"},"👊",-1),t("div",{class:"choice-name"},"石头",-1)]),2),t("div",{class:S(["rps-choice",{selected:o.rpsGame.playerChoice==="scissors"}]),onClick:e[16]||(e[16]=n=>o.makeRPSChoice("scissors"))},e[69]||(e[69]=[t("div",{class:"choice-icon"},"✌️",-1),t("div",{class:"choice-name"},"剪刀",-1)]),2),t("div",{class:S(["rps-choice",{selected:o.rpsGame.playerChoice==="paper"}]),onClick:e[17]||(e[17]=n=>o.makeRPSChoice("paper"))},e[70]||(e[70]=[t("div",{class:"choice-icon"},"✋",-1),t("div",{class:"choice-name"},"布",-1)]),2)]),o.rpsGame.result?(r(),d("div",uo,[t("div",vo,[e[71]||(e[71]=C(" 电脑选择了： ")),o.rpsGame.computerChoice==="rock"?(r(),d("span",go,"👊 石头")):o.rpsGame.computerChoice==="scissors"?(r(),d("span",fo,"✌️ 剪刀")):o.rpsGame.computerChoice==="paper"?(r(),d("span",po,"✋ 布")):k("",!0)]),t("div",{class:S(["result-text",o.rpsGame.result])},[o.rpsGame.result==="win"?(r(),d("span",yo,"你赢了！🎉")):o.rpsGame.result==="lose"?(r(),d("span",ho,"你输了！😢")):(r(),d("span",wo,"平局！🤝"))],2)])):k("",!0),o.rpsGame.result?(r(),L(p,{key:1,type:"primary",onClick:o.resetRPSGame},{default:v(()=>e[72]||(e[72]=[C("再来一局")])),_:1},8,["onClick"])):k("",!0)])):k("",!0),o.currentGame==="draw"?(r(),d("div",ko,[e[78]||(e[78]=t("div",{class:"game-rules"},[t("p",null,"游戏规则：在画布上作画，让家人猜你画的是什么。")],-1)),t("div",Co,[t("div",Vo,[t("div",_o,[e[74]||(e[74]=t("span",{class:"tool-label"},"画笔颜色:",-1)),t("div",Go,[(r(!0),d(I,null,q(o.drawingColors,n=>(r(),d("div",{class:S(["color-item",{active:o.drawingTool.color===n}]),key:n,style:ce({backgroundColor:n}),onClick:V=>o.drawingTool.color=n},null,14,bo))),128))])]),t("div",Mo,[e[75]||(e[75]=t("span",{class:"tool-label"},"画笔大小:",-1)),c(l,{modelValue:o.drawingTool.size,"onUpdate:modelValue":e[18]||(e[18]=n=>o.drawingTool.size=n),min:1,max:20,step:1},null,8,["modelValue"])]),c(p,{type:"danger",size:"small",onClick:o.clearCanvas},{default:v(()=>e[76]||(e[76]=[C("清空画布")])),_:1},8,["onClick"])]),t("canvas",{ref:"canvas",class:"drawing-canvas",onMousedown:e[19]||(e[19]=(...n)=>o.startDrawing&&o.startDrawing(...n)),onMousemove:e[20]||(e[20]=(...n)=>o.draw&&o.draw(...n)),onMouseup:e[21]||(e[21]=(...n)=>o.stopDrawing&&o.stopDrawing(...n)),onMouseleave:e[22]||(e[22]=(...n)=>o.stopDrawing&&o.stopDrawing(...n)),onTouchstart:e[23]||(e[23]=(...n)=>o.handleTouchStart&&o.handleTouchStart(...n)),onTouchmove:e[24]||(e[24]=(...n)=>o.handleTouchMove&&o.handleTouchMove(...n)),onTouchend:e[25]||(e[25]=(...n)=>o.stopDrawing&&o.stopDrawing(...n))},null,544),t("div",Do,[c(M,{modelValue:o.drawGame.word,"onUpdate:modelValue":e[26]||(e[26]=n=>o.drawGame.word=n),placeholder:"告诉大家你要画什么（可选）"},null,8,["modelValue"]),c(p,{type:"primary",onClick:o.shareDrawing,disabled:!o.canvasIsEmpty},{default:v(()=>e[77]||(e[77]=[C("分享作品")])),_:1},8,["onClick","disabled"])])])])):k("",!0),o.currentGame==="vote"?(r(),d("div",To,[e[83]||(e[83]=t("div",{class:"game-rules"},[t("p",null,"游戏规则：创建一个投票，让家人共同决定重要事项。")],-1)),o.voteGame.activeVote?(r(),d("div",xo,[t("div",So,[t("h5",null,y(o.voteGame.activeVote.question),1),t("p",Uo,"由 "+y(o.voteGame.activeVote.creator)+" 发起",1)]),t("div",Po,[(r(!0),d(I,null,q(o.voteGame.activeVote.options,(n,V)=>(r(),d("div",{key:V,class:S(["vote-option",{selected:o.voteGame.myVote===V}]),onClick:m=>o.castVote(V)},[t("div",Ro,[t("div",Eo,y(n.text),1),t("div",zo,[t("div",{class:"progress-bar",style:ce({width:`${o.calculateVotePercentage(n.votes)}%`})},null,4),t("div",Ao,y(n.votes)+" 票",1)])])],10,Fo))),128))]),t("div",Io,[o.isVoteCreator?(r(),L(p,{key:0,type:"primary",onClick:o.endVote},{default:v(()=>e[79]||(e[79]=[C("结束投票")])),_:1},8,["onClick"])):k("",!0),c(p,{onClick:o.exitVoteResults},{default:v(()=>e[80]||(e[80]=[C("返回")])),_:1},8,["onClick"])])])):(r(),d("div",qo,[c(P,null,{default:v(()=>[c(g,{label:"投票问题"},{default:v(()=>[c(M,{modelValue:o.voteGame.question,"onUpdate:modelValue":e[27]||(e[27]=n=>o.voteGame.question=n),placeholder:"例如：今晚吃什么？"},null,8,["modelValue"])]),_:1}),(r(!0),d(I,null,q(o.voteGame.options,(n,V)=>(r(),d("div",{key:V,class:"option-item"},[c(g,{label:`选项 ${V+1}`},{default:v(()=>[t("div",Bo,[c(M,{modelValue:o.voteGame.options[V],"onUpdate:modelValue":m=>o.voteGame.options[V]=m,placeholder:`选项 ${V+1}`},null,8,["modelValue","onUpdate:modelValue","placeholder"]),o.voteGame.options.length>2?(r(),L(p,{key:0,type:"danger",icon:"el-icon-delete",circle:"",onClick:m=>o.removeVoteOption(V)},null,8,["onClick"])):k("",!0)])]),_:2},1032,["label"])]))),128)),t("div",jo,[c(p,{type:"primary",plain:"",onClick:o.addVoteOption},{default:v(()=>e[81]||(e[81]=[C("添加选项")])),_:1},8,["onClick"]),c(p,{type:"primary",onClick:o.createVote,disabled:!o.canCreateVote},{default:v(()=>e[82]||(e[82]=[C("创建投票")])),_:1},8,["onClick","disabled"])])]),_:1})]))])):k("",!0)])):k("",!0)])):k("",!0),o.activeTab==="users"?(r(),d("div",Lo,e[85]||(e[85]=[t("div",{class:"section-header"},[t("h3",null,"用户列表")],-1),t("p",{class:"coming-soon"},"功能开发中，敬请期待...",-1)]))):k("",!0),o.activeTab==="settings"?(r(),d("div",Oo,e[86]||(e[86]=[t("div",{class:"section-header"},[t("h3",null,"设置")],-1),t("p",{class:"coming-soon"},"功能开发中，敬请期待...",-1)]))):k("",!0)]),c(Q,{title:"个人资料设置",visible:o.showProfileModal,width:"500px","close-on-click-modal":!1},{default:v(()=>[t("div",No,[t("div",Jo,[t("div",{class:"current-avatar",onClick:e[28]||(e[28]=(...n)=>o.triggerAvatarUpload&&o.triggerAvatarUpload(...n))},[t("img",{src:o.previewAvatar||o.userAvatar,alt:"用户头像"},null,8,Wo),e[87]||(e[87]=t("div",{class:"avatar-upload-hint"},[t("i",{class:"el-icon-upload"}),t("span",null,"更改头像")],-1))]),t("input",{ref:"avatarInput",type:"file",style:{display:"none"},accept:"image/*",onChange:e[29]||(e[29]=(...n)=>o.handleAvatarChange&&o.handleAvatarChange(...n))},null,544)]),t("div",Xo,[c(P,{"label-width":"80px",model:o.profileForm},{default:v(()=>[c(g,{label:"用户名"},{default:v(()=>[c(M,{modelValue:o.profileForm.username,"onUpdate:modelValue":e[30]||(e[30]=n=>o.profileForm.username=n),disabled:!0},null,8,["modelValue"])]),_:1}),c(g,{label:"昵称"},{default:v(()=>[c(M,{modelValue:o.profileForm.nickname,"onUpdate:modelValue":e[31]||(e[31]=n=>o.profileForm.nickname=n),placeholder:"设置您的昵称"},null,8,["modelValue"])]),_:1}),c(g,{label:"主题"},{default:v(()=>[c(K,{modelValue:o.profileForm.theme,"onUpdate:modelValue":e[32]||(e[32]=n=>o.profileForm.theme=n)},{default:v(()=>[c(F,{label:"light"},{default:v(()=>e[88]||(e[88]=[C("浅色")])),_:1}),c(F,{label:"dark"},{default:v(()=>e[89]||(e[89]=[C("深色")])),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])])]),t("span",Yo,[c(p,{onClick:e[33]||(e[33]=n=>o.showProfileModal=!1)},{default:v(()=>e[90]||(e[90]=[C("取消")])),_:1}),c(p,{type:"primary",onClick:o.saveProfile,loading:o.savingProfile},{default:v(()=>e[91]||(e[91]=[C("保存")])),_:1},8,["onClick","loading"])])]),_:1},8,["visible"])])}const $o=Ye(st,[["render",Ho],["__scopeId","data-v-0bdefc54"]]);export{$o as default};
