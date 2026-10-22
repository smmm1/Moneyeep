/* Moneyeep shared interaction feedback. Sounds are off by default and only run after explicit opt-in. */
(function(){'use strict';var KEY='moneyeep-ui-sound-enabled',enabled=false,audioContext=null;try{enabled=localStorage.getItem(KEY)==='true'}catch(_){}
function tone(freq,duration,volume){if(!enabled)return;try{var Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;audioContext=audioContext||new Ctx();if(audioContext.state==='suspended')audioContext.resume();var osc=audioContext.createOscillator(),gain=audioContext.createGain(),now=audioContext.currentTime;osc.type='sine';osc.frequency.setValueAtTime(freq,now);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume||.025,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+(duration||.11));osc.connect(gain);gain.connect(audioContext.destination);osc.start(now);osc.stop(now+(duration||.11)+.02)}catch(_){}}
function feedback(){tone(660,.075,.018)}
function mount(){redesign();if(!document.body||document.getElementById('uiSoundToggle'))return;var b=document.createElement('button');b.id='uiSoundToggle';b.type='button';b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',enabled?'ปิดเสียงประกอบ':'เปิดเสียงประกอบ');b.innerHTML='<span aria-hidden="true">'+(enabled?'♫':'♪')+'</span><span>'+(enabled?'เสียงเปิด':'เสียงปิด')+'</span>';b.addEventListener('click',function(){enabled=!enabled;try{localStorage.setItem(KEY,String(enabled))}catch(_){}b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',enabled?'ปิดเสียงประกอบ':'เปิดเสียงประกอบ');b.innerHTML='<span aria-hidden="true">'+(enabled?'♫':'♪')+'</span><span>'+(enabled?'เสียงเปิด':'เสียงปิด')+'</span>';if(enabled)tone(740,.12,.025)});document.body.appendChild(b);document.addEventListener('click',function(e){if(!enabled)return;var t=e.target&&e.target.closest?e.target.closest('button,[role="button"],input[type="submit"]'):null;if(!t||t===b||t.disabled)return;var s=((t.innerText||t.getAttribute('aria-label')||t.title||'')+'').trim();if(/บันทึก|เพิ่มรายการ|ยืนยัน|สร้างบัญชี|เข้าสู่ระบบ|เริ่มออกกำลัง|save|submit|confirm|create account|sign in/i.test(s))feedback()},true)}

/* Structural redesign: preserve application hooks while composing a new shared workspace. */
function redesign(){
  var body=document.body;if(!body||body.dataset.redesignApplied)return;body.dataset.redesignApplied='true';
  function el(tag,cls,html){var n=document.createElement(tag);if(cls)n.className=cls;if(html!==undefined)n.innerHTML=html;return n}
  function commonNav(active){
    var side=document.querySelector('.exercise-sidebar,.sidebar');if(!side)return;
    side.className='redesign-sidebar';
    side.innerHTML='<a class="redesign-brand" href="/" aria-label="พื้นที่ของฉัน"><span class="redesign-brand-mark">m.</span><span><b>พื้นที่ของฉัน</b><small>PERSONAL WORKSPACE</small></span></a><div class="redesign-nav-label">WORKSPACE</div><nav class="redesign-nav" aria-label="เมนูหลัก"><a '+(active==='savings'?'aria-current="page" ':'')+'class="'+(active==='savings'?'is-active':'')+'" href="/moneyyeep.html"><span class="redesign-nav-icon">↗</span><span>ออมเงิน<small>การเงินและเป้าหมาย</small></span></a><a '+(active==='notes'?'aria-current="page" ':'')+'class="'+(active==='notes'?'is-active':'')+'" href="/note.html"><span class="redesign-nav-icon">✎</span><span>โน้ต<small>ความคิดและบันทึก</small></span></a><a '+(active==='health'?'aria-current="page" ':'')+'class="'+(active==='health'?'is-active':'')+'" href="/excelsior.html"><span class="redesign-nav-icon">＋</span><span>สุขภาพ<small>กิจกรรมและสถิติ</small></span></a></nav><div class="redesign-sidebar-bottom"><span class="redesign-status-dot"></span><span><b>พื้นที่ส่วนตัว</b><small>ทุกอย่างอยู่ในที่เดียว</small></span></div>';
  }
  function addHeading(parent,kicker,title,desc,action){
    if(!parent||parent.querySelector(':scope > .redesign-page-heading'))return;
    var h=el('section','redesign-page-heading','<div><p class="redesign-kicker">'+kicker+'</p><h1>'+title+'</h1><p class="redesign-heading-copy">'+desc+'</p></div>'+(action||''));
    parent.insertBefore(h,parent.firstChild);
  }
  if(body.classList.contains('ui-page-landing')){
    var shell=document.querySelector('.shell'),intro=document.querySelector('.intro'),section=document.querySelector('.section'),top=document.querySelector('.top'),grid=document.querySelector('.grid');
    if(shell){shell.classList.add('redesign-landing-shell');if(top)top.classList.add('redesign-landing-top');if(intro)intro.classList.add('redesign-landing-hero');if(section)section.classList.add('redesign-apps-section');if(grid){grid.classList.add('redesign-app-grid');Array.from(grid.children).forEach(function(c,i){c.classList.add('redesign-app-tile');c.setAttribute('data-tile',String(i+1));});}}
    return;
  }
  if(body.classList.contains('ui-page-savings')){
    commonNav('savings');
    var layout=document.querySelector('#appShell .app-layout'),main=document.querySelector('#appShell .app-content main'),grid=main&&main.querySelector(':scope > .grid');
    if(layout)layout.classList.add('redesign-app-layout');
    if(main)main.classList.add('redesign-main');
    addHeading(main,'MONEY / OVERVIEW','เงินของคุณ ในมุมมองที่ชัดเจน','ติดตามยอดคงเหลือ เป้าหมาย และทุกความเคลื่อนไหวได้ในที่เดียว','<button type="button" class="redesign-primary-action" onclick="openAddModal()">＋ <span>เพิ่มรายการ</span></button>');
    if(grid){grid.classList.add('redesign-savings-grid');var cols=Array.from(grid.children);if(cols[0])cols[0].classList.add('redesign-primary-column');if(cols[1])cols[1].classList.add('redesign-aside-column');}
    var balance=document.getElementById('netBalanceDisplay');if(balance){var card=balance.closest('.cream-card');if(card)card.classList.add('redesign-balance-card');}
    var goal=document.getElementById('savingsGoalTitle');if(goal){var card=goal.closest('section');if(card)card.classList.add('redesign-goal-card');}
    var recent=document.getElementById('recentTransactionsList');if(recent&&recent.parentElement)recent.parentElement.classList.add('redesign-recent-card');
    return;
  }
  if(body.classList.contains('ui-page-notes')){
    commonNav('notes');
    var layout=document.querySelector('.app-layout'),main=document.querySelector('.main'),content=document.querySelector('.content'),composer=document.getElementById('composer'),board=document.getElementById('board');
    if(layout)layout.classList.add('redesign-app-layout');
    if(main)main.classList.add('redesign-notes-main');
    if(content)content.classList.add('redesign-notes-simple');
    if(composer)composer.classList.add('redesign-composer-simple');
    var boardHead=document.querySelector('.board-head');if(boardHead)boardHead.classList.add('redesign-board-heading-simple');
    if(board)board.classList.add('redesign-notes-board-simple');
    return;
  }
  if(body.classList.contains('ui-page-health')){
    commonNav('health');
    var layout=document.querySelector('.app-layout'),main=document.querySelector('.exercise-main'),header=document.querySelector('.exercise-shell'),content=document.getElementById('exerciseContent');
    if(layout)layout.classList.add('redesign-app-layout');
    if(main)main.classList.add('redesign-health-main');
    var pageContent=main&&main.querySelector(':scope > main.exercise-shell');if(pageContent)pageContent.classList.add('redesign-page-content');
    if(header){
      header.classList.add('redesign-health-header');
      var healthTopbar=header.querySelector(':scope > .ui-topbar-inner');
      if(healthTopbar){
        var healthTopbarShell=document.createElement('div');
        healthTopbarShell.className='ui-health-topbar-shell';
        header.parentNode.insertBefore(healthTopbarShell,header);
        healthTopbarShell.appendChild(healthTopbar);
      }
      var banner=header.querySelector(':scope > div.mt-5');if(banner)banner.classList.add('redesign-health-hero');
    }
    if(content){content.classList.add('redesign-health-grid');var profile=content.querySelector(':scope > .exercise-wide');if(profile)profile.classList.add('redesign-profile-panel');}
    var obsoleteHeading=main&&main.querySelector(':scope > .redesign-page-heading');if(obsoleteHeading)obsoleteHeading.remove();
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();window.MoneyeepSound={setEnabled:function(v){enabled=!!v;try{localStorage.setItem(KEY,String(enabled))}catch(_){}},success:function(){tone(880,.16,.03)},tap:feedback}})();